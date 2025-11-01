"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Save, Plus } from "lucide-react"
import TableDefault, { TableAction, TableColumn } from "../../../hooks/TableDefault"
import { DefaultInput } from "../../../hooks/DefaultInput"
import { Modal } from "../../../components/ui/modal"
import { Pais } from "../../../services/classes/Pais"
import { Option } from "../../../services/Utilitario"
import { Bairro } from "../../../services/classes/Bairro"
import { Rua } from "../../../services/classes/Rua"

const RuaManager: React.FC = () => {
  // Estados
  const [ruas, setRuas] = useState<Rua[]>([])
  const [bairros, setBairros] = useState<Bairro[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Rua>(new Rua())

  // Carregar dados iniciais
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [ruas, bairros] = await Promise.all([
        Rua.all(),
        Bairro.all(),
      ])
      setRuas(ruas)
      setBairros(bairros)
    } catch (err) {
      console.log("Erro ao carregar dados: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  // Manipulação do formulário
  const handleInputChange = (field: keyof Rua, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await Rua.save(formData)

      if (response.status = 'sucesso') {
        // Recarregar a lista
        await loadData()
        setIsOpen(false)
        resetForm()
      } else {
        console.log(response.mensagem || "Erro ao salvar rua")
      }
    } catch (err) {
      console.log("Erro ao salvar rua: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const resetForm = () => {
    setFormData(new Rua())
  }

  // Ações da tabela
  const handleEdit = (p: Rua) => {
    setFormData(p)
    setIsOpen(true)
  }

  const handleDelete = async (p: Pais) => {
    if (confirm(`Tem certeza que deseja excluir o Rua "${p.nome}"?`)) {
      try {
        // Implementar lógica de exclusão aqui
        // await Municipio.delete(municipio.id)
        await loadData() // Recarregar após exclusão
      } catch (err) {
        console.log("Erro ao excluir Rua: " + (err instanceof Error ? err.message : String(err)))
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
      label: "Nome do Bairro",
      width: "50%"
    },
    {
      key: "",
      label: "Nome da Rua",
      width: "50%",
      render: (_, row: Rua) => `${row.bairro.nome}/${row.bairro.comuna.municipio.nome}`
    }
  ];

  // Ações da tabela
  const actions: TableAction[] = [
    {
      label: "Editar",
      icon: <Edit size={16} />,
      handleClick: handleEdit,
      variant: "default",
      hidden: () => true
    },
    {
      label: "Excluir",
      icon: <Trash2 size={16} />,
      handleClick: handleDelete,
      variant: "destructive",
      hidden: () => true
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
        <button onClick={() => { setIsOpen(true); setFormData(new Rua()) }}
          className="w-27 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium flex row justify-between items-center"
        >
          <Plus /> Rua
        </button>
      </div>

      {/* Lista de municípios */}
      <TableDefault
        columns={columns}
        data={ruas}
        actions={actions}
        style="striped"
        pagination={true}
        itemsPerPage={8}
        selectable={false}
        emptyState={<div className="text-center py-4 text-gray-500">Nenhuma Rua cadastrado</div>}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Adicionar Rua"
        showCloseButton={true}
        width="40%"
        maxHeight="90vh"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
            <DefaultInput
              label="Nome da Rua"
              inputType="text-only"
              inputvalue={formData.nome}
              float
              onChange={(value: any) => handleInputChange("nome", value)}
              required
            />

            <DefaultInput
              label="Seleciona um Bairro"
              inputType="text-only"
              inputvalue={formData.bairro.nome}
              options={bairros.map((e: Bairro) => new Option(e.nome, e.nome, e))}
              selectedChange={(_, r) => handleInputChange("bairro", r)}
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
      </Modal>
    </div>
  )
}

export default RuaManager