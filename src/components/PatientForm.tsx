import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Patient, CreatePatientData, UpdatePatientData } from '@/types/patient';
import { Save, X, User } from 'lucide-react';

const patientSchema = z.object({
  nome_completo: z.string()
    .trim()
    .min(1, { message: "Nome completo é obrigatório" })
    .max(255, { message: "Nome deve ter no máximo 255 caracteres" }),
  data_nascimento: z.string()
    .min(1, { message: "Data de nascimento é obrigatória" }),
  cpf: z.string()
    .trim()
    .min(1, { message: "CPF é obrigatório" })
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF deve estar no formato 000.000.000-00" }),
  telefone: z.string()
    .optional()
    .refine(
      (val) => !val || /^\(\d{2}\) \d{4,5}-\d{4}$/.test(val),
      { message: "Telefone deve estar no formato (00) 00000-0000" }
    ),
  endereco_completo: z.string()
    .max(1000, { message: "Endereço deve ter no máximo 1000 caracteres" })
    .optional(),
});

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePatientData | UpdatePatientData) => void;
  initialData?: Patient | null;
  title: string;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreatePatientData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData ? {
      nome_completo: initialData.nome_completo,
      data_nascimento: initialData.data_nascimento,
      cpf: initialData.cpf,
      telefone: initialData.telefone || '',
      endereco_completo: initialData.endereco_completo || '',
    } : {}
  });

  // Format CPF
  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cleaned;
  };

  // Format phone
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 11) {
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    } else if (cleaned.length === 10) {
      const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return cleaned;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('telefone', formatted);
  };

  const handleFormSubmit = (data: CreatePatientData) => {
    if (initialData) {
      onSubmit({ ...data, id: initialData.id });
    } else {
      onSubmit(data);
    }
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  React.useEffect(() => {
    if (initialData && isOpen) {
      reset({
        nome_completo: initialData.nome_completo,
        data_nascimento: initialData.data_nascimento,
        cpf: initialData.cpf,
        telefone: initialData.telefone || '',
        endereco_completo: initialData.endereco_completo || '',
      });
    }
  }, [initialData, isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-clinic-blue-medium" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome_completo" className="text-sm font-medium">
                Nome Completo *
              </Label>
              <Input
                id="nome_completo"
                {...register('nome_completo')}
                className={errors.nome_completo ? 'border-destructive' : ''}
                placeholder="Digite o nome completo"
              />
              {errors.nome_completo && (
                <p className="text-sm text-destructive mt-1">{errors.nome_completo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cpf" className="text-sm font-medium">
                CPF *
              </Label>
              <Input
                id="cpf"
                {...register('cpf')}
                onChange={handleCPFChange}
                value={watch('cpf') || ''}
                className={errors.cpf ? 'border-destructive' : ''}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-sm text-destructive mt-1">{errors.cpf.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="data_nascimento" className="text-sm font-medium">
                Data de Nascimento *
              </Label>
              <Input
                id="data_nascimento"
                type="date"
                {...register('data_nascimento')}
                className={errors.data_nascimento ? 'border-destructive' : ''}
              />
              {errors.data_nascimento && (
                <p className="text-sm text-destructive mt-1">{errors.data_nascimento.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="telefone" className="text-sm font-medium">
                Telefone
              </Label>
              <Input
                id="telefone"
                {...register('telefone')}
                onChange={handlePhoneChange}
                value={watch('telefone') || ''}
                className={errors.telefone ? 'border-destructive' : ''}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
              {errors.telefone && (
                <p className="text-sm text-destructive mt-1">{errors.telefone.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="endereco_completo" className="text-sm font-medium">
                Endereço Completo
              </Label>
              <Textarea
                id="endereco_completo"
                {...register('endereco_completo')}
                className={errors.endereco_completo ? 'border-destructive' : ''}
                placeholder="Rua, número, complemento, bairro, cidade/estado"
                rows={3}
              />
              {errors.endereco_completo && (
                <p className="text-sm text-destructive mt-1">{errors.endereco_completo.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary hover:opacity-90 text-white shadow-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};