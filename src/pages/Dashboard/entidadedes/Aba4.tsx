import TableDefault from "../../../hooks/TableDefault";
import { formatDataMysql } from "../../../services/Util";

interface Aba1Props {
    processos: any[]
}
const Aba4: React.FC<Aba1Props> = ({ processos }) => {

    // Colunas para a tabela de processos
    const processosColumns = [
        { key: 'num_processo', label: 'Nº Processo', width: '15%' },
        {
            key: 'tipo', 
            label: 'Tipo pedido', 
            width: '20%',
            render: (_: string, row: any) => (
                <span className="font-mono text-sm text-gray-600">
                    {row.tipo_pedido?.nome || 'N/A'}
                </span>
            )
        },
        {
            key: 'entidade',
            label: 'Entidade',
            width: '15%',
            render: (_: string, row: any) => (
                <span className="text-gray-900 dark:text-white">
                    {row.entidade?.pessoa?.nome || 'N/A'}
                </span>
            )
        },
        {
            key: 'bairro',
            label: 'Bairro',
            width: '15%',
            render: (_: string, row: any) => (
                <span className="text-gray-900 dark:text-white">
                    {row.bairro?.nome || 'N/A'}
                </span>
            )
        },
        {
            key: '_',
            label: 'Técnico',
            width: '15%',
            render: (_: string, __: any) => (
                <div />
            )
        },
        { 
            key: 'created_at', 
            label: 'Data de registo', 
            width: '15%',
            render: (_: string, row: any) => formatDataMysql(row.created_at) 
        },
        {
            key: '__',
            label: 'Estado',
            width: '10%',
            render: (_: string, __: any) => <div></div>
        }
    ];

    // Transformar os dados para a estrutura esperada pela tabela
    const dadosTabela = processos.map(processo => ({
        ...processo
    }));

    return (
        <>
            <div className="p-4">
                <TableDefault
                    columns={processosColumns}
                    data={dadosTabela}
                    style="striped"
                    selectable={false}
                    pagination={true}
                    itemsPerPage={10}
                />
            </div>
        </>
    )
};

export default Aba4;