import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { AutoCompleteIA } from "../../../hooks/AutoCompleteIA";
import Body from "../../../layout/Body";
import { useAuth } from "../../../services/AuthService";
import { CategoriaDto, Categoria } from "../../../services/classes/Categoria";
import { Curso } from "../../../services/classes/Curso";


export interface CursoCardItem {
  curso?: Curso;
  nota?: number;
  id?: string;
  titulo?: string;
  categoria?: {
    nome?: string;
  };
  instituicao?: {
    id?: string;
  };
}

const MeusCursos: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [objects, setObjects] = useState<CursoCardItem[]>([]);
  const [filteredObjects, setFilteredObjects] = useState<CursoCardItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [ordenacao, setOrdenacao] = useState<string>("nome");
  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    inicializar();
  }, []);

  async function inicializar() {
    try {
      console.log("Iniciando carregamento de cursos...", screenWidth);
      setLoading(true);
      setError(null);
      await carregarCursosOuInscricoes();
      const categorias = await Categoria.allCategorias();
      setCategorias(categorias);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Falha ao carregar cursos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  async function carregarCursosOuInscricoes() {
    if (!isAuthenticated) {
      logout();
      navigate("/login");
      return;
    }

    // try {
    //   // Admin vê todos os cursos sem filtro
    //   if (userRoles.isAdmin) {
    //     const cursos = await Curso.allCursos();
    //     setObjects(cursos);
    //     setFilteredObjects(cursos);
    //     return;
    //   }

    //   // Instituição vê apenas seus cursos
    //   if (userRoles.isInstituicao && user?.id) {
    //     const cursos = await Curso.allCursos();
    //     const cursosDaInstituicao = cursos.filter(c => c.instituicao?.id === user.id);
    //     setObjects(cursosDaInstituicao);
    //     setFilteredObjects(cursosDaInstituicao);
    //     return;
    //   }

    //   // Estudantes e professores veem suas inscrições
    //   if (userRoles.isAlunoOuProfessor && user?.id) {
    //     const inscricoes = await Insricao.getByStudentId(user.id);
    //     setObjects(inscricoes);
    //     setFilteredObjects(inscricoes);
    //   }
    // } catch (err) {
    //   throw err;
    // }
  }

  useEffect(() => {
    if (loading) return;

    let filtrados = [...objects];

    if (searchTerm) {
      filtrados = filtrados.filter((item) => {
        const curso = getCursoFromItem(item);
        return (
          curso?.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          curso?.categoria?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredObjects(ordenarObjects(filtrados));
  }, [searchTerm, objects, ordenacao, loading]);

  function getCursoFromItem(item: CursoCardItem): Curso | undefined {
    // if (userRoles.isAdmin || userRoles.isInstituicao) {
    //   return item as Curso;
    // }
    return item.curso;
  }

  function ordenarObjects(objs: CursoCardItem[]): CursoCardItem[] {
    const sorted = [...objs];
    
    if (ordenacao === "nome") {
      sorted.sort((a, b) => {
        const cursoA = getCursoFromItem(a);
        const cursoB = getCursoFromItem(b);
        return (cursoA?.titulo || "").localeCompare(cursoB?.titulo || "");
      });
    }

    return sorted;
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrdenacao(e.target.value);
  };

  const handleShowAll = () => {
    setSearchTerm("");
    setFilteredObjects(objects);
  };

  const searchFromBackend = async (query: string): Promise<string[]> => {
    setSearchTerm(query);
    await new Promise((resolve) => setTimeout(resolve, 300));

    return categorias
      .map((c) => c.categoria.nome)
      .filter(
        (nome): nome is string =>
          nome !== undefined &&
          nome.toLowerCase().includes(query.toLowerCase())
      );
  };

  function renderCursoCard(item: CursoCardItem) {
    const curso = getCursoFromItem(item);
    // const nota = (item as Insricao).nota;

    if (!curso) return null;

    return (
    //   <Cards
    //     curso={curso}
    //     cardStyle="style1"
    //     progress={nota}
    //     minWidth="300px"
    //     onSubscribe={() =>
    //       navigate(`/dashboard/meus-cursos/${curso.id}`, {
    //         replace: false,
    //         state: curso,
    //       })
    //     }
    //   />
        <>
        
        </>
    );
  }

  if (loading) {
    return (
      <Body>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Body>
    );
  }

  if (error) {
    return (
      <Body>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </Body>
    );
  }

  return (
    <div className="p-4 w-full bg-white">
      <PageMeta
        title="Meus Cursos | Dashboard"
        description="Dashboard de cursos com funcionalidades de busca, ordenação e exibição de todos os cursos."
      />
      <PageBreadcrumb pageTitle="Meus Cursos" />
      <Body>
        {/* {userRoles.isAdmin && (
          <div className="bg-blue-100 text-blue-800 p-2 rounded mb-4 text-sm">
            Modo Administrador: Visualizando todos os cursos do sistema
          </div>
        )} */}

        <div className="flex flex-col gap-4 p-4 w-full bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
            <div className="w-full sm:w-auto">
              <button
                onClick={handleShowAll}
                className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              >
                <span className="text-lg">⚙️</span>
                <span>Todos</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11M3 6h16M3 14h7M3 18h13" />
              </svg>
              <div className="relative">
                <select
                  onChange={handleSortChange}
                  className="w-full sm:w-auto px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={ordenacao}
                >
                  <option value="nome">Ordenar por nome do curso</option>
                  <option value="cartao">Cartão</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-md">
              <AutoCompleteIA searchFunction={searchFromBackend}>
                <input
                  type="text"
                  placeholder="Buscar cursos"
                  className="w-full py-2 px-4 border rounded-full pr-10 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </AutoCompleteIA>
            </div>
          </div>
        </div>

        <div className="relative">
          {filteredObjects.length > 0 ? (
            // <CardContent
            //   showMode={false} // true = inline scroll, false = grid
            //   itemsPerPage={8}
            //   minCardWidth={300}
            // >
            //   {filteredObjects.map((item, index) => (
            //     <div key={index}>
            //       {renderCursoCard(item)}
            //     </div>
            //   ))}
            // </CardContent>
            <></>
          ) : (
            <div className="flex items-center justify-center py-10">
              <h1 className="text-gray-500 text-lg text-center">
                Nenhum curso encontrado,{" "}
                <Link to="/dashboard" className="text-blue-600 hover:underline">
                  Clique aqui
                </Link>{" "}
                para inscrever-se em cursos <span className="text-green-500">gratuitos</span>.
              </h1>
            </div>
          )}
        </div>
      </Body>
    </div>
  );
};

export default MeusCursos;