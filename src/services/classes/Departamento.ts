import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";
import { Funcionario } from "./Funcionario";

export class Departamento {
    id: any;
    nome: string = '';
    categoria: string = '';
    diretor?: Funcionario;  // Removida a inicialização automática
    created_at: string = '';
    updated_at: string = '';

    constructor(init?: Partial<Departamento>) {
        if (init) {
            Object.assign(this, init);
            // Inicializa diretor apenas se os dados vierem com ele
            if (init.diretor) {
                this.diretor = new Funcionario(init.diretor);
            }
        }
    }

    static async save(dep: any): Promise<SimplifiedResponse> {
        const method = dep.id ? "PUT" : "POST";
        return await apiRequest(method, `${APIURL}departamentos/add${dep.id == null ? '' : '/' + dep.id}`, dep);
    }

    static async getAll(): Promise<Departamento[]> {
        return await apiRequest("GET", `${APIURL}departamentos/all`);
    }

    static async getFuncoes(depId: number): Promise<any[]> {
        return await apiRequest("GET", `${APIURL}/funcoes/${depId}`);
    }

    static async delete(func: Departamento): Promise<any> {
        if (!func.id) throw new Error("ID do Departamento não definido.");
        return await apiRequest("DELETE", `${APIURL}departamentos/delete/${func.id}`);
    }

    static toJson(dep: Departamento) {
        return {
            id: dep.id,
            nome: dep.nome,
            categoria: dep.categoria,
            diretor_id: dep.diretor?.id,
            created_at: dep.created_at,
            updated_at: dep.updated_at
        }
    }
}
