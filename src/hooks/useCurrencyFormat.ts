import { useState, useCallback } from 'react';

// Tipos de formato monetário
export type CurrencyFormat = 'br' | 'us' | 'ao';

// Hook para formatação de valores monetários
export const useCurrencyFormat = (initialValue = '', format: CurrencyFormat = 'ao', showSymbol: boolean = true) => {
  const [value, setValue] = useState(initialValue);
  const [rawValue, setRawValue] = useState('');

  // Função para extrair apenas números de uma string
  const extractNumbers = useCallback((input: string): string => {
    return input.replace(/[^\d]/g, '');
  }, []);

  // Função para converter string numérica para formato monetário
  const formatCurrency = useCallback((numericString: string, currencyFormat: CurrencyFormat, showSymbol: boolean): { formatted: string; raw: string } => {
    // Converte a string numérica para número
    const number = parseFloat(numericString) / 100; // Divide por 100 para considerar centavos
    
    if (isNaN(number)) {
      return { formatted: '', raw: '' };
    }

    let formatted = '';
    const raw = number.toString();

    switch (currencyFormat) {
      case 'br': // Brasileiro
        if (showSymbol) {
          formatted = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(number);
        } else {
          formatted = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(number);
        }
        break;
      
      case 'us': // Americano
        if (showSymbol) {
          formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(number);
        } else {
          formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(number);
        }
        break;
      
      case 'ao': // Angolano
      default:
        if (showSymbol) {
          // Formata como Kz 1.234.567,89
          formatted = new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA'
          }).format(number);
        } else {
          // Formata como 1.234.567,89 (sem símbolo)
          formatted = new Intl.NumberFormat('pt-AO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(number);
        }
        break;
    }

    return { formatted, raw };
  }, []);

  // Função para lidar com mudanças no input
  const handleChange = useCallback((inputValue: string) => {
    // Extrai apenas os números do input
    const numbersOnly = extractNumbers(inputValue);
    
    // Formata o valor
    const { formatted, raw } = formatCurrency(numbersOnly, format, showSymbol);
    
    setValue(formatted);
    setRawValue(raw);
    return numbersOnly; // Retorna os números para possível uso externo
  }, [formatCurrency, format, showSymbol, extractNumbers]);

  // Função para mudar o formato
  const changeFormat = useCallback((newFormat: CurrencyFormat, newShowSymbol: boolean) => {
    const { formatted, raw } = formatCurrency(rawValue, newFormat, newShowSymbol);
    setValue(formatted);
    return raw;
  }, [formatCurrency, rawValue]);

  return {
    value,
    rawValue,
    handleChange,
    setValue,
    changeFormat
  };
};