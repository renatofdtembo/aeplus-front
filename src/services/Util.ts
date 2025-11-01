import { CellDef } from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { apiRequest } from './httpAxios';
import { Coordenada } from './classes/FormaGeografica';

export const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Júlho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]
type RGBA = [number, number, number, number];
export function hexToRgbaArray(hex: string): RGBA {
  // Remove o '#' e trata casos curtos (#rgb → #rrggbb, #rgba → #rrggbbaa)
  let hexSanitized = hex.slice(1);

  // Expande formato curto (#fff → #ffffff, #fff7 → #ffffff77)
  if (hexSanitized.length === 3 || hexSanitized.length === 4) {
    hexSanitized = hexSanitized.split('').map(c => c + c).join('');
  }

  // Extrai componentes
  const r = parseInt(hexSanitized.substring(0, 2), 16);
  const g = parseInt(hexSanitized.substring(2, 4), 16);
  const b = parseInt(hexSanitized.substring(4, 6), 16);

  // Alpha (padrão = 1 se não existir)
  let a = 1;
  if (hexSanitized.length >= 8) {
    const alphaHex = hexSanitized.substring(6, 8);
    a = parseInt(alphaHex, 16) / 255; // Converte para 0-1
  }

  // Retorna [r, g, b, a] (SEM o 'x' no final)
  return [r, g, b, a];
}
export function parseJSON(data: any) {
  return JSON.parse(data);
}
export const getLocalStorage = <T>(key: string): T | null => {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) {
      return null;
    }
    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.error('Erro ao recuperar do localStorage:', error);
    return null;
  }
};

export function gerarCodigoBarras(desc: string) {
  // Remove espaços e caracteres especiais do nome do produto
  let nomeFormatado = desc.replace(/[^a-zA-Z]/g, '').toUpperCase();

  // Pega as 2 ou 3 primeiras letras do nome
  let letras = nomeFormatado.substring(0, Math.min(3, nomeFormatado.length));

  // Gera 4 números aleatórios antes e depois das letras
  let parte1 = Math.floor(1000 + Math.random() * 9000); // Garante 4 dígitos
  let parte2 = Math.floor(1000 + Math.random() * 9000);

  // Retorna o código de barras final
  return `${parte1}${letras}${parte2}`;
}
export class Opcoes {
  constructor(public label: string, public value: any, public object: any) { }
}
export function ajustarAlturaElemento(selector_id: string) {
  const alturaAjustada = calcularAltura();
  const elemento = document.getElementById(selector_id);

  if (elemento) {
    elemento.style.height = `${alturaAjustada}px`;
  } else {
    console.error('Elemento não encontrado!');
  }
}
function calcularAltura() {
  // Obter a altura total da janela
  const alturaJanela = window.innerHeight;

  // Obter a altura total do documento
  const alturaDocumento = document.documentElement.scrollHeight;

  // Decidir qual altura usar
  const alturaFinal = Math.min(alturaJanela, alturaDocumento);

  // Subtrair 10% da altura
  const alturaAjustada = alturaFinal * 10;

  return alturaAjustada;
}

export class ObjectUpdater<T> {
  constructor(private obj: T) { }

  /**
   * Atualiza um campo aninhado do objeto gerenciado.
   * @param path O caminho do campo a ser atualizado, como um array de strings.
   * @param newValue O novo valor a ser atribuído.
   * @returns Uma nova instância do objeto com o campo atualizado.
   */
  updateNestedField(path: string, newValue: any): T {
    const update = (obj: any, path: string[], value: any): any => {
      if (path.length === 1) {
        return { ...obj, [path[0]]: value };
      }
      return {
        ...obj,
        [path[0]]: update(obj[path[0]] || {}, path.slice(1), value),
      };
    };

    return update(this.obj, path.split('.'), newValue);
  }
}

export function printf(...values: any[]): void {
  console.log(...values);
}

