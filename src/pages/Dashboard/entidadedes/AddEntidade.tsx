/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-constant-binary-expression */
import React, { useEffect, useState } from "react";
import { DefaultInput } from "../../../hooks/DefaultInput";
import { Entidade } from "../../../services/classes/Entidade";
import { rtalert } from "../../../hooks/rtalert";
import { ObjectUpdater } from "../../../services/Util";
import { Option, saveFile, saveFileItem } from "../../../services/Utilitario";
import { Endereco } from "../../../services/classes/Endereco";
import { Municipio } from "../../../services/classes/Municipio";
import AvatarUpload from "../AvatarUpload";
import { PlusSquare, Save } from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import EnderecoManager from "../Localizacao/AddEndereco";
import AddNaturalidade from "../Localizacao/AddNaturalidade";
import { Pais } from "../../../services/classes/Pais";
import { FileUpload } from "../../../hooks/FileUpload";

interface EntidadeProps {
    isSuccess: (status: boolean) => void;
    entidadeP: Entidade;
}

const AddEntidade: React.FC<EntidadeProps> = ({ isSuccess, entidadeP }) => {
    const [formData, setEntidade] = useState<Entidade>(new Entidade());
    const [erros, setErros] = useState<Record<string, string>>({});
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [paises, setPais] = useState<Pais[]>([]);
    const [file, setFile] = useState<File>(new File([], ''));
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModalBairro, setOpenModalBairro] = useState(false);
    const [openModalEndereco, setOpenModalEndereco] = useState(false);

    async function inicializar() {
        try {
            setErros({});
            const [municipios, enderecos, paises] = await Promise.all([Municipio.all(), Endereco.all(), Pais.all()]);
            setMunicipios(municipios);
            setEnderecos(enderecos);
            setPais(paises);
            // Se estamos editando, preencher o formulário com os dados existentes
            if (entidadeP.id && entidadeP.id != null) {
                const entit = await Entidade.findEntidade(entidadeP.num_entidade);
                console.log(entit)
                setEntidade(entit);

                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        inicializar();
    }, [entidadeP]);

    const copyWith = (field: string, value: any) => {
        const updater = new ObjectUpdater(formData);
        setEntidade(updater.updateNestedField(field, value) as Entidade);
    };

    const validarCampos = () => {
        const novosErros: Record<string, string> = {};

        if (!formData.estado) {
            novosErros.estado = "Estado é obrigatório";
        }

        // Validações da pessoa
        if (!formData.pessoa.nome || formData.pessoa.nome.trim() === "") {
            novosErros.nome = "Nome completo é obrigatório";
        }

        if (!formData.pessoa.email || formData.pessoa.email.trim() === "") {
            novosErros.email = "E-mail é obrigatório";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.pessoa.email)) {
            novosErros.email = "E-mail inválido";
        }

        if (!formData.pessoa.contacto || formData.pessoa.contacto.trim() === "") {
            novosErros.contacto = "Contacto é obrigatório";
        }

        if ((!formData.pessoa.nascimento || formData.pessoa.nascimento.trim() === "" && formData.tipo_entidade === "PARTICULAR")) {
            novosErros.nascimento = "Data de nascimento é obrigatória";
        }

        if (!file && files.length === 0) {
            novosErros.nascimento = "Seleciona a foto do perfil e a copia do Bilhete de Identidade";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const submit = async () => {
        if (validarCampos()) {
            setLoading(true);
            try {

                const emissao = new Date(formData.pessoa.validade.emissao);
                const expiracao = new Date(formData.pessoa.validade.expiracao);
                const criacao = new Date(formData.created_at);
                // 1. Emissão não pode ser anterior à criação
                if (emissao < criacao && formData.id == null) {
                    rtalert.error("A data de emissão não pode ser anterior à data de criação.");
                    return;
                }
                // 2. Expiração deve ser maior que a criação
                if (expiracao <= criacao) {
                    rtalert.error("A data de expiração deve ser maior que a data de criação..");
                    return;
                }
                // 3. Expiração deve ser pelo menos 1 ano após a emissão
                const emissaoMaisUmAno = new Date(emissao);
                emissaoMaisUmAno.setFullYear(emissaoMaisUmAno.getFullYear() + 1);

                if (expiracao < emissaoMaisUmAno) {
                    rtalert.error("A data de expiração deve ser pelo menos 1 ano após a emissão.");
                    return;
                }
                // Agora salva a entidade
                const response = await Entidade.save(formData);

                if (response.status == "sucesso") {
                    if (file && file.size > 0) {
                        const uploadResponse = await saveFile(file, `/Profile`);
                        if (uploadResponse) {
                            const ent = response.record as Entidade;
                            await Entidade.perfil(ent.id, { urlImg: uploadResponse.path });
                        }

                        if (files && files.length > 0) {
                            for (const file of files) {
                                const uploadResponse = await saveFile(file);
                                if (uploadResponse) {
                                    await saveFileItem(uploadResponse, response.record.num_entidade);
                                }
                            }
                        }
                    }
                    isSuccess(true);
                    rtalert.success(response.mensagem, "top-right");
                } else {
                    console.log(response)
                    rtalert.error(response.mensagem || "Erro ao salvar entidade", "top-right");
                }
            } catch (error) {
                console.log(error)
                rtalert.error("Erro ao salvar entidade: " + error, "top-right");
            } finally {
                setLoading(false);
            }
        } else {
            rtalert.error("Preenche todos campos obrigatórios a cima.", "center");
        }
    };

    return (
        <div className="mx-auto">
            <div>
                <div className="space-y-6">
                    {/* Dados da Pessoa */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h3>
                        <AvatarUpload
                            initialImage={formData.pessoa?.urlImg}
                            backgroundImage={`${import.meta.env.VITE_IMAGE_BASE_PATH}/design-em-fundo-escuro-vetor.jpg`}
                            label="Foto de perfil"
                            size={32}
                            onFileChange={(file: File) => setFile(file)}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <DefaultInput
                                label="Nome completo"
                                placeholder="Digite o nome completo"
                                inputType="default"
                                float
                                required
                                inputvalue={formData.pessoa.nome}
                                error={erros.nome}
                                onValueChange={(v) => copyWith('pessoa.nome', v)}
                            />

                            <DefaultInput
                                label="E-mail"
                                inputType="email"
                                htmlType="email"
                                float
                                required
                                inputvalue={formData.pessoa.email}
                                error={erros.email}
                                onValueChange={(v) => copyWith('pessoa.email', v)}
                            />

                            <DefaultInput
                                label="Contacto"
                                placeholder="Digite o contacto"
                                inputType="default"
                                float
                                required
                                inputvalue={formData.pessoa.contacto}
                                error={erros.contacto}
                                onValueChange={(v) => copyWith('pessoa.contacto', v)}
                            />
                            {formData.tipo_entidade === "PARTICULAR" && (
                                <>
                                    {formData.pessoa.nacionalidade == 'Angolana' &&
                                        (<>
                                            <DefaultInput
                                                label="BI/Identificação"
                                                placeholder="Número do documento"
                                                inputType="default"
                                                float
                                                inputvalue={formData.pessoa.bi}
                                                onValueChange={(v) => copyWith('pessoa.bi', v)}
                                            />
                                            <DefaultInput
                                                label="Data Registro"
                                                placeholder="Data Registro"
                                                htmlType="date"
                                                float
                                                inputvalue={formData.pessoa.validade.emissao}
                                                onValueChange={(v) => copyWith('pessoa.validade.emissao', v)}
                                            />
                                            <DefaultInput
                                                label="Data Expiração"
                                                placeholder="Data Expiração"
                                                htmlType="date"
                                                float
                                                inputvalue={formData.pessoa.validade.expiracao}
                                                onValueChange={(v) => copyWith('pessoa.validade.expiracao', v)}
                                            />
                                            <DefaultInput
                                                label="NIF"
                                                placeholder="NIF"
                                                inputType="default"
                                                float
                                                inputvalue={formData.pessoa.nif}
                                                onValueChange={(v) => copyWith('pessoa.nif', v)}
                                            />
                                        </>)
                                    }
                                    {formData.pessoa.nacionalidade != 'Angolana' &&
                                        (<>
                                            <DefaultInput
                                                label="Cartão de Residência"
                                                placeholder="Cartão de Residência"
                                                inputType="default"
                                                float
                                                inputvalue={formData.pessoa.cartao_residencia}
                                                onValueChange={(v) => copyWith('pessoa.cartao_residencia', v)}
                                            />
                                            <DefaultInput
                                                label="Data Registro"
                                                placeholder="Data Registro"
                                                htmlType="date"
                                                float
                                                inputvalue={formData.pessoa.validade.emissao}
                                                onValueChange={(v) => copyWith('pessoa.validade.emissao', v)}
                                            />
                                            <DefaultInput
                                                label="Data Expiração"
                                                placeholder="Data Expiração"
                                                htmlType="date"
                                                float
                                                inputvalue={formData.pessoa.validade.expiracao}
                                                onValueChange={(v) => copyWith('pessoa.validade.expiracao', v)}
                                            />
                                            <DefaultInput
                                                label="NIF"
                                                placeholder="NIF"
                                                inputType="default"
                                                float
                                                inputvalue={formData.pessoa.nif}
                                                onValueChange={(v) => copyWith('pessoa.nif', v)}
                                            />
                                        </>)
                                    }
                                    <DefaultInput
                                        label="Data de Nascimento"
                                        inputType="date"
                                        htmlType="date"
                                        float
                                        required
                                        inputvalue={formData.pessoa.nascimento}
                                        error={erros.nascimento}
                                        onValueChange={(v) => copyWith('pessoa.nascimento', v)}
                                    />
                                    <DefaultInput
                                        label="Gênero"
                                        htmlType="select"
                                        float
                                        inputvalue={formData.pessoa.genero || ''}
                                        options={[
                                            new Option('Masculino', 'M', 'M'),
                                            new Option('Feminino', 'F', 'F'),
                                        ]}
                                        onValueChange={(_, v) => copyWith('pessoa.genero', v)}
                                    />
                                    <DefaultInput
                                        label="Estado Civil"
                                        htmlType="select"
                                        float
                                        inputvalue={formData.pessoa.estadocivil || ''}
                                        options={[
                                            new Option('Solteiro(a)', 'SOLTEIRO', 'SOLTEIRO'),
                                            new Option('Casado(a)', 'CASADO', 'CASADO'),
                                            new Option('Divorciado(a)', 'DIVORCIADO', 'DIVORCIADO'),
                                            new Option('Viúvo(a)', 'VIUVO', 'VIUVO'),
                                            new Option('União de Facto', 'UNIAO_DE_FACTO', 'UNIAO_DE_FACTO')
                                        ]}
                                        onValueChange={(_, v) => copyWith('pessoa.estadocivil', v)}
                                    />

                                    <DefaultInput
                                        label="Naturalidade"
                                        htmlType="select"
                                        float
                                        inputvalue={formData.pessoa.naturalidade?.nome || ''}
                                        options={municipios.map((municipio) =>
                                            new Option(municipio.nome, municipio.id?.toString() || '', municipio)
                                        )}
                                        onValueChange={(_, v) => copyWith('pessoa.naturalidade', v)}
                                        iconRight={<PlusSquare size={24} color="#3B82F6" className="cursor-pointer" />}
                                        onClickIconRight={() => { setOpenModalBairro(true); }}
                                    />

                                    <DefaultInput
                                        label="Nacionalidade"
                                        htmlType="select"
                                        float
                                        inputvalue={formData.pessoa.nacionalidade || ''}
                                        options={paises?.map((pais) => new Option(pais?.nacionalidade, pais?.id || '', pais))}
                                        onValueChange={(_, v) => copyWith('pessoa.nacionalidade', v.nacionalidade)}
                                    />
                                </>
                            )}

                            {formData.tipo_entidade === "PRIVADA" || formData.tipo_entidade === "PUBLICA" && (
                                <>
                                    <DefaultInput
                                        label="NIF"
                                        placeholder="Número de identificação fiscal"
                                        inputType="default"
                                        float
                                        inputvalue={formData.pessoa.nif}
                                        onValueChange={(v) => copyWith('pessoa.nif', v)}
                                    />
                                    <DefaultInput
                                        label="Nome do Gestor"
                                        placeholder="Nome do Gestor"
                                        inputType="default"
                                        float
                                        inputvalue={formData.gestor}
                                        onValueChange={(v) => copyWith('gestor', v)}
                                    />
                                    <DefaultInput
                                        label="Cargo do Gestor"
                                        placeholder="Cargo do Gestor"
                                        inputType="default"
                                        float
                                        inputvalue={formData.cargo}
                                        onValueChange={(v) => copyWith('cargo', v)}
                                    />
                                    <DefaultInput
                                        label="Contacto"
                                        placeholder="Contacto"
                                        inputType="default"
                                        float
                                        inputvalue={formData.telefone}
                                        onValueChange={(v) => copyWith('telefone', v)}
                                    />
                                    <DefaultInput
                                        label="E-mail"
                                        placeholder="E-mail"
                                        inputType="default"
                                        float
                                        inputvalue={formData.email_gestor}
                                        onValueChange={(v) => copyWith('email_gestor', v)}
                                    />
                                </>
                            )}

                            <DefaultInput
                                label="Endereço"
                                htmlType="select"
                                float
                                inputvalue={`${formData.pessoa.endereco.nome}, ${formData.pessoa.endereco.rua?.nome}, ${formData.pessoa.endereco.rua?.bairro?.nome}` || ''}
                                options={enderecos.map((e) =>
                                    new Option(
                                        `${e.nome}, ${e.rua?.nome}, ${e.rua?.bairro?.nome}`,
                                        e.id?.toString() || '',
                                        e
                                    )
                                )}
                                onValueChange={(_, v) => copyWith('pessoa.endereco', v)}
                                iconRight={<PlusSquare size={24} color="#3B82F6" className="cursor-pointer" />}
                                onClickIconRight={() => { setOpenModalEndereco(true); }}
                            />
                        </div>

                        {/* Dados da Entidade */}
                        <div className="pb-6 mt-5">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados da Entidade</h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-1">
                                <DefaultInput
                                    label="Estado"
                                    htmlType="select"
                                    float
                                    required
                                    inputvalue={formData.estado}
                                    error={erros.estado}
                                    options={[
                                        new Option('Activo', 'ACTIVO', 'ACTIVO'),
                                        new Option('Inactivo', 'INACTIVO', 'INACTIVO')
                                    ]}
                                    onValueChange={(_, v) => copyWith('estado', v)}
                                />

                                <DefaultInput
                                    label="Observações"
                                    htmlType="textarea"
                                    float
                                    inputvalue={formData.observacao || ''}
                                    onValueChange={(v) => copyWith('observacao', v)}
                                    rows={4}
                                    multiple
                                    textarea={true}
                                />
                            </div>
                        </div>
                        <div className="-mt-4">
                            <FileUpload
                                id={'file-upload-outro-pagamento-'}
                                label="Arquivos (BILHETES, Cartão de Residente, etc.)"
                                value={files}
                                onChange={(files) => setFiles(files)}
                                multiple={true}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={loading}
                            onClick={submit}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {entidadeP.id ? "Atualizar" : "Cadastrar"}
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={openModalBairro}
                onClose={() => {
                    setOpenModalBairro(false);
                }}
                title={'Nova Naturalidade'}
                showCloseButton={true}
                width={"50%"}
                maxHeight="700px"
            >
                <AddNaturalidade onComplete={(e: Municipio) => {
                    setOpenModalBairro(false);
                    copyWith('pessoa.naturalidade', e);
                }} />
            </Modal>
            <Modal
                isOpen={openModalEndereco}
                onClose={() => {
                    setOpenModalEndereco(false);
                }}
                title={'Novo Endereço'}
                showCloseButton={true}
                width={"50%"}
                maxHeight="700px"
            >
                <>
                    <EnderecoManager onComplete={(e: Endereco) => {
                        copyWith('pessoa.endereco', e);
                        setOpenModalEndereco(false);
                    }} />
                </>
            </Modal>
        </div>
    );
};

export default AddEntidade;