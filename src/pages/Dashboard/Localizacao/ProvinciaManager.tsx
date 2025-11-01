"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Save, Plus } from "lucide-react"
import { Provincia } from "../../../services/classes/Provincia"
import TableDefault, { TableAction, TableColumn } from "../../../hooks/TableDefault"
import { DefaultInput } from "../../../hooks/DefaultInput"
import { Option } from "../../../services/Utilitario"
import { Modal } from "../../../components/ui/modal"
import { Pais } from "../../../services/classes/Pais"

const ProvinciaManager: React.FC = () => {
  // Estados
  const [paises, setPais] = useState<Pais[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Provincia>(new Provincia())

  // Carregar dados iniciais
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [paisData, provinciasData] = await Promise.all([
        Pais.all(),
        Provincia.all()
      ])
      console.log(provinciasData)
      setPais(paisData)
      setProvincias(provinciasData)
    } catch (err) {
      console.log("Erro ao carregar dados: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  // Manipulação do formulário
  const handleInputChange = (field: keyof Provincia, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await Provincia.save(new Provincia(formData))
      if (response.status = 'sucesso') {
        // Recarregar a lista
        await loadData()
        resetForm()
      } else {
        console.log(response.mensagem || "Erro ao salvar município")
      }
    } catch (err) {
      console.log("Erro ao salvar município: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const resetForm = () => {
    setFormData(new Provincia())
    setIsOpen(false)
  }

  // Ações da tabela
  const handleEdit = (p: Provincia) => {
    setFormData(p)
    setIsOpen(true)
  }

  const handleDelete = async (p: Provincia) => {
    if (confirm(`Tem certeza que deseja excluir o município "${p.nome}"?`)) {
      try {
        // Implementar lógica de exclusão aqui
        // await Provincia.delete(municipio.id)
        await loadData() // Recarregar após exclusão
      } catch (err) {
        console.log("Erro ao excluir município: " + (err instanceof Error ? err.message : String(err)))
      }
    }
  }

  // Definição das colunas da tabela
  const columns: TableColumn[] = [
    {
      key: "id",
      label: "ID",
      width: "10%",
      align: "center"
    },
    {
      key: "nome",
      label: "Nome da Província",
      width: "30%"
    },
    {
      key: "capital",
      label: "Capital",
      width: "20%"
    },
    {
      key: "pais",
      label: "País",
      width: "40%",
      render: (value: any) => value?.nome || "-"
    }
  ];

  // Ações da tabela
  const actions: TableAction[] = [
    {
      label: "Editar",
      icon: <Edit size={16} />,
      handleClick: handleEdit,
      variant: "default",
      hidden: ()=> false
    },
    {
      label: "Excluir",
      icon: <Trash2 size={16} />,
      handleClick: handleDelete,
      variant: "destructive",
      hidden: ()=> false
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white/20 dark:bg-gray-900">
      <div className="flex flex-row justify-end mb-4 gap-3">
        <button onClick={() => { setIsOpen(true); }}
          className="w-27 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium flex row justify-between items-center"
        >
          <Plus size={16}/> Provincia
        </button>
      </div>

      {/* Lista de municípios */}
      <TableDefault
        columns={columns}
        data={provincias}
        actions={actions}
        style="striped"
        pagination={true}
        itemsPerPage={10}
        totalItems={provincias.length}
        selectable={false}
        emptyState={<div className="text-center py-4 text-gray-500">Nenhuma Provincia cadastrado</div>}
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Adicionar Província"
        showCloseButton={true}
        width="40%"
        maxHeight="600px"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
            <DefaultInput
              label="Nome da Província"
              inputType="text-only"
              inputvalue={formData.nome}
              float
              onChange={(value: any) => handleInputChange("nome", value)}
              required
            />

            <DefaultInput
              label="Capital"
              inputType="text-only"
              inputvalue={formData.capital}
              float
              onChange={(value: any) => handleInputChange("capital", value)}
              required
            />

            <DefaultInput
              label="Código"
              inputType="text-only"
              inputvalue={formData.codigo}
              float
              onChange={(value: any) => handleInputChange("codigo", value)}
            />

            <DefaultInput
              label="Região"
              inputType="text-only"
              inputvalue={formData.regiao}
              float
              onChange={(value: any) => handleInputChange("regiao", value)}
            />

            <DefaultInput
              label="Área (km²)"
              inputType="default"
              inputvalue={formData.area}
              float
              onChange={(value: any) => handleInputChange("area", value)}
            />

            <DefaultInput
              label="População"
              inputType="default"
              inputvalue={formData.populacao}
              float
              onChange={(value: any) => handleInputChange("populacao", value)}
            />

            <DefaultInput
              label="País"
              inputType="text-only"
              inputvalue={formData.pais.nome}
              options={paises.map((p: Pais) => new Option(p.nome, p.nome, p))}
              selectedChange={(_, selected) => handleInputChange("pais", selected)}
              float
              required
            />

            <DefaultInput
              label="Descrição"
              inputType="default"
              multiple
              inputvalue={formData.descricao}
              float
              onChange={(value: any) => handleInputChange("descricao", value)}
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
      </Modal>

    </div>
  )
}

export default ProvinciaManager