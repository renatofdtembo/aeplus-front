import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { User } from "../../../services/classes/User";
import { Funcao } from "../../../services/classes/Funcao";
import { Funcionario } from "../../../services/classes/Funcionario";
import { apiRequest } from "../../../services/httpAxios";
import { APIURL } from "../../../services/Util";
import { Modal } from "../../../components/ui/modal";

interface AssignFunctionsProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSuccess?: () => void;
}

export const AssignFunctions = ({ isOpen, onClose, user, onSuccess }: AssignFunctionsProps) => {
    const [allFunctions, setAllFunctions] = useState<Funcao[]>([]);
    const [filteredFunctions, setFilteredFunctions] = useState<Funcao[]>([]);
    const [selectedFunctions, setSelectedFunctions] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [funcionario, setFuncionario] = useState<Funcionario>(new Funcionario());
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "selected" | "unselected">("all");

    useEffect(() => {
        if (isOpen && user.id) {
            loadFunctions();
        }
    }, [isOpen, user.id]);

    useEffect(() => {
        filterFunctions();
    }, [searchTerm, allFunctions, selectedFunctions, activeFilter]);

    const loadFunctions = async () => {
        setIsLoading(true);
        try {
            const [allFuncs, userFuncs] = await Promise.all([
                Funcao.all(),
                Funcionario.findByPessoaId(user.pessoa.id)
            ]);
            setFuncionario(userFuncs.data)
            setAllFunctions(allFuncs);
            console.log(userFuncs.data)
            setSelectedFunctions(userFuncs.data.funcoes?.map((f: Funcao) => f.id) || []);
        } catch (error) {
            console.error("Failed to load functions", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterFunctions = () => {
        let result = allFunctions;

        // Aplicar filtro de busca
        if (searchTerm) {
            result = result.filter(f =>
                f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Aplicar filtro de seleção
        if (activeFilter === "selected") {
            result = result.filter(f => selectedFunctions.includes(f.id));
        } else if (activeFilter === "unselected") {
            result = result.filter(f => !selectedFunctions.includes(f.id));
        }

        setFilteredFunctions(result);
    };

    const handleToggleFunction = (funcId: number) => {
        setSelectedFunctions(prev =>
            prev.includes(funcId)
                ? prev.filter(id => id !== funcId)
                : [...prev, funcId]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await apiRequest(
                "POST",
                `${APIURL}funcionarios/${funcionario.id}/funcoes`,
                { funcao_ids: selectedFunctions }
            );

            if (response.success) {
                onSuccess?.();
                onClose();
            }
        } catch (error) {
            console.error("Failed to save functions", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Atribuir Funções - ${user.pessoa?.nome}`}
            showCloseButton={true}
            width="60%"
        >
            <div className="flex flex-col h-full">
                {/* Barra de ferramentas */}
                <div className="flex gap-3 mb-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Pesquisar funções..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                        <button
                            onClick={() => setActiveFilter("all")}
                            className={`px-3 py-1 text-sm rounded-md ${activeFilter === "all" ? "bg-white shadow" : "text-gray-600"}`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setActiveFilter("selected")}
                            className={`px-3 py-1 text-sm rounded-md ${activeFilter === "selected" ? "bg-white shadow" : "text-gray-600"}`}
                        >
                            Selecionadas
                        </button>
                        <button
                            onClick={() => setActiveFilter("unselected")}
                            className={`px-3 py-1 text-sm rounded-md ${activeFilter === "unselected" ? "bg-white shadow" : "text-gray-600"}`}
                        >
                            Não selecionadas
                        </button>
                    </div>
                </div>

                {/* Contador */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                        {filteredFunctions.length} funções encontradas
                    </span>
                    <span className="text-sm font-medium">
                        {selectedFunctions.length} selecionadas
                    </span>
                </div>

                {/* Lista de funções */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                        <span className="ml-2">Carregando funções...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[400px] pr-2">
                        {filteredFunctions.map(func => {
                            const isSelected = selectedFunctions.includes(func.id);
                            return (
                                <div
                                    key={func.id}
                                    onClick={() => handleToggleFunction(func.id)}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                                >
                                    <div className="flex items-start">
                                        <div className={`flex items-center justify-center h-5 w-5 mt-0.5 rounded border ${isSelected ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"}`}>
                                            {isSelected && (
                                                <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>

                                        <div className="ml-3 flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-800"}`}>
                                                        {func.nome}
                                                    </h3>
                                                    {func.departamento?.nome && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Departamento: {func.departamento.nome}
                                                        </p>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        Selecionada
                                                    </span>
                                                )}
                                            </div>
                                            {func.descricao && (
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {func.descricao}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Rodapé */}
                <div className="flex justify-between items-center pt-4 mt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />
                                Salvando...
                            </>
                        ) : (
                            `Salvar ${selectedFunctions.length} funções`
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};