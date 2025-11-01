"use client"

import { useState, useEffect } from "react"
import { Save } from "lucide-react"
import { DefaultInput } from "../../../hooks/DefaultInput"
import { Option } from "../../../services/Utilitario"
import { Comuna } from "../../../services/classes/Comuna"
import { Bairro } from "../../../services/classes/Bairro"

interface AddBairroProps {
  onComplete: (b: Bairro) => void
}

const AddBairro: React.FC<AddBairroProps> = ({ onComplete }) => {
  // Estados
  const [comunas, setComunas] = useState<Comuna[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Bairro>(new Bairro())

  // Carregar dados iniciais
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [comunasdt] = await Promise.all([
        Comuna.all(),
      ])
      setComunas(comunasdt)
    } catch (err) {
      console.log("Erro ao carregar dados: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  // Manipulação do formulário
  const handleInputChange = (field: keyof Bairro, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await Bairro.save(formData)

      if (response.status = 'sucesso') {
        onComplete(response.record)
        resetForm()
      } else {
        console.log(response.mensagem || "Erro ao salvar município")
      }
    } catch (err) {
      console.log("Erro ao salvar município: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const resetForm = () => {
    setFormData(new Bairro())
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white/20 dark:bg-gray-900">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
          <DefaultInput
            label="Nome do Bairro"
            inputType="default"
            inputvalue={formData.nome}
            float
            onChange={(value: any) => handleInputChange("nome", value)}
            required
          />

          <DefaultInput
            label="Seleciona uma Comuna"
            inputType="text-only"
            inputvalue={formData.comuna.nome}
            options={comunas.map((e: Comuna) => new Option(e.nome, e.nome, e))}
            selectedChange={(_, r) => handleInputChange("comuna", r)}
            float
          />
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Save />
            Salvar
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddBairro