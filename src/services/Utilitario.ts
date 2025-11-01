import jsPDF from "jspdf";
import { Empresas } from "./classes/Empresa";
import { FileItem } from "./classes/FileItem";
import { rtalert } from "../hooks/rtalert";
import { Coordenada } from "./classes/FormaGeografica";

export type SavedResponse = {
  headers: Record<string, any>;
  body: {
    recordId: any;
    record: any;
    mensagem: string;
    status: string;
  };
  statusCode: string;
  statusCodeValue: number;
};

export type SimplifiedResponse = {
  record?: any;
  recordId: any;
  mensagem: string;
  status: string;
};
export const normalizeResponse = (response: SavedResponse): SimplifiedResponse => {
  return 'body' in response ? response.body : response;
};

export class Option {
  label: any;
  value: any;
  object: Object;

  constructor(label: any, value: any, object: Object) {
    this.label = label;
    this.value = value;
    this.object = object;
  }
}

// src/models/Usuario.ts

export enum TipoUsuario {
  ADMIN = "ADMIN",
  PROFESSOR = "PROFESSOR",
  ALUNO = "ALUNO",
  VISITANTE = "VISITANTE"
}

export class Usuario {
  id: number | null = null;
  nomeUsuario: string = "";
  senha: string = "";
  email: string = "";
  nome: string = "";
  urlFoto: string = "https://i.ibb.co/vD7B5M2/aeplus-icon.png";
  biografia: string = "Sem biografia";
  telefone: string = "";
  perfil: TipoUsuario = TipoUsuario.VISITANTE;
  bloqueado: boolean = false;
  codigoUsuario: string = "";
  bi: string = "BI não definido";
  emailVerificado: boolean = false;
  ultimoAcesso: Date | null = null;
  dataCriacao: Date = new Date();
  dataAtualizacao: Date = new Date();

