import { createErrorResponse, ErrorResponse } from './../Util';
import { Pessoa } from "./Pessoa";
import { Funcao } from "./Funcao";
import { SimplifiedResponse, formatDateToMysql } from "../Utilitario";
import { apiRequest } from "../httpAxios";
import { ApiResponse } from "../Util";

const APIURL = `${import.meta.env.VITE_API_URL}/api/`;

export class Funcionario {
  id: any = null;
  pessoa_id: number | null = null;
  num_funcionario: string = '';
  tipo_contrato: string = 'EFETIVO';
  data_admissao: string = new Date().toISOString().split('T')[0];
  data_efetivacao: string = new Date().toISOString().split('T')[0];
  data_termino_contrato: string = new Date().toISOString().split('T')[0];
  banco: string | null = null;
  numero_conta: string | null = null;
  iban: string | null = null;
  numero_seguranca_social: string | null = null;
  numero_contribuinte: string | null = null;
  estado: string = 'ACTIVO';
  activo: boolean = true;
  horario_trabalho: string | null = null;
  horas_semanais: number = 40;
  tem_seguro_saude: boolean = false;
  tem_vale_refeicao: boolean = false;
  tem_vale_transporte: boolean = false;
  observacoes: string | null = null;
  qualificacoes: string | null = null;

  pessoa: Pessoa = new Pessoa();
  funcoes: Funcao[] = [];

  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null = null;

  // Constantes para enums (iguais ao Laravel)
  static readonly TIPO_CONTRATO_EFETIVO = 'EFETIVO';
  static readonly TIPO_CONTRATO_TEMPORARIO = 'TEMPORARIO';
  static readonly TIPO_CONTRATO_ESTAGIO = 'ESTAGIO';
  static readonly TIPO_CONTRATO_PRACTICANTE = 'PRACTICANTE';

  static readonly ESTADO_ACTIVO = 'ACTIVO';
  static readonly ESTADO_AUSENTE = 'AUSENTE';
  static readonly ESTADO_FERIAS = 'FERIAS';
  static readonly ESTADO_LICENCA = 'LICENCA';
  static readonly ESTADO_SUSPENSO = 'SUSPENSO';
  static readonly ESTADO_DESPEDIDO = 'DESPEDIDO';
  static readonly ESTADO_REFORMADO = 'REFORMADO';

  constructor(data?: Partial<Funcionario>) {
    if (data) {
      Object.assign(this, data);

      // Inicializa funcoes se os dados vierem com elas
      if (data.funcoes) {
        this.funcoes = data.funcoes.map((funcao: any) => new Funcao(funcao));
      }
    }
  }

  // Métodos estáticos para API

  static async all(params?: any): Promise<ApiResponse<Funcionario> | ErrorResponse> {
    try {
      return await apiRequest("GET", `${APIURL}funcionarios`, params);
    } catch (error) {
      return createErrorResponse('Erro ao carregar funcionários', error);
    }
  }

  static async findByPessoaId(id: any): Promise<any> {
    try {
      return await apiRequest("GET", `${APIURL}funcionarios/${id}/pessoa`);
    } catch (error) {
      return new Funcionario();
    }
  }

