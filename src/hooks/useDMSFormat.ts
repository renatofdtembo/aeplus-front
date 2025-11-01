import { useState, useCallback } from 'react';

export interface Coordenadas {
  lat: number;
  lng: number;
}

// Hook para formatação DMS completo
export const useDMSFormat = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [rawValue, setRawValue] = useState('');
  const [coordenadas, setCoordenadas] = useState<Coordenadas>({ lat: 0, lng: 0 });

  // Função para converter DMS para decimal
  const dmsParaDecimal = useCallback((digitos: string): Coordenadas => {
    let lat = 0;
    let lng = 0;

    // Processa latitude (primeiros 8 dígitos)
    if (digitos.length >= 2) {
      const graus = parseInt(digitos.substring(0, 2));
      const minutos = digitos.length > 2 ? parseInt(digitos.substring(2, 4)) : 0;
      const segundos = digitos.length > 4 ? parseInt(digitos.substring(4, 6)) : 0;
      const decimos = digitos.length > 6 ? parseInt(digitos.substring(6, 8)) : 0;

      lat = graus + (minutos / 60) + (segundos / 3600) + (decimos / 360000);
      lat = -lat; // S é negativo
    }

    // Processa longitude (próximos 8 dígitos)
    if (digitos.length > 8) {
      const graus = parseInt(digitos.substring(8, 10));
      const minutos = digitos.length > 10 ? parseInt(digitos.substring(10, 12)) : 0;
      const segundos = digitos.length > 12 ? parseInt(digitos.substring(12, 14)) : 0;
      const decimos = digitos.length > 14 ? parseInt(digitos.substring(14, 16)) : 0;

      lng = graus + (minutos / 60) + (segundos / 3600) + (decimos / 360000);
    }

    return { lat, lng };
  }, []);

  // Função para formatar DMS completo
  const formatDMS = useCallback((input: string): { formatted: string; raw: string; coordenadas: Coordenadas } => {
    let digits = input.replace(/[^\d]/g, '');
    if (digits.length > 16) digits = digits.substring(0, 16);

    let formatted = '';
    let raw = digits;

    if (digits.length >= 1) {
      const latGraus = digits.substring(0, 2);
      formatted += 'S ' + latGraus + '°';
    }
    if (digits.length > 2) formatted += digits.substring(2, 4) + `'`;
    if (digits.length > 4) formatted += digits.substring(4, 6) + `,`;
    if (digits.length > 6) formatted += digits.substring(6, 8) + `"`;
    if (digits.length > 8) {
      formatted += ' / E ';
      const lonGraus = digits.substring(8, 10);
      formatted += lonGraus + '°';
    }
    if (digits.length > 10) formatted += digits.substring(10, 12) + `'`;
    if (digits.length > 12) formatted += digits.substring(12, 14) + `,`;
    if (digits.length > 14) formatted += digits.substring(14, 16) + `"`;

    const coordenadas = dmsParaDecimal(digits);

    return { formatted, raw, coordenadas };
  }, [dmsParaDecimal]);

  // Função para lidar com mudanças no input
  const handleChange = useCallback((inputValue: string) => {
    const { formatted, raw, coordenadas } = formatDMS(inputValue);
    setValue(formatted);
    setRawValue(raw);
    setCoordenadas(coordenadas);
    return raw;
  }, [formatDMS]);

  const converterParaDMS = (latitude: number, longitude: number): string => {
    const converterGraus = (decimal: number, isLatitude: boolean): string => {
      const absDecimal = Math.abs(decimal);
      const graus = Math.floor(absDecimal);
      const minutosDecimal = (absDecimal - graus) * 60;
      const minutos = Math.floor(minutosDecimal);
      const segundosDecimal = (minutosDecimal - minutos) * 60;
      const segundos = Math.floor(segundosDecimal);
      const decimos = Math.floor((segundosDecimal - segundos) * 100);

      const direcao = isLatitude ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W');
      return `${direcao} ${graus.toString().padStart(2, '0')}°${minutos.toString().padStart(2, '0')}'${segundos.toString().padStart(2, '0')},${decimos.toString().padStart(2, '0')}"`;
    };

    const latDMS = converterGraus(latitude, true);
    const lngDMS = converterGraus(longitude, false);

    return `${latDMS} / ${lngDMS}`;
  };

  // Função para definir valor a partir de coordenadas decimais
  const setFromCoordenadas = useCallback((lat: number, lng: number) => {
    const converterParaDMS = (decimal: number, isLatitude: boolean): string => {
      const absDecimal = Math.abs(decimal);
      const graus = Math.floor(absDecimal);
      const minutosDecimal = (absDecimal - graus) * 60;
      const minutos = Math.floor(minutosDecimal);
      const segundosDecimal = (minutosDecimal - minutos) * 60;
      const segundos = Math.floor(segundosDecimal);
      const decimos = Math.floor((segundosDecimal - segundos) * 100);

      const direcao = isLatitude ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W');
      return `${direcao} ${graus.toString().padStart(2, '0')}°${minutos.toString().padStart(2, '0')}'${segundos.toString().padStart(2, '0')},${decimos.toString().padStart(2, '0')}"`;
    };

    const latDMS = converterParaDMS(lat, true);
    const lngDMS = converterParaDMS(lng, false);
    const formatted = `${latDMS} / ${lngDMS}`;

    setValue(formatted);
    setCoordenadas({ lat, lng });
    const raw = formatted.replace(/[^\d]/g, '');
    setRawValue(raw);

    return raw;
  }, []);

  // ============================
  // 📌 Funções adicionais pedidas
  // ============================

  // graus para radianos
  const toRad = (value: number) => (value * Math.PI) / 180;

  // formatador
  const formatNumber = (value: number, unit: string) => {
    if (unit === 'm') {
      if (value >= 1000) return `${(value / 1000).toFixed(2)} km`;
      return `${value.toFixed(2)} m`;
    }
    if (unit === 'm²') {
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)} km²`;
      return `${value.toFixed(2)} m²`;
    }
    return `${value.toFixed(2)} ${unit}`;
  };

  const calcularDistancia = useCallback(
    (p1: Coordenadas | Coordenadas[], p2?: Coordenadas) => {
      const R = 6371000;

      // --- Caso seja array de pontos ---
      if (Array.isArray(p1)) {
        let distanciaTotal = 0;
        for (let i = 0; i < p1.length - 1; i++) {
          const dLat = toRad(p1[i + 1].lat - p1[i].lat);
          const dLng = toRad(p1[i + 1].lng - p1[i].lng);
          const lat1 = toRad(p1[i].lat);
          const lat2 = toRad(p1[i + 1].lat);

          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          distanciaTotal += R * c;
        }

        return {
          distancia: distanciaTotal,
          formatada: formatNumber(distanciaTotal, "m"),
        };
      }

      // --- Caso clássico: apenas 2 pontos ---
      if (p1 && p2) {
        const dLat = toRad(p2.lat - p1.lat);
        const dLng = toRad(p2.lng - p1.lng);
        const lat1 = toRad(p1.lat);
        const lat2 = toRad(p2.lat);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distancia = R * c;

        return {
          distancia,
          formatada: formatNumber(distancia, "m"),
        };
      }

      return { distancia: 0, formatada: "0 m" };
    },
    []
  );

  const calcularPerimetro = useCallback((pontos: Coordenadas[]) => {
    let perimetro = 0;
    for (let i = 0; i < pontos.length; i++) {
      const p1 = pontos[i];
      const p2 = pontos[(i + 1) % pontos.length];
      perimetro += calcularDistancia(p1, p2).distancia;
    }
    return { perimetro, formatada: formatNumber(perimetro, 'm') };
  }, [calcularDistancia]);

  const calcularArea = useCallback((pontos: Coordenadas[]) => {
    if (pontos.length < 3) return { area: 0, formatada: '0 m²' };
    const R = 6371000;
    let area = 0;
    for (let i = 0; i < pontos.length; i++) {
      const { lat: lat1, lng: lng1 } = pontos[i];
      const { lat: lat2, lng: lng2 } = pontos[(i + 1) % pontos.length];
      area += toRad(lng2 - lng1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
    }
    area = (area * R * R) / 2;
    area = Math.abs(area);
    return { area, formatada: formatNumber(area, 'm²') };
  }, []);

  const calcularAreaCirculo = useCallback((raio: number) => {
    const area = Math.PI * Math.pow(raio, 2);
    return { area, formatada: formatNumber(area, 'm²') };
  }, []);

  const calcularAreaRetangulo = useCallback((bounds: any) => {
    const ne = bounds.northEast;
    const sw = bounds.southWest;
    const nw = { lat: ne.lat, lng: sw.lng };
    const largura = calcularDistancia(nw, ne).distancia;
    const altura = calcularDistancia(nw, sw).distancia;
    const area = largura * altura;
    return { area, formatada: formatNumber(area, 'm²') };
  }, [calcularDistancia]);

  const calcularLargura = useCallback((bounds: any) => {
    const ne = bounds.northEast;
    const sw = bounds.southWest;
    const nw = { lat: ne.lat, lng: sw.lng };
    const largura = calcularDistancia(nw, ne).distancia;
    return { largura, formatada: formatNumber(largura, 'm') };
  }, [calcularDistancia]);

  const calcularAltura = useCallback((bounds: any) => {
    const ne = bounds.northEast;
    const sw = bounds.southWest;
    const nw = { lat: ne.lat, lng: sw.lng };
    const altura = calcularDistancia(nw, sw).distancia;
    return { altura, formatada: formatNumber(altura, 'm') };
  }, [calcularDistancia]);

  const formatarDistancia = useCallback((valor: number) => {
    return formatNumber(valor, 'm');
  }, []);

  return {
    value,
    rawValue,
    coordenadas,
    handleChange,
    setValue,
    setFromCoordenadas,

    // novas funções
    converterParaDMS,
    calcularDistancia,
    calcularPerimetro,
    calcularArea,
    calcularAreaCirculo,
    calcularAreaRetangulo,
    calcularLargura,
    calcularAltura,
    formatarDistancia,
  };
};
