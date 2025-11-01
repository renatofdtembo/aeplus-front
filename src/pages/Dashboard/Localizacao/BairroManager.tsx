"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Save, Plus, MapPlus } from "lucide-react"
import TableDefault, { TableAction, TableColumn } from "../../../hooks/TableDefault"
import { DefaultInput } from "../../../hooks/DefaultInput"
import { Modal } from "../../../components/ui/modal"
import { Pais } from "../../../services/classes/Pais"
import { Option } from "../../../services/Utilitario"
import { Comuna } from "../../../services/classes/Comuna"
import { Bairro } from "../../../services/classes/Bairro"
import KMLReader from "./KMLReader"
import MapModal, { Coordinate } from "./MapModal"

const BairroManager: React.FC = () => {
  // Estados
  const [comunas, setComunas] = useState<Comuna[]>([])
  const [bairros, setBairros] = useState<Bairro[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMap, setIsOpenMap] = useState(false);
  const [formData, setFormData] = useState<Bairro>(new Bairro())
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

  const openMapWithCoordinates = (coords: Coordinate[]) => {
    setCoordinates(coords);
    setIsOpenMap(true);
  };
  // Carregar dados iniciais
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [comunasdt, bairros] = await Promise.all([
        Comuna.all(),
        Bairro.all(),
      ])
      setComunas(comunasdt)
      console.log(bairros)
      setBairros(bairros)
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
        // Recarregar a lista
        await loadData()
        setIsOpen(false)
        resetForm()
      } else {
        console.log(response.mensagem || "Erro ao salvar município")
      }
    } catch (err) {
      console.log("Erro ao salvar município: " + (err instanceof Error ? err.message : String(err)))
    }
  }

  const onJson = (json1: any) => {
    handleInputChange('data_geometrica', json1[0])
  }

  const resetForm = () => {
    setFormData(new Bairro())
  }

  // Ações da tabela
  const handleEdit = (p: Bairro) => {
    setFormData(p)
    setIsOpen(true)
  }

  const handleDelete = async (p: Pais) => {
    if (confirm(`Tem certeza que deseja excluir o município "${p.nome}"?`)) {
      try {
        // Implementar lógica de exclusão aqui
        // await Municipio.delete(municipio.id)
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
      label: "Nome do Bairro",
      width: "50%"
    },
    {
      key: "",
      label: "Nome da Comuna",
      width: "50%",
      render: (_, row: Bairro) => `${row.comuna.nome}/${row.comuna.municipio.nome}`
    }
  ];

  // Ações da tabela
  const actions: TableAction[] = [
    {
      label: "Editar",
      icon: <Edit size={16} />,
      handleClick: handleEdit,
      variant: "default",
      hidden: () => false
    },
    {
      label: "Excluir",
      icon: <Trash2 size={16} />,
      handleClick: handleDelete,
      variant: "destructive",
      hidden: () => false
    },
    {
      label: "Ver No Mapa",
      icon: <MapPlus size={16} />,
      handleClick: (row: Bairro) => {
        setFormData(row)
        openMapWithCoordinates(row.data_geometrica.coordenadas as Coordinate[])
      },
      variant: "success",
      hidden: (row: Bairro) => {
        return row.data_geometrica !== null ? false : true
      }
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
        <button onClick={() => { setIsOpen(true); setFormData(new Bairro()) }}
          className="w-27 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium flex row justify-between items-center"
        >
          <Plus /> Bairro
        </button>
      </div>

      {/* Lista de municípios */}
      <TableDefault
        columns={columns}
        data={bairros}
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
        title="Adicionar Bairro"
        showCloseButton={true}
        width="80%"
        maxHeight="90vh"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
            <DefaultInput
              label="Nome do Pais"
              inputType="text-only"
              inputvalue={formData.nome}
              float
              onChange={(value: any) => handleInputChange("nome", value)}
              required
            />

            <DefaultInput
              label="Seleciona um Município"
              inputType="text-only"
              inputvalue={formData.comuna.nome}
              options={comunas.map((e: Comuna) => new Option(e.nome, e.nome, e))}
              selectedChange={(_, r) => handleInputChange("comuna", r)}
              float
            />
          </div>

          <div className="container mx-auto p-4">
            <KMLReader onJson={onJson} />
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
      <Modal
        isOpen={isOpenMap}
        onClose={() => setIsOpenMap(false)}
        title={`Visualização das Coordenadas do Bairro ${formData.nome}`}
        showCloseButton={true}
        width="90%"
        maxHeight="90vh"
      >
        <MapModal
          coordinates={coordinates}
          containerStyles={{ width: '100%', height: '93vh' }}
          zoom={16}
        />
      </Modal>


    </div>
  )
}

export default BairroManager