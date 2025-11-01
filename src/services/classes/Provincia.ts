// Provincia.ts
import { Pais } from "./Pais";
import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";

export class Provincia {
    id: number | null = null;
    nome: string = '';
    capital: string = '';
    codigo: string = '';
    regiao: string = '';
    area: number = 0;
    populacao: number = 0;
    descricao: string = '';
    pais: Pais = new Pais();

    constructor(init?: Partial<Provincia>) {
        Object.assign(this, init);

    }

    static async save(data: Provincia): Promise<SimplifiedResponse> {
        return await apiRequest('POST', `${APIURL}localizacao/provincias`, data);
    }

    static async all(): Promise<Provincia[]> {
        const data = await apiRequest("GET", `${APIURL}localizacao/provincias`);
        return data.map((item: any) => new Provincia(item));
    }
}
