import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";
import { Provincia } from "./Provincia";

// Municipio.ts
export class Municipio {
    id: any = 1;
    nome: string = '';
    provincia: Provincia = new Provincia();

    constructor(init?: Partial<Municipio>) {
        Object.assign(this, init);
    }

    static async save(data: Municipio): Promise<SimplifiedResponse> {
        return await apiRequest('POST', `${APIURL}localizacao/municipios`, data);
    }

    static async all(): Promise<Municipio[]> {
        return await apiRequest("GET", `${APIURL}localizacao/municipios`);
    }
}
