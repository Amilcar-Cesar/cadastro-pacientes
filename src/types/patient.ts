export interface Patient {
  id: string;
  nome_completo: string;
  data_nascimento: string;
  cpf: string;
  telefone?: string;
  endereco_completo?: string;
  data_cadastro: string;
}

export interface CreatePatientData {
  nome_completo: string;
  data_nascimento: string;
  cpf: string;
  telefone?: string;
  endereco_completo?: string;
}

export interface UpdatePatientData extends CreatePatientData {
  id: string;
}