import React, { useEffect, useState } from "react";
import { DefaultInput } from "../../../hooks/DefaultInput";
import DefaultForm from "../../../hooks/DefaultForm";
import { Funcionario } from "../../../services/classes/Funcionario";
import { rtalert } from "../../../hooks/rtalert";
import { formatDataMysql, ObjectUpdater } from "../../../services/Util";
import { Option, saveFile } from "../../../services/Utilitario";
import ToggleSwitch from "../../../hooks/ToggleSwitch";
import { Municipio } from "../../../services/classes/Municipio";
import { Endereco } from "../../../services/classes/Endereco";
import AvatarUpload from "../AvatarUpload";
import { Pessoa } from "../../../services/classes/Pessoa";

interface FuncionarioProps {
    isSuccess: (status: boolean) => void;
    funcionarioP: Funcionario;
}

const AddFuncionario: React.FC<FuncionarioProps> = ({ isSuccess, funcionarioP }) => {
    const [formData, setFuncionario] = useState<Funcionario>(new Funcionario());
    const [erros, setErros] = useState<Record<string, string>>({});
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [file, setFile] = useState<File>(new File([], ''));
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [loading, setLoading] = useState(false);

    async function inicializar() {
        setErros({});
        console.log(file)
        // Carregar municípios (ajustar conforme sua implementação)
        setMunicipios(await Municipio.all());
        setEnderecos(await Endereco.all());
        // Se estamos editando, preencher o formulário com os dados existentes
        if (funcionarioP.id !== null) {
            setFuncionario(funcionarioP);
        } else {
            setFuncionario(new Funcionario());
        }
    }

    useEffect(() => {
        inicializar();
    }, [funcionarioP]);

    const copyWith = (field: string, value: any) => {
        const updater = new ObjectUpdater(formData);
        setFuncionario(updater.updateNestedField(field, value) as Funcionario);
    };

    const validarCampos = () => {
        const novosErros: Record<string, string> = {};

        // Validações para dados da pessoa
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

        if (!formData.pessoa.nascimento || formData.pessoa.nascimento.trim() === "") {
            novosErros.nascimento = "Data de nascimento é obrigatória";
        }

        if (!formData.data_admissao || formData.data_admissao.trim() === "") {
            novosErros.data_admissao = "Data de admissão é obrigatória";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const submit = async () => {
        if (validarCampos()) {
            setLoading(true);
            try {
                const response = await Funcionario.save(formData);
                if (response.status === 'sucesso') {
                    isSuccess(true);
                    rtalert.success(
                        funcionarioP.id
                            ? "Funcionário atualizado com sucesso!"
                            : "Funcionário cadastrado com sucesso!",
                        "top-right"
                    );
                    if (file && file.size > 0) {
                        const uploadResponse = await saveFile(file, `/Profile`);
                        if (uploadResponse) {
                            let ent = response.record as Funcionario;
                            await Pessoa.updatePerfil({ pessoa_id: ent.pessoa_id, path: uploadResponse.path });
                        }
                    }
                } else {
                    rtalert.error(response.mensagem || "Erro ao salvar funcionário", "top-right");
                }
            } catch (error) {
                rtalert.error("Erro ao salvar funcionário: " + error, "top-right");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="mx-auto">
            <DefaultForm onSubmit={submit}>
                <div className="space-y-6">
                    {/* Dados Pessoais */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h3>

                        <AvatarUpload
                            initialImage={formData.pessoa.urlImg}
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

                            <DefaultInput
                                label="BI/Identificação"
                                placeholder="Número do documento"
                                inputType="default"
                                float
                                inputvalue={formData.pessoa.bi}
                                onValueChange={(v) => copyWith('pessoa.bi', v)}
                            />

                            <DefaultInput
                                label="Data de Nascimento"
                                inputType="date"
                                htmlType="date"
                                float
                                required
                                inputvalue={formData.pessoa.nascimento}
                                error={erros.nascimento}
                                onValueChange={(v) => {
                                    copyWith('pessoa.nascimento', v)
                                }}
                            />

                            <DefaultInput
                                label="Gênero"
                                htmlType="select"
                                float
                                inputvalue={formData.pessoa.genero || ''}
                                options={[
                                    new Option('Masculino', 'M', 'MASCULINO'),
                                    new Option('Feminino', 'F', 'Feminino')
                                ]}
                                onValueChange={(v) => copyWith('pessoa.genero', v)}
                            />

                            <DefaultInput
                                label="Estado Civil"
                                htmlType="select"
                                float
                                inputvalue={formData.pessoa.estadocivil || ''}
                                options={[
                                    new Option('Solteiro(a)', 'SOLTEIRO', 'Solteiro(a)'),
                                    new Option('Casado(a)', 'CASADO', 'Casado(a)'),
                                    new Option('Divorciado(a)', 'DIVORCIADO', 'Divorciado(a)'),
                                    new Option('Viúvo(a)', 'VIUVO', 'Viúvo(a)'),
                                    new Option('União de Facto', 'UNIAO_DE_FACTO', 'União de Facto')
                                ]}
                                onValueChange={(v) => copyWith('pessoa.estadocivil', v)}
                            />

                            <DefaultInput
                                label="NIF"
                                placeholder="Número de identificação fiscal"
                                inputType="default"
                                float
                                inputvalue={formData.pessoa.nif}
                                onValueChange={(v) => copyWith('pessoa.nif', v)}
                            />

                            <DefaultInput
                                label="Seleciona uma Naturalidade"
                                htmlType="select"
                                float
                                inputvalue={`${formData.pessoa.naturalidade?.nome}, ${formData.pessoa.naturalidade?.provincia?.nome}, ${formData.pessoa.naturalidade?.provincia.pais?.nome}`}
                                options={municipios.map((naturalidade) => new Option(naturalidade.nome, naturalidade.id, naturalidade))}
                                onValueChange={(_, v: any) => copyWith('pessoa.naturalidade', v)}
                            />

                            <DefaultInput
                                label="Seleciona uma Endereço"
                                htmlType="select"
                                float
                                inputvalue={`${formData.pessoa.endereco.rua.nome}, ${formData.pessoa.endereco.rua.bairro?.nome}`}
                                options={enderecos.map((end) => new Option(
                                    `${end.rua?.nome}, ${end.rua.bairro?.nome}, ${end.rua.bairro.comuna?.nome}, ${end.rua.bairro.comuna.municipio?.nome}`, end, end))}
                                onValueChange={(_, v: any) => copyWith('pessoa.endereco', v)}
                            />
                        </div>
                    </div>

                    {/* Dados do Funcionário */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do Funcionário</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DefaultInput
                                label="Matrícula"
                                placeholder="Número de matrícula"
                                inputType="default"
                                float
                                readOnly
                                inputvalue={formData.num_funcionario}
                                error={erros.matricula}
                                onValueChange={(v) => copyWith('matricula', v)}
                            />

                            <DefaultInput
                                label="Tipo de Contrato"
                                htmlType="select"
                                float
                                required
                                inputvalue={formData.tipo_contrato}
                                options={[
                                    new Option('Efetivo', 'EFETIVO', 'Efetivo'),
                                    new Option('Temporário', 'TEMPORARIO', 'Temporário'),
                                    new Option('Estágio', 'ESTAGIO', 'Estágio'),
                                    new Option('Practicante', 'PRACTICANTE', 'Practicante')
                                ]}
                                onValueChange={(v) => copyWith('tipo_contrato', v)}
                            />

                            <DefaultInput
                                label="Data de Admissão"
                                inputType="date"
                                htmlType="date"
                                float
                                required
                                inputvalue={formatDataMysql(formData.data_admissao)}
                                error={erros.data_admissao}
                                onValueChange={(v) => copyWith('data_admissao', v)}
                            />

                            <DefaultInput
                                label="Data de Efetivação"
                                htmlType="date"
                                float
                                inputvalue={formatDataMysql(formData.data_efetivacao)}
                                onValueChange={(v) => copyWith('data_efetivacao', v)}
                            />

                            <DefaultInput
                                label="Data de Término"
                                htmlType="date"
                                float
                                inputvalue={formatDataMysql(formData.data_termino_contrato)}
                                onValueChange={(v) => copyWith('data_termino_contrato', v)}
                            />

                            <DefaultInput
                                label="Estado"
                                htmlType="select"
                                float
                                required
                                inputvalue={formData.estado}
                                options={[
                                    new Option('Activo', 'ACTIVO', 'Activo'),
                                    new Option('Ausente', 'AUSENTE', 'Ausente'),
                                    new Option('Férias', 'FERIAS', 'Férias'),
                                    new Option('Licença', 'LICENCA', 'Licença'),
                                    new Option('Suspenso', 'SUSPENSO', 'Suspenso'),
                                    new Option('Despedido', 'DESPEDIDO', 'Despedido'),
                                    new Option('Reformado', 'REFORMADO', 'Reformado')
                                ]}
                                onValueChange={(v) => copyWith('estado', v)}
                            />

                            <DefaultInput
                                label="Horas Semanais"
                                htmlType="number"
                                float
                                inputvalue={formData.horas_semanais.toString()}
                                onValueChange={(v) => copyWith('horas_semanais', parseInt(v) || 40)}
                            />
                        </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Adicionais</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DefaultInput
                                label="Banco"
                                placeholder="Nome do banco"
                                inputType="default"
                                float
                                inputvalue={formData.banco || ''}
                                onValueChange={(v) => copyWith('banco', v)}
                            />

                            <DefaultInput
                                label="Número da Conta"
                                placeholder="Número da conta bancária"
                                inputType="default"
                                float
                                inputvalue={formData.numero_conta || ''}
                                onValueChange={(v) => copyWith('numero_conta', v)}
                            />

                            <DefaultInput
                                label="IBAN"
                                placeholder="Código IBAN"
                                inputType="default"
                                float
                                inputvalue={formData.iban || ''}
                                onValueChange={(v) => copyWith('iban', v)}
                            />

                            <DefaultInput
                                label="Nº Segurança Social"
                                placeholder="Número de segurança social"
                                inputType="default"
                                float
                                inputvalue={formData.numero_seguranca_social || ''}
                                onValueChange={(v) => copyWith('numero_seguranca_social', v)}
                            />

                            <DefaultInput
                                label="Observações"
                                htmlType="textarea"
                                float
                                inputvalue={formData.observacoes || ''}
                                onValueChange={(v) => copyWith('observacoes', v)}
                            />

                            <DefaultInput
                                label="Qualificações"
                                htmlType="textarea"
                                float
                                inputvalue={formData.qualificacoes || ''}
                                onValueChange={(v) => copyWith('qualificacoes', v)}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ToggleSwitch
                                checked={formData.tem_seguro_saude}
                                onChange={(v) => copyWith('tem_seguro_saude', v)}
                                label="Seguro de Saúde"
                            />

                            <ToggleSwitch
                                checked={formData.tem_vale_refeicao}
                                onChange={(v) => copyWith('tem_vale_refeicao', v)}
                                label="Vale Refeição"
                            />

                            <ToggleSwitch
                                checked={formData.tem_vale_transporte}
                                onChange={(v) => copyWith('tem_vale_transporte', v)}
                                label="Vale Transporte"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? "Salvando..." : (funcionarioP.id ? "Atualizar" : "Cadastrar")}
                        </button>
                    </div>
                </div>
            </DefaultForm>
        </div>
    );
};

export default AddFuncionario;