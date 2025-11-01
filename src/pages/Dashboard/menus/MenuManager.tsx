import { Fragment, useEffect, useState } from "react";
import AddMenu from "./AddMenu";
import { ChevronDown, ChevronRight, Copy, Pencil, Trash2 } from "lucide-react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Body from "../../../layout/Body";
import { Modal } from "../../../components/ui/modal";
import { DefaultIcon } from "../../../hooks/DefaultIcon";
import { Menu } from "../../../services/classes/Menu";

const MenuManager = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [menup, setMenu] = useState<Menu>(new Menu());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("Adicionar Menu");
    const [expandedMenus, setExpandedMenus] = useState<number[]>([]);

    const fetchMenus = async () => {
        const result = await Menu.all();
        setMenus(result);
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const openModal = (title: string) => {
        setModalTitle(title);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setMenu(new Menu());
    };

    const handleEdit = (menu: Menu) => {
        setMenu({ ...menu } as Menu);
        openModal(`Editar: ${menu.label}`);
    };

    const handleDelete = async (menu: Menu) => {
        if (confirm(`Tem certeza que deseja excluir "${menu.label}"?`)) {
            console.log("Excluir menu:", menu);
            await Menu.delete(menu);
        }
    };

    const handleClone = async (menu: Menu) => {
        const pais = menus.filter(m => m.parent === 0 && m.id !== menu.id);
        const destino = prompt(
            `Para onde deseja clonar "${menu.label}"?\nEscolha um dos seguintes IDs:\n${pais.map(p => `${p.id} - ${p.label}`).join("\n")}`
        );
        const destinoId = parseInt(destino || "");

        if (!isNaN(destinoId)) {
            const clone = new Menu();
            clone.label = menu.label;
            clone.link = menu.link;
            clone.icone = menu.icone;
            clone.parent = destinoId;
            clone.sort = menu.sort;
        }
    };

    const isSaved = (status: boolean) => {
        if (status) fetchMenus(); closeModal();
    };
    const toggleExpand = (id: number) => {
        setExpandedMenus((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };
    const renderMenuRow = (menu: Menu, level = 0) => {
        const hasChildren = menus.some((m) => m.parent === menu.id);
        const isExpanded = expandedMenus.includes(menu.id);

        return (
            <tr key={menu.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        style={{ paddingLeft: `${level * 16}px` }}
                        onClick={() => hasChildren && toggleExpand(menu.id)}
                    >
                        {hasChildren && (
                            <span className="text-gray-400">
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </span>
                        )}
                        <DefaultIcon name={menu.icone || "LucideFan"} size={15} color="currentColor" />
                        <span>{menu.label}</span>
                    </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{menu.icone || "LucideFan"}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{menu.link || "—"}</td>
                <td className="px-4 py-2 text-sm">
                    <div className="w-full flex flex-row justify-end items-center gap-2">
                        <button
                            onClick={() => handleEdit(menu)}
                            className="text-yellow-500 hover:text-yellow-600"
                            title="Editar"
                        >
                            <Pencil size={18} />
                        </button>

                        <button
                            onClick={() => handleDelete(menu)}
                            className="text-red-500 hover:text-red-600"
                            title="Excluir"
                        >
                            <Trash2 size={18} />
                        </button>

                        <button
                            onClick={() => handleClone(menu)}
                            className="text-green-600 hover:text-green-700"
                            title="Clonar"
                        >
                            <Copy size={18} />
                        </button>
                    </div>
                </td>

            </tr>
        );
    };

    const renderSubMenusTable = (parentId: number, level = 1): any[] => {
        if (!expandedMenus.includes(parentId)) return [];

        const children = menus.filter((m) => m.parent === parentId);
        return children.flatMap((filho) => [
            renderMenuRow(filho, level),
            ...renderSubMenusTable(filho.id, level + 1),
        ]);
    };

    const menuPais = menus.filter(menu => menu.parent === 0);

    return (
        <>
            <PageMeta title="Gerir Menus" description="Listagem de Menus com Submenus em Cards" />
            <PageBreadcrumb pageTitle="Gerir Menus" />

            <Body>
                <div className="flex flex-col gap-6 p-4 w-full">
                    {/* Botões de Ação */}
                    <div className="flex flex-row justify-end gap-3">
                        <button
                            onClick={() => openModal("Adicionar Menu")}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Adicionar Menu
                        </button>
                    </div>

                    {/* Listagem de Menus */}
                    <table className="min-w-full divide-y divide-gray-200 border rounded-md overflow-hidden bg-white shadow-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Menu</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Icon</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Link</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {menuPais.map((pai) => (
                                <Fragment key={pai.id}>
                                    {renderMenuRow(pai)}
                                    {renderSubMenusTable(pai.id)}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>

                    {/* Modal */}
                    <Modal
                        key={menup.id}
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        title={modalTitle}
                        showCloseButton={true}
                        width="27%"
                        maxHeight="500px"
                    >
                        <AddMenu isSaved={isSaved} menup={menup} />
                    </Modal>
                </div>
            </Body>
        </>
    );
};

export default MenuManager;
