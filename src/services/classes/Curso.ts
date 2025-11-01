import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { Usuario, SimplifiedResponse, normalizeResponse } from "../Utilitario";
import { Categoria } from "./Categoria";

export type NivelCurso = "INICIANTE" | "INTERMEDIARIO" | "AVANCADO" | "CURSO_PROFISSIONAL";
export type PrivacidadeCurso = "PRIVADO" | "PUBLICO";

const API_BASE = "/v1/cursos";

export class Curso {
  id: any;
  capa: string;
  urlImage: string;
  titulo: string;
  nomeBreve: string;
  descricao: string;
  preco: any = 0;
  gratuito: any;
  inscricao: boolean;
  dataInicioInscricao?: string;
  dataFimInscricao?: string;
  dataInicio?: string;
  dataTermino?: string;
  categoria: Categoria =  new Categoria();
  duracao?: "UM_MES" | "TRES_MESES" | "SEIS_MESES" | "UM_ANO";
  nivel: NivelCurso;
  privacidade: PrivacidadeCurso;
  oqueaprender: string;
  sobre: string;
  videoIntroducao: string;
  tipo: string;
  visibilidade: string;
  responsavel: Usuario = new Usuario();
  instituicao: Usuario= new Usuario();
  configuracoes?: string | "'{\"operator\":\"AND\",\"conditions\":[]}'";
  dataCriacao?: string;
  dataAtualizacao?: string;

  constructor(data?: Partial<Curso>) {
    this.id = null;
    this.urlImage = data?.urlImage ?? "";
    this.capa = data?.capa ?? "/assets/aeplus/defaultcourse.png";
    this.titulo = data?.titulo ?? "";
    this.nomeBreve = data?.nomeBreve ?? "";
    this.descricao = data?.descricao ?? "";
    this.preco = data?.preco || 0;
    this.gratuito = data?.gratuito ?? false;
    this.inscricao = data?.inscricao ?? false;
    this.dataInicioInscricao = data?.dataInicioInscricao;
    this.dataFimInscricao = data?.dataFimInscricao;
    this.categoria = data?.categoria ?? new Categoria();
    this.duracao = data?.duracao ?? "UM_MES";
    this.nivel = data?.nivel ?? "AVANCADO";
    this.privacidade = data?.privacidade ?? "PRIVADO";
    this.oqueaprender = data?.oqueaprender ?? "";
    this.sobre = data?.sobre ?? "";
    this.videoIntroducao = data?.videoIntroducao ?? "";
    this.tipo = data?.tipo ?? "";
    this.visibilidade = data?.visibilidade ?? "";
    this.responsavel = data?.responsavel || new Usuario();
    this.instituicao = data?.instituicao || new Usuario();
    this.configuracoes = data?.configuracoes ?? "'{\"operator\":\"AND\",\"conditions\":[]}'";
    this.dataCriacao = data?.dataCriacao;
    this.dataAtualizacao = data?.dataAtualizacao;
  }

  isGratuito(): boolean {
    return this.gratuito;
  }

  getTituloFormatado(): string {
    return `${this.titulo} (${this.tipo})`;
  }

  // 🔽 API Methods

  /** GET /v1/cursos */
  static async publicAllCursos(): Promise<any> {
    const res = await apiRequest("GET", `${APIURL}cursos`);
    return res;
  }
  static async publicAllCursosCategoriaId(id: number): Promise<Curso[]> {
    const res = await apiRequest("GET", `/public/all-cursos/categoria/${id}`);
    return res;
  }
  static async allCursos(): Promise<Curso[]> {
    const res = await apiRequest("GET", API_BASE);
    return res;
  }

  /** GET /v1/cursos/{id} */
  static async getCursoById(id: number): Promise<Curso> {
    const res = await apiRequest("GET", `${API_BASE}/${id}`);
    return res;
  }

  /** GET /v1/cursos/{id} */
  static async existeIncricao(estudanteId: number, id: number): Promise<boolean> {
    console.log("Verificando inscrição para estudanteId:", estudanteId, "e cursoId:", id);
    const res = await apiRequest("GET", `${API_BASE}/exist-inscricao/${estudanteId}/${id}`);
    return res;
  }

  /** GET /v1/cursos/instituicao/{id} */
  static async getCursosByInstituicaoId(instituicaoId: number): Promise<Curso[]> {
    const res = await apiRequest("GET", `${API_BASE}/instituicao/${instituicaoId}`);
    return res.data.map((item: any) => new Curso(item));
  }

  /** GET /v1/cursos/instituicao/{id} */
  static async findByCategoriaId(categoriaId: number): Promise<Curso[]> {
    const res = await apiRequest("GET", `${API_BASE}/categoria/${categoriaId}`);
    return res;
  }

  /** GET /v1/cursos/all-participantes/{id} */
  static async getParticipantesByCursoId(cursoId: number): Promise<Usuario[]> {
    return await apiRequest("GET", `${API_BASE}/all-participantes/${cursoId}`);
  }

  /** POST /v1/cursos/add */
  static async save(c: Curso): Promise<SimplifiedResponse> {
    const method = c.id != null ? 'PUT' : 'POST';
    const response = await apiRequest(method, `${API_BASE}`, c);
    return normalizeResponse(response);
  }
}
