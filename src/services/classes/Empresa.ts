
export class Empresas {
  id: any;
  nomempresa: string = 'Escola José de Asis';
  descricao: string = 'Instituição de Ensino de Nível Básico e Médio';
  urllogo: string = 'storage/perfil/angolab.png';
  urlrepublica: string = 'storage/perfil/angolab.png';
  cabecalho: string = 'República de Angola\nMinistério da Educação';
  cabecalhopersonalizado: string = 'Escola Modelo ABC - Excelência na Educação';
  nif: string = '5000001234';
  contactos: string = '+244 999 999 999';
  email: string = 'geral@escolamodelo.ao';
  email2: string = 'secretaria@escolamodelo.ao';
  endereco: string = 'Rua do Saber, nº 123, Luanda';
  tipoRecibo: string = 'A4';
  fiscalyear: string = '2025';
  start_date: string = '2025-01-01';
  end_date: string = '2025-12-31';
  nomePrograma: string = 'Sistema de Gestão Escolar';
  meunif: string = 'SGE-123456';
  validacao: string = 'Licenciado';
  versaoprograma: string = 'v2.5.1';
  isrunning: boolean = true;
  cidade: string = 'Luanda';
  provincia: string = 'Luanda';
  pais: string = 'Angola';
  dia_multa: number = 12;
  multa: number = 1000;

  constructor(init?: Partial<Empresas>) {
    Object.assign(this, init);
  }
}
