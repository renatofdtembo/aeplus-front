import React, { useState, useEffect } from 'react';
import { User } from '../../../services/classes/User';
import { Funcionario } from '../../../services/classes/Funcionario';

interface FuncaoColumnProps {
  user: User;
}

const FuncaoColumn: React.FC<FuncaoColumnProps> = ({ user }) => {
  const [funcao, setFuncao] = useState<string>('Carregando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFuncao = async () => {
      try {
        const response = await Funcionario.findByPessoaId(user.pessoa.id);
        if (response.success && response.data.funcoes.length > 0) {
          setFuncao(response.data.funcoes[0].nome);
        } else {
          setFuncao('Não Definido');
        }
      } catch (error) {
        console.error('Erro ao carregar função:', error);
        setFuncao('Erro ao carregar');
      } finally {
        setLoading(false);
      }
    };

    loadFuncao();
  }, [user.pessoa.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
      </div>
    );
  }

  return <span className="text-gray-900 dark:text-white">{funcao}</span>;
};

export default FuncaoColumn;