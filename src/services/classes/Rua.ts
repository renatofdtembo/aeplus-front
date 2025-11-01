import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";
import { Bairro } from "./Bairro";

export class Rua {
    id: number | null = null;
    nome: string = '';
    bairro: Bairro = new Bairro();

    constructor(init?: Partial<Rua>) {
        Object.assign(this, init);

        if (init?.bairro) {
            this.bairro = new Bairro(init.bairro);
        }
    }

    static async save(data: Rua): Promise<SimplifiedResponse> {
        const response = await apiRequest('POST', `${APIURL}localizacao/ruas`, data);
        return response;
    }

    static async all(): Promise<Rua[]> {
        const data = await apiRequest("GET", `${APIURL}localizacao/ruas`);
        return data.map((item: any) => new Rua(item));
    }
}