"use client"

import { useState, useEffect } from "react"
import { PlusSquare, Save } from "lucide-react"
import { Bairro } from "../../../services/classes/Bairro"
import { Comuna } from "../../../services/classes/Comuna"
import { Municipio } from "../../../services/classes/Municipio"
import { Provincia } from "../../../services/classes/Provincia"
import { Pais } from "../../../services/classes/Pais"
import { DefaultInput } from "../../../hooks/DefaultInput"
import { Option } from "../../../services/Utilitario"
import { Modal } from "../../../components/ui/modal"
import { ObjectUpdater } from "../../../services/Util"

interface AddBairroManagerProps {
    onComplete: (e: Bairro) => void
}

const AddBairroManager: React.FC<AddBairroManagerProps> = ({ onComplete }) => {
    // Estados
    const [comunas, setComunas] = useState<Comuna[]>([])
    const [municipios, setMunicipios] = useState<Municipio[]>([])
    const [provincias, setProvincias] = useState<Provincia[]>([])
    const [paises, setPaises] = useState<Pais[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [formData, setFormData] = useState<Bairro>(new Bairro())
    const [loading, setLoading] = useState(true)

    // Carregar dados iniciais
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async (reload = true) => {
        setLoading(reload)
        try {
            const [all_data] = await Promise.all([Pais.all_localizacao()])
            setComunas(all_data.comunas)
            setMunicipios(all_data.municipios)
            setProvincias(all_data.provincias)
            setPaises(all_data.paises)
        } catch (err) {
            console.log("Erro ao carregar dados: " + (err instanceof Error ? err.message : String(err)))
        } finally {
            setLoading(false)
        }
    }

    // Manipulação do formulário
    const copyWith = (field: string, value: any) => {
        const updater = new ObjectUpdater(formData);
        setFormData(updater.updateNestedField(field, value) as Bairro);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const bairro = new Bairro(formData)
            const response = await Bairro.save(bairro)
            console.log(response)
            if (response.status === 'sucesso') {
                onComplete(response.record)
                await loadData()
                resetForm()
                setIsOpen(false)
            } else {
                console.log(response.mensagem || "Erro ao salvar endereço")
            }
        } catch (err) {
            console.log("Erro ao salvar endereço: " + (err instanceof Error ? err.message : String(err)))
        }
    }

    const resetForm = () => {
        setFormData(new Bairro())
    }

    async function salvarDado(): Promise<void> {
        let response = null;
        if (titulo == 'Comuna') {
            response = await Comuna.save(new Comuna({ nome: descricao, municipio: formData.comuna.municipio }));
            copyWith('comuna', response.record)
        } else if (titulo == 'Município') {
            response = await Municipio.save(new Municipio({ nome: descricao, provincia: formData.comuna.municipio.provincia }));
            copyWith('comuna.municipio', response.record)
        } else if (titulo == 'Província') {
            response = await Provincia.save(new Provincia({ nome: descricao, capital: '', codigo: '', regiao: '', area: 0, populacao: 0, descricao: '', pais: formData.comuna.municipio.provincia.pais }));
            copyWith('comuna.municipio.provincia', response.record)
        }
        loadData(false)
        setIsOpen(true);
    }

    if (loading) {
        return (
            <div className="p-4 flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Novo Bairro
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DefaultInput
                            label="Bairro"
                            inputType="text-only"
                            inputvalue={formData.nome}
                            onChange={(value) => copyWith('nome', value)}
                            float
                            iconRight={<PlusSquare size={24} color="#3B82F6" className="cursor-pointer" />}
                            onClickIconRight={() => { setIsOpen(true); setTitulo('Bairro') }}
                        />

                        <DefaultInput
                            label="Comuna"
                            inputType="text-only"
                            inputvalue={formData.comuna?.nome}
                            options={comunas.map((c: Comuna) => new Option(c.nome, c.nome, c))}
                            selectedChange={(_, comuna) => copyWith('comuna', comuna)}
                            float
                            iconRight={<PlusSquare size={24} color="#3B82F6" className="cursor-pointer" />}
                            onClickIconRight={() => { setIsOpen(true); setTitulo('Comuna') }}
                        />

                        <DefaultInput
                            label="Município"
                            inputType="text-only"
                            inputvalue={formData.comuna?.municipio?.nome}
                            options={municipios.map((m: Municipio) => new Option(m.nome, m.nome, m))}
                            selectedChange={(_, municipio) => copyWith('comuna.municipio', municipio)}
                            float
                            iconRight={<PlusSquare size={24} color="#3B82F6" className="cursor-pointer" />}
                            onClickIconRight={() => { setIsOpen(true); setTitulo('Município') }}
                        />

                        <DefaultInput
                            label="Província"
                            inputType="text-only"
                            inputvalue={formData.comuna?.municipio?.provincia?.nome}
                            options={provincias.map((p: Provincia) => new Option(p.nome, p.nome, p))}
                            selectedChange={(_, provincia) => copyWith('comuna.municipio.provincia', provincia)}
                            float
                            iconRight={<PlusSquare size={24} color="#3B82F6" className="cursor-pointer" />}
                            onClickIconRight={() => { setIsOpen(true); setTitulo('Província') }}
                        />

                        <DefaultInput
                            label="País"
                            inputType="text-only"
                            inputvalue={formData.comuna?.municipio?.provincia?.pais?.nome}
                            options={paises.map((p: Pais) => new Option(p.nome, p.nome, p))}
                            selectedChange={(_, pais) => copyWith('comuna.municipio.provincia.pais', pais)}
                            float
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false)
                            resetForm()
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Save size={16} />
                        {formData.id ? "Atualizar" : "Salvar"}
                    </button>
                </div>
            </form>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
                title={titulo}
                showCloseButton={true}
                width={"25%"}
                maxHeight="600px"
            >
                <>
                    <DefaultInput
                        label={`Descrição ${titulo}`}
                        inputType="text-only"
                        inputvalue={descricao}
                        onChange={(value) => setDescricao(value)}
                        required
                        float
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={salvarDado}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Save size={16} />
                            {"Salvar"}
                        </button>
                    </div>
                </>
            </Modal>

        </div>
    )
}

export default AddBairroManager