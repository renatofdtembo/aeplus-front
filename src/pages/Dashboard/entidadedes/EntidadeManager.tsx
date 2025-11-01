import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building, Mail, Phone, Search, X, Eye } from 'lucide-react';
import { apiRequest } from '../../../services/httpAxios';
import { TableAction, TableColumn } from '../../../hooks/TableDefault';
import { Entidade, EntidadeShow } from '../../../services/classes/Entidade';
import { Modal } from '../../../components/ui/modal';
import AddEntidade from './AddEntidade';
import { useNavigate } from 'react-router';
import TableDefaultApi from '../../../hooks/TableDefaultApi';
import { rtalert } from '../../../hooks/rtalert';
import LoadingData from '../../../hooks/LoadingData';

const EntidadeManager: React.FC = () => {
    // const { user, currentfuncao } = useAuth();
    const navigator = useNavigate();
    const [entidades, setEntidades] = useState<EntidadeShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Entidade>(new Entidade());
    const [filters, setFilters] = useState({
        tipo_entidade: '',
        estado: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 10
    });

    const estadoOptions = [
        { label: 'Todos os estados', value: '' },
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Inactivo', value: 'INACTIVO' }
    ];

    // Carregar entidades com filtros
    const loadEntidades = async (page = 1) => {
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

            Entidade.all(params.toString()).then((response) => {
                if (response.success) {
                    setEntidades(response.data.data);
                    setPagination({
                        current_page: response.data.current_page,
                        total: response.data.total,
                        per_page: response.data.per_page
                    });
                } else {
                    console.log(response.message);
                }
                setLoading(false);
            });
        } catch (err) {
            console.log('Erro ao carregar entidades');
        }
    };

    useEffect(() => {
        loadEntidades();
    }, [filters.tipo_entidade, filters.estado]);

    // Aplicar filtro com debounce para pesquisa
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.search !== '') {
                loadEntidades(1);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [filters.search]);

    // Limpar filtros
    const clearFilters = () => {
        setFilters({
            tipo_entidade: '',
            estado: '',
            search: ''
        });
    };

    // Verificar se há filtros ativos
    const hasActiveFilters = filters.tipo_entidade || filters.estado || filters.search;

    // Editar entidade
    const handleEdit = (entidade: Entidade) => {
        setFormData(entidade);
        setIsModalOpen(true);
    };

    // Excluir entidade
    const handleDelete = async (id: number) => {
        rtalert.question(
            "Tem certeza que desejas excluir esta entidade?",
            {
                confirmText: "Sim",
                cancelText: "Cancelar",
                onConfirm: async () => {
                    const response = await apiRequest('DELETE', `/api/entidades/${id}`);
                    if (response.success) {
                        loadEntidades(pagination.current_page);
                    } else {
                        console.log(response.message);
                    }
                },
                onCancel: () => rtalert.alert("A acção foi cancelada")
            }
        );
    };

    // Colunas da tabela
    const columns: TableColumn[] = [
        {
            key: 'numero_entidade',
            label: 'Nº Entidade',
            width: '10%',
            render: (_: string, row: Entidade) => (
                <span className="font-mono text-sm text-gray-600">
                    {row.num_entidade}
                </span>
            )
        },
        {
            key: 'pessoa.nome',
            label: 'Nome',
            width: '23%',
            render: (_: string, row: EntidadeShow) => (
                <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-gray-400">{row.nome}</span>
                </div>
            )
        },
        {
            key: 'pessoa.email',
            label: 'Email',
            width: '18%',
            render: (_: string, row: EntidadeShow) => (
                <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{row.email}</span>
                </div>
            )
        },
        {
            key: '_',
            label: 'Contacto',
            width: '12%',
            render: (_: string, row: EntidadeShow) => (
                <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{row.contacto}</span>
                </div>
            )
        },
        {
            key: 'dependentes',
            label: 'Dependentes',
            width: '12%',
            align: 'center'
        },
        {
            key: 'estado',
            label: 'Estado',
            width: '10%',
            render: (value: string) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 ${value === 'ACTIVO' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {value}
                </span>
            )
        }
    ];

    // Ações da tabela
    const actions: TableAction[] = [
        {
            label: 'Ver Entidade',
            icon: <Eye size={16} />,
            handleClick: (row: Entidade) => {
                navigator(`/vendas/clientes/view/${row.num_entidade}`, { replace: false })
            },
            variant: 'default' as const,
        }, {
            label: 'Editar Entidade',
            icon: <Edit size={16} />,
            handleClick: handleEdit,
            variant: 'default' as const,
        },
        {
            label: 'Excluir Entidade',
            icon: <Trash2 size={16} />,
            handleClick: (row: Entidade) => handleDelete(row.id!),
            variant: 'destructive' as const,
            hidden(_: Entidade) {
                return false;
                // return (currentfuncao?.nome == "Diretor Administrativo" || currentfuncao?.nome == "Diretor Adjunto Administrativo" || currentfuncao?.nome == "Diretor Técnico") ? false : true;
            },
        }
    ];

    function isSuccess(status: boolean): void {
        if (status) {
            setIsModalOpen(false);
            setFormData(new Entidade());
            loadEntidades(pagination.current_page);
        }
    }


    if (loading && entidades.length === 0) {
        return <LoadingData />;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800/50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-300">Gestão de Entidades</h1>
                    <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">
                        {pagination.total} entidades registadas
                    </p>
                </div>

                {/* Dropdown para Nova Entidade */}
                <div className="relative">
                    <button
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center shadow-md transition-colors dark:text-gray-300"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Nova Entidade
                    </button>
                </div>
            </div>

            {/* Filtros profissionais */}
            <div className="mb-6 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Campo de pesquisa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                            Pesquisar
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Nome, NIF, BI, Nº Entidade..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-300 dark:border-gray-700"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                            Estado
                        </label>
                        <select
                            value={filters.estado}
                            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-300 dark:border-gray-700"
                        >
                            {estadoOptions.map((option) => (
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
                            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:text-gray-300 dark:border-gray-700"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>

                {/* Contador de resultados filtrados */}
                {hasActiveFilters && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-gray-600/50 dark:border-gray-700">
                        <div className="flex items-center text-blue-800">
                            <Search className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium dark:text-gray-300 dark:text-gray-300">
                                {pagination.total} resultado(s) encontrado(s) com os filtros aplicados
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabela de entidades */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <TableDefaultApi
                    columns={columns}
                    data={entidades}
                    actions={actions}
                    style="striped"
                    pagination={true}
                    itemsPerPage={pagination.per_page}
                    totalItems={pagination.total}
                    currentPage={pagination.current_page}
                    onPageChange={loadEntidades}
                    selectable={false}
                    loading={loading}
                    emptyState={
                        <>
                            {
                                (loading && entidades.length === 0) &&
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            }
                            {
                                (loading || entidades.length === 0) &&
                                <div className="flex justify-center items-center h-64">
                                    Nenhuma entidade encontrada
                                </div>
                            }
                        </>
                    }
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}
                title={`${formData.id ? "Editar" : "Adicionar"} Cliente`}
                showCloseButton={true}
                width={"50%"}
                maxHeight="700px"
            >
                <AddEntidade
                    isSuccess={isSuccess}
                    entidadeP={formData}
                />
            </Modal>

        </div>
    );
};

export default EntidadeManager;