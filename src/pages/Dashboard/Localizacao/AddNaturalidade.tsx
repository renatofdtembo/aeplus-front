"use client"

import { useState, useEffect } from "react"
import { PlusSquare, Save } from "lucide-react"
import { Municipio } from "../../../services/classes/Municipio"
import { Provincia } from "../../../services/classes/Provincia"
import { Pais } from "../../../services/classes/Pais"
import { DefaultInput } from "../../../hooks/DefaultInput"
import { Option } from "../../../services/Utilitario"
import { Modal } from "../../../components/ui/modal"
import { ObjectUpdater } from "../../../services/Util"

interface AddNaturalidadeProps {
    onComplete: (e: Municipio) => void
}

const AddNaturalidade: React.FC<AddNaturalidadeProps> = ({ onComplete }) => {
    // Estados
    const [provincias, setProvincias] = useState<Provincia[]>([])
    const [paises, setPaises] = useState<Pais[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [titulo, setTitulo] = useState('Província')
    const [descricao, setDescricao] = useState('')
    const [formData, setFormData] = useState<Municipio>(new Municipio())

    // Carregar dados iniciais
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async (reload = true) => {
        try {
            setLoading(reload)
            const [all_data] = await Promise.all([Pais.all_localizacao()])
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
        setFormData(updater.updateNestedField(field, value) as Municipio);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const municipio = new Municipio(formData)
            const response = await Municipio.save(municipio)

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
        setFormData(new Municipio())
    }

    async function salvarDado(): Promise<void> {
        let record = null;
        if (titulo == 'Província') {
            record = await Provincia.save(new Provincia({ nome: descricao, capital: '', codigo: '', regiao: '', area: 0, populacao: 0, descricao: descricao, pais: formData.provincia.pais }));
            copyWith('provincia', record.record)
        }
        loadData(false)
        setIsOpen(false)
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
                <div className="dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DefaultInput
                            label="Município / Estado"
                            inputType="default"
                            inputvalue={formData.nome}
                            onChange={(value) => copyWith('nome', value)}
                            float
                        />

                        <DefaultInput
                            label="Província"
                            inputType="text-only"
                            inputvalue={formData.provincia?.nome}
                            options={provincias.map((p: Provincia) => new Option(p.nome, p.nome, p))}
                            selectedChange={(_, provincia) => copyWith('provincia', provincia)}
                            float
                            iconRight={<PlusSquare size={24} color="#3B82F6" className="cursor-pointer" />}
                            onClickIconRight={() => { setIsOpen(true); setTitulo('Província') }}
                        />

                        <DefaultInput
                            label="País"
                            inputType="text-only"
                            inputvalue={formData.provincia?.pais?.nome}
                            options={paises.map((p: Pais) => new Option(p.nome, p.nome, p))}
                            selectedChange={(_, pais) => copyWith('provincia.pais', pais)}
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

export default AddNaturalidade