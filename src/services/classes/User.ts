import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";
import { Pessoa } from "./Pessoa";

export class User {
    id: any = null;
    user_code: string = '';
    name: string = '';
    password: string = '';
    email: string = '';
    email_verified_at: string | null = null;
    status: any = 'ofline';
    pessoa: Pessoa = new Pessoa();
    created_at: string = '';
    updated_at: string = '';
    ultimo_acesso: string = '';

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
    static async save(data: User): Promise<SimplifiedResponse> {
        return await apiRequest('POST', `${APIURL}users/add`, data);
    }
    static async update(data: User, updatePassword: boolean = false): Promise<SimplifiedResponse> {
        const payload = {
            ...data,
            update_password: updatePassword
        };
        return await apiRequest('PUT', `${APIURL}users/update/${payload.id}`, payload);
    }

    static async perfil(pessoa_id: any, data: any): Promise<SimplifiedResponse> {
        try {
            const method = 'PUT';
            const url = `/api/add-perfil/${pessoa_id}/perfil`;
            const response = await apiRequest(method, url, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async login(data: any): Promise<any> {
        return await apiRequest('POST', `${APIURL}users/login`, data);
    }

    static async recover(data: User): Promise<SimplifiedResponse> {
        return await apiRequest('POST', `${APIURL}users/recover`, data);
    }

    static async findId(id: number): Promise<User> {
        return await apiRequest("GET", `${APIURL}users/${id}`);
    }

    static async funcoesId(id: number): Promise<any> {
        return await apiRequest("GET", `${APIURL}funcionarios/funcoes/${id}`);
    }

    static async getAll(): Promise<User[]> {
        const res = await apiRequest("GET", `${APIURL}users/all`);
        return res;
    }

    static async allTecnicos(): Promise<User[]> {
        const res = await apiRequest("GET", `${APIURL}users/tecnicos`);
        return res;
    }

    static async me(): Promise<any> {
        const res = await apiRequest("GET", `${APIURL}users/me`);
        return res;
    }

    static async delete(id: number): Promise<SimplifiedResponse> {
        return await apiRequest("DELETE", `${APIURL}users/${id}/delete`);
    }
}