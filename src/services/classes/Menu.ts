import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";

export class Menu {
    id: any;
    label: string = '';
    link: string = '';
    icone: string = '';
    parent: number = 0;
    sort: number = 0;
    children: Menu[] = [];
    children_recursive: Menu[] = [];

    constructor(data?: Partial<Menu>) {
        Object.assign(this, data);
    }

    static async save(menu: Menu): Promise<SimplifiedResponse> {
        const method = menu.id == null ? 'POST' : 'PUT';
        const response = await apiRequest(method, `${APIURL}menus`, menu);
        return response;
    }
    static async delete(menu: Menu) {
        try {
            const response = await apiRequest("DELETE", `${APIURL}menus/${menu.id}`);
            console.log(response);
        } catch (error) {
            console.error('Erro ao salvar menus:', error);
            return false;
        }
    }

    static async all(): Promise<Menu[]> {
        return await apiRequest("GET", `${APIURL}menus`);
    }

    static async allMenuOrganized(): Promise<Menu[]> {
        return await apiRequest("GET", `${APIURL}menus/organized`);
    }
}