import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";
import { Departamento } from "./Departamento";

export class Funcao {
    id: any;
    nome: string = '';
    descricao: string = '';
    salario_base: number = 0;
    nivel: number = 0;
    ativo: boolean = true;
    departamento: Departamento = new Departamento();  // Removida a inicialização automática

    constructor(init?: Partial<Funcao>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    static async save(func: any): Promise<SimplifiedResponse> {
        const method = func.id == null ? "POST" : "PUT";
        return await apiRequest(method, `${APIURL}funcoes/add${func.id == null ? '' : '/'+func.id}`, func);
    }

    static async delete(func: Funcao): Promise<any> {
        if (!func.id) throw new Error("ID da função não definido.");
        return await apiRequest("DELETE", `${APIURL}funcoes/delete/${func.id}`);
    }

    static async all(): Promise<Funcao[]> {
        const data = await apiRequest("GET", `${APIURL}funcoes/all`);
        return data.map((item: any) => new Funcao(item));
    }

    static async find(id: number): Promise<Funcao> {
        const data = await apiRequest("GET", `${APIURL}funcoes/${id}`);
        return new Funcao(data);
    }

    static toJson(func: Funcao) {
        return {
            id: func.id,
            nome: func.nome,
            descricao: func.descricao,
            salario_base: func.salario_base,
            nivel: func.nivel,
            ativo: func.ativo,
            departamento_id: func?.departamento?.id
        };
    }
}
