import { useEffect, useState } from "react";
import { Edit, Eye, PlusSquare, Settings, Trash2 } from "lucide-react";
import { AssignFunctions } from "./AssignFunctions";
import AddUsuario from "./AddUsuario";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { Modal } from "../../../components/ui/modal";
import { useAuth } from "../../../services/AuthService";
import { User } from "../../../services/classes/User";
import { formatarUltimoAcesso } from "../../../services/Utilitario";
import TableDefault, { TableAction, TableColumn } from "../../../hooks/TableDefault";
import { rtalert } from "../../../hooks/rtalert";
import Body from "../../../layout/Body";
import FuncaoColumn from "./FuncaoColumn";

const UsuarioManager = () => {
    const navigate = useNavigate();
    const { findMenuByUrl, currentfuncao } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [usuario, setUsuario] = useState<User>(new User());
    const [isFunctionsModalOpen, setIsFunctionsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const columns: TableColumn[] = [
        { key: "name", label: "Nome do Usuário", sortable: true },
        { key: "email", label: "E-mail", sortable: true },
        {
            key: "status", label: "Status", render: (_: any, row: User) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.status !== 'online' ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            key: "",
            label: "Função",
            align: 'center',
            sortable: true,
            render: (_: any, row: User) => <FuncaoColumn user={row} />,
        },
        {
            key: "ultimoAcesso",
            label: "Último Acesso",
            sortable: true,
            render: (value: Date) => formatarUltimoAcesso(value),
        }
    ];

    const actions: TableAction[] = [
        {
            label: "Editar",
            icon: <Edit size={16} />,
            handleClick: (row: any) => {
                setUsuario(row);
                openModal();
            }, hidden: (row: User) => {
                return row?.pessoa.id !== 1 ? false : true 
            }
        },
        {
            label: "Visualizar",
            icon: <Eye size={16} />,
            handleClick: (row: User) => {
                navigate(`/principal/profile/${row.id}`, { replace: false });
            }, hidden: (row: User) => {
                return row?.pessoa.id !== 1 ? false : true 
            }
        }, {
            label: "Adicionar Função",
            icon: <Settings size={16} />,
            handleClick: (row: User) => {
                setUsuario(row);
                setIsFunctionsModalOpen(true);
            }, hidden: (row: User) => {
                return row?.pessoa.id !== 1 ? false : true
            }
        },
        
        {
            label: "Excluir",
            variant: "destructive",
            icon: <Trash2 size={16} color="red" />,
            handleClick: async (row: any) => {
                await User.delete(row.id).then(() => {
                    Inicializar();
                    rtalert.success("Usuário deletado com sucesso!", "top-right");
                })
            }, hidden: (row: User) => {
                return row?.pessoa.id !== 1 ? false : true 
            }
        },
    ]

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    async function Inicializar() {
        setData([])
        console.log(currentfuncao)
        try {
            const [data] = [await User.getAll()];
            
            setData(data.filter(u => u.id != 1))

            findMenuByUrl(true);
        } catch (error) {
            console.error("Error loading list user:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        Inicializar();
    }, [])

    function isSucces(status: boolean): void {
        if (status) {
            closeModal();
            Inicializar();
        }
    }
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }
    return (
        <>
            <PageMeta
                title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Gerir Usuários" />

            <Body>
                <div className="flex flex-col gap-4 p-4 w-full">
                    <div className="flex flex-row justify-end mb-4 gap-3">
                        <button onClick={() => { openModal(); setUsuario(new User()) }}
                            className="w-27 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium flex row justify-between items-center"
                        >
                            <PlusSquare /> Usuário
                        </button>
                    </div>

                    <TableDefault
                        columns={columns}
                        data={data}
                        actions={actions}
                        fixedHeader={true}
                        style="bordered"
                        pagination={true}
                        itemsPerPage={10}
                        selectable={false}
                    />

                    <Modal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        title={`Adicionar Usuário`}
                        showCloseButton={true}
                        width={"50%"}
                        maxHeight="600px"
                    >
                        <AddUsuario isSucces={isSucces} usuariop={usuario} />
                    </Modal>

                    <AssignFunctions
                        isOpen={isFunctionsModalOpen}
                        onClose={() => setIsFunctionsModalOpen(false)}
                        user={usuario}
                        onSuccess={()=> Inicializar()} // Para recarregar a lista após salvar
                    />
                </div>
            </Body>
        </>
    )
}

export default UsuarioManager;
