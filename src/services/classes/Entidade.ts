import { apiRequest } from "../httpAxios";
import { Pessoa } from "./Pessoa";
import { createErrorResponse } from "../Util";
import { SimplifiedResponse } from "../Utilitario";

export class EntidadeShow {
    id!: string;
    num_entidade!: string;
    tipo!: string;
    nome!: string;
    email!: string;
    contacto!: string;
    processos!: number;
    imoveis!: number;
    estado!: string;

    constructor(init?: Partial<Entidade>) {
        Object.assign(this, init);
    }
}
export class EntidadeList {
    id!: number;
    num_entidade!: string;
    tipo!: string;
    nome!: string;
    email!: string;
    contacto!: string;
    processos!: number;
    imoveis!: number;
    estado!: string;

    constructor(data?: Partial<Entidade>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class Entidade {
    id: any;
    tipo_entidade: 'PARTICULAR' | 'PUBLICA' | 'PRIVADA' = 'PARTICULAR';
    num_entidade: string = '';
    gestor: string = '';
    cargo: string = '';
    telefone: string = '';
    email_gestor: string = '';
    observacao: string = '';
    estado: 'ACTIVO' | 'INACTIVO' = 'ACTIVO';
    pessoa: Pessoa = new Pessoa();
    created_at: string = '';
    updated_at: string = '';

    constructor(init?: Partial<Entidade>) {
        Object.assign(this, init);
    }

    // Listar todas as entidades
    static async all(params?: any): Promise<any> {
        try {
            return await apiRequest('GET', `/api/entidades?${params}`);
        } catch (error) {
            return createErrorResponse('Erro ao carregar entidades', error);
        }
    }

    // Buscar entidade por ID
    static async historicos(entity_code: string): Promise<any> {
        try {
            return await apiRequest('GET', `/api/entidades/${entity_code}/historico`);
        } catch (error) {
            throw error;
        }
    }

    // Buscar entidade por ID
    static async files(entidade_id: string): Promise<any> {
        try {
            return await apiRequest('GET', `/api/entidades/${entidade_id}/files`);
        } catch (error) {
            throw error;
        }
    }

    // Buscar entidade por ID
    static async findEntidade(num_entidade: string): Promise<Entidade> {
        try {
            return await apiRequest('GET', `/api/entidades/find/${num_entidade}`);
        } catch (error) {
            throw error;
        }
    }

    // Buscar entidade por ID
    static async find(num_entidade: string): Promise<any> {
        try {
            return await apiRequest('GET', `/api/entidades/${num_entidade}/show`);
        } catch (error) {
            throw error;
        }
    }

    // Buscar entidade por ID
    static async findProcessos(id: number): Promise<any> {
        try {
            return await apiRequest('GET', `/api/entidades/${id}/processos`);
        } catch (error) {
            throw error;
        }
    }

    // Buscar entidade por ID
    static async findTecnico(id: number): Promise<any> {
        try {
            return await apiRequest('GET', `/api/entidades/${id}/tecnico`);
        } catch (error) {
            throw error;
        }
    }

    // Salvar entidade (criar ou atualizar)
    static async save(entidade: Entidade): Promise<SimplifiedResponse> {
        try {
            const method = entidade.id ? 'PUT' : 'POST';
            const url = entidade.id ? `/api/entidades/${entidade.id}` : '/api/entidades';

            const response = await apiRequest(method, url, entidade);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Salvar entidade (criar ou atualizar)
    static async perfil(pessoa_id: any, data: any): Promise<SimplifiedResponse> {
        try {
            const method = 'PUT';
            const url = `/api/entidades/${pessoa_id}/perfil`;
            const response = await apiRequest(method, url, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Excluir entidade
    static async delete(id: number): Promise<any> {
        try {
            const response = await apiRequest('DELETE', `/api/entidades/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Converter objeto Entidade para JSON
    static toJson(e: Entidade): any {
        return {
            id: e.id,
            tipo_entidade: e.tipo_entidade,
            num_entidade: e.num_entidade,
            observacao: e.observacao,
            estado: e.estado,
            pessoa_id: e.pessoa.id,
            pessoa: e.pessoa.toJson(),
            created_at: e.created_at,
            updated_at: e.updated_at
        };
    }

    // Método para clonar a entidade
    clone(e: Entidade): Entidade {
        e.id = null;
        return new Entidade(e);
    }
}