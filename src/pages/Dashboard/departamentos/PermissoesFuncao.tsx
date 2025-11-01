import { useEffect, useState } from "react";
import { rtalert } from "../../../hooks/rtalert";
import { Funcao } from "../../../services/classes/Funcao";
import { Permissao } from "../../../services/classes/Permissao";
import { Menu } from "../../../services/classes/Menu";
import { ChevronDownSquareIcon, ChevronRightSquareIcon } from "lucide-react";

interface PermissoesFuncaoProps {
  func: Funcao;
}

interface PermissaoState {
  id: number | null;
  menu: Menu;
  funcao: Funcao;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const PermissoesFuncao: React.FC<PermissoesFuncaoProps> = ({ func }) => {
    const [menuHierarchy, setMenuHierarchy] = useState<Menu[]>([]);
    const [permissoes, setPermissoes] = useState<Record<number, PermissaoState>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());

    // Carrega dados iniciais
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Carrega todos os menus já organizados hierarquicamente
                const menusData = await Menu.allMenuOrganized();
                setMenuHierarchy(menusData);

                console.log(menusData)
                
                // Carrega as permissões existentes
                const permissoesData = await Permissao.initializeall(func.id);
                
                // Converter para formato mais fácil de usar
                const permissoesMap: Record<number, PermissaoState> = {};
                permissoesData.forEach((p: Permissao) => {
                    permissoesMap[p.menu.id] = {
                        id: p.id,
                        menu: p.menu,
                        funcao: p.funcao,
                        canView: p.canView,
                        canCreate: p.canCreate,
                        canUpdate: p.canUpdate,
                        canDelete: p.canDelete
                    };
                });
                
                setPermissoes(permissoesMap);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                rtalert.error("Erro ao carregar dados", 'top-right');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [func]);

    // Alternar expansão de menu
    const toggleMenuExpansion = (menuId: number) => {
        setExpandedMenus(prev => {
            const newSet = new Set(prev);
            if (newSet.has(menuId)) {
                newSet.delete(menuId);
            } else {
                newSet.add(menuId);
            }
            return newSet;
        });
    };

    // Encontrar menu por ID
    const findMenuById = (menusList: Menu[], id: number): Menu | null => {
        for (const menu of menusList) {
            if (menu.id === id) return menu;
            if (menu.children_recursive && menu.children_recursive.length > 0) {
                const found = findMenuById(menu.children_recursive, id);
                if (found) return found;
            }
        }
        return null;
    };

    // Encontrar todos os pais de um menu
    const findParentMenus = (menuId: number): number[] => {
        const parentIds: number[] = [];
        let currentMenu = findMenuById(menuHierarchy, menuId);
        
        while (currentMenu && currentMenu.parent) {
            const parentMenu = findMenuById(menuHierarchy, currentMenu.parent);
            if (parentMenu) {
                parentIds.push(parentMenu.id);
                currentMenu = parentMenu;
            } else {
                break;
            }
        }
        
        return parentIds;
    };

    // Atualiza uma permissão e gerencia a hierarquia
    const updatePermission = (menuId: number, field: keyof Omit<PermissaoState, 'id' | 'menu' | 'funcao'>, value: boolean) => {
        setPermissoes(prev => {
            const newPermissoes = {...prev};
            const menu = findMenuById(menuHierarchy, menuId);
            
            if (!menu) return prev;
            
            // Cria uma nova permissão se não existir
            if (!newPermissoes[menuId]) {
                newPermissoes[menuId] = {
                    id: null,
                    menu: menu,
                    funcao: func,
                    canView: false,
                    canCreate: false,
                    canUpdate: false,
                    canDelete: false
                };
            }
            
            // Atualiza o campo específico
            newPermissoes[menuId] = {
                ...newPermissoes[menuId],
                [field]: value
            };
            
            // Lógica para quando é alterada a visualização
            if (field === 'canView') {
                // Se está marcando visualização, marca todos os pais
                if (value) {
                    const parentIds = findParentMenus(menuId);
                    
                    parentIds.forEach(parentId => {
                        const parentMenu = findMenuById(menuHierarchy, parentId);
                        if (parentMenu) {
                            if (!newPermissoes[parentId]) {
                                newPermissoes[parentId] = {
                                    id: null,
                                    menu: parentMenu,
                                    funcao: func,
                                    canView: true,
                                    canCreate: false,
                                    canUpdate: false,
                                    canDelete: false
                                };
                            } else if (!newPermissoes[parentId].canView) {
                                newPermissoes[parentId] = {
                                    ...newPermissoes[parentId],
                                    canView: true
                                };
                            }
                        }
                    });
                } 
                // Se está desmarcando visualização, desmarca todos os filhos
                else {
                    const desmarcarFilhos = (menuArray: Menu[]) => {
                        menuArray.forEach(child => {
                            if (newPermissoes[child.id]?.canView) {
                                newPermissoes[child.id] = {
                                    ...newPermissoes[child.id],
                                    canView: false,
                                    canCreate: false,
                                    canUpdate: false,
                                    canDelete: false
                                };
                            }
                            
                            if (child.children_recursive && child.children_recursive.length > 0) {
                                desmarcarFilhos(child.children_recursive);
                            }
                        });
                    };
                    
                    if (menu.children_recursive && menu.children_recursive.length > 0) {
                        desmarcarFilhos(menu.children_recursive);
                    }
                }
            }
            
            // Se desmarcou visualização, desmarca todas as outras permissões
            if (field === 'canView' && !value) {
                newPermissoes[menuId] = {
                    ...newPermissoes[menuId],
                    canCreate: false,
                    canUpdate: false,
                    canDelete: false
                };
            }
            
            return newPermissoes;
        });
    };

    // Salva todas as permissões
    const savePermissions = async () => {
        try {
            setSaving(true);
            
            // Converter o objeto de volta para array
            const permissoesArray = Object.values(permissoes).filter(p => 
                p.canView || p.canCreate || p.canUpdate || p.canDelete
            );
            
            if (permissoesArray.length > 0) {
                await Permissao.save(permissoesArray);
                rtalert.success('Permissões salvas com sucesso', 'top-right');
            } else {
                rtalert.alert('Nenhuma permissão para salvar', 'top-right');
            }
        } catch (error) {
            console.error("Erro ao salvar permissões:", error);
            rtalert.error("Erro ao salvar permissões", 'top-right');
        } finally {
            setSaving(false);
        }
    };

    // Renderiza os menus de forma hierárquica com opção de expandir/recolher
    const renderMenu = (menu: Menu, level: number = 0) => {
        const hasChildren = menu.children_recursive && menu.children_recursive.length > 0;
        const isExpanded = expandedMenus.has(menu.id);
        
        return (
            <div key={menu.id} className="mb-1">
                <div 
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        level === 0 
                            ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30' 
                            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                    style={{ marginLeft: `${level * 20}px` }}
                >
                    <div className="flex items-center">
                        {hasChildren && (
                            <button
                                onClick={() => toggleMenuExpansion(menu.id)}
                                className="mr-2 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {isExpanded ? <ChevronDownSquareIcon /> : <ChevronRightSquareIcon />}
                            </button>
                        )}
                        {!hasChildren && <div className="mr-2 w-6 h-6 flex items-center justify-center"></div>}
                        
                        {menu.icone && (
                            <span className="mr-2 text-lg">
                                <i className={menu.icone}></i>
                            </span>
                        )}
                        <span className={`font-medium ${level === 0 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                            {menu.label}
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Checkbox 
                            label="Visualizar"
                            checked={permissoes[menu.id]?.canView || false}
                            onChange={(checked) => updatePermission(menu.id, 'canView', checked)}
                            color="blue"
                        />
                        
                        <Checkbox 
                            label="Criar"
                            checked={permissoes[menu.id]?.canCreate || false}
                            onChange={(checked) => updatePermission(menu.id, 'canCreate', checked)}
                            disabled={!permissoes[menu.id]?.canView}
                            color="green"
                        />
                        
                        <Checkbox 
                            label="Editar"
                            checked={permissoes[menu.id]?.canUpdate || false}
                            onChange={(checked) => updatePermission(menu.id, 'canUpdate', checked)}
                            disabled={!permissoes[menu.id]?.canView}
                            color="yellow"
                        />
                        
                        <Checkbox 
                            label="Excluir"
                            checked={permissoes[menu.id]?.canDelete || false}
                            onChange={(checked) => updatePermission(menu.id, 'canDelete', checked)}
                            disabled={!permissoes[menu.id]?.canView}
                            color="red"
                        />
                    </div>
                </div>
                
                {hasChildren && isExpanded && (
                    <div className="mt-1">
                        {menu.children_recursive.map(child => renderMenu(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-gray-600 dark:text-gray-300">Carregando menus...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 md:p-6 mb-6 dark:bg-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Gerenciar Permissões</h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Configure as permissões de acesso para a função <span className="font-semibold text-blue-600 dark:text-blue-400">{func.nome}</span>
                        </p>
                        {func.departamento && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                Departamento: {func.departamento.nome}
                            </p>
                        )}
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg w-full md:w-auto">
                        <p className="text-blue-800 dark:text-blue-300 text-sm">
                            <i className="fas fa-info-circle mr-2"></i>
                            Clique nas setas para expandir/recolher menus
                        </p>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 font-medium">
                        <span className="text-gray-700 dark:text-white">Menu</span>
                        <span className="text-gray-700 dark:text-white text-center">Visualizar</span>
                        <span className="text-gray-700 dark:text-white text-center">Criar</span>
                        <span className="text-gray-700 dark:text-white text-center">Editar</span>
                        <span className="text-gray-700 dark:text-white text-center">Excluir</span>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        {menuHierarchy.length > 0 ? (
                            menuHierarchy.map(menu => renderMenu(menu, 0))
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <i className="fas fa-folder-open text-4xl mb-3"></i>
                                <p>Nenhum menu disponível</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        Todas as alterações são salvas apenas quando você clica em "Salvar Permissões"
                    </div>
                    <button
                        onClick={savePermissions}
                        disabled={saving}
                        className="flex items-center px-6 py-3 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-md w-full md:w-auto justify-center"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2"></i>
                                Salvar Permissões
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente de checkbox auxiliar para simplificar
interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    color?: "blue" | "green" | "yellow" | "red";
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, disabled = false, color = "blue" }) => {
    const colorClasses = {
        blue: "text-blue-600 focus:ring-blue-500 border-blue-300",
        green: "text-green-600 focus:ring-green-500 border-green-300",
        yellow: "text-yellow-600 focus:ring-yellow-500 border-yellow-300",
        red: "text-red-600 focus:ring-red-500 border-red-300"
    };
    
    return (
        <label className="flex flex-col items-center space-y-1 group">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className={`h-5 w-5 rounded focus:ring-2 border-2 ${colorClasses[color]} cursor-pointer group-hover:scale-110 transition-transform`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
        </label>
    );
};

export default PermissoesFuncao;