import { useEffect } from "react";
import { Entidade } from "../../../services/classes/Entidade";

interface Aba1Props {
    entidade: Entidade
}

const Aba1: React.FC<Aba1Props> = ({ entidade }) => {

    useEffect(() => {
        async function Inicializar() {
            try {
                console.log(entidade)
            } catch (error) {
                console.error("Error loading profile:", error);
            }
        }

        Inicializar();
    }, []);

    return (
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-300">
            {/* Data do Registro */}
            <div className="mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                        Data do Registro:
                    </label>
                    <span className="text-gray-900 dark:text-white font-medium">
                        {new Date(entidade.created_at).toLocaleDateString('pt-AO')}
                    </span>
                </div>
            </div>

            {/* Informações Pessoais */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">{entidade.pessoa?.nome}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">{entidade.pessoa?.email}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contacto</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">{entidade.pessoa?.contacto}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">NIF</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">{entidade.pessoa?.nif || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Dados específicos para PARTICULAR */}
                    {entidade.tipo_entidade === 'PARTICULAR' && (
                        <>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">BI</label>
                                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <span className="text-gray-900 dark:text-white">{entidade.pessoa?.bi || 'N/A'}</span>
                                </div>
                            </div>
                            
                            {entidade.pessoa?.validade && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Validade</label>
                                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                        <span className="text-gray-900 dark:text-white">
                                            {entidade.pessoa.validade.emissao} a {entidade.pessoa.validade.expiracao}
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Género</label>
                                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <span className="text-gray-900 dark:text-white">
                                        {entidade.pessoa?.genero === 'M' ? 'Masculino' :
                                         entidade.pessoa?.genero === 'F' ? 'Feminino' : 'Outro'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado Civil</label>
                                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <span className="text-gray-900 dark:text-white">
                                        {entidade.pessoa?.estadocivil ?
                                            entidade.pessoa.estadocivil.charAt(0) +
                                            entidade.pessoa.estadocivil.slice(1).toLowerCase()
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nascimento</label>
                                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <span className="text-gray-900 dark:text-white">
                                        {entidade.pessoa?.nascimento ?
                                            new Date(entidade.pessoa.nascimento).toLocaleDateString('pt-AO')
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                    {/* Dados específicos para diferente de PARTICULAR */}
                    {entidade.tipo_entidade !== 'PARTICULAR' && (
                        <>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Gestor</label>
                                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <span className="text-gray-900 dark:text-white">{entidade.gestor || 'N/A'}</span>
                                </div>
                            </div>
                            
                            {entidade.pessoa?.validade && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Função do Gestor</label>
                                    <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                        <span className="text-gray-900 dark:text-white">
                                            {entidade.pessoa.validade.emissao} a {entidade.cargo}
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contacto do Gestor</label>
                                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <span className="text-gray-900 dark:text-white">
                                        {entidade.telefone}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
                                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <span className="text-gray-900 dark:text-white">
                                        {entidade.email_gestor}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nascimento</label>
                                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <span className="text-gray-900 dark:text-white">
                                        {entidade.pessoa?.nascimento ?
                                            new Date(entidade.pessoa.nascimento).toLocaleDateString('pt-AO')
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Naturalidade - Só para PARTICULAR */}
            {entidade.tipo_entidade === 'PARTICULAR' && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                        Naturalidade | Nacionalidade <span className="text-blue-600 dark:text-blue-400 ml-2">{entidade.pessoa?.nacionalidade}</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                        {entidade.pessoa?.nacionalidade !== 'Angolana' && (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nº Cartão Residência</label>
                                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                    <span className="text-red-600 dark:text-red-400 font-medium">{entidade.pessoa?.cartao_residencia}</span>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Município</label>
                            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                <span className="text-gray-900 dark:text-white">{entidade.pessoa?.naturalidade?.nome}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Província</label>
                            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                <span className="text-gray-900 dark:text-white">{entidade.pessoa?.naturalidade?.provincia?.nome}</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">País</label>
                            <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                                <span className="text-gray-900 dark:text-white">{entidade.pessoa?.naturalidade?.provincia?.pais?.nome}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Endereço */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Endereço
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rua</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">{entidade.pessoa?.endereco?.rua?.nome}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">{entidade.pessoa?.endereco?.numero}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complemento</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">{entidade.pessoa?.endereco?.complemento || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bairro</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">{entidade.pessoa?.endereco?.rua?.bairro?.nome}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Município</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">
                                {entidade.pessoa?.endereco?.rua?.bairro?.comuna?.municipio?.nome}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Província</label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors">
                            <span className="text-gray-900 dark:text-white">
                                {entidade.pessoa?.endereco?.rua?.bairro?.comuna?.municipio?.provincia?.nome}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Aba1;