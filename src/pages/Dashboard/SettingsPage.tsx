import { Settings, Users, BookOpen, Layers, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SettingsPage() {
  const links = [
    {
      title: "Gerir Usuários",
      description: "Adicione, edite ou remova contas de usuários.",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      path: "/configuracoes/usuarios",
    },
    {
      title: "Gerir Categorias",
      description: "Organize as categorias de cursos e conteúdos.",
      icon: <Layers className="w-6 h-6 text-green-500" />,
      path: "/configuracoes/categorias",
    },
    {
      title: "Gerir Cursos",
      description: "Crie e gerencie cursos disponíveis na plataforma.",
      icon: <BookOpen className="w-6 h-6 text-purple-500" />,
      path: "/configuracoes/cursos",
    },
    {
      title: "Outras Configurações",
      description: "Ajuste preferências e opções avançadas (em breve).",
      icon: <Settings className="w-6 h-6 text-gray-500" />,
      path: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 space-x-3">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.03] overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {link.icon}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {link.title}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {link.description}
                </p>
                {link.path !== "#" && (
                  <Link to={link.path}>
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      Aceder
                    </button>
                  </Link>
                )}
                {link.path === "#" && (
                  <button 
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-400 font-medium bg-gray-50 cursor-not-allowed"
                  >
                    Em breve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sobre as Configurações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Gestão de Conteúdo</h3>
              <p className="text-sm text-gray-600">
                Gerencie usuários, categorias e cursos de forma centralizada. 
                Mantenha sua plataforma organizada e atualizada.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Próximas Atualizações</h3>
              <p className="text-sm text-gray-600">
                Em breve, novas funcionalidades de configuração estarão disponíveis 
                para personalizar ainda mais sua experiência.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}