export function getHoraHoje() {
  var x = new Date().toLocaleString().split(' ')[1];
  return x;
}
export function getAno() {
  return getdataHojeUS1().split('-')[0];
}
export function getDia() {
  return parseInt(getdataHojeUS1().split('-')[2]);
}
export function getdataHoje() {
  var x = new Date().toLocaleString().split(' ')[0]; //2021-01-01
  return (x.split('/')[0] + '-' + x.split('/')[1] + '-' + x.split('/')[2]).replace(',', '');
}
export function getdataHojeUS() {
  var x = new Date().toLocaleString().split(' ')[0];
  return (x.split('/')[2].split(',')[0]) + '/' + x.split('/')[1] + '/' + x.split('/')[0].replace(',', '');
}
export function getdataHojeUS1() {
  var x = new Date().toLocaleString().split(' ')[0];
  return (x.split('/')[2].split(',')[0]) + '-' + x.split('/')[1] + '-' + x.split('/')[0].replace(',', '');
}
export function getdataHora() {
  return `${getdataHojeUS1()} ${getHoraHoje()}`;
}
export function getdataTHora() {
  return `${getdataHojeUS1()}T${getHoraHoje()}`;
}
export function getdataHojeDMA() {
  var x = new Date().toLocaleString().split(' ')[0];
  return (x.split('/')[0].split(',')[0]) + '-' + x.split('/')[1] + '-' + x.split('/')[2].replace(',', '');
}
export function getdataParam(dt: any) {
  var x = new Date(dt).toLocaleString().split(' ')[0];
  return (x.split('/')[2].split(',')[0]) + '-' + x.split('/')[1] + '-' + x.split('/')[0].replace(',', '');
}
export function formatData(data: any) {
  var x = new Date(data).toLocaleString().split(' ')[0];
  return (x.split('/')[2]).replace(',', '') + '/' + x.split('/')[1].replace(',', '') + '/' + x.split('/')[0].replace(',', '');
}
// Versão alternativa que também formata datetime (YYYY-MM-DD HH:MM:SS)
export function formatDataMysql(data: any): string {
  // Se a data for null ou undefined, retorna string vazia
  if (!data) return '';

  try {
    // Se já estiver no formato MySQL (YYYY-MM-DD), retorna diretamente
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }

    // Tenta converter para objeto Date
    let dateObj: Date;

    if (typeof data === 'string') {
      // Trata formato DD/MM/YYYY
      if (data.includes('/')) {
        const parts = data.split('/');
        if (parts.length === 3) {
          // Corrige ano com menos de 4 dígitos
          let year = parts[2];
          if (year.length === 2) {
            year = '20' + year; // Assume século 20 para anos de 2 dígitos
          } else if (year.length === 3) {
            year = '0' + year; // Adiciona zero para anos de 3 dígitos
          }

          // Converte para formato YYYY-MM-DD
          return `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      // Tenta criar Date a partir da string
      dateObj = new Date(data);
    } else {
      dateObj = new Date(data);
    }

    // Verifica se é uma data válida
    if (isNaN(dateObj.getTime())) {
      console.warn('Data inválida fornecida, tentando interpretar:', data);

      // Tenta extrair componentes de data de strings problemáticas
      if (typeof data === 'string') {
        // Procura por padrões de data na string
        const match = data.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
        if (match) {
          const [, dia, mes, ano] = match;
          let year = ano;

          // Ajusta o ano para ter 4 dígitos
          if (year.length === 2) {
            year = '20' + year;
          } else if (year.length === 3) {
            year = '0' + year;
          }

          return `${year}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }
      }

      // Se não conseguir interpretar, retorna string vazia
      return '';
    }

    // Extrai ano, mês e dia
    const ano = dateObj.getFullYear();
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dia = String(dateObj.getDate()).padStart(2, '0');

    // Retorna no formato MySQL (YYYY-MM-DD)
    return `${ano}-${mes}-${dia}`;
  } catch (error) {
    console.warn('Erro ao formatar data, retornando string vazia:', error);
    return '';
  }
}