  constructor(init?: Partial<Usuario>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  // Métodos estáticos para operações de CRUD
  static async listarTodos(): Promise<Usuario[]> {
    // Implementação da chamada à API
    try {
      const response = await fetch('/api/usuarios');
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  }

  static async buscarPorId(id: number): Promise<Usuario | null> {
    try {
      const response = await fetch(`/api/usuarios/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${id}:`, error);
      return null;
    }
  }

  async salvar(): Promise<boolean> {
    try {
      const method = this.id ? 'PUT' : 'POST';
      const url = this.id ? `/api/usuarios/${this.id}` : '/api/usuarios';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this),
      });

      if (response.ok) {
        const data = await response.json();
        Object.assign(this, data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      return false;
    }
  }

  async remover(): Promise<boolean> {
    if (!this.id) return false;

    try {
      const response = await fetch(`/api/usuarios/${this.id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      return false;
    }
  }

  // Métodos auxiliares
  getPerfilFormatado(): string {
    switch (this.perfil) {
      case TipoUsuario.ADMIN: return "Administrador";
      case TipoUsuario.PROFESSOR: return "Professor";
      case TipoUsuario.ALUNO: return "Aluno";
      case TipoUsuario.VISITANTE: return "Visitante";
      default: return "Desconhecido";
    }
  }

  getStatus(): string {
    return this.bloqueado ? "Bloqueado" : "Ativo";
  }

  // Validação
  validar(): Record<string, string> {
    const erros: Record<string, string> = {};

    if (!this.nomeUsuario.trim()) {
      erros.nomeUsuario = "Nome de usuário é obrigatório";
    }

    if (!this.senha.trim()) {
      erros.senha = "Senha é obrigatória";
    } else if (this.senha.length < 6) {
      erros.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!this.email.trim()) {
      erros.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      erros.email = "E-mail inválido";
    }

    if (!this.nome.trim()) {
      erros.nome = "Nome completo é obrigatório";
    }

    return erros;
  }
}

// Função utilitária para criar Option a partir de enum
export function criarOpcoesTipoUsuario(): Option[] {
  return Object.values(TipoUsuario).map(tipo => {
    let label = "";
    switch (tipo) {
      case TipoUsuario.ADMIN: label = "Administrador"; break;
      case TipoUsuario.PROFESSOR: label = "Professor"; break;
      case TipoUsuario.ALUNO: label = "Aluno"; break;
      case TipoUsuario.VISITANTE: label = "Visitante"; break;
    }
    return new Option(label, tipo, { id: tipo });
  });
}

export const formatDateToMysql = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDecimal = (value: any): number => {
  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const cleaned = value.replace(/\./g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}; // https://cfirox.com

export function formatarUltimoAcesso(value: Date | string): string {
  if (!value) return "Nunca acessou";

  const acesso = new Date(value);
  const agora = new Date();
  const diffMs = agora.getTime() - acesso.getTime();

  const segundos = Math.floor(diffMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const meses = Math.floor(dias / 30);
  const anos = Math.floor(dias / 365);

  if (segundos < 60) {
    return `Há ${segundos} segundo${segundos === 1 ? '' : 's'}`;
  }

  if (minutos < 60) {
    const s = segundos % 60;
    return `Há ${minutos} minuto${minutos === 1 ? '' : 's'} e ${s} segundo${s === 1 ? '' : 's'}`;
  }

  if (horas < 24) {
    const m = minutos % 60;
    return `Há ${horas} hora${horas === 1 ? '' : 's'} e ${m} minuto${m === 1 ? '' : 's'}`;
  }

  if (dias < 30) {
    return `Há ${dias} dia${dias === 1 ? '' : 's'}`;
  }

  if (meses < 12) {
    return `Há ${meses} mês${meses === 1 ? '' : 'es'}`;
  }

  return `Há ${anos} ano${anos === 1 ? '' : 's'}`;
}

export const addText = (
  doc: jsPDF,
  text: string = '',
  size: number = 12,
  fstyle: string = 'helvetica',
  bold: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal',
  align: 'left' | 'center' | 'right' | 'justify' | undefined = 'center',
  color: string = '#000000', // Mudado de '#fff' (branco) para '#000000' (preto) como padrão mais sensato
  currentY: number = 0,
  centerX: number = 0
): void => {
  doc.setFontSize(size);
  doc.setFont(fstyle, bold);
  doc.setTextColor(color);
  doc.text(text, centerX, currentY, { align: align });
};


export const header = async (doc: jsPDF, currentY: number, centerX: number, pageWidth: number, margin: any) => {
  let emp = new Empresas()
  currentY = 19;
  // Cabeçalho - Dados da Escola
  addText(doc, 'REPÚBLICA DE ANGOLA', 12, 'helvetica', 'bold', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Ministério da Educação - Direção Provincial de Luanda', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Administração Municipal do Mussulo', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Direcção Municipal de Infraestructuras, Ordenamento do Território', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Habitação, Ambiente, Saneamento Básico e Equipamento Urbano', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Secção de Infraestruturas e Equipamento Urbano', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);

  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(`${emp.endereco} | Tel: ${emp.contactos} | Email: ${emp.email}`, centerX, currentY, { align: 'center' });
  currentY += 8;
  // Linha divisória
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(margin.left, currentY, pageWidth - margin.right, currentY);
}
export const headerParecer = (doc: jsPDF, currentY: number, centerX: number) => {
  // Cabeçalho - Dados da Escola
  addText(doc, 'REPÚBLICA DE ANGOLA', 12, 'helvetica', 'bold', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Ministério da Educação - Direção Provincial de Luanda', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Administração Municipal do Mussulo', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Direcção Municipal de Infraestructuras, Ordenamento do Território', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Habitação, Ambiente, Saneamento Básico e Equipamento Urbano', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);
  currentY += 4;
  addText(doc, 'Secção de Infraestruturas e Equipamento Urbano', 10, 'helvetica', 'normal', 'center', '#000000', currentY, centerX);

  return currentY += 8;
}

// utils/coordinateConverter.ts

/**
 * Converte coordenadas no formato DMS para decimal
 * @param dmsString String no formato "S 23°42'43,23" / E 23°42'34,23""
 * @returns Objeto com latitude e longitude em formato decimal
 */
export const dmsToDecimal = (dmsString: string): { lat: number; lng: number } | null => {
  try {
    // Expressão regular para extrair os componentes DMS
    const regex = /([NS])\s*(\d+)°\s*(\d+)'\s*([\d,]+)"\s*\/\s*([EW])\s*(\d+)°\s*(\d+)'\s*([\d,]+)"/;
    const match = dmsString.match(regex);

    if (!match) {
      console.error('Formato DMS inválido');
      return null;
    }

    // Extrai os componentes da latitude
    const [, latDirection, latDegrees, latMinutes, latSeconds] = match;

    // Extrai os componentes da longitude
    const [, , , , , lngDirection, lngDegrees, lngMinutes, lngSeconds] = match;

    // Converte vírgula para ponto e parse para número
    const parseDMSValue = (value: string): number => {
      return parseFloat(value.replace(',', '.'));
    };

    // Converte DMS para decimal
    const convertToDecimal = (degrees: string, minutes: string, seconds: string, direction: string): number => {
      const deg = parseFloat(degrees);
      const min = parseFloat(minutes);
      const sec = parseDMSValue(seconds);

      let decimal = deg + (min / 60) + (sec / 3600);

      // Aplica o sinal baseado na direção
      if (direction === 'S' || direction === 'W') {
        decimal = -decimal;
      }

      return decimal;
    };

    const latitude = convertToDecimal(latDegrees, latMinutes, latSeconds, latDirection);
    const longitude = convertToDecimal(lngDegrees, lngMinutes, lngSeconds, lngDirection);

    return {
      lat: parseFloat(latitude.toFixed(6)),
      lng: parseFloat(longitude.toFixed(6))
    };
  } catch (error) {
    console.error('Erro ao converter DMS para decimal:', error);
    return null;
  }
};

/**
 * Converte coordenadas decimais para formato DMS
 * @param lat Latitude decimal
 * @param lng Longitude decimal
 * @returns String no formato "S 23°42'43,23" / E 23°42'34,23""
 */
export const decimalToDMS = (lat: number, lng: number): string => {
  const convertToDMS = (decimal: number, isLatitude: boolean): string => {
    // Determina a direção
    let direction: string;
    if (isLatitude) {
      direction = decimal >= 0 ? 'N' : 'S';
    } else {
      direction = decimal >= 0 ? 'E' : 'W';
    }

    // Valor absoluto
    const absDecimal = Math.abs(decimal);

    // Extrai graus, minutos e segundos
    const degrees = Math.floor(absDecimal);
    const minutesDecimal = (absDecimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;

    return `${direction} ${degrees}°${minutes}'${seconds.toFixed(2).replace('.', ',')}"`;
  };

  const latDMS = convertToDMS(lat, true);
  const lngDMS = convertToDMS(lng, false);

  return `${latDMS} / ${lngDMS}`;
};

/**
 * Extrai apenas os números de uma string DMS formatada
 * @param dmsString String no formato "S 23°42'43,23" / E 23°42'34,23""
 * @returns String com apenas números (ex: "2342432323423432")
 */
export const extractNumbersFromDMS = (dmsString: string): string => {
  return dmsString.replace(/[^\d]/g, '');
};

// utils/currencyUtils.ts

/**
 * Converte um valor monetário formatado para número double
 * @param formattedValue Valor formatado (ex: "R$ 1.234,56", "1.234,56", "$1,234.56")
 * @returns Número double ou null se não for possível converter
 */
export const currencyToDouble = (formattedValue: string): number | null => {
  if (!formattedValue || typeof formattedValue !== 'string') {
    return null;
  }

  try {
    // Remove símbolos de moeda e espaços
    let cleanValue = formattedValue
      .replace(/[^\d,.-]/g, '') // Remove tudo exceto números, vírgula, ponto e hífen
      .replace(/\s/g, ''); // Remove espaços

    // Verifica se é formato brasileiro/português (1.234,56)
    if (/^\d{1,3}(\.\d{3})*,\d+$/.test(cleanValue)) {
      cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
    }
    // Verifica se é formato americano (1,234.56)
    else if (/^\d{1,3}(,\d{3})*\.\d+$/.test(cleanValue)) {
      cleanValue = cleanValue.replace(/,/g, '');
    }
    // Se não tem separador decimal, assume que é inteiro
    else if (!cleanValue.includes(',') && !cleanValue.includes('.')) {
      cleanValue = cleanValue + '.00';
    }

    // Converte para número
    const number = parseFloat(cleanValue);

    return isNaN(number) ? null : number;
  } catch (error) {
    console.error('Erro ao converter valor monetário:', error);
    return null;
  }
};

/**
 * Converte um valor double para formato monetário
 * @param value Valor numérico
 * @param format Formato desejado ('br', 'us', 'ao')
 * @param showSymbol Se deve mostrar o símbolo da moeda
 * @returns Valor formatado como string
 */
export const doubleToCurrency = (
  value: number,
  format: 'br' | 'us' | 'ao' = 'ao',
  showSymbol: boolean = true
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }

  try {
    switch (format) {
      case 'br': // Brasileiro
        if (showSymbol) {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(value);
        } else {
          return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value);
        }

      case 'us': // Americano
        if (showSymbol) {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(value);
        } else {
          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value);
        }

      case 'ao': // Angolano
      default:
        if (showSymbol) {
          return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA'
          }).format(value);
        } else {
          return new Intl.NumberFormat('pt-AO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value);
        }
    }
  } catch (error) {
    console.error('Erro ao formatar valor monetário:', error);
    return value.toString();
  }
};

