import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthService";
import { Curso } from "../../services/classes/Curso";
import DefaultBody from "../../layout/DefaultBody";

// Componente Card para mostrar cursos
const CourseCard = ({ curso, onSubscribe }: { curso: Curso, onSubscribe: (curso: Curso) => void }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <img 
        src={`${import.meta.env.VITE_API_URL}/${curso.capa}`}
        alt={curso.titulo}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            curso.nivel === 'INICIANTE' ? 'bg-green-100 text-green-800' :
            curso.nivel === 'INTERMEDIARIO' ? 'bg-blue-100 text-blue-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {curso.nivel}
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            curso.privacidade === 'PUBLICO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {curso.privacidade}
          </span>
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{curso.titulo}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{curso.descricao}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">{curso.categoria.nome}</span>
          <span className={`text-lg font-bold ${
            curso.gratuito ? 'text-green-600' : 'text-gray-900'
          }`}>
            {curso.gratuito ? 'Grátis' : `R$ ${curso.preco}`}
          </span>
        </div>
        
        <button
          onClick={() => onSubscribe(curso)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ver Curso
        </button>
      </div>
    </div>
  );
};

// Componente Grid responsivo
const ResponsiveGrid = ({ 
  children, 
  minCardWidth = "350px", 
  gap = "gap-6",
  perPage = 8 
}: { 
  children: React.ReactNode;
  minCardWidth?: string;
  gap?: string;
  perPage?: number;
}) => {
  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gap}`}
      style={{ 
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}, 1fr))` 
      }}
    >
      {children}
    </div>
  );
};

const categorias = [
  "Todos",
  "Programação",
  "Design", 
  "Data Science",
  "Marketing Digital",
  "Gestão",
  "Idiomas",
  "Tecnologia",
  "Fotografia",
  "Produtividade"
];

