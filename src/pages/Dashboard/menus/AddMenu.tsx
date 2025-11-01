import { useEffect, useState } from "react";
import * as lucideIcons from "lucide-react";
import { DefaultInput } from "../../../hooks/DefaultInput";
import { Option } from "../../../services/Utilitario";
import { DefaultIcon } from "../../../hooks/DefaultIcon";
import { Menu } from "../../../services/classes/Menu";

// Obtenha os ícones do Lucide
const iconOptions = Object.keys(lucideIcons)
    .filter(key => key[0] === key[0].toUpperCase())
    .map(iconName => ({
        value: iconName,
        label: iconName,
    }));

interface MenuProps {
    isSaved: (status: boolean) => void;
    menup: Menu
}

const AddMenu: React.FC<MenuProps> = ({ isSaved, menup }) => {
    const [menu, setMenu] = useState<Menu>(menup);
    const [isSubmenu, setIsSubmenu] = useState(false);
    const [menusPais, setMenusPais] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMenu(menup);
    }, [menup]);

    useEffect(() => {
        const fetchMenus = async () => {
            const allMenus = await Menu.all();
            const pais = allMenus;
            setMenusPais(pais);
        };
        fetchMenus();
    }, []);

    const submit = async () => {
        console.log(menu);
        setLoading(true);
        try {
            if (menu.label.trim() === "") return;
            if (menu.link.trim() === "") return;
            if (menu.icone.trim() === "") return;

            await Menu.save(menu);
            isSaved(true);
        } catch (error) {
            setLoading(false);
            console.error("Erro ao salvar menu:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <span className="text-gray-500 flex flex-row gap-10">Pré visualização: <DefaultIcon name={menu.icone} size={30} color="currentColor" /></span>
            <DefaultInput
                label="Digite o nome do menu"
                inputType="text-only"
                float
                name="link"
                top="3"
                placeholder="Digite o nome do menu"
                inputvalue={menu.label}
                onValueChange={(val) => setMenu((prev: Menu) => ({ ...prev, label: val }) as Menu)}
            />

            <DefaultInput
                label="Link do Menu"
                inputType="default"
                float
                name="link"
                top="3"
                placeholder="Digite o link (caso aplicável)"
                inputvalue={menu.link}
                onValueChange={(val) => setMenu((prev: Menu) => ({ ...prev, link: val }) as Menu)}
            />

            {/* Input de ícone modificado */}
            <DefaultInput
                label="Ícone"
                inputType="default"
                float
                name="icon"
                top="3"
                placeholder="Selecione um ícone"
                readOnly={true}
                options={iconOptions.map(icon => new Option(icon.label, icon.value, icon))}
                inputvalue={menu.icone}
                selectedChange={(val) => setMenu((prev: Menu) => ({ ...prev, icone: val }) as Menu)}
            />

            {isSubmenu && (
                <DefaultInput
                    label="Menu Pai"
                    float
                    name="parent"
                    top="3"
                    placeholder="Selecione o menu pai"
                    inputType="default"
                    readOnly={true}
                    options={menusPais.map(m => new Option(m.label, m.id, m))}
                    inputvalue={menusPais.find(m => m.id === menu.parent)?.id}
                    selectedChange={(value) => {
                        setMenu((prev: any) => ({ ...prev, parent: parseInt(value) }));
                    }}
                />
            )}

            <div className="flex items-center gap-3 mt-4">
                <label className="text-gray-700 font-medium">Este é um submenu?</label>
                <input
                    type="checkbox"
                    checked={isSubmenu}
                    onChange={() => {
                        setIsSubmenu(prev => !prev);
                        if (!isSubmenu) setMenu((prev: any) => ({ ...prev, parent: 0 }));
                    }}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
            </div>

            <button
                onClick={submit}
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded transition ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
                    }`}
            >
                {loading && (
                    <svg
                        className="w-5 h-5 animate-spin text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                )}
                Salvar
            </button>
        </div>
    );
};

export default AddMenu;