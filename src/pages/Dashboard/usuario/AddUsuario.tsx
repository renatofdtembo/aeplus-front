import { useEffect, useState } from "react";
import { DefaultInput } from "../../../hooks/DefaultInput";
import DefaultForm from "../../../hooks/DefaultForm";
import { User } from "../../../services/classes/User";
import { rtalert } from "../../../hooks/rtalert";
import { ObjectUpdater } from "../../../services/Util";
import ToggleSwitch from "../../../hooks/ToggleSwitch";
import { Option, saveFile, saveFileItem } from "../../../services/Utilitario";
import { PlusSquare } from "lucide-react";
import { Modal } from "../../../components/ui/modal";
import EnderecoManager from "../Localizacao/AddEndereco";
import { Endereco } from "../../../services/classes/Endereco";
import AvatarUpload from "../AvatarUpload";

interface UsuarioProps {
    isSucces: (status: boolean) => void;
    usuariop: User;
}

const AddUsuario: React.FC<UsuarioProps> = ({ isSucces, usuariop }) => {
    const [formData, setUsuario] = useState<User>(usuariop);
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erros, setErros] = useState<Record<string, string>>({});
    const [openModalEndereco, setOpenModalEndereco] = useState(false);
    const [updatepassword, setUpdatePassword] = useState<boolean>(false);
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [file, setFile] = useState<File>(new File([], ''));

    useEffect(() => {
        async function init() {
            const [enderecos] = await Promise.all([Endereco.all()]);
            setEnderecos(enderecos);
        }
        init()
    }, [usuariop]);

    const copyWith = (field: string, value: any) => {
        const updater = new ObjectUpdater(formData);
        setUsuario(updater.updateNestedField(field, value) as User);
    };

    const validarCampos = () => {
        const novosErros: Record<string, string> = {};

        // Validação de senha (apenas para novo usuário ou se está atualizando)
        if ((!usuariop.id || updatepassword) && (!formData.password || formData.password.trim() === "")) {
            novosErros.password = "Senha é obrigatória";
        } else if (formData.password && formData.password.length < 6) {
            novosErros.password = "Senha deve ter pelo menos 6 caracteres";
        }

        if ((!usuariop.id || updatepassword) && formData.password !== confirmarSenha) {
            novosErros.confirmarSenha = "As senhas não coincidem";
        }

        if (!formData.email || formData.email.trim() === "") {
            novosErros.email = "E-mail é obrigatório";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            novosErros.email = "E-mail inválido";
        }

        if (!formData.email || formData.email.trim() === "") {
            novosErros.email = "O e-mail de acesso é obrigatório";
        }

        if (!formData.name || formData.email.trim() === "") {
            novosErros.name = "O nome de usuário é obrigatório";
        }

        // Validação dos dados da pessoa
        if (!formData.pessoa?.nome || formData.pessoa.nome.trim() === "") {
            novosErros.nome_pessoa = "Nome completo é obrigatório";
        }

        if (!formData.pessoa?.nascimento) {
            novosErros.nascimento = "Data de nascimento é obrigatória";
        }

        if (!formData.pessoa?.genero) {
            novosErros.genero = "Género é obrigatório";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const submit = () => {
        if (validarCampos()) {
            try {
                // Preparar dados para envio
                const userData = {
                    ...formData,
                    update_password: updatepassword
                };
                let response = null;
                if (userData.id) {
                    response = User.update(userData, updatepassword);
                } else {
                    response = User.save(userData);
                }
                response.then(async (res: any) => {
                    console.log(res)
                    if (res.status == 'sucesso') {
                        if (file && file.size > 0) {
                            const uploadResponse = await saveFile(file, `/Profile`);
                            if (uploadResponse) {
                                let us = res.record as User;
                                await saveFileItem(uploadResponse, us.user_code);
                                await User.perfil(us.pessoa.id, { urlImg: uploadResponse.path });
                            }
                        }
                        isSucces(true);
                        rtalert.success(userData.id ? "Usuário atualizado com sucesso!" : "Usuário cadastrado com sucesso!", "top-right");
                    }
                }).catch(error => {
                    console.log(error)
                    rtalert.error("Erro ao salvar usuário: " + error.message, "top-right");
                });
            } catch (error) {
                console.log(error)
                rtalert.error("Erro ao cadastrar usuário: " + error, "top-right");
            }
        }
    };

    return (
        <div className="mx-auto">
            <DefaultForm onSubmit={submit}>
                <div className="space-y-6">
                    {/* Dados da Pessoa */}
                    <AvatarUpload
                        initialImage={formData.pessoa.urlImg}
                        backgroundImage={`${import.meta.env.VITE_IMAGE_BASE_PATH}/design-em-fundo-escuro-vetor.jpg`}
                        label="Foto de perfil"
                        size={32}
                        onFileChange={(file: File) => setFile(file)}
                    />
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Dados Pessoais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DefaultInput
                                label="Nome Completo"
                                placeholder="Digite o nome completo"
                                inputType="default"
                                float
                                required
                                inputvalue={formData.pessoa?.nome || ""}
                                onValueChange={(v) => copyWith('pessoa.nome', v)}
                            />

                            <DefaultInput
                                label="E-mail"
                                placeholder="Digite o e-mail"
                                inputType="email"
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
                                inputvalue={formData.pessoa?.contacto || ""}
                                error={erros.contacto}
                                onValueChange={(v) => copyWith('pessoa.contacto', v)}
                            />

                            <DefaultInput
                                label="NIF"
                                placeholder="Digite o NIF"
                                inputType="default"
                                float
                                inputvalue={formData.pessoa?.nif || ""}
                                onValueChange={(v) => copyWith('pessoa.nif', v)}
                            />

                            <DefaultInput
                                label="BI"
                                placeholder="Digite o BI ou Passaporte"
                                inputType="default"
                                float
                                inputvalue={formData.pessoa?.bi || formData.pessoa?.passaporte || ""}
                                onValueChange={(v) => {
                                    copyWith('pessoa.bi', v);
                                }}
                            />

                            <DefaultInput
                                label="Data de Nascimento"
                                htmlType="date"
                                float
                                required
                                inputvalue={formData.pessoa?.nascimento || ""}
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
                        </div>

                        <div className="pt-5">
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
                    </div>

                    {/* Dados do Usuário */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Dados de Acesso</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <DefaultInput
                                label="Nome de Usuário"
                                placeholder="Digite o nome de usuário"
                                inputType="default"
                                float
                                required
                                inputvalue={formData.name}
                                error={erros.nome}
                                onValueChange={(v) => copyWith('name', v)}
                            />

                            <DefaultInput
                                label="Email de Acesso"
                                placeholder="Email de Acesso"
                                inputType="default"
                                float
                                required
                                inputvalue={formData.email}
                                error={erros.email}
                                onValueChange={(v) => copyWith('email', v)}
                            />
                        </div>

                        {usuariop.id && (
                            <ToggleSwitch
                                checked={updatepassword}
                                onChange={setUpdatePassword}
                                label="Alterar senha"
                            />
                        )}

                        {(!usuariop.id || updatepassword) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <DefaultInput
                                    label="Senha"
                                    inputType="password"
                                    htmlType="password"
                                    float
                                    required={!usuariop.id || updatepassword}
                                    inputvalue={formData.password}
                                    error={erros.password}
                                    onValueChange={(v) => copyWith('password', v)}
                                />

                                <DefaultInput
                                    label="Confirmar Senha"
                                    inputType="password"
                                    htmlType="password"
                                    float
                                    required={!usuariop.id || updatepassword}
                                    inputvalue={confirmarSenha}
                                    error={erros.confirmarSenha}
                                    onValueChange={setConfirmarSenha}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            onClick={() => isSucces(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {usuariop.id ? "Atualizar Usuário" : "Cadastrar Usuário"}
                        </button>
                    </div>
                </div>
            </DefaultForm>

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

export default AddUsuario;