  static async save(data: Funcionario): Promise<SimplifiedResponse> {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${APIURL}funcionarios/${data.id}` : `${APIURL}funcionarios`;
    console.log(Funcionario.toJson(data));
    return await apiRequest(method, url, Funcionario.toJson(data));
  }

  static async delete(id: number): Promise<SimplifiedResponse> {
    return await apiRequest("DELETE", `${APIURL}funcionarios/${id}`);
  }

  static async restore(id: number): Promise<SimplifiedResponse> {
    return await apiRequest("POST", `${APIURL}funcionarios/${id}/restore`);
  }

  static async statistics(): Promise<SimplifiedResponse> {
    try {
      return await apiRequest("GET", `${APIURL}funcionarios/estatisticas`);
    } catch (error) {
      return {
        status: 'error',
        mensagem: 'Erro ao carregar estatísticas',
        recordId: null
      };
    }
  }

  static async addFuncao(funcionarioId: number, funcaoData: {
    funcao_id: number;
    data_inicio: string;
    data_fim?: string;
  }): Promise<SimplifiedResponse> {
    return await apiRequest(
      "POST",
      `${APIURL}funcionarios/${funcionarioId}/funcoes`,
      funcaoData
    );
  }

  static async removeFuncao(funcionarioId: number, funcaoId: number): Promise<SimplifiedResponse> {
    return await apiRequest(
      "DELETE",
      `${APIURL}funcionarios/${funcionarioId}/funcoes/${funcaoId}`
    );
  }

  // Métodos de instância

  isActivo(): boolean {
    return this.activo && this.estado === Funcionario.ESTADO_ACTIVO;
  }

  isDeFerias(): boolean {
    return this.estado === Funcionario.ESTADO_FERIAS;
  }

  isSuspenso(): boolean {
    return this.estado === Funcionario.ESTADO_SUSPENSO;
  }

  precisaRenovarContrato(): boolean {
    if (this.tipo_contrato !== Funcionario.TIPO_CONTRATO_TEMPORARIO || !this.data_termino_contrato) {
      return false;
    }

    const termino = new Date(this.data_termino_contrato);
    const hoje = new Date();
    const diffTime = termino.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 30;
  }

  getEstadoFormatado(): string {
    const estados: { [key: string]: string } = {
      [Funcionario.ESTADO_ACTIVO]: 'Activo',
      [Funcionario.ESTADO_AUSENTE]: 'Ausente',
      [Funcionario.ESTADO_FERIAS]: 'Férias',
      [Funcionario.ESTADO_LICENCA]: 'Licença',
      [Funcionario.ESTADO_SUSPENSO]: 'Suspenso',
      [Funcionario.ESTADO_DESPEDIDO]: 'Despedido',
      [Funcionario.ESTADO_REFORMADO]: 'Reformado'
    };

    return estados[this.estado] || this.estado;
  }

  getTipoContratoFormatado(): string {
    const contratos: { [key: string]: string } = {
      [Funcionario.TIPO_CONTRATO_EFETIVO]: 'Efetivo',
      [Funcionario.TIPO_CONTRATO_TEMPORARIO]: 'Temporário',
      [Funcionario.TIPO_CONTRATO_ESTAGIO]: 'Estágio',
      [Funcionario.TIPO_CONTRATO_PRACTICANTE]: 'Practicante'
    };

    return contratos[this.tipo_contrato] || this.tipo_contrato;
  }

  getAnosServico(): number {
    if (!this.data_admissao) return 0;

    const admissao = new Date(this.data_admissao);
    const hoje = new Date();
    return hoje.getFullYear() - admissao.getFullYear();
  }

  // Conversão para JSON para API
  // No método toJson da classe Funcionario, ajuste os valores para os enums corretos:
  static toJson(funcionario: Funcionario): any {
    // Mapear valores para os enums esperados pelo backend
    const mapGenero = {
      'Masculino': 'M',
      'Feminino': 'F',
      'Outro': 'OUTRO'
    };

    const mapEstadoCivil = {
      'Solteiro(a)': 'SOLTEIRO',
      'Casado(a)': 'CASADO',
      'Divorciado(a)': 'DIVORCIADO',
      'Viúvo(a)': 'VIUVO',
      'União de Facto': 'UNIAO_DE_FACTO'
    };

    const mapEstado = {
      'Activo': 'ACTIVO',
      'Ausente': 'AUSENTE',
      'Férias': 'FERIAS',
      'Licença': 'LICENCA',
      'Suspenso': 'SUSPENSO',
      'Despedido': 'DESPEDIDO',
      'Reformado': 'REFORMADO'
    };

    return {
      // Dados da pessoa
      nome: funcionario.pessoa.nome,
      contacto: funcionario.pessoa.contacto,
      email: funcionario.pessoa.email,
      nif: funcionario.pessoa.nif,
      bi: funcionario.pessoa.bi,
      passaporte: funcionario.pessoa.passaporte,
      genero: mapGenero[funcionario.pessoa.genero as keyof typeof mapGenero] || funcionario.pessoa.genero,
      estadocivil: mapEstadoCivil[funcionario.pessoa.estadocivil as keyof typeof mapEstadoCivil] || funcionario.pessoa.estadocivil,
      nascimento: formatDateToMysql(funcionario.pessoa.nascimento),
      municipio_id: funcionario.pessoa.naturalidade.id,

      // Dados do funcionário - NÃO enviar matricula (será gerada automaticamente)
      tipo_contrato: funcionario.tipo_contrato,
      data_admissao: formatDateToMysql(funcionario.data_admissao),
      data_efetivacao: funcionario.data_efetivacao ? formatDateToMysql(funcionario.data_efetivacao) : null,
      data_termino_contrato: funcionario.data_termino_contrato ? formatDateToMysql(funcionario.data_termino_contrato) : null,
      banco: funcionario.banco,
      numero_conta: funcionario.numero_conta,
      iban: funcionario.iban,
      numero_seguranca_social: funcionario.numero_seguranca_social,
      numero_contribuinte: funcionario.numero_contribuinte,
      estado: mapEstado[funcionario.estado as keyof typeof mapEstado] || funcionario.estado,
      activo: funcionario.activo,
      horario_trabalho: funcionario.horario_trabalho,
      horas_semanais: funcionario.horas_semanais,
      tem_seguro_saude: funcionario.tem_seguro_saude,
      tem_vale_refeicao: funcionario.tem_vale_refeicao,
      tem_vale_transporte: funcionario.tem_vale_transporte,
      observacoes: funcionario.observacoes,
      qualificacoes: funcionario.qualificacoes,

      // Dados do endereço (se existir)
      endereco_id: funcionario.pessoa.endereco.id,

      // Funções (se existirem)
      funcoes: funcionario.funcoes && funcionario.funcoes.length > 0
        ? funcionario.funcoes.map(funcao => ({
          funcao_id: funcao.id,
          data_inicio: new Date().toISOString().split('T')[0],
          data_fim: new Date().toISOString().split('T')[0]
        }))
        : []
    };
  }

  // Método para criar instância a partir de dados da API
  static fromApiData(data: any): Funcionario {
    return new Funcionario({
      id: data.id,
      pessoa_id: data.pessoa_id,
      num_funcionario: data.num_funcionario,
      tipo_contrato: data.tipo_contrato,
      data_admissao: data.data_admissao,
      data_efetivacao: data.data_efetivacao,
      data_termino_contrato: data.data_termino_contrato,
      banco: data.banco,
      numero_conta: data.numero_conta,
      iban: data.iban,
      numero_seguranca_social: data.numero_seguranca_social,
      numero_contribuinte: data.numero_contribuinte,
      estado: data.estado,
      activo: data.activo,
      horario_trabalho: data.horario_trabalho,
      horas_semanais: data.horas_semanais,
      tem_seguro_saude: data.tem_seguro_saude,
      tem_vale_refeicao: data.tem_vale_refeicao,
      tem_vale_transporte: data.tem_vale_transporte,
      observacoes: data.observacoes,
      qualificacoes: data.qualificacoes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      deleted_at: data.deleted_at,

      pessoa: data.pessoa ? new Pessoa(data.pessoa) : new Pessoa(),
      funcoes: data.funcoes ? data.funcoes.map((f: any) => new Funcao(f)) : []
    });
  }
}