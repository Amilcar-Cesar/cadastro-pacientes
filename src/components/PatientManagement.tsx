import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Patient, CreatePatientData, UpdatePatientData } from '@/types/patient';
import { PatientForm } from './PatientForm';
import { PatientTable } from './PatientTable';
import { DeleteConfirmModal } from './DeleteConfirmModal';

// Mock data removed - now using Supabase database

export const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Load patients from Supabase
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;
      
      // Convert database format to frontend format
      const formattedPatients = data.map(patient => ({
        id: patient.id,
        nome_completo: patient.nome_completo,
        data_nascimento: patient.data_nascimento,
        cpf: patient.cpf,
        telefone: patient.telefone || '',
        endereco_completo: patient.endereco_completo || '',
        data_cadastro: patient.data_cadastro
      }));
      
      setPatients(formattedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pacientes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  );

  const handleCreatePatient = async (data: CreatePatientData) => {
    try {
      const { error } = await supabase
        .from('pacientes')
        .insert([{
          ...data,
          user_id: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Paciente cadastrado com sucesso!",
      });
      
      setIsFormOpen(false);
      loadPatients(); // Reload the list
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o paciente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePatient = async (data: UpdatePatientData) => {
    try {
      const { error } = await supabase
        .from('pacientes')
        .update({
          nome_completo: data.nome_completo,
          data_nascimento: data.data_nascimento,
          cpf: data.cpf,
          telefone: data.telefone,
          endereco_completo: data.endereco_completo
        })
        .eq('id', data.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Paciente atualizado com sucesso!",
      });
      
      setEditingPatient(null);
      loadPatients(); // Reload the list
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o paciente.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Paciente excluído com sucesso!",
      });
      
      setDeletingPatient(null);
      loadPatients(); // Reload the list
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o paciente.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (patient: Patient) => {
    setEditingPatient(patient);
  };

  const handleDeleteClick = (patient: Patient) => {
    setDeletingPatient(patient);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-card border-0">
          <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-2xl">
                <Users className="h-8 w-8" />
                Sistema de Cadastro de Pacientes
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Search and Actions */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-primary hover:opacity-90 shadow-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Novo Paciente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Table */}
        <PatientTable
          patients={filteredPatients}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {/* Forms and Modals */}
        <PatientForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreatePatient}
          title="Cadastrar Novo Paciente"
        />

        <PatientForm
          isOpen={!!editingPatient}
          onClose={() => setEditingPatient(null)}
          onSubmit={handleUpdatePatient}
          initialData={editingPatient}
          title="Editar Paciente"
        />

        <DeleteConfirmModal
          isOpen={!!deletingPatient}
          onClose={() => setDeletingPatient(null)}
          onConfirm={() => deletingPatient && handleDeletePatient(deletingPatient.id)}
          patientName={deletingPatient?.nome_completo || ''}
        />
      </div>
    </div>
  );
};