/**
 * Extrai apenas os números de um valor monetário formatado
 * @param formattedValue Valor formatado
 * @returns String contendo apenas números
 */
export const extractNumbersFromCurrency = (formattedValue: string): string => {
  return formattedValue.replace(/[^\d]/g, '');
};

export function generateUniqueId(prefix: 'file' | 'folder'): string {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2);

  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 000–999

  return `${prefix}_${hours}${minutes}${seconds}${day}${month}${year}_${random}`;
}

interface dataResult {
  success: true,
  message: string,
  path: string,
  data: {
    original_name: string,
    saved_name: string,
    size: number,
    extension: string
  }
}

export async function saveFile(file: File, path: string = `/Processos`): Promise<dataResult | null> {
  const formDat = new FormData();
  formDat.append('file', file);
  formDat.append('path', `${path}/${file.name}`);

  return await FileItem.uploads(formDat)
}

export async function saveFileItem(file: dataResult, entity_id: string): Promise<SimplifiedResponse> {
  let data = new FileItem({
    id: generateUniqueId('file'),
    name: file.data.original_name,
    type: 'file',
    path: file.path,
    size: file.data.size,
    extension: file.data.extension,
    parent_id: 'root',
    entity_id: entity_id,
    modifiedAt: '',
    createdAt: '',
    permissions: {
      departments: ['all'],
      isPublic: true
    }
  })

  return await FileItem.create(data)
}

