/* eslint-disable no-constant-binary-expression */
// components/DashboardCursos.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Curso } from "../../../services/classes/Curso";

interface DashboardStats {
  totalCursos: number;
  cursosPublicos: number;
  cursosPrivados: number;
  cursosGratuitos: number;
  cursosPorNivel: Record<string, number>;
}

export default function DashboardCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCursos: 0,
    cursosPublicos: 0,
    cursosPrivados: 0,
    cursosGratuitos: 0,
    cursosPorNivel: {}
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    carregarCursos();
  }, []);

  useEffect(() => {
    calcularEstatisticas();
  }, [cursos]);

  const carregarCursos = async () => {
    try {
      setLoading(true);
      const cursosData = await Curso.publicAllCursos();
      console.log(cursosData.data.data)
      setCursos(cursosData.data.data);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = () => {
    const totalCursos = cursos.length;
    const cursosPublicos = cursos.filter(curso => curso.privacidade === "PUBLICO").length;
    const cursosPrivados = cursos.filter(curso => curso.privacidade === "PRIVADO").length;
    const cursosGratuitos = cursos.filter(curso => curso.gratuito).length;
    
    const cursosPorNivel = cursos.reduce((acc, curso) => {
      acc[curso.nivel] = (acc[curso.nivel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({
      totalCursos,
      cursosPublicos,
      cursosPrivados,
      cursosGratuitos,
      cursosPorNivel
    });
  };

  const cursosFiltrados = cursos?.filter(curso => {
    const matchesFilter = 
      filter === "all" ||
      (filter === "public" && curso.privacidade === "PUBLICO") ||
      (filter === "private" && curso.privacidade === "PRIVADO") ||
      (filter === "free" && curso.gratuito) ||
      (filter === "paid" && !curso.gratuito);

    const matchesSearch = 
      curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.categoria.nome.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getNivelBadgeColor = (nivel: string) => {
    const colors = {
      INICIANTE: "bg-green-100 text-green-800",
      INTERMEDIARIO: "bg-blue-100 text-blue-800",
      AVANCADO: "bg-purple-100 text-purple-800",
      CURSO_PROFISSIONAL: "bg-orange-100 text-orange-800"
    };
    return colors[nivel as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPrivacidadeBadgeColor = (privacidade: string) => {
    return privacidade === "PUBLICO" 
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Cursos</h1>
              <p className="text-gray-600 mt-2">Gerencie e visualize todos os cursos do sistema</p>
            </div>
            <Link
              to="/cursos/novo"
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Curso
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Cursos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCursos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cursos Públicos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cursosPublicos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cursos Privados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cursosPrivados}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cursos Gratuitos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cursosGratuitos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar cursos por título ou categoria..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todos os Cursos</option>
                <option value="public">Públicos</option>
                <option value="private">Privados</option>
                <option value="free">Gratuitos</option>
                <option value="paid">Pagós</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">{cursosFiltrados.length} cursos encontrados</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privacidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cursosFiltrados.map((curso) => (
                  <tr key={curso.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${curso.capa}` || "/assets/aeplus/defaultcourse.png"}
                          alt={curso.titulo}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{curso.titulo}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {curso.descricao.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{curso.categoria.nome}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getNivelBadgeColor(curso.nivel)}`}>
                        {curso.nivel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrivacidadeBadgeColor(curso.privacidade)}`}>
                        {curso.privacidade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${curso.gratuito ? 'text-green-600' : 'text-gray-900'}`}>
                        {curso.gratuito ? 'Grátis' : `R$ ${curso.preco}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        curso.inscricao ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {curso.inscricao ? 'Inscrições Abertas' : 'Inscrições Fechadas'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          Editar
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors">
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cursosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum curso encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar seus filtros ou termos de busca.
              </p>
            </div>
          )}
        </div>

        {/* Level Distribution */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Nível</h3>
            <div className="space-y-4">
              {Object.entries(stats.cursosPorNivel).map(([nivel, quantidade]) => (
                <div key={nivel} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{nivel}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          nivel === "INICIANTE" ? "bg-green-500" :
                          nivel === "INTERMEDIARIO" ? "bg-blue-500" :
                          nivel === "AVANCADO" ? "bg-purple-500" : "bg-orange-500"
                        }`}
                        style={{ width: `${(quantidade / stats.totalCursos) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{quantidade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/cursos/novo"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Criar Novo Curso</p>
                  <p className="text-sm text-gray-600">Adicione um novo curso ao catálogo</p>
                </div>
              </Link>
              
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Exportar Relatório</p>
                  <p className="text-sm text-gray-600">Baixe dados dos cursos em CSV</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}