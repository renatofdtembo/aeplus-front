import { apiRequest } from "../httpAxios";
import { APIURL, getdataHojeUS1 } from "../Util";
import { Endereco } from "./Endereco";
import { Municipio } from "./Municipio";

class Validade {
    emissao: string = getdataHojeUS1();
    expiracao: string = getdataHojeUS1();
}

export class Pessoa {

    id: number | null = null;
    nome: string = '';
    urlImg: string = '';;
    contacto: string = '';;
    email: string = '';;
    nif: string = '';;
    bi: string = '';
    cartao_residencia: string = '';
    validade: Validade = new Validade();
    passaporte: string = '';
    nacionalidade: string = 'Angolana';
    genero: 'M' | 'F' | 'OUTRO' = 'M';
    estadocivil: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'UNIAO_DE_FACTO' = 'SOLTEIRO';
    tipo: 'USUARIO' | 'FUNCIONARIO' | 'MUNICIPE' = 'MUNICIPE';
    nascimento: string = getdataHojeUS1();

    endereco: Endereco = new Endereco();
    naturalidade: Municipio = new Municipio();

    created_at: string = '';
    updated_at: string = '';

    constructor(init?: Partial<Pessoa>) {
        this.validade = new Validade();
        Object.assign(this, init);
    }

    getIdade(): number | null {
        if (!this.nascimento) return null;

        const nascimento = new Date(this.nascimento);
        const hoje = new Date();
        let idade = hoje.getFullYear() - nascimento.getFullYear();

        const mesAtual = hoje.getMonth();
        const mesNascimento = nascimento.getMonth();

        if (mesAtual < mesNascimento ||
            (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return idade;
    }

    getGeneroFormatado(): string {
        const generos: { [key: string]: string } = {
            'M': 'Masculino',
            'F': 'Feminino',
            'OUTRO': 'Outro'
        };

        return this.genero ? generos[this.genero] || this.genero : 'Não informado';
    }

    getEstadoCivilFormatado(): string {
        const estados: { [key: string]: string } = {
            'SOLTEIRO': 'Solteiro(a)',
            'CASADO': 'Casado(a)',
            'DIVORCIADO': 'Divorciado(a)',
            'VIUVO': 'Viúvo(a)',
            'UNIAO_DE_FACTO': 'União de Facto'
        };

        return this.estadocivil ? estados[this.estadocivil] || this.estadocivil : 'Não informado';
    }

    getTipoFormatado(): string {
        const tipos: { [key: string]: string } = {
            'USUARIO': 'Usuário',
            'FUNCIONARIO': 'Funcionário',
            'MUNICIPE': 'Munícipe'
        };

        return tipos[this.tipo] || this.tipo;
    }

    isFuncionario(): boolean {
        return this.tipo === 'FUNCIONARIO';
    }

    isUsuario(): boolean {
        return this.tipo === 'USUARIO';
    }

    isMunicipe(): boolean {
        return this.tipo === 'MUNICIPE';
    }

    toJson(): any {
        return {
            id: this.id,
            nome: this.nome,
            urlImg: this.urlImg,
            contacto: this.contacto,
            email: this.email,
            nif: this.nif,
            bi: this.bi,
            passaporte: this.passaporte,
            genero: this.genero,
            estadocivil: this.estadocivil,
            tipo: this.tipo,
            nascimento: this.nascimento,
            endereco_id: this.endereco.id,
            municipio_id: this.naturalidade.id,
        };
    }

    // Método para criar instância a partir de dados da API
    static fromApiData(data: any): Pessoa {
        return new Pessoa({
            id: data.id,
            nome: data.nome,
            urlImg: data.urlImg,
            contacto: data.contacto,
            email: data.email,
            nif: data.nif,
            bi: data.bi,
            passaporte: data.passaporte,
            genero: data.genero,
            estadocivil: data.estadocivil,
            tipo: data.tipo,
            nascimento: data.nascimento,
            created_at: data.created_at,
            updated_at: data.updated_at,

            endereco: data.endereco,
            naturalidade: data.municipio
        });
    }

    // Métodos estáticos para API
    static async save(data: Pessoa): Promise<any> {
        // Implementação depende da sua API
        const method = data.id ? 'PUT' : 'POST';
        const url = data.id ? `/api/pessoas/${data.id}` : '/api/pessoas';

        return await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data.toJson())
        });
    }

    static async updatePerfil(data: any): Promise<any> {
        return await apiRequest('PUT', `${APIURL}file-items/pessoa-perfil`, data);
    }

    static async findById(id: number): Promise<Pessoa | null> {
        try {
            const response = await fetch(`/api/pessoas/${id}`);
            const data = await response.json();

            if (data.success) {
                return Pessoa.fromApiData(data.data);
            }

            return null;
        } catch (error) {
            console.error('Erro ao buscar pessoa:', error);
            return null;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const response = await fetch(`/api/pessoas/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Erro ao excluir pessoa:', error);
            return false;
        }
    }
}