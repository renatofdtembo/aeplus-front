import { useEffect, useState } from 'react';
import PermissoesFuncao from './PermissoesFuncao';
import { Modal } from '../../../components/ui/modal';
import { Funcao } from '../../../services/classes/Funcao';
import { Departamento } from '../../../services/classes/Departamento';
import { ObjectUpdater } from '../../../services/StatusUpdater';
import { rtalert } from '../../../hooks/rtalert';

export default function DepartamentoManager() {
    const [departamentos, setDepartamentos] = useState<any[]>([]);
    const [showDepModal, setShowDepModal] = useState(false);
    const [showFuncModal, setShowFuncModal] = useState(false);
    const [showFuncEditModal, setShowFuncEditModal] = useState(false);
    const [showFuncDetailModal, setShowFuncDetailModal] = useState(false);
    const [showMenusModal, setShowMenusModal] = useState(false);
    const [editingDepartamento, setEditingDepartamento] = useState<any>(null);

    const [selectedDepartamento, setSelectedDepartamento] = useState<any>(null);
    const [selectedFuncao, setSelectedFuncao] = useState<any>(null);

    const [departamento, setDepartamento] = useState<Departamento>(new Departamento());
    const [funcao, setFuncao] = useState<Funcao>(new Funcao());

    useEffect(() => {
        carregarDepartamentos();
    }, []);

    const carregarDepartamentos = async () => {
        const res = await Departamento.getAll();
        setDepartamentos(res);
    };

    const salvarDepartamento = async () => {
        try {
            Departamento.save(Departamento.toJson(departamento)).then(() => {
                setDepartamento(new Departamento());
                setEditingDepartamento(null);
                setShowDepModal(false);
                carregarDepartamentos();
                rtalert.success('Salvo com sucesso.', 'top-right')
            });

        } catch (err) {
            console.error("Erro ao salvar departamento:", err);
        }
    };

    const salvarFuncao = async () => {
        const payload = { ...funcao, departamento: selectedDepartamento };

        Funcao.save(Funcao.toJson(payload)).then(() => {
            setFuncao(new Funcao());
            setShowFuncModal(false);
            carregarDepartamentos();
            rtalert.success('Salvo com sucesso.', 'top-right')
        });
    };

    const atualizarFuncao = async () => {
        Funcao.save(Funcao.toJson(selectedFuncao)).then(() => {
            setFuncao(new Funcao());
            setShowFuncEditModal(false);
            carregarDepartamentos();
            rtalert.success('Salvo com sucesso.', 'top-right')
        });
    };

    const copyWith = (field: string, value: any, type: string = 'dp') => {
        if (type == 'dp') {
            const updater = new ObjectUpdater(departamento);
            setDepartamento(updater.updateNestedField(field, value) as Departamento);
        } else {
            const updater = new ObjectUpdater(funcao);
            setFuncao(updater.updateNestedField(field, value) as Funcao);
        }
    };

    return (
        <div className="p-6 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Departamentos</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => setShowDepModal(true)}
                >
                    + Departamento
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departamentos.map((dep) => (
                    <div key={dep.id} className="bg-white dark:bg-gray-800 shadow rounded p-4">
                        <div className="flex justify-between  mb-2">
                            <h2 className="text-lg font-semibold">{dep.nome}</h2>
                            <div className='flex gap-3'>
                                <button
                                    className="text-sm text-yellow-500 ml-4"
                                    onClick={() => {
                                        setEditingDepartamento(dep);
                                        setDepartamento(dep);
                                        setShowDepModal(true);
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    className="text-red-500 text-sm"
                                    onClick={() => {
                                        rtalert.question('Tem certeza que deseja deletar este departamento?', {
                                            onConfirm: async () => {
                                                await Departamento.delete(dep).then(() => {
                                                    carregarDepartamentos();
                                                    rtalert.success('Departamento deletado com sucesso.', 'top-right')
                                                })
                                            }
                                        })
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className="text-sm text-blue-500"
                                    onClick={() => {
                                        setSelectedDepartamento(dep);
                                        setShowFuncModal(true);
                                    }}
                                >
                                    + Função
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{dep.descricao}</p>

                        <ul className="space-y-2">
                            {dep.funcoes.map((func: any) => (
                                <li key={func.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{func.nome}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            Nível: {func.nivel} | Salário: {func.salario_base}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            className="text-green-500 text-sm"
                                            onClick={() => {
                                                setSelectedFuncao(func);
                                                setShowFuncDetailModal(true);
                                            }}
                                        >
                                            Detalhes
                                        </button>
                                        <button
                                            className="text-red-500 text-sm"
                                            onClick={async () => {
                                                rtalert.question('Tem certeza que deseja deletar esta função?', {
                                                    onConfirm: async () => {
                                                        await Funcao.delete(func).then(() => {
                                                            carregarDepartamentos();
                                                            rtalert.success('Função deletada com sucesso.', 'top-right')
                                                        })
                                                    }
                                                })
                                            }}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="text-yellow-500 text-sm"
                                            onClick={() => {
                                                setSelectedFuncao(func);
                                                setShowFuncEditModal(true);
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="text-purple-500 text-sm"
                                            onClick={() => {
                                                setSelectedFuncao(func);
                                                setShowMenusModal(true);
                                            }}
                                        >
                                            Permições
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={showDepModal}
                onClose={() => {
                    setShowDepModal(false);
                    setDepartamento(new Departamento());
                    setEditingDepartamento(null);
                }}
                width="500px"
            >
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {editingDepartamento ? "Editar Departamento" : "Novo Departamento"}
                    </h2>
                    <button
                        onClick={() => {
                            setShowDepModal(false);
                            setDepartamento(new Departamento());
                            setEditingDepartamento(null);
                        }}
                        className="text-gray-500 hover:text-red-500 text-lg font-bold"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Nome do departamento"
                        value={departamento.nome}
                        onChange={(e) => copyWith('nome', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />

                    <textarea
                        placeholder="Descrição"
                        value={departamento.categoria}
                        onChange={(e) => copyWith('categoria', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px]"
                    />
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setShowDepModal(false);
                            setDepartamento(new Departamento());
                            setEditingDepartamento(null);
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={salvarDepartamento}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        {editingDepartamento ? "Atualizar" : "Salvar"}
                    </button>
                </div>
            </Modal>

            <Modal isOpen={showFuncModal} onClose={() => setShowFuncModal(false)} title="Adicionar Função" width="500px">
                <input
                    type="text"
                    placeholder="Nome"
                    value={funcao.nome}
                    onChange={(e) => copyWith('nome', e.target.value, 'f')}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3"
                />
                <textarea
                    placeholder="Descrição"
                    value={funcao.descricao}
                    onChange={(e) => copyWith('descricao', e.target.value, 'f')}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3"
                />
                <input
                    type="number"
                    placeholder="Salário Base"
                    value={funcao.salario_base}
                    onChange={(e) => copyWith('salario_base', e.target.value, 'f')}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3"
                />
                <input
                    type="text"
                    placeholder="Nível"
                    value={funcao.nivel}
                    onChange={(e) => copyWith('nivel', e.target.value, 'f')}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={funcao.ativo}
                        onChange={(e) => copyWith('ativo', e.target.value, 'f')}
                    />
                    Ativo
                </label>
                <div className="mt-4 flex justify-end">
                    <button onClick={salvarFuncao} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Salvar
                    </button>
                </div>
            </Modal>

            <Modal isOpen={showFuncEditModal} onClose={() => setShowFuncEditModal(false)} title="Editar Função" width="500px">
                {selectedFuncao && (
                    <>
                        <input
                            type="text"
                            value={selectedFuncao.nome}
                            onChange={(e) => setSelectedFuncao({ ...selectedFuncao, nome: e.target.value })}
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3"
                        />
                        <textarea
                            value={selectedFuncao.descricao}
                            onChange={(e) => setSelectedFuncao({ ...selectedFuncao, descricao: e.target.value })}
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3"
                        />
                        <input
                            type="number"
                            value={selectedFuncao.salario_base}
                            onChange={(e) => setSelectedFuncao({ ...selectedFuncao, salario_base: e.target.value })}
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3"
                        />
                        <input
                            type="text"
                            value={selectedFuncao.nivel}
                            onChange={(e) => setSelectedFuncao({ ...selectedFuncao, nivel: e.target.value })}
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-3"
                        />
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedFuncao.ativo}
                                onChange={(e) => setSelectedFuncao({ ...selectedFuncao, ativo: e.target.checked })}
                            />
                            Ativo
                        </label>
                        <div className="mt-4 flex justify-end">
                            <button onClick={atualizarFuncao} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Atualizar
                            </button>
                        </div>
                    </>
                )}
            </Modal>

            <Modal isOpen={showFuncDetailModal} onClose={() => setShowFuncDetailModal(false)} title="Detalhes da Função" width="500px">
                {selectedFuncao && (
                    <div className="space-y-2">
                        <p><strong>Nome:</strong> {selectedFuncao.nome}</p>
                        <p><strong>Descrição:</strong> {selectedFuncao.descricao}</p>
                        <p><strong>Nível:</strong> {selectedFuncao.nivel}</p>
                        <p><strong>Salário Base:</strong> {selectedFuncao.salario_base}</p>
                        <p><strong>Status:</strong> {selectedFuncao.ativo ? 'Ativo' : 'Inativo'}</p>
                    </div>
                )}
            </Modal>

            <Modal isOpen={showMenusModal} onClose={() => setShowMenusModal(false)} title={`Permições e Menus`} width="80%" maxHeight='90vh'>
                {selectedFuncao && (
                    <div className="space-y-2">
                        <PermissoesFuncao func={selectedFuncao} />
                    </div>
                )}
            </Modal>
        </div>
    );
}
