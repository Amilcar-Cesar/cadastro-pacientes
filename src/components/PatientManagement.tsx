import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users } from 'lucide-react';
import { Patient, CreatePatientData, UpdatePatientData } from '@/types/patient';
import { PatientForm } from './PatientForm';
import { PatientTable } from './PatientTable';
import { DeleteConfirmModal } from './DeleteConfirmModal';

// Mock data for development - in production this would come from your database
const mockPatients: Patient[] = [
  {
    id: 1,
    nome_completo: 'Maria Silva Santos',
    data_nascimento: '1985-03-15',
    cpf: '123.456.789-01',
    telefone: '(11) 99999-8888',
    endereco_completo: 'Rua das Flores, 123 - Centro - São Paulo/SP',
    data_cadastro: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    nome_completo: 'João Carlos Oliveira',
    data_nascimento: '1978-07-22',
    cpf: '987.654.321-02',
    telefone: '(11) 88888-7777',
    endereco_completo: 'Avenida Paulista, 456 - Bela Vista - São Paulo/SP',
    data_cadastro: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    nome_completo: 'Ana Paula Costa',
    data_nascimento: '1992-11-08',
    cpf: '456.789.123-03',
    telefone: '(11) 77777-6666',
    endereco_completo: 'Rua Augusta, 789 - Consolação - São Paulo/SP',
    data_cadastro: '2024-01-17T09:15:00Z'
  }
];

export const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  );

  const handleCreatePatient = (data: CreatePatientData) => {
    const newPatient: Patient = {
      id: Math.max(...patients.map(p => p.id), 0) + 1,
      ...data,
      data_cadastro: new Date().toISOString()
    };
    setPatients([newPatient, ...patients]);
    setIsFormOpen(false);
  };

  const handleUpdatePatient = (data: UpdatePatientData) => {
    setPatients(patients.map(patient =>
      patient.id === data.id ? { ...patient, ...data } : patient
    ));
    setEditingPatient(null);
  };

  const handleDeletePatient = (id: number) => {
    setPatients(patients.filter(patient => patient.id !== id));
    setDeletingPatient(null);
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
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Users className="h-8 w-8" />
              Sistema de Cadastro de Pacientes
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