export default function WelcomeManager() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cousCategories, setCoursCategories] = useState<Curso[]>([]);
  const [coursSuperior, setCoursSuperior] = useState<Curso[]>([]);
  const [coursIntermediario, setCoursIntermediario] = useState<Curso[]>([]);
  const [allCursos, setCursos] = useState<Curso[]>([]);

  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  async function inicializar() {
    try {
      const dt = await Curso.publicAllCursos();
      console.log('Dados recebidos:', dt);
      
      if (dt.data && dt.data.data) {
        setCursos(dt.data.data);
        setCoursCategories(dt.data.data);
        setCoursIntermediario(dt.data.data.filter((c: Curso) => c.nivel === "INTERMEDIARIO"));
        setCoursSuperior(dt.data.data.filter((c: Curso) => c.nivel === "AVANCADO" || c.nivel === "CURSO_PROFISSIONAL"));
      } else {
        console.error('Estrutura de dados inesperada:', dt);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  }

  useEffect(() => {
    inicializar();
  }, []);

  const handleCategoriaClick = async (categoria: string) => {
    setCategoriaAtiva(categoria);

    if (categoria === "Todos") {
      setCoursCategories(allCursos);
    } else {
      setCoursCategories(
        allCursos.filter((curso: Curso) => 
          curso.categoria && curso.categoria.nome === categoria
        )
      );
    }
  };

  const handleSubscribe = (curso: Curso) => {
    navigate('/curso-preview', { replace: false, state: curso });
  };

  // Atualizar categorias dinamicamente baseado nos cursos
  const categoriasDisponiveis = ["Todos", ...new Set(allCursos
    .filter(curso => curso.categoria && curso.categoria.nome)
    .map(curso => curso.categoria.nome)
  )];

  return (
    <DefaultBody showFooter={true} showSearch={true} fixedHeader={true} list={[]}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Maneira mais rápida para <span className="text-blue-600">acelerar</span> o seu crescimento
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Descubra milhares de cursos gratuitos das melhores universidades e empresas do mundo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                style={{ display: isAuthenticated ? "none" : "" }}
                to="/inscricao"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center shadow-md hover:shadow-lg"
              >
                Inscreva-se grátis
              </Link>
              <Link
                to="/aprender"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center shadow-sm hover:shadow-md"
              >
                Aprender agora
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={`${import.meta.env.VITE_IMAGE_BASE_PATH}/students.png`}
              alt="Estudante com laptop"
              width={600}
              height={500}
              className="w-full max-w-lg h-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por que escolher a AE+?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma experiência de aprendizagem completa com recursos que impulsionam sua carreira
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100 hover:border-blue-100">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-full p-5 mb-6 shadow-md">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4L3 7V20L12 17L21 20V7L12 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M12 4V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Cursos Gratuitos das Melhores Universidades</h3>
              <p className="text-gray-600 leading-relaxed">Aprenda com professores das melhores universidades e empresas do mundo</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100 hover:border-blue-100">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-full p-5 mb-6 shadow-md">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 8V12L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Aprendizagem Individualizada</h3>
              <p className="text-gray-600 leading-relaxed">Aprenda no seu ritmo e em qualquer lugar, com suporte personalizado</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100 hover:border-blue-100">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-full p-5 mb-6 shadow-md">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15L8 11H16L12 15Z" fill="currentColor" />
                  <rect x="4" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Ganhe um Certificado</h3>
              <p className="text-gray-600 leading-relaxed">Obtenha certificados reconhecidos das melhores universidades</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100 hover:border-blue-100">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-full p-5 mb-6 shadow-md">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 3L20 7V17L12 21L4 17V7L12 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12L20 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12L4 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Créditos Universitários</h3>
              <p className="text-gray-600 leading-relaxed">Ganhe créditos universitários e transfira para o seu diploma</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore alguns cursos</h2>
              <p className="text-gray-600">Descubra cursos em diversas áreas do conhecimento</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-4 mb-10 pb-2 overflow-x-auto">
            {categoriasDisponiveis.map((categoria) => (
              <button
                key={categoria}
                onClick={() => handleCategoriaClick(categoria)}
                className={`font-medium px-5 py-3 rounded-full transition-all duration-200 whitespace-nowrap ${
                  categoriaAtiva === categoria
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>

          {/* Lista de cursos filtrados */}
          <div className="relative">
            <ResponsiveGrid minCardWidth="350px" gap="gap-6">
              {cousCategories.map((item, index) => (
                <CourseCard
                  key={item.id || index}
                  curso={item}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </ResponsiveGrid>
            
            {cousCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum curso encontrado para esta categoria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cursos Superiores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cursos de Nível Superior</h2>
            <div className="w-20 h-1 bg-blue-600 mb-4"></div>
            <p className="text-lg text-gray-600 max-w-3xl">
              Cursos voltados para formação acadêmica completa, com base teórica sólida e foco em competências técnicas e científicas.
              Indicados para quem busca qualificação profissional reconhecida, com diploma de graduação ou tecnólogo.
            </p>
          </div>

          <div className="relative">
            <ResponsiveGrid minCardWidth="350px" gap="gap-6">
              {coursSuperior.map((item, index) => (
                <CourseCard
                  key={item.id || index}
                  curso={item}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </ResponsiveGrid>
            
            {coursSuperior.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-500">Em breve novos cursos de nível superior.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cursos Intermediários */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cursos de Nível Intermediário</h2>
            <div className="w-20 h-1 bg-blue-600 mb-4"></div>
            <p className="text-lg text-gray-600 max-w-3xl">
              Cursos ideais para quem já possui conhecimentos básicos e deseja aprofundar ou expandir suas habilidades em áreas específicas.
              Perfeitos para aprimoramento profissional, transição de carreira ou atualização de conhecimentos.
            </p>
          </div>

          <div className="relative">
            <ResponsiveGrid minCardWidth="350px" gap="gap-6">
              {coursIntermediario.map((item, index) => (
                <CourseCard
                  key={item.id || index}
                  curso={item}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </ResponsiveGrid>
            
            {coursIntermediario.length === 0 && (
              <div className="text-center py-8 bg-white rounded-xl">
                <p className="text-gray-500">Em breve novos cursos de nível intermediário.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: Introduction Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-xl lg:w-2/5 w-full shrink-0 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ouça nossos alunos</h2>
              <p className="text-blue-100 leading-relaxed">
                Os cursos AE+ têm capacitado os alunos de diversas maneiras.
                Ouça diretamente de nossos alunos sobre como os cursos os impactaram positivamente em suas carreiras e vidas.
              </p>
              <div className="mt-6 flex items-center">
                <div className="bg-blue-500 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium">+5.000 alunos satisfeitos</span>
              </div>
            </div>

            {/* Right: Scrollable Testimonials */}
            <div className="w-full overflow-x-auto pb-6">
              <div className="flex gap-6 min-w-max">
                {/* Aluno 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-lg w-80 shrink-0 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_BASE_PATH}/aluno1.png`} 
                      alt="Ana Lima" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" 
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Ana Lima</h4>
                      <p className="text-sm text-blue-600">Design Gráfico</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    "O curso de Power BI me deu a confiança que eu precisava para aplicar em vagas que antes pareciam distantes."
                  </p>
                </div>

                {/* Aluno 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-lg w-80 shrink-0 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_BASE_PATH}/aluno2.png`} 
                      alt="Bruno Silva" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" 
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Bruno Silva</h4>
                      <p className="text-sm text-blue-600">Desenvolvimento Web</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    "Aprendi JavaScript de uma forma clara e prática. Hoje desenvolvo meus próprios projetos!"
                  </p>
                </div>

                {/* Aluno 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-lg w-80 shrink-0 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_BASE_PATH}/people.jpg`} 
                      alt="Carla Mendes" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" 
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Carla Mendes</h4>
                      <p className="text-sm text-blue-600">Transição de Carreira</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    "Com os cursos gratuitos, consegui migrar de carreira para a área de tecnologia em apenas 6 meses."
                  </p>
                </div>

                {/* Aluno 4 */}
                <div className="bg-white p-6 rounded-2xl shadow-lg w-80 shrink-0 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_BASE_PATH}/Rectangle 52.png`} 
                      alt="Diego Rocha" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" 
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Diego Rocha</h4>
                      <p className="text-sm text-blue-600">Gestão de Projetos</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    "As aulas são objetivas e aplicáveis. Recomendo muito para quem quer evoluir rápido na carreira."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultBody>
  );
}