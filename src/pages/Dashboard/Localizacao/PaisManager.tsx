"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Save, Plus } from "lucide-react"
import { Municipio } from "../../../services/classes/Municipio"
import TableDefault, { TableAction, TableColumn } from "../../../hooks/TableDefault"
import { DefaultInput } from "../../../hooks/DefaultInput"
import { Modal } from "../../../components/ui/modal"
import { Pais } from "../../../services/classes/Pais"

const PaisManager: React.FC = () => {
  // Estados
  const [paises, setPais] = useState<Pais[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Pais>(new Pais())

  // Carregar dados iniciais
  useEffect(() => {
    initData()
  }, [])

  async function initData() {
    try {
      setLoading(true)
      const [paisData] = await Promise.all([
        Pais.all()
      ])
      setPais(paisData)
    } catch (err) {
      console.log("Erro ao carregar dados: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  // Manipulação do formulário
  const handleInputChange = (field: keyof Pais, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      return;
      const response = await Municipio.save(new Municipio(formData))

      if (response.status = 'sucesso') {
        // Recarregar a lista
        await initData()
        // Limpar formulário
        resetForm()
      } else {
        console.log(response.mensagem || "Erro ao salvar município")
      }
    } catch (err) {
      console.log("Erro ao salvar município: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const resetForm = () => {
    setFormData(new Pais())
  }

  // Ações da tabela
  const handleEdit = (p: Pais) => {
    setFormData(p)
    setIsOpen(true)
  }

  const handleDelete = async (p: Pais) => {
    if (confirm(`Tem certeza que deseja excluir o município "${p.nome}"?`)) {
      try {
        // Implementar lógica de exclusão aqui
        // await Municipio.delete(municipio.id)
        await initData() // Recarregar após exclusão
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
      width: "50%"
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
          <Plus /> Pais
        </button>
      </div>

      {/* Lista de municípios */}
      <TableDefault
        columns={columns}
        data={paises}
        actions={actions}
        style="striped"
        pagination={true}
        itemsPerPage={8}
        selectable={false}
        emptyState={<div className="text-center py-4 text-gray-500">Nenhum Pais cadastrado</div>}
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Adicionar Pais"
        showCloseButton={true}
        width="40%"
        maxHeight="600px"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 pt-5">
            <DefaultInput
              label="Nome do Pais"
              inputType="text-only"
              inputvalue={formData.nome}
              float
              onChange={(value: any) => handleInputChange("nome", value)}
              required
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

export default PaisManager