import { apiRequest } from "../httpAxios";
import { APIURL } from "../Util";
import { normalizeResponse, SimplifiedResponse } from "../Utilitario";

export class CategoriaDto {

    constructor(
        public categoria: Categoria,
        public lengthCursos: number
    ) {
        this.categoria = categoria;
        this.lengthCursos = lengthCursos;
    }
}
export class Categoria {

    id: any = null;
    nome: string = '';
    pai: any = 0;
    subcategorias_recursivas?: Categoria[];
    data_criacao: string = '';
    data_atualizacao: string = '';

    constructor(init?: Partial<Categoria>) {
        Object.assign(this, init);
    }

    static async save(c: Categoria): Promise<SimplifiedResponse> {
        const method = c.id != null ? 'PUT' : 'POST';
        const response = await apiRequest(method, `${APIURL}categorias`, c);

        return normalizeResponse(response);
    }

    static delete(c: Categoria) {
        console.log(c);
    }

    static async allCategorias(): Promise<any> {
        try {
            return await apiRequest("GET", `${APIURL}categorias`);
        } catch (error: any) {
            console.error('Erro ao buscar categorias:', error);
            return [];
        }
    }

}