// Comuna.ts
import { Municipio } from "./Municipio";
import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";

export class Comuna {
    id: number | null = null;
    nome: string = '';
    municipio: Municipio = new Municipio();

    constructor(init?: Partial<Comuna>) {
        Object.assign(this, init);
    }

    static async save(data: Comuna): Promise<SimplifiedResponse> {
        const response = await apiRequest('POST', `${APIURL}localizacao/comunas`, data);
        return response;
    }

    static async all(): Promise<Comuna[]> {
        const data = await apiRequest("GET", `${APIURL}localizacao/comunas`);
        return data.map((item: any) => new Comuna(item));
    }

    static async delete(com: Comuna): Promise<any> {
        return await apiRequest("DELETE", `${APIURL}localizacao/comunas/delete/${com.id}`);
    }
}
