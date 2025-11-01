import TableDefault, { TableAction } from "../../../hooks/TableDefault";
import { Eye, Trash2, MapPin, Home, Info } from "lucide-react";
import { useNavigate } from "react-router";

interface Aba2Props {
    imoveis: any;
}

const Aba2: React.FC<Aba2Props> = ({ imoveis }) => {
    const navigate = useNavigate();

    console.log(imoveis)

    // Colunas para a tabela de imóveis
    const imoveisColumns = [
        {
            key: 'referencia',
            label: 'Referência',
            width: '15%',
            render: (value: any, _: any) => (
                <div className="flex items-center gap-2">
                    <Home size={16} className="text-blue-600" />
                    <span className="font-medium">{value}</span>
                </div>
            )
        },
        {
            key: 'tipo_imovel',
            label: 'Tipo',
            width: '15%',
            render: (row: any) => (
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">{row}</span>
            )
        },
        {
            key: 'endereco',
            label: 'Endereço',
            width: '40%',
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-red-500" />
                    <span className="text-gray-700">{row}</span>
                </div>
            )
        },
        {
            key: 'data_contrato',
            label: 'Data Contrato',
            width: '15%',
            render: (row: any) => (
                row ? new Date(row).toLocaleDateString('pt-BR') : '-'
            )
        },
        {
            key: 'activo',
            label: 'Estado',
            width: '15%',
            render: (row: any) => {
                console.log(row)
                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${row?.activo == 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {row?.activo == 1 ? 'Ativo' : 'Desativo'}
                    </span>
                )
            }
        }
    ];

    // Preparar dados para a tabela

    const data_show = imoveis.map((row: any) => {
        return {
            referencia: row.referencia,
            tipo_imovel: row.tipo_imovel.nome,
            endereco: `${row.rua.nome} - ${row.rua.bairro.nome} - ${row.rua.bairro.comuna.nome} - ${row.rua.bairro.comuna.municipio.nome}`,
            data_contrato: row.pivot.data_contrato,
            activo: row.pivot
        }
    });

    const actions: TableAction[] = [
        {
            label: "Visualizar Imóvel",
            icon: <Eye size={16} />,
            handleClick: (row: any) => {
                navigate(`/principal/imoveis/${row.referencia}`, { replace: false });
            },
            hidden: (_: any) => false
        },
        {
            label: "Remover Associação",
            icon: <Trash2 size={16} />,
            handleClick: async (_: any) => {

            },
            hidden: (_: any) => false
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Imóveis Associados ({[].length})
                </h3>
                <div className="text-sm text-gray-600">
                    {[].filter((item: any) => item.activo).length} ativos
                </div>
            </div>

            <TableDefault
                columns={imoveisColumns}
                data={data_show}
                actions={actions}
                style="striped"
                pagination={true}
                itemsPerPage={10}
                selectable={false}
            />

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <div className="flex items-center gap-2">
                    <Info size={16} className="text-blue-600" />
                    <span className="text-sm text-blue-800">
                        Esta tabela mostra os imóveis associados a esta entidade.
                        Clique em "Visualizar Imóvel" para ver detalhes completos.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Aba2;