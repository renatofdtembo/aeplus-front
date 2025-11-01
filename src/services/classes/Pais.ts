import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";

export class Pais {
    id: any;
    urlimg: string = '';
    nome: string = '';
    codigo: string = '';
    nacionalidade: string = '';
    
    constructor(init?: Partial<Pais>) {
        Object.assign(this, init);
    }

    static async save(data: Pais): Promise<SimplifiedResponse> {
        return await apiRequest('POST', `${APIURL}localizacao/paises`, data);
    }

    static async all(): Promise<Pais[]> {
        return await apiRequest("GET", `${APIURL}localizacao/paises`);
    }

    static async all_localizacao(): Promise<any> {
        return await apiRequest("GET", `${APIURL}localizacao/all`);
    }
}
