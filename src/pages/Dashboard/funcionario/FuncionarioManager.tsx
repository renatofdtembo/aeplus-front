import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, User, Mail, Phone, Search, X } from 'lucide-react';
import { apiRequest } from '../../../services/httpAxios';
import TableDefault, { TableAction } from '../../../hooks/TableDefault';
import { Funcionario } from '../../../services/classes/Funcionario';
import { Modal } from '../../../components/ui/modal';
import AddFuncionario from './AddFuncionario';

const FuncionarioManager: React.FC = () => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Funcionario>(new Funcionario());
    const [filters, setFilters] = useState({
        estado: '',
        tipo_contrato: '',
        activo: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 15
    });

    // Opções dos filtros
    const estadoOptions = [
        { label: 'Todos os estados', value: '' },
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Ausente', value: 'AUSENTE' },
        { label: 'Férias', value: 'FERIAS' },
        { label: 'Inactivo', value: 'INACTIVO' }
    ];

    const contratoOptions = [
        { label: 'Todos os contratos', value: '' },
        { label: 'Efetivo', value: 'EFETIVO' },
        { label: 'Temporário', value: 'TEMPORARIO' },
        { label: 'Estágio', value: 'ESTAGIO' },
        { label: 'Prestação Serviço', value: 'PRESTACAO_SERVICO' }
    ];

    const activoOptions = [
        { label: 'Todos', value: '' },
        { label: 'Activo', value: 'true' },
        { label: 'Inactivo', value: 'false' }
    ];

    // Carregar funcionários com filtros
    const loadFuncionarios = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: pagination.per_page.toString(),
                ...filters
            });

            // Remove parâmetros vazios
            Array.from(params.entries()).forEach(([key, value]) => {
                if (!value) params.delete(key);
            });

            const response = await apiRequest('GET', `/api/funcionarios?${params}`);
            
            if (response.success) {
                setFuncionarios(response.data.data);
                setPagination({
                    current_page: response.data.current_page,
                    total: response.data.total,
                    per_page: response.data.per_page
                });
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Erro ao carregar funcionários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFuncionarios();
    }, [filters.estado, filters.tipo_contrato, filters.activo]);

    // Aplicar filtro com debounce para pesquisa
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.search !== '') {
                loadFuncionarios(1);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [filters.search]);

    // Limpar filtros
    const clearFilters = () => {
        setFilters({
            estado: '',
            tipo_contrato: '',
            activo: '',
            search: ''
        });
    };

    // Verificar se há filtros ativos
    const hasActiveFilters = filters.estado || filters.tipo_contrato || filters.activo || filters.search;

    // Editar funcionário
    const handleEdit = (funcionario: Funcionario) => {
        setFormData(funcionario);
        setIsModalOpen(true);
    };

    // Excluir funcionário
    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir este funcionário?')) {
            try {
                const response = await apiRequest('DELETE', `/api/funcionarios/${id}`);
                if (response.success) {
                    loadFuncionarios(pagination.current_page);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError('Erro ao excluir funcionário');
            }
        }
    };

    function handleView(_: Funcionario): void {
        // Implementar visualização de detalhes se necessário
    }

    // Colunas da tabela
    const columns = [
        {
            key: 'num_funcionario',
            label: 'Matrícula',
            width: '12%',
            render: (_: string, row: Funcionario) => (
                <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
                    {row.num_funcionario}
                </span>
            )
        },
        {
            key: 'pessoa.nome',
            label: 'Nome',
            width: '23%',
            render: (_: string, row: Funcionario) => (
                <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-gray-300">{row.pessoa.nome}</span>
                </div>
            )
        },
        {
            key: 'pessoa.email',
            label: 'Email',
            width: '18%',
            render: (_: string, row: Funcionario) => (
                <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{row.pessoa.email}</span>
                </div>
            )
        },
        {
            key: 'pessoa.contacto',
            label: 'Contacto',
            width: '12%',
            render: (_: string, row: Funcionario) => (
                <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{row.pessoa.contacto}</span>
                </div>
            )
        },
        {
            key: 'tipo_contrato',
            label: 'Contrato',
            width: '15%',
            render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 ${
                    value === 'EFETIVO' ? 'bg-green-100 text-green-800 border-green-200' :
                    value === 'TEMPORARIO' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    value === 'ESTAGIO' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                    {value}
                </span>
            )
        },
        {
            key: 'estado',
            label: 'Estado',
            width: '12%',
            render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 ${
                    value === 'ACTIVO' ? 'bg-green-100 text-green-800 border-green-200' :
                    value === 'AUSENTE' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    value === 'FERIAS' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-red-100 text-red-800 border-red-200'
                }`}>
                    {value}
                </span>
            )
        }
    ];

    // Ações da tabela
    const actions: TableAction[] = [
        {
            label: 'Visualizar',
            icon: <Eye size={16} />,
            handleClick: handleView,
            variant: 'default' as const,
            hidden: (row: Funcionario) => row.pessoa.id == 1
        }, 
        {
            label: 'Editar',
            icon: <Edit size={16} />,
            handleClick: handleEdit,
            variant: 'default' as const,
            hidden: (row: Funcionario) => row.pessoa.id == 1
        },
        {
            label: 'Excluir',
            icon: <Trash2 size={16} />,
            handleClick: (row: Funcionario) => handleDelete(row.id),
            variant: 'destructive' as const,
            hidden: (row: Funcionario) => row.pessoa.id == 1
        }
    ];

    if (loading && funcionarios.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    function isSuccess(status: boolean): void {
        if (status){
            setIsModalOpen(false);
            setFormData(new Funcionario());
            loadFuncionarios(pagination.current_page);
        }
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md  dark:bg-gray-800/50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestão de Funcionários</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {pagination.total} funcionários registados
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center shadow-md transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Novo Funcionário
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-800">
                        <X className="h-5 w-5 mr-2" />
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            )}

            {/* Filtros profissionais */}
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200  dark:bg-gray-800/50 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Campo de pesquisa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400 dark:border-gray-700">
                            Pesquisar
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Nome, email, contacto, matrícula..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-400 dark:border-gray-700"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => setFilters({ ...filters, search: '' })}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filtro por Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400 dark:border-gray-700">
                            Estado
                        </label>
                        <select
                            value={filters.estado}
                            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-400 dark:border-gray-700"
                        >
                            {estadoOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Tipo de Contrato */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400 dark:border-gray-700">
                            Tipo de Contrato
                        </label>
                        <select
                            value={filters.tipo_contrato}
                            onChange={(e) => setFilters({ ...filters, tipo_contrato: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-400 dark:border-gray-700"
                        >
                            {contratoOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Activo/Inactivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-400 dark:border-gray-700">
                            Situação
                        </label>
                        <select
                            value={filters.activo}
                            onChange={(e) => setFilters({ ...filters, activo: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-400 dark:border-gray-700"
                        >
                            {activoOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botão Limpar Filtros */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            disabled={!hasActiveFilters}
                            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:text-gray-400 dark:border-gray-700"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>

                {/* Contador de resultados filtrados */}
                {hasActiveFilters && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center text-blue-800">
                            <Search className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">
                                {pagination.total} resultado(s) encontrado(s) com os filtros aplicados
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabela de funcionários */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <TableDefault
                    columns={columns}
                    data={funcionarios}
                    actions={actions}
                    style="striped"
                    pagination={true}
                    itemsPerPage={pagination.per_page}
                    totalItems={pagination.total}
                    currentPage={pagination.current_page}
                    onPageChange={loadFuncionarios}
                    selectable={false}
                    loading={loading}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${formData.id ? "Editar" : "Adicionar"} Funcionário`}
                showCloseButton={true}
                width={"55%"}
                maxHeight="600px"
            >
                <AddFuncionario isSuccess={isSuccess} funcionarioP={formData} />
            </Modal>
        </div>
    );
};

export default FuncionarioManager;