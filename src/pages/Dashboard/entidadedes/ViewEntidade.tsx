import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Entidade } from "../../../services/classes/Entidade";
import { formatData } from "../../../services/Util";
import TabBar from "../../../hooks/TabBar";
import Aba1 from "./Aba1";
import Aba2 from "./Aba2";
import Aba3 from "./Aba3";
import Aba4 from "./Aba4";
import { Modal } from "../../../components/ui/modal";
import TableDefault from "../../../hooks/TableDefault";
import AvatarUpload, { containerStyle } from "../AvatarUpload";
import { saveFile, saveFileItem } from "../../../services/Utilitario";
import { Pessoa } from "../../../services/classes/Pessoa";

const ViewEntidade: React.FC = () => {
    const { id } = useParams();
    // const { currentfuncao, user } = useAuth();
    const [_data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalProcOpen, setIsModalProcOpen] = useState(false);
    const [isModalImovelOpen, setIsModalImovelOpen] = useState(false);
    const [file, setFile] = useState<File>(new File([], ''));

    async function Inicializar() {
        try {
            const data = await Entidade.find(id as string)

            if (data.status == 'sucesso') {
                console.log(data.record);
                setData(data.record);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {

        Inicializar()
    }, [id]);

    const historicoColumns = [
        {
            key: 'description',
            label: 'Descrição',
            width: '15%',
            render: (value: string, _: any) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                </div>
            )
        },
        {
            key: 'entity_code',
            label: 'Código da Entidade',
            width: '15%',
            render: (value: string) => (
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-800 dark:text-gray-200">
                    {value}
                </span>
            )
        },
        {
            key: 'created_at',
            label: 'Data Criação',
            width: '40%',
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300">{formatData(value)}</span>
                </div>
            )
        }
    ];

    const tabs = [
        {
            label: `Dados do ${_data?.entidade?.tipo_entidade?.toLocaleLowerCase() || 'entidade'}`,
            content: <Aba1 entidade={_data?.entidade} />
        },
        {
            label: `Dependentes ( ${0} )`,
            content: <Aba2 imoveis={_data?.entidade.imoveis} />
        },
        {
            label: `Documentos`,
            content: <Aba3 entidade={_data?.entidade} />
        },
        {
            label: `Histórico`,
            content: (
                <div className="p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                            <TableDefault
                                columns={historicoColumns}
                                data={_data?.historicos}
                                style="striped"
                                selectable={false}
                                pagination={true}
                                itemsPerPage={10}
                            />
                        </div>
                    </div>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>
        );
    }

    async function isSuccess(_: boolean): Promise<void> {
        setIsModalImovelOpen(false);
        setIsModalProcOpen(false);
        try {
            const data = await Entidade.find(id as string)

            if (data.status == 'sucesso') {
                setData(data.record);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="transparent bg-gray-100/50 dark:bg-gray-900 min-h-screen pt-1 pb-8 transition-colors duration-300">
            <div className="transparent max-w-8xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
                {/* Header com imagem e informações */}
                <div style={containerStyle(`${import.meta.env.VITE_IMAGE_BASE_PATH}/design-em-fundo-escuro-vetor.jpg`)} className="w-full transparent flex flex-col items-center py-3 px-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 transition-colors duration-300">
                    <div className="relative mb-4">
                        <AvatarUpload
                            initialImage={_data?.entidade?.pessoa?.urlImg}
                            backgroundImage={''}
                            label="Foto de perfil"
                            size={32}
                            onFileChange={(file: File) => setFile(file)}
                        />
                    </div>
                    <div className="bg-gray-700/60 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-white dark:text-white-800 text-center mb-2">
                            {_data.entidade.num_entidade} - {_data?.entidade?.pessoa?.nome}
                        </h2>

                        <p className="text-white font-bold dark:text-white-300 text-sm text-center mb-4">
                            {_data?.entidade?.tipo_entidade} • Registrado em{" "}
                            {new Date(_data.entidade.created_at).toLocaleDateString("pt-AO")}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-4 items-center justify-center">
                            {/* <button
                                onClick={() => setIsModalImovelOpen(true)}
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 shadow-md"
                            >
                                Associar Imóvel
                            </button> */}

                            <button
                                onClick={() => setIsModalProcOpen(true)}
                                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 shadow-md"
                            >
                                Adicionar Processo
                            </button>

                            {file && file.size > 0 && (
                                <button
                                    onClick={async () => {
                                        const uploadResponse = await saveFile(file, '/Perfil');
                                        if (uploadResponse) {
                                            await saveFileItem(uploadResponse, _data.entidade.num_entidade);
                                            await Pessoa.updatePerfil({pessoa_id: _data?.entidade?.pessoa?.id, path: uploadResponse.path});
                                            Inicializar();
                                            setFile(new File([], ''))
                                        }
                                    }}
                                    className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 shadow-md"
                                >
                                    Salvar Imagem
                                </button>
                            )}
                        </div>
                    </div>

                </div>

                {/* Área de abas */}
                <div className="mt-6 px-6 pb-6">
                    <TabBar tabs={tabs} />
                </div>
            </div>

            <Modal
                isOpen={isModalProcOpen}
                onClose={() => setIsModalProcOpen(false)}
                title={`Adicionar Processo para ${_data?.entidade?.pessoa.nome}`}
                showCloseButton={true}
                width={"75%"}
                maxHeight="700px"
            >
                <div />
            </Modal>

            <Modal
                isOpen={isModalImovelOpen}
                onClose={() => setIsModalImovelOpen(false)}
                title={`Adicionar Imóvel`}
                showCloseButton={true}
                width={"60%"}
                maxHeight="700px"
            >
                <div />
            </Modal>
        </div>
    );
};

export default ViewEntidade;