// Função para validar se uma string é uma data válida no formato MySQL
export function isValidMysqlDate(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') return false;

  // Verifica o formato básico YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

  // Verifica se os componentes são válidos
  const [year, month, day] = dateString.split('-').map(Number);

  // Verifica intervalos válidos
  if (year < 1000 || year > 9999) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Verifica meses com 30 dias
  if ([4, 6, 9, 11].includes(month) && day > 30) return false;

  // Verifica fevereiro e anos bissextos
  if (month === 2) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (day > (isLeapYear ? 29 : 28)) return false;
  }

  return true;
}

// Função para corrigir datas problemáticas antes de enviar para o backend
export function sanitizeDateForBackend(date: any): string {
  const formatted = formatDataMysql(date);

  if (!formatted || !isValidMysqlDate(formatted)) {
    console.warn('Data inválida após formatação, usando data atual:', date);
    return formatDataMysql(new Date());
  }

  return formatted;
}
export function getAnoLetivoAtual() {
  const hoje = new Date(); // Obtém a data atual
  const anoAtual = hoje.getFullYear(); // Ano atual
  const mesAtual = hoje.getMonth() + 1; // Mês atual (0 = janeiro, por isso somamos 1)
  // Se o mês for antes de setembro, o ano letivo é do ano anterior ao ano atual
  if (mesAtual < 9) {
    return `${anoAtual - 1}/${anoAtual}`;
  }
  // Caso contrário, o ano letivo começa no ano atual e termina no próximo ano
  else {
    return `${anoAtual}/${anoAtual + 1}`;
  }
}
export function gerarIdentificador(nome: string): string {
  if (!nome) return '';

  const partes = nome.trim().split(' ');
  const primeiraLetra = partes[0].charAt(0).toUpperCase();
  const ultimaLetra = partes.length > 1 ? partes[partes.length - 1].charAt(0).toUpperCase() : '';

  const anoAtual = new Date().getFullYear();
  const numeroAleatorio = Math.floor(Math.random() * 900) + 100; // Número entre 100 e 999

  return `${primeiraLetra}${ultimaLetra}${anoAtual}${numeroAleatorio}`;
}
export function calcularTempoDecorrido(dataRegistro: string) {
  const agora: any = new Date();
  const data: any = new Date(dataRegistro);
  const diffMilissegundos = agora - data;

  // Conversões de tempo
  var segundos = Math.floor(diffMilissegundos / 1000);
  segundos < 0 ? segundos = segundos * -1 : segundos;
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const meses = Math.floor(dias / 30); // Aproximado
  const anos = Math.floor(meses / 12);

  if (segundos < 60) {
    return `Há ${segundos} segundos`;
  } else if (minutos < 60) {
    return `Há ${minutos} minutos`;
  } else if (horas < 24) {
    return `Há ${horas} horas e ${minutos % 60} minutos`;
  } else if (dias < 30) {
    return `Há ${dias} dias`;
  } else if (meses < 12) {
    return `Há ${meses} meses`;
  } else {
    return `Há ${anos} anos e ${meses % 12} meses`;
  }
}

export const formatMaiusMinusc = (trimestre: string) => {
  return trimestre.charAt(0).toUpperCase() + trimestre.slice(1).toLowerCase();
};

export function desformatar(value: any, isFormated: boolean = false): any {
  if (!value) return isFormated ? "0,00" : 0.00; // Retorna "0,00" ou 0.00 se o valor for nulo ou indefinido

  // Converte para string e remove espaços extras
  value = String(value).trim().replace(/\s+/g, '');

  // Se o número já estiver no formato correto (com ponto decimal)
  if (/^\d+(\.\d+)?$/.test(value)) {
    // Garante duas casas decimais
    const fixed = parseFloat(value).toFixed(2);
    return isFormated ? formatarAngolano(fixed) : parseFloat(fixed);
  }

  // Remove todos os pontos usados como separador de milhar
  value = value.replace(/\./g, '');

  // Substitui a última vírgula por um ponto decimal
  value = value.replace(/,([^,]*)$/, '.$1');

  // Converte para número e garante duas casas decimais
  const numero = parseFloat(value);
  const fixed = numero.toFixed(2);
  return isFormated ? formatarAngolano(fixed) : parseFloat(fixed);
}

