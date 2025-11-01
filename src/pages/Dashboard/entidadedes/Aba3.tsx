import { useEffect, useState } from "react";
import { Entidade } from "../../../services/classes/Entidade";
import TableDefault, { TableAction, TableColumn } from "../../../hooks/TableDefault";
import { FileItem } from "../../../services/classes/FileItem";
import { Modal } from "../../../components/ui/modal";
import { rtalert } from "../../../hooks/rtalert";
import { saveFile, saveFileItem } from "../../../services/Utilitario";
import { Eye } from "lucide-react";
import { FileUpload } from "../../../hooks/FileUpload";

interface Aba1Props {
    entidade: Entidade;
}

const Aba3: React.FC<Aba1Props> = ({ entidade }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(true);
    const [files, setFiles] = useState<File[]>([]);
    const [arquivos, setArquivos] = useState<FileItem[]>([]);

    const [showModalFile, setShowModalFile] = useState<boolean>(false)
    const [url_file, setUrlFile] = useState<string>('');

    useEffect(() => {
        init();
    }, [entidade.id]);

            async function init() {
            try {
                const response = await Entidade.files(entidade.num_entidade);
                if (response.success && response.data) {
                    setArquivos(response.data);
                }
            } catch (error) {
                console.error("Erro ao carregar arquivos:", error);
                rtalert.error("Erro ao carregar documentos");
            } finally {
                setUploading(false)
            }
        }

    // Colunas para a tabela de documentos - ajustadas para a estrutura FileItem
    const documentosColumns: TableColumn[] = [
        {
            key: 'name',
            label: 'Nome do Arquivo',
            width: '50%'
        },
        {
            key: 'size',
            label: 'Tamanho',
            width: '10%',
            align: 'right',
        },
        {
            key: 'createdAt',
            label: 'Data de Upload',
            width: '30%',
            render: (_: FileItem) => (
                <span>{new Date().toLocaleDateString('pt-AO')}</span>
            )
        }
    ];

    const actions: TableAction[] = [
        {
            label: "Visualizar Imóvel",
            icon: <Eye size={16} />,
            handleClick: (row: FileItem) => {
                setUrlFile(row.path);
                setShowModalFile(true)
            },
            hidden: (_: any) => false
        },
        // {
        //     label: "Remover Associação",
        //     icon: <Trash2 size={16} />,
        //     handleClick: async (_: any) => {
        //         if (window.confirm("Tem certeza que deseja remover esta associação?")) {
        //             try {
        //                 // await ImovelEntidade.delete(row.id);
        //                 // // Atualizar lista após exclusão
        //                 // setImoveisEntidades(prev => prev.filter(item => item.id !== row.id));
        //             } catch (error) {
        //                 console.error("Erro ao remover associação:", error);
        //                 alert("Erro ao remover associação");
        //             }
        //         }
        //     },
        //     hidden: (_: any) => false
        // }
    ];

    const handleUpload = async () => {
        if (files.length === 0 || !entidade.id) {
            rtalert.warning("Por favor, selecione pelo menos um arquivo");
            return;
        }

        setUploading(true);

        try {
            for (const file of files) {

                const uploadResponse = await saveFile(file, `/Processos`);

                if (uploadResponse) {
                    await saveFileItem(uploadResponse, entidade.num_entidade);
                }
            }
            const response = await Entidade.files(entidade.id);
            if (response.success && response.data) {
                setArquivos(response.data);
            }
            // Limpar formulário
            setFiles([]);
            init();
            setShowUploadModal(false);
            rtalert.success("Documentos enviados com sucesso!");

        } catch (error) {
            console.error("Erro no upload:", error);
            rtalert.error("Erro ao enviar documentos");
        } finally {
            setUploading(false);
        }
    };

    if (arquivos.length === 0 && uploading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Documentos Associados</h3>
                    {arquivos.length !== 0 &&
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Adicionar Documento
                        </button>
                    }
                </div>


                <TableDefault
                    columns={documentosColumns}
                    actions={actions}
                    data={arquivos}
                    style="striped"
                    pagination={true}
                    selectable={false}
                    itemsPerPage={10}
                    emptyState={<div className="text-center py-8 text-gray-500">
                        <div className="text-center py-8 text-gray-500">
                            <p>Nenhum documento encontrado</p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Adicionar Primeiro Documento
                            </button>
                        </div>
                    </div>}
                />
            </div>

            <Modal
                isOpen={showUploadModal}
                onClose={() => {
                    setShowUploadModal(false);
                    setFiles([]);
                }}
                title={`Adicionar documento à entidade`}
                showCloseButton={true}
                width={"50%"}
                maxHeight="600px"
            >
                <div className="space-y-4">
                    <FileUpload
                        id="khskdhfksjdfk"
                        label="Selecione arquivos para upload"
                        value={files}
                        onChange={(newFiles) => setFiles(newFiles)}
                        multiple={true}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />

                    {files.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium mb-2">Arquivos selecionados:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {files.map((file, index) => (
                                    <li key={index}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={() => {
                            setShowUploadModal(false);
                            setFiles([]);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                        disabled={uploading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {uploading ? 'Enviando...' : `Enviar ${files.length} arquivo(s)`}
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={showModalFile}
                onClose={() => {
                    setShowModalFile(false);
                }}
                title={'Emissão de Título PDF'}
                showCloseButton={true}
                width={"70%"}
                maxHeight="700px"
            >
                <>
                    {url_file && (() => {
                        // Extrair extensão
                        let array = url_file.split('.').pop();
                        const ext = array && array.toLowerCase();

                        if (ext === "pdf") {
                            return (
                                <iframe
                                    src={`${import.meta.env.VITE_API_URL}${url_file}`}
                                    width="100%"
                                    height="600px"
                                    style={{ border: "none" }}
                                    title="Visualizador PDF"
                                />
                            );
                        }

                        if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) {
                            return (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${url_file}`}
                                    alt="Documento"
                                    style={{ maxWidth: "100%", maxHeight: "600px", display: "block", margin: "0 auto" }}
                                />
                            );
                        }

                        return (
                            <p style={{ textAlign: "center", padding: "20px" }}>
                                Arquivo não suportado para visualização: {ext}
                            </p>
                        );
                    })()}
                </>
            </Modal>
        </>
    );
};

export default Aba3;