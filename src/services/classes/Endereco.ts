import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { Rua } from "./Rua";

// Endereco.ts
export class Endereco{
    id: number | null = null;
    nome: string = '';
    numero: string = 'Semm Número';
    complemento: string = 'Não informado';
    ponto_referencia: string = 'Não informado';
    rua: Rua = new Rua();

    constructor(init?: Partial<Endereco>) {
        Object.assign(this, init);
    }

    static async save(data: Endereco): Promise<any> {
        return await apiRequest('POST', `${APIURL}localizacao/enderecos`, data);
    }

    static async all(): Promise<Endereco[]> {
        return await apiRequest("GET", `${APIURL}localizacao/enderecos`);
    }
}