// Função auxiliar para formatar o número no padrão angolano
export function formatarAngolano(numero: any): string {
  return new Intl.NumberFormat('AOA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 10, // Aumente o número de casas decimais permitidas
    useGrouping: true,
  }).format(numero);
}

export async function getBase64Image(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export function setText(doc: jsPDF, size: number, text: string = '', x: number, y: number, centered: boolean = false, color = [0, 0, 0]) {
  doc.setTextColor(color[0], color[1], color[2]);  // Define a cor do texto
  doc.setFontSize(size);    // Define o tamanho da fonte

  // Centraliza o texto horizontalmente se 'centered' for verdadeiro
  const posX = centered ? (doc.internal.pageSize.getWidth() - doc.getTextWidth(text)) / 2 : x;

  // Adiciona o texto na posição calculada
  doc.text(text, posX, y);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-AO');
}

export const formatDateExt = (dateString: string): string => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('pt-AO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date).replace(/\bde\b/g, ' de ');
};

export function setContent(
  text: string, halign: 'left' | 'center' | 'right' | 'justify', fontSize?: any, textColor?: any, minCellWidth?: number,
  cellPadding?: number, cellWidth?: number): CellDef {
  return { content: text, styles: { halign, minCellWidth, cellPadding, cellWidth, fontSize, textColor } };
}

export function blobToBase64(blob: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function setDrawer(doc: jsPDF, drawline = [0, 0, 0, 0], width = 0, color = [0, 0, 0]) {
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(width); // Define a espessura da linha
  doc.line(drawline[0], drawline[1], drawline[2], drawline[3]);
}

export function getImageUrl(urlImg: string): string {
  let url = import.meta.env.VITE_API_URL;

  return urlImg?.trim() == '' || urlImg?.trim() == 'storagenull' ? `${url}/uploads/default.png` : `${url}/${urlImg}`;
}

export async function loadImageForPDF(imagePath: string | null | undefined) {
  try {
    // Define um caminho padrão se imagePath for null, undefined ou vazio
    const defaultPath = 'uploads/logoAngola.png';
    const finalPath = imagePath?.trim() ? imagePath : defaultPath;

    // Codifica o caminho para URL
    const encodedPath = encodeURIComponent(finalPath);
    const response = await apiRequest(
      "GET",
      `${import.meta.env.VITE_API_URL}/api/imagem/base64?caminho=${encodedPath}`
    );

    return response.imagem_base64;
  } catch (error) {
    console.error('Erro ao carregar imagem:', error);
    return null;
  }
}
const conectores = ['de', 'da', 'do', 'das', 'dos', 'e'];
export function abreviarNome(nomeCompleto: string) {
  if (!nomeCompleto) return '';

  const partes = nomeCompleto.trim().split(/\s+/);
  if (partes.length <= 2) return nomeCompleto;

  const primeiro = partes[0];
  const ultimo = partes[partes.length - 1];

  const meio = partes.slice(1, -1).map(parte => {
    const lower = parte.toLowerCase();
    if (conectores.includes(lower)) {
      return parte;
    } else if (parte.length === 2 && parte[1] === '.') {
      return parte;
    } else {
      return parte[0].toUpperCase() + '.';
    }
  });

  return `${primeiro} ${meio.join(' ')} ${ultimo}`;
}

export async function createRoundImage(imageData: any) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      // Criar canvas para processamento
      const canvas = document.createElement('canvas');
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      const ctx: any = canvas.getContext('2d');

      // Criar máscara circular
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Desenhar imagem no círculo
      ctx.drawImage(img, 0, 0, img.width, img.height,
        0, 0, size, size);

      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.src = imageData;
  });
}

