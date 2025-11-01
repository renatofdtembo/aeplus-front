// Arquivo: Alvara.ts
import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";
import { Parecer } from "./Parecer";
import { Titulo } from "./Titulo";

export class Alvara {
    public id: any = null;
    public num_alvara: string = '';
    public titulo_id: number = 0;
    public parecer_id: number = 0;
    public validade: string = '';
    public created_at: string = '';
    public updated_at: string = '';
    // Relacionamentos
    public parecer: Parecer = new Parecer();
    public titulo: Titulo = new Titulo();

    constructor(init?: Partial<Alvara>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    // Métodos estáticos para API

    static async all(): Promise<Alvara[]> {
        try {
            const data = await apiRequest("GET", `${APIURL}alvaras`);
            return data.map((item: any) => new Alvara(item));
        } catch (error) {
            console.error('Erro ao buscar alvarás:', error);
            return [];
        }
    }

    static async find(id: number): Promise<Alvara | null> {
        try {
            const data = await apiRequest("GET", `${APIURL}alvaras/${id}`);
            return new Alvara(data);
        } catch (error) {
            console.error('Erro ao buscar alvará:', error);
            return null;
        }
    }

    static async findByTitulo(id: number): Promise<any> {
        try {
            return await apiRequest("GET", `${APIURL}alvaras/${id}/titulo`);
        } catch (error) {
            console.error('Erro ao buscar alvará por titulo:', error);
            return null;
        }
    }

    static async findByParecer(id: number): Promise<any> {
        try {
            return await apiRequest("GET", `${APIURL}alvaras/${id}/parecer`);
        } catch (error) {
            console.error('Erro ao buscar alvará por parecer:', error);
            return null;
        }
    }

    static async save(alvara: any): Promise<SimplifiedResponse | null> {
        try {
            const method = alvara.id ? 'PUT' : 'POST';
            const url = alvara.id ? `${APIURL}alvaras/${alvara.id}` : `${APIURL}alvaras/store`;
            
            const response = await apiRequest(method, url, alvara);
            
            return response;
        } catch (error) {
            return null 
        }
    }

    async delete(): Promise<SimplifiedResponse> {
        if (!this.id) {
            return {
                recordId: null,
                status: 'error',
                mensagem: 'Alvará não possui id'
            };
        }

        try {
            return await apiRequest("DELETE", `${APIURL}alvaras/${this.id}`);
        } catch (error) {
            console.error('Erro ao deletar alvará:', error);
            return {
                recordId: null,
                status: 'error',
                mensagem: 'Erro ao deletar alvará'
            };
        }
    }

    // Getter para verificar se o alvará está válido (não expirado)
    get estaValido(): boolean {
        if (!this.validade) return false;
        
        const hoje = new Date();
        const prazo = new Date(this.validade);
        return prazo > hoje;
    }

    // Getter para dias restantes até o vencimento
    get diasRestantes(): number {
        if (!this.validade) return 0;
        
        const hoje = new Date();
        const prazo = new Date(this.validade);
        const diffTime = prazo.getTime() - hoje.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}