export const nacionalidades = [
  new Option('Afegã', 'Afegã', 'Afegã'),
  new Option('Albanesa', 'Albanesa', 'Albanesa'),
  new Option('Alemã', 'Alemã', 'Alemã'),
  new Option('Andorrana', 'Andorrana', 'Andorrana'),
  new Option('Angolana', 'Angolana', 'Angolana'),
  new Option('Antiguana', 'Antiguana', 'Antiguana'),
  new Option('Argentina', 'Argentina', 'Argentina'),
  new Option('Arménia', 'Arménia', 'Arménia'),
  new Option('Australiana', 'Australiana', 'Australiana'),
  new Option('Austríaca', 'Austríaca', 'Austríaca'),
  new Option('Azerbaijana', 'Azerbaijana', 'Azerbaijana'),
  new Option('Bahamense', 'Bahamense', 'Bahamense'),
  new Option('Bareinita', 'Bareinita', 'Bareinita'),
  new Option('Bangladechense', 'Bangladechense', 'Bangladechense'),
  new Option('Barbadiana', 'Barbadiana', 'Barbadiana'),
  new Option('Belga', 'Belga', 'Belga'),
  new Option('Belizenha', 'Belizenha', 'Belizenha'),
  new Option('Beninense', 'Beninense', 'Beninense'),
  new Option('Bielorrussa', 'Bielorrussa', 'Bielorrussa'),
  new Option('Birmanesa', 'Birmanesa', 'Birmanesa'),
  new Option('Boliviana', 'Boliviana', 'Boliviana'),
  new Option('Bósnia', 'Bósnia', 'Bósnia'),
  new Option('Botsuanesa', 'Botsuanesa', 'Botsuanesa'),
  new Option('Brasileira', 'Brasileira', 'Brasileira'),
  new Option('Britânica', 'Britânica', 'Britânica'),
  new Option('Bruneiana', 'Bruneiana', 'Bruneiana'),
  new Option('Búlgara', 'Búlgara', 'Búlgara'),
  new Option('Burquinense', 'Burquinense', 'Burquinense'),
  new Option('Burundiana', 'Burundiana', 'Burundiana'),
  new Option('Butanesa', 'Butanesa', 'Butanesa'),
  new Option('Caboverdiana', 'Caboverdiana', 'Caboverdiana'),
  new Option('Camaronense', 'Camaronense', 'Camaronense'),
  new Option('Cambojana', 'Cambojana', 'Cambojana'),
  new Option('Canadiana', 'Canadiana', 'Canadiana'),
  new Option('Catariana', 'Catariana', 'Catariana'),
  new Option('Cazaque', 'Cazaque', 'Cazaque'),
  new Option('Centro-Africana', 'Centro-Africana', 'Centro-Africana'),
  new Option('Chadiana', 'Chadiana', 'Chadiana'),
  new Option('Chilena', 'Chilena', 'Chilena'),
  new Option('Chinesa', 'Chinesa', 'Chinesa'),
  new Option('Cipriota', 'Cipriota', 'Cipriota'),
  new Option('Colombiana', 'Colombiana', 'Colombiana'),
  new Option('Comorense', 'Comorense', 'Comorense'),
  new Option('Congolesa', 'Congolesa', 'Congolesa'),
  new Option('Sul-Coreana', 'Sul-Coreana', 'Sul-Coreana'),
  new Option('Norte-Coreana', 'Norte-Coreana', 'Norte-Coreana'),
  new Option('Costarriquenha', 'Costarriquenha', 'Costarriquenha'),
  new Option('Croata', 'Croata', 'Croata'),
  new Option('Cubana', 'Cubana', 'Cubana'),
  new Option('Dinamarquesa', 'Dinamarquesa', 'Dinamarquesa'),
  new Option('Djibutiana', 'Djibutiana', 'Djibutiana'),
  new Option('Dominicana', 'Dominicana', 'Dominicana'),
  new Option('Dominiquense', 'Dominiquense', 'Dominiquense'),
  new Option('Egípcia', 'Egípcia', 'Egípcia'),
  new Option('Salvadorenha', 'Salvadorenha', 'Salvadorenha'),
  new Option('Emiratense', 'Emiratense', 'Emiratense'),
  new Option('Equatoriana', 'Equatoriana', 'Equatoriana'),
  new Option('Eritreia', 'Eritreia', 'Eritreia'),
  new Option('Eslovaca', 'Eslovaca', 'Eslovaca'),
  new Option('Eslovena', 'Eslovena', 'Eslovena'),
  new Option('Espanhola', 'Espanhola', 'Espanhola'),
  new Option('Norte-Americana', 'Norte-Americana', 'Norte-Americana'),
  new Option('Estadunidense', 'Estadunidense', 'Estadunidense'),
  new Option('Estoniana', 'Estoniana', 'Estoniana'),
  new Option('Etíope', 'Etíope', 'Etíope'),
  new Option('Fijiana', 'Fijiana', 'Fijiana'),
  new Option('Filipina', 'Filipina', 'Filipina'),
  new Option('Finlandesa', 'Finlandesa', 'Finlandesa'),
  new Option('Francesa', 'Francesa', 'Francesa'),
  new Option('Gabonesa', 'Gabonesa', 'Gabonesa'),
  new Option('Gambiana', 'Gambiana', 'Gambiana'),
  new Option('Ganesa', 'Ganesa', 'Ganesa'),
  new Option('Georgiana', 'Georgiana', 'Georgiana'),
  new Option('Granadina', 'Granadina', 'Granadina'),
  new Option('Grega', 'Grega', 'Grega'),
  new Option('Guatemalteca', 'Guatemalteca', 'Guatemalteca'),
  new Option('Guineense', 'Guineense', 'Guineense'),
  new Option('Guineu-Equatoriana', 'Guineu-Equatoriana', 'Guineu-Equatoriana'),
  new Option('Guineense-Bissau', 'Guineense-Bissau', 'Guineense-Bissau'),
  new Option('Guianesa', 'Guianesa', 'Guianesa'),
  new Option('Haitiana', 'Haitiana', 'Haitiana'),
  new Option('Hondurenha', 'Hondurenha', 'Hondurenha'),
  new Option('Húngara', 'Húngara', 'Húngara'),
  new Option('Iemenita', 'Iemenita', 'Iemenita'),
  new Option('Indiana', 'Indiana', 'Indiana'),
  new Option('Indonésia', 'Indonésia', 'Indonésia'),
  new Option('Iraniana', 'Iraniana', 'Iraniana'),
  new Option('Iraquiana', 'Iraquiana', 'Iraquiana'),
  new Option('Irlandesa', 'Irlandesa', 'Irlandesa'),
  new Option('Islandesa', 'Islandesa', 'Islandesa'),
  new Option('Israelita', 'Israelita', 'Israelita'),
  new Option('Italiana', 'Italiana', 'Italiana'),
  new Option('Jamaicana', 'Jamaicana', 'Jamaicana'),
  new Option('Japonesa', 'Japonesa', 'Japonesa'),
  new Option('Jordana', 'Jordana', 'Jordana'),
  new Option('Kiribatiana', 'Kiribatiana', 'Kiribatiana'),
  new Option('Kuwaitiana', 'Kuwaitiana', 'Kuwaitiana'),
  new Option('Laosiana', 'Laosiana', 'Laosiana'),
  new Option('Lesotiana', 'Lesotiana', 'Lesotiana'),
  new Option('Letã', 'Letã', 'Letã'),
  new Option('Libanesa', 'Libanesa', 'Libanesa'),
  new Option('Liberiana', 'Liberiana', 'Liberiana'),
  new Option('Líbia', 'Líbia', 'Líbia'),
  new Option('Liechtensteinense', 'Liechtensteinense', 'Liechtensteinense'),
  new Option('Lituana', 'Lituana', 'Lituana'),
  new Option('Luxemburguesa', 'Luxemburguesa', 'Luxemburguesa'),
  new Option('Macedónia', 'Macedónia', 'Macedónia'),
  new Option('Malagasy', 'Malagasy', 'Malagasy'),
  new Option('Malaia', 'Malaia', 'Malaia'),
  new Option('Malauiana', 'Malauiana', 'Malauiana'),
  new Option('Maldiva', 'Maldiva', 'Maldiva'),
  new Option('Maliana', 'Maliana', 'Maliana'),
  new Option('Maltesa', 'Maltesa', 'Maltesa'),
  new Option('Marroquina', 'Marroquina', 'Marroquina'),
  new Option('Mauriciana', 'Mauriciana', 'Mauriciana'),
  new Option('Mauritana', 'Mauritana', 'Mauritana'),
  new Option('Mexicana', 'Mexicana', 'Mexicana'),
  new Option('Micronésia', 'Micronésia', 'Micronésia'),
  new Option('Moçambicana', 'Moçambicana', 'Moçambicana'),
  new Option('Moldava', 'Moldava', 'Moldava'),
  new Option('Monegasca', 'Monegasca', 'Monegasca'),
  new Option('Mongol', 'Mongol', 'Mongol'),
  new Option('Montenegrina', 'Montenegrina', 'Montenegrina'),
  new Option('Namibiana', 'Namibiana', 'Namibiana'),
  new Option('Nauruana', 'Nauruana', 'Nauruana'),
  new Option('Nepalesa', 'Nepalesa', 'Nepalesa'),
  new Option('Nicaraguense', 'Nicaraguense', 'Nicaraguense'),
  new Option('Nigeriana', 'Nigeriana', 'Nigeriana'),
  new Option('Nigerina', 'Nigerina', 'Nigerina'),
  new Option('Norueguesa', 'Norueguesa', 'Norueguesa'),
  new Option('Neozelandesa', 'Neozelandesa', 'Neozelandesa'),
  new Option('Omanense', 'Omanense', 'Omanense'),
  new Option('Neerlandesa', 'Neerlandesa', 'Neerlandesa'),
  new Option('Palauana', 'Palauana', 'Palauana'),
  new Option('Panamenha', 'Panamenha', 'Panamenha'),
  new Option('Papua-Nova Guineense', 'Papua-Nova Guineense', 'Papua-Nova Guineense'),
  new Option('Paquistanesa', 'Paquistanesa', 'Paquistanesa'),
  new Option('Paraguaia', 'Paraguaia', 'Paraguaia'),
  new Option('Peruana', 'Peruana', 'Peruana'),
  new Option('Polaca', 'Polaca', 'Polaca'),
  new Option('Portuguesa', 'Portuguesa', 'Portuguesa'),
  new Option('Queniana', 'Queniana', 'Queniana'),
  new Option('Quirguiz', 'Quirguiz', 'Quirguiz'),
  new Option('Britânica', 'Britânica', 'Britânica'),
  new Option('Centro-Africana', 'Centro-Africana', 'Centro-Africana'),
  new Option('Checa', 'Checa', 'Checa'),
  new Option('Dominicana', 'Dominicana', 'Dominicana'),
  new Option('Romena', 'Romena', 'Romena'),
  new Option('Ruandesa', 'Ruandesa', 'Ruandesa'),
  new Option('Russa', 'Russa', 'Russa'),
  new Option('Salomónica', 'Salomónica', 'Salomónica'),
  new Option('Salvadorenha', 'Salvadorenha', 'Salvadorenha'),
  new Option('Samoana', 'Samoana', 'Samoana'),
  new Option('São-Cristovense', 'São-Cristovense', 'São-Cristovense'),
  new Option('São-Marinese', 'São-Marinese', 'São-Marinese'),
  new Option('São-Tomense', 'São-Tomense', 'São-Tomense'),
  new Option('São-Vicentina', 'São-Vicentina', 'São-Vicentina'),
  new Option('Saudita', 'Saudita', 'Saudita'),
  new Option('Senegalesa', 'Senegalesa', 'Senegalesa'),
  new Option('Serra-Leonesa', 'Serra-Leonesa', 'Serra-Leonesa'),
  new Option('Sérvia', 'Sérvia', 'Sérvia'),
  new Option('Seychellense', 'Seychellense', 'Seychellense'),
  new Option('Singapuriana', 'Singapuriana', 'Singapuriana'),
  new Option('Síria', 'Síria', 'Síria'),
  new Option('Somali', 'Somali', 'Somali'),
  new Option('Cingalesa', 'Cingalesa', 'Cingalesa'),
  new Option('Sudanesa', 'Sudanesa', 'Sudanesa'),
  new Option('Sul-Sudanesa', 'Sul-Sudanesa', 'Sul-Sudanesa'),
  new Option('Sueca', 'Sueca', 'Sueca'),
  new Option('Suíça', 'Suíça', 'Suíça'),
  new Option('Surinamesa', 'Surinamesa', 'Surinamesa'),
  new Option('Tailandesa', 'Tailandesa', 'Tailandesa'),
  new Option('Tailandesa', 'Tailandesa', 'Tailandesa'),
  new Option('Tajique', 'Tajique', 'Tajique'),
  new Option('Tanzaniana', 'Tanzaniana', 'Tanzaniana'),
  new Option('Timorense', 'Timorense', 'Timorense'),
  new Option('Togolesa', 'Togolesa', 'Togolesa'),
  new Option('Tonganês', 'Tonganês', 'Tonganês'),
  new Option('Trindadiana', 'Trindadiana', 'Trindadiana'),
  new Option('Tunisina', 'Tunisina', 'Tunisina'),
  new Option('Turcomena', 'Turcomena', 'Turcomena'),
  new Option('Turca', 'Turca', 'Turca'),
  new Option('Tuvaluana', 'Tuvaluana', 'Tuvaluana'),
  new Option('Ucraniana', 'Ucraniana', 'Ucraniana'),
  new Option('Ugandense', 'Ugandense', 'Ugandense'),
  new Option('Uruguaia', 'Uruguaia', 'Uruguaia'),
  new Option('Uzbeque', 'Uzbeque', 'Uzbeque'),
  new Option('Vanuatuense', 'Vanuatuense', 'Vanuatuense'),
  new Option('Vaticana', 'Vaticana', 'Vaticana'),
  new Option('Venezuelana', 'Venezuelana', 'Venezuelana'),
  new Option('Vietnamita', 'Vietnamita', 'Vietnamita'),
  new Option('Zambiana', 'Zambiana', 'Zambiana'),
  new Option('Zimbabuense', 'Zimbabuense', 'Zimbabuense'),
  new Option('Zimbabuense', 'Zimbabuense', 'Zimbabuense')
]

interface Ponto {
  x: number;
  y: number;
}

/**
 * Verifica se dois polígonos (definidos por listas de coordenadas) se intersectam
 * @param coord1 - Lista de coordenadas do primeiro polígono
 * @param coord2 - Lista de coordenadas do segundo polígono
 * @returns True se houver interseção, False caso contrário
 */
export function verificarIntersecao(coord1: Coordenada[], coord2: Coordenada[]): boolean {
  // Converte as coordenadas para arrays de pontos [x, y] (lng = x, lat = y)
  const poly1: Ponto[] = coord1.map(coord => ({ x: coord.lng, y: coord.lat }));
  const poly2: Ponto[] = coord2.map(coord => ({ x: coord.lng, y: coord.lat }));

  // Verifica se algum dos polígonos tem menos de 3 pontos (não é um polígono válido)
  if (poly1.length < 3 || poly2.length < 3) {
    rtalert.error("Um dos polígonos tem menos de 3 pontos");
    return false;
  }

  // Verifica interseção usando o algoritmo SAT
  const poligonos = [poly1, poly2];

  for (let i = 0; i < poligonos.length; i++) {
    const polygon = poligonos[i];

    for (let j = 0; j < polygon.length; j++) {
      const p1 = polygon[j];
      const p2 = polygon[(j + 1) % polygon.length];

      // Calcula a normal (perpendicular) ao segmento de linha
      const normal = { x: -(p2.y - p1.y), y: p2.x - p1.x };

      // Projeta todos os pontos do primeiro polígono no eixo normal
      const proj1 = projetarPoligono(poly1, normal);

      // Projeta todos os pontos do segundo polígono no eixo normal
      const proj2 = projetarPoligono(poly2, normal);

      // Verifica se as projeções se sobrepõem
      if (!sobreposicao(proj1, proj2)) {
        // Encontramos um eixo de separação, os polígonos não colidem
        return false;
      }
    }
  }

  // Se não encontramos nenhum eixo de separação, os polígonos colidem
  return true;
}

/**
 * Projeta todos os pontos de um polígono em um eixo
 */
function projetarPoligono(poly: Ponto[], axis: Ponto): { min: number; max: number } {
  let min = produtoEscalar(poly[0], axis);
  let max = min;

  for (let i = 1; i < poly.length; i++) {
    const p = produtoEscalar(poly[i], axis);
    if (p < min) min = p;
    if (p > max) max = p;
  }

  return { min, max };
}

/**
 * Calcula o produto escalar entre dois pontos
 */
function produtoEscalar(p1: Ponto, p2: Ponto): number {
  return p1.x * p2.x + p1.y * p2.y;
}

/**
 * Verifica se duas projeções se sobrepõem
 */
function sobreposicao(proj1: { min: number; max: number }, proj2: { min: number; max: number }): boolean {
  return !(proj1.max < proj2.min || proj2.max < proj1.min);
}