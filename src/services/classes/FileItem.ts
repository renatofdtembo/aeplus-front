import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";

export class FileItem {
    id: string = '';
    name: string = '';
    type: 'file' | 'folder' = 'folder';
    path: string = '';
    size: number = 0;
    extension?: string = '';
    parent_id?: string = '';
    entity_id?: any = null;
    modifiedAt: string = '';
    createdAt: string = '';
    permissions?: {
        departments: string[];
        isPublic: boolean;
    };
    children?: FileItem[];

    constructor(init?: Partial<FileItem>) {
        Object.assign(this, init);
    }

    static async create(data: FileItem): Promise<SimplifiedResponse> {
        return await apiRequest('POST', `${APIURL}file-items`, data);
    }

    static async updatePerfil(data: any): Promise<SimplifiedResponse> {
        return await apiRequest('POST', `${APIURL}file-items/perfil`, data);
    }

    static async uploads(data: FormData): Promise<any> {
        return await apiRequest('POST', `${APIURL}file-items/upload`, data);
    }

    static async moveFile(data: any): Promise<SimplifiedResponse> {
        return await apiRequest('POST', `${APIURL}file-items/move-file`, data);
    }

    static async uploadInscricao(data: FormData): Promise<SimplifiedResponse> {
        return await apiRequest('POST', `${APIURL}inscricao/upload`, data);
    }

    static async update(id: string, data: Partial<FileItem>): Promise<SimplifiedResponse> {
        return await apiRequest('PUT', `${APIURL}file-items/${id}`, data);
    }

    static async delete(id: string): Promise<SimplifiedResponse> {
        return await apiRequest('DELETE', `${APIURL}file-items/${id}`);
    }

    static async all(): Promise<FileItem[]> {
        return await apiRequest('GET', `${APIURL}file-items`);
    }
}
