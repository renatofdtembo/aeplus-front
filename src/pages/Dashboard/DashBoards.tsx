import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import DefaultBody from "../../layout/DefaultBody";
import { Curso } from "../../services/classes/Curso";



const DashBoards = () => {
    const navigate = useNavigate();
    const [allCursos, setCursos] = useState<Curso[]>([]);
    const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);

    // Filtros únicos
    const [instituicoesUnicas, setInstituicoes] = useState<string[]>([]);
    const [niveisUnicos, setNiveis] = useState<string[]>([]);
    const [duracoesUnicas, setDuracoes] = useState<string[]>([]);
    const [tiposUnicos, setTipounicos] = useState<string[]>([]);
    const [categoriasUnicos, setCategoriapounicos] = useState<string[]>([]);
    // const [participantesMap, setParticipantesMap] = useState<Record<number, number>>({})

    // Filtros selecionados
    const [searchTerm, setSearchTerm] = useState("");
    const [instituicaoSelecionada, setInstituicaoSelecionada] = useState("");
    const [nivelSelecionado, setNivelSelecionado] = useState("");
    const [duracaoSelecionada, setDuracaoSelecionada] = useState("");
    const [tipoSelecionado, setTipoSelecionado] = useState("");
    const [categoriaSelecionado, setCategoriaSelecionado] = useState("");

    async function inicializar() {
        const dt = await Curso.publicAllCursos();
        setCursos(dt.data.data);
        setFilteredCursos(dt.data.data);

        setInstituicoes([...new Set(dt.data.data.map((c: any) => c.instituicao?.nome))] as string[]);
        setNiveis([...new Set(dt.data.data.map((c: any) => c.nivel))] as string[]);
        setDuracoes([...new Set(dt.data.data.map((c: any) => c.duracao?.replace("_", " ")))] as string[]);
        setTipounicos([...new Set(dt.data.data.map((c: any) => c.tipo))] as string[]);
        setCategoriapounicos([...new Set(dt.data.data.map((c: any) => c.categoria?.nome))] as string[]);
    }

    useEffect(() => {
        // async function carregarParticipantes() {
        //     const map: Record<number, number> = {}
        //     for (const curso of filteredCursos) {
        //         const participantes = await Curso.getParticipantesByCursoId(curso.id)
        //         map[curso.id] = participantes.length
        //     }
        //     // setParticipantesMap(map)
        // }

        // carregarParticipantes()
    }, [filteredCursos])

    useEffect(() => {
        inicializar();
    }, []);

    // Função para aplicar os filtros
    useEffect(() => {
        const cursosFiltrados = allCursos.filter((curso) => {
            const nomeMatch = curso.nomeBreve?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                curso.titulo?.toLowerCase().includes(searchTerm.toLowerCase());

            const instituicaoMatch = instituicaoSelecionada === "" || curso.instituicao?.nome === instituicaoSelecionada;
            const nivelMatch = nivelSelecionado === "" || curso.nivel === nivelSelecionado;
            const duracaoMatch = duracaoSelecionada === "" || curso.duracao?.replace("_", " ") === duracaoSelecionada;
            const tipoMatch = tipoSelecionado === "" || curso.tipo === tipoSelecionado;
            const categoriaMatch = categoriaSelecionado === "" || curso.categoria.nome === categoriaSelecionado;

            return nomeMatch && instituicaoMatch && nivelMatch && duracaoMatch && tipoMatch && categoriaMatch;
        });

        setFilteredCursos(cursosFiltrados);
    }, [searchTerm, instituicaoSelecionada, nivelSelecionado, duracaoSelecionada, tipoSelecionado, categoriaSelecionado, allCursos]);

    return (
        <div>
            <div className="flex flex-col gap-4">
                <div style={{ backgroundColor: "#0467eb" }} className="bg-white shadow-md rounded-xl w-full py-20 pt-14">
                    {/* Campo de pesquisa */}
                    <h1 className="text-3xl font-bold mb-4 px-5 text-white">O que você quer aprender?</h1>
                    <div className="relative w-full mb-6 px-25">
                        <input
                            type="text"
                            style={{ backgroundColor: "white" }}
                            placeholder="O que você quer aprender?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 px-4 border rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="absolute right-27 top-[74px] md:top-[21px] translate-y-[-50%] bg-blue-500 rounded-full p-2 hover:bg-blue-600 transition-colors">
                            <Search className="h-5 w-5 text-white" />
                        </button>
                    </div>

                    {/* Selects de filtros */}
                    <div className="flex flex-col md:flex-row gap-4 px-17">
                        <select
                            value={instituicaoSelecionada}
                            onChange={(e) => setInstituicaoSelecionada(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Seleciona uma Instituição</option>
                            {instituicoesUnicas.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>

                        <select
                            value={nivelSelecionado}
                            onChange={(e) => setNivelSelecionado(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Seleciona um Nível</option>
                            {niveisUnicos.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>

                        <select
                            value={duracaoSelecionada}
                            onChange={(e) => setDuracaoSelecionada(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Seleciona a Duração</option>
                            {duracoesUnicas.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>

                        <select
                            value={tipoSelecionado}
                            onChange={(e) => setTipoSelecionado(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Seleciona o Tipo</option>
                            {tiposUnicos.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>

                        <select
                            value={categoriaSelecionado}
                            onChange={(e) => setCategoriaSelecionado(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Seleciona a Categoria</option>
                            {categoriasUnicos.map((item, index) => (
                                <option key={index} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Lista de cursos filtrados */}
                <div className="bg-white p-1 rounded-md space-y-1 py-15">
                    <div className="relative">
                        {/* <CardContent
                            showMode={false} // true = inline scroll, false = grid
                            itemsPerPage={8}
                            minCardWidth={350}
                        >
                            {filteredCursos.map((curso, index) => (
                                <Cards
                                    key={index}
                                    curso={curso}
                                    minWidth={350}
                                    cardStyle="style1"
                                    onSubscribe={(curso) => navigate('/curso-preview', { replace: false, state: curso })}
                                />
                            ))}
                        </CardContent> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoards;
