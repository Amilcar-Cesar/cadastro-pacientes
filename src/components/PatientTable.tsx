import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Patient } from '@/types/patient';

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="bg-gradient-secondary text-white">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Lista de Pacientes ({patients.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {patients.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhum paciente encontrado</p>
            <p className="text-sm">Cadastre o primeiro paciente para começar</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Nome Completo</TableHead>
                <TableHead className="font-semibold">CPF</TableHead>
                <TableHead className="font-semibold">Telefone</TableHead>
                <TableHead className="font-semibold">Data de Nascimento</TableHead>
                <TableHead className="font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    {patient.nome_completo}
                  </TableCell>
                  <TableCell className="font-mono">
                    {patient.cpf}
                  </TableCell>
                  <TableCell>
                    {patient.telefone || '-'}
                  </TableCell>
                  <TableCell>
                    {formatDate(patient.data_nascimento)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(patient)}
                        className="h-8 w-8 p-0 border-clinic-blue-light hover:bg-clinic-blue-light hover:text-white"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(patient)}
                        className="h-8 w-8 p-0 border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};