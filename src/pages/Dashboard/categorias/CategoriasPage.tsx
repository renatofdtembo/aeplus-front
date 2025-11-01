import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Edit,
    Trash2,
    Folder,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    Search,
    Layers
} from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import { Categoria } from "../../../services/classes/Categoria";

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriasFlat, setCategoriasFlat] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [modalAberto, setModalAberto] = useState(false);
    const [editandoCategoria, setEditandoCategoria] = useState<Categoria>(new Categoria());
    const [formData, setFormData] = useState<Categoria>(new Categoria());

    // Carregar categorias
    const carregarCategorias = async () => {
        try {
            setLoading(true);
            // Simulação de API - substituir pela sua chamada real
            const response = await Categoria.allCategorias();
            console.log(response.data.data)
            setCategoriasFlat(response.data.data);

            setCategorias(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarCategorias();
    }, []);

    // Toggle expandir/colapsar
    const toggleExpandir = (id: number) => {
        const novosExpandidos = new Set(expandedItems);
        if (novosExpandidos.has(id)) {
            novosExpandidos.delete(id);
        } else {
            novosExpandidos.add(id);
        }
        setExpandedItems(novosExpandidos);
    };

    // Filtrar categorias
    const categoriasFiltradas = categoriasFlat.filter(cat =>
        cat.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Abrir modal para nova categoria
    const abrirModalNovaCategoria = (pai: Categoria | null) => {
        if (pai) {
            editandoCategoria.pai = pai.id
            formData.pai = pai.id
            setEditandoCategoria(editandoCategoria);
            setFormData(formData);
            setModalAberto(true);
        }
    };

    // Abrir modal para editar categoria
    const abrirModalEditarCategoria = (pai: Categoria | null) => {
        if (pai) {
            setEditandoCategoria(pai);
            setFormData(new Categoria());
            setModalAberto(true);
        }
    };

    // Salvar categoria
    const salvarCategoria = async () => {
        try {
            if (formData) {
                // Editar categoria existente
                const res = await Categoria.save(formData);
                console.log(res)
            } else {
                // Nova categoria
                const res = await Categoria.save(formData);
                console.log(res)
            }

            setModalAberto(false);
            carregarCategorias(); // Recarregar a lista
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
        }
    };

    // Excluir categoria
    const excluirCategoria = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

        try {
            await fetch(`/api/categorias/${id}`, { method: 'DELETE' });
            carregarCategorias(); // Recarregar a lista
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
        }
    };

    // Renderizar árvore de categorias
    const renderizarArvore = (categorias: Categoria[], nivel = 0) => {
        return categorias.map(categoria => (
            <div key={categoria.id}>
                {/* Item da categoria */}
                <div
                    className={`flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 ${nivel > 0 ? 'ml-' + (nivel * 4) : ''
                        }`}
                    style={{ marginLeft: `${nivel * 1.5}rem` }}
                >
                    <div className="flex items-center space-x-3 flex-1">
                        {categoria.subcategorias_recursivas && categoria.subcategorias_recursivas.length > 0 ? (
                            <button
                                onClick={() => toggleExpandir(categoria.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                {expandedItems.has(categoria.id) ? (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                        ) : (
                            <div className="w-6"></div>
                        )}

                        {expandedItems.has(categoria.id) ? (
                            <FolderOpen className="w-5 h-5 text-blue-500" />
                        ) : (
                            <Folder className="w-5 h-5 text-gray-400" />
                        )}

                        <div className="flex-1">
                            <span className="font-medium text-gray-900">{categoria.nome}</span>
                            {categoria.pai && (
                                <span className="text-sm text-gray-500 ml-2">
                                    (Subcategoria)
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                            {new Date(categoria.data_criacao).toLocaleDateString('pt-BR')}
                        </span>

                        <button
                            onClick={() => abrirModalNovaCategoria(categoria)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Adicionar subcategoria"
                        >
                            <Plus className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => abrirModalEditarCategoria(categoria)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar categoria"
                        >
                            <Edit className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => excluirCategoria(categoria.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Excluir categoria"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Children recursivos */}
                {expandedItems.has(categoria.id) && categoria.subcategorias_recursivas && (
                    <div>
                        {renderizarArvore(categoria.subcategorias_recursivas, nivel + 1)}
                    </div>
                )}
            </div>
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                        <Layers className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gerir Categorias</h1>
                            <p className="text-gray-600">Organize as categorias de cursos em hierarquia</p>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <Link
                            to="/configuracoes"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Voltar
                        </Link>
                        <button
                            onClick={() => abrirModalNovaCategoria(null)}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Nova Categoria</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar categorias..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Lista de Categorias */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header da tabela */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Lista de Categorias
                            </h2>
                            <span className="text-sm text-gray-600">
                                {categoriasFlat.length} categorias no total
                            </span>
                        </div>
                    </div>

                    {/* Lista hierárquica */}
                    {searchTerm ? (
                        // Vista plana para busca
                        <div>
                            {categoriasFiltradas.map(categoria => (
                                <div key={categoria.id} className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        <Folder className="w-5 h-5 text-gray-400" />
                                        <span className="font-medium text-gray-900">{categoria.nome}</span>
                                        {categoria.pai && (
                                            <span className="text-sm text-gray-500">(Subcategoria)</span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => abrirModalEditarCategoria(categoria)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => excluirCategoria(categoria.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {categoriasFiltradas.length === 0 && (
                                <div className="text-center py-12">
                                    <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Nenhuma categoria encontrada</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Vista hierárquica normal
                        <div>
                            {categorias.length > 0 ? (
                                renderizarArvore(categorias)
                            ) : (
                                <div className="text-center py-12">
                                    <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">Nenhuma categoria cadastrada</p>
                                    <button
                                        onClick={() => abrirModalNovaCategoria(null)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Criar Primeira Categoria
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                title="Abertura de Caixa"
                width='40%'
            >
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Categoria
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Digite o nome da categoria"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoria Pai (Opcional)
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.pai}
                            onChange={(e) => setFormData({ ...formData, pai: e.target.value })}
                        >
                            <option value="">Nenhuma (Categoria Raiz)</option>
                            {categoriasFlat
                                .filter(cat => !editandoCategoria || cat.id !== editandoCategoria.id)
                                .map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nome}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        onClick={() => setModalAberto(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={salvarCategoria}
                        disabled={!formData.nome.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {editandoCategoria ? 'Atualizar' : 'Criar'}
                    </button>
                </div>
            </Modal>
        </div>
    );
}