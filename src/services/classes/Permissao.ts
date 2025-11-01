import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { SimplifiedResponse } from "../Utilitario";
import { Funcao } from "./Funcao";
import { Menu } from "./Menu";

export class Permissao {
    id: any;
    menu: Menu = new Menu();
    funcao: Funcao = new Funcao();
    canView: boolean = false;
    canCreate: boolean = false;
    canUpdate: boolean = false;
    canDelete: boolean = false;

    constructor(init?: Partial<Permissao>) {
        Object.assign(this, init);
    }

    static async save(permics: Permissao[]): Promise<SimplifiedResponse> {
        let permissoes = permics.map((p)=>{
            return this.toJson(p)
        })
        return await apiRequest('POST', `${APIURL}permissoes/bulk`, permissoes);
    }

    static async delete(func: Permissao): Promise<any> {
        if (!func.id) throw new Error("ID da função não definido.");
        return await apiRequest("DELETE", `${APIURL}funcoes/${func.id}`);
    }

    static async all(): Promise<Permissao[]> {
        const data = await apiRequest("GET", `${APIURL}funcoes`);
        return data.map((item: any) => new Permissao(item));
    }

    static async initializeall(id: number): Promise<Permissao[]> {
        const data = await apiRequest("GET", `${APIURL}permissoes/funcao/${id}/inicialize`);
        return data.map((item: any) => new Permissao(item));
    }

    static async find(id: number): Promise<Permissao> {
        const data = await apiRequest("GET", `${APIURL}funcoes/${id}`);
        return new Permissao(data);
    }

    static toJson(p: Permissao) {
        return {
            id: p.id,
            menu_id: p.menu.id,
            funcao_id: p.funcao.id,
            canView:   p.canView,
            canCreate: p.canCreate,
            canUpdate: p.canUpdate,
            canDelete: p.canDelete
        };
    }
}