export const showPdfModal = (doc: any) => {
  // Gerar o PDF como blob
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Criar uma nova janela apenas para impressão
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  if (!printWindow) {
    alert('O bloqueador de pop-ups pode estar impedindo a abertura da janela de impressão. Por favor, permita pop-ups para este site.');
    return;
  }

  // Conteúdo HTML da nova janela
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pré-visualização de Impressão</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
      <style>
        body { margin: 0; font-family: Arial, sans-serif; }
        .toolbar { 
          padding: 10px; 
          background: #f0f0f0; 
          display: flex; 
          justify-content: flex-end; 
          gap: 10px;
        }
        iframe { 
          width: 100%; 
          height: calc(100vh - 50px); 
          border: none; 
        }
      </style>
    </head>
    <body>
      <iframe src="${pdfUrl}"></iframe>
    </body>
    </html>
  `);

  printWindow.document.close();

  // Limpar a URL do objeto quando a janela for fechada
  printWindow.onbeforeunload = () => {
    URL.revokeObjectURL(pdfUrl);
  };
};

export function openPdfPreview(pdfUrl: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');

  if (!printWindow) {
    alert('Por favor, permita pop-ups para abrir a pré-visualização.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pré-visualização de Impressão</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
      <style>
        body { margin: 0; font-family: Arial, sans-serif; }
        iframe { 
          width: 100%; 
          height: calc(100vh - 50px); 
          border: none; 
          display: block;
        }
      </style>
    </head>
    <body>
      <iframe src="${pdfUrl}" frameborder="0"></iframe>
    </body>
    </html>
  `);

  printWindow.document.close();

  // Limpar a URL do objeto quando a janela for fechada
  printWindow.onbeforeunload = () => {
    if (pdfUrl.startsWith('blob:')) {
      URL.revokeObjectURL(pdfUrl);
    }
  };
}
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const APIURL = `${import.meta.env.VITE_API_URL}/api/`;

// Tipos base
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: PaginationData<T>;
  message: string;
}
export interface ErrorResponse {
  success: false;
  data: PaginationData<never>;
  message: string;
  error?: any;
}

// Função auxiliar para criar resposta de erro
export function createErrorResponse(message: string, error?: any): ErrorResponse {
  return {
    success: false,
    data: {
      current_page: 1,
      data: [],
      first_page_url: '',
      from: 0,
      last_page: 1,
      last_page_url: '',
      links: [],
      next_page_url: null,
      path: '',
      per_page: 15,
      prev_page_url: null,
      to: 0,
      total: 0
    },
    message,
    error
  };
}

export function formatarDataPortugues(dt: any = new Date(), anexluanda = 'Luanda, aos '): string {
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const data = new Date(dt);
    const dia = data.getDate();
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();
    
    return `${anexluanda}${dia} de ${mes} de ${ano}.`;
}

/**
 * Compara duas strings ignorando diferenças de case e acentuação
 * @param str1 Primeira string para comparação
 * @param str2 Segunda string para comparação
 * @param locale Localidade para comparação (padrão: 'pt-BR')
 * @returns true se as strings forem equivalentes ignorando case e acentos
**/
export function compareIgnoreCase(
  str1: string | undefined | null, 
  str2: string | undefined | null,
  locale: string = 'pt-BR'
): boolean {
  // Se ambas são null/undefined, são consideradas iguais
  if (str1 == null && str2 == null) return true;
  
  // Se apenas uma é null/undefined, são diferentes
  if (str1 == null || str2 == null) return false;
  
  // Comparação ignorando case e acentos
  return str1.localeCompare(str2, locale, { 
    sensitivity: 'base',
    ignorePunctuation: true
  }) === 0;
}

const R = 6371000; // metros
const toRad = (v: number) => (v * Math.PI) / 180;

/**
 * Distância (m) entre duas coordenadas usando Haversine.
 */
export const calcularDistancia = (p1: Coordenada, p2: Coordenada): number => {
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Distância total (m) percorrendo os pontos na ordem fornecida.
 */
export const calcularDistanciaTotal = (coords: Coordenada[]): number => {
  if (!coords || coords.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += calcularDistancia(coords[i], coords[i + 1]);
  }
  return total;
};

/**
 * Opcional: retorna um array com a distância de cada segmento (p0->p1, p1->p2, ...).
 */
export const distanciasPorSegmento = (coords: Coordenada[]): number[] => {
  if (!coords || coords.length < 2) return [];
  return coords.slice(1).map((p, i) => calcularDistancia(coords[i], p));
};