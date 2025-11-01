// Bairro.ts
import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";
import { Comuna } from "./Comuna";

export class Bairro {
    public id: number | null = null;
    public nome: string = '';
    public comuna: Comuna = new Comuna();

    constructor(init?: Partial<Bairro>) {
        Object.assign(this, init);
    }

    static async save(data: Bairro): Promise<SimplifiedResponse> {
        const response = await apiRequest('POST', `${APIURL}localizacao/bairros`, data);
        return response;
    }

    static async all(): Promise<Bairro[]> {
        const data = await apiRequest("GET", `${APIURL}localizacao/bairros`);
        return data;
    }
}
