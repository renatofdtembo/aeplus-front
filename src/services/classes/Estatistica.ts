// Arquivo: Alvara.ts
import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";

export class Estatistica {
    // Estatísticas para títulos
    public expiram_em_31_dias: number = 0;
    public expiram_em_15_dias: number = 0;
    public expiram_em_10_dias: number = 0;
    public expiram_em_5_dias: number = 0;
    public expiram_em_1_dia: number = 0;

    public titulos_vencidos: number = 0;
    public alvaras_vencidos: number = 0;
    public documentos_vencidas: number = 0;

    // Estatísticas para processos
    public proc_all: number = 0;
    public pendentes: number = 0;
    public analise: number = 0;
    public vistoria: number = 0;
    public parecer: number = 0;
    public assinaturas: number = 0;
    public prontoentregue: number = 0;
    public aprovados: number = 0;
    public rejeitados: number = 0;
    public afinalizar: number = 0;
    public imprimir: number = 0;

    //Outros
    public vencidos: number = 0;
    public total_entidades: number = 0;
    public total_imoveis: number = 0;
    constructor(init?: Partial<Estatistica>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    // Métodos estáticos para API

    static async all_estatistica(): Promise<Estatistica> {
        try {
            return await apiRequest("GET", `${APIURL}estatisticas/all`);
        } catch (error) {
            console.error('Erro ao buscar alvarás:', error);
            return new Estatistica();
        }
    }

    static async all_estatistica_lista(): Promise<Estatistica> {
        try {
            return await apiRequest("GET", `${APIURL}all-lista`);
        } catch (error) {
            console.error('Erro ao buscar alvarás:', error);
            return new Estatistica();
        }
    }

    get todosDocAVencer(): number {
        return this.expiram_em_5_dias + this.expiram_em_10_dias + this.expiram_em_15_dias + this.expiram_em_31_dias;
    }

}