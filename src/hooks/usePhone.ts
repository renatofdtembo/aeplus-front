import { useState, useCallback } from 'react';

// Hook para formatação de números de telemóvel angolanos
export const usePhoneFormat = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const [rawValue, setRawValue] = useState('');

  // Função para formatar números de telemóvel
  const formatPhone = useCallback((input: string): { formatted: string; raw: string } => {
    // Remove tudo que não for número
    let digits = input.replace(/[^\d]/g, '');
    
    let formatted = '';

    // Se não tem dígitos, retorna vazio
    if (!digits.length) {
      return { formatted: '', raw: '' };
    }

    // Adiciona o código do país se não estiver presente
    if (!digits.startsWith('244')) {
      digits = '244' + digits;
    }

    // Limita a um máximo de números (considerando múltiplos números)
    // Cada número completo: 244 + 9 dígitos = 12 dígitos
    if (digits.length > 12 * 5) { // Limite de 5 números
      digits = digits.substring(0, 12 * 5);
    }

    // Formata cada número individualmente
    const numbers = [];
    for (let i = 0; i < digits.length; i += 12) {
      const numberDigits = digits.substring(i, i + 12);
      
      if (numberDigits.length >= 3) {
        let numberFormatted = '+' + numberDigits.substring(0, 3);
        
        if (numberDigits.length > 3) {
          numberFormatted += ' ' + numberDigits.substring(3, 6);
        }
        
        if (numberDigits.length > 6) {
          numberFormatted += ' ' + numberDigits.substring(6, 9);
        }
        
        if (numberDigits.length > 9) {
          numberFormatted += ' ' + numberDigits.substring(9, 12);
        }
        
        numbers.push(numberFormatted);
      }
    }

    formatted = numbers.join(' / ');
    return { formatted, raw: digits };
  }, []);

  // Função para lidar com mudanças no input
  const handleChange = useCallback((inputValue: string) => {
    const { formatted, raw } = formatPhone(inputValue);
    setValue(formatted);
    setRawValue(raw);
    return raw;
  }, [formatPhone]);

  // Função para extrair números individuais
  const extractPhoneNumbers = useCallback(() => {
    const numbers = [];
    for (let i = 0; i < rawValue.length; i += 12) {
      const number = rawValue.substring(i, i + 12);
      if (number.length >= 12) {
        numbers.push(number);
      }
    }
    return numbers;
  }, [rawValue]);

  return {
    value,
    rawValue,
    handleChange,
    setValue,
    extractPhoneNumbers
  };
};