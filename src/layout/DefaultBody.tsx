import { ReactNode, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import UserDropdown from "../components/header/UserDropdown";
import { useAuth } from "../services/AuthService";
import { AutoCompleteIA } from "../hooks/AutoCompleteIA";

interface DefaultBodyProps {
    children: ReactNode;
    list: string[];
    showSearch?: boolean;
    showFooter?: boolean;
    fixedHeader?: boolean;
}

const DefaultBody: React.FC<DefaultBodyProps> = ({
    children,
    showSearch = false,
    showFooter = false,
    fixedHeader = false,
    list = [],
}) => {
    const { isAuthenticated } = useAuth();

    // estado para toggle nav mobile
    const [navOpen, setNavOpen] = useState(false);
    // estado para toggle search mobile

    const searchFromBackend = async (query: string): Promise<string[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return list.filter((nome) =>
            nome.toLowerCase().includes(query.toLowerCase())
        );
    };
    const menuLinks = () => (
        <>
            {/* Desktop nav */}
            <nav className="hidden md:block">
                <ul className="flex gap-6 items-center">
                    <li>
                        <Link to="/diplomas" className="text-gray-700 hover:text-blue-600 font-medium">Certificação</Link>
                    </li>
                    <li>
                        <Link to="/cursos" className="text-gray-700 hover:text-blue-600 font-medium">Cursos</Link>
                    </li>
                    {!isAuthenticated && (
                        <>
                            <li>
                                <Link to="/signin" className="text-gray-700 hover:text-blue-600 font-medium">Entrar</Link>
                            </li>
                            <li>
                                <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium text-center">Criar conta</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Mobile nav (exibe apenas quando navOpen=true) */}
            {navOpen && (
                <nav className="block md:hidden absolute top-20 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
                    <ul className="flex flex-col p-4 gap-4">
                        <li>
                            <Link to="/diplomas" className="text-gray-700 hover:text-blue-600 font-medium block" onClick={() => setNavOpen(false)}>Diplomas</Link>
                        </li>
                        <li>
                            <Link to="/cursos" className="text-gray-700 hover:text-blue-600 font-medium block" onClick={() => setNavOpen(false)}>Cursos</Link>
                        </li>
                        {!isAuthenticated && (
                            <>
                                <li>
                                    <Link to="/signin" className="text-gray-700 hover:text-blue-600 font-medium block" onClick={() => setNavOpen(false)}>Entrar</Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium block text-center" onClick={() => setNavOpen(false)}>Criar conta</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            )}
        </>
    );


    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header
                className={`w-full px-4 py-4 flex items-center justify-between border-b bg-white z-50 ${fixedHeader ? "fixed top-0 left-0 right-0 shadow-md" : ""
                    }`}
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex flex-row gap-2 items-center">
                        {/* Ícone sempre visível */}
                        <img
                            src="/assets/defaultcourse.png"
                            alt="logo"
                            className="w-12 h-12 rounded-full"
                        />
                        {/* Texto “Angola educa+” só em md+ */}
                        <Link
                            to="/"
                            className="text-blue-600 font-bold text-2xl hidden md:block whitespace-nowrap"
                        >
                            Angola Educa Mas
                        </Link>
                    </div>


                    <div className="flex items-center gap-4">
                        {/* Search desktop */}
                        {showSearch && (
                            <div className="relative hidden md:block">
                                
                                <AutoCompleteIA searchFunction={searchFromBackend}>
                                    <input
                                        type="text"
                                        placeholder="O que você quer aprender?"
                                        className="w-64 py-2 px-4 border rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                </AutoCompleteIA>

                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 rounded-full p-1 hover:bg-blue-600 transition-colors">
                                    <Search className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        )}

                        {/* Menu mobile (aparece por cima) */}
                        {menuLinks()}


                        {/* UserDropdown sempre visível */}
                        <UserDropdown />

                        {/* Hamburger menu mobile */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setNavOpen((o) => !o)}
                        >
                            {navOpen ? (
                                <X className="h-6 w-6 text-gray-700" />
                            ) : (
                                <Menu className="h-6 w-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Espaço para header fixo */}
            {fixedHeader && <div className="h-20 md:h-16" />}

            {/* Conteúdo */}
            <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

            {/* Footer */}
            <footer className={`bg-white py-${showFooter ? "6" : "0"} border-t`}>
                <div className="container mx-auto px-4">
                    <div style={{ display: showFooter ? "" : "none" }} className="grid grid-cols-2 md:grid-cols-7 gap-3 text-sm text-gray-800">

                        {/* Coluna 1: Logo e texto */}
                        <div className="col-span-2">
                            <h2 className="text-xl font-bold text-blue-600 mb-2">Angola Educa Mas</h2>
                            <p className="text-gray-700">
                                A nossa instituição têm capacitado os alunos de diversas maneiras. Ouça diretamente de nossos alunos sobre como os cursos os impactaram.
                            </p>
                        </div>

                        {/* A Empresa */}
                        <div>
                            <h3 className="font-bold mb-2">A Empresa</h3>
                            <ul className="space-y-1">
                                <li><a href="#" className="hover:underline">Sobre Nós</a></li>
                                <li><a href="#" className="hover:underline">Nossos Cursos</a></li>
                                <li><a href="#" className="hover:underline">Seja um professor</a></li>
                            </ul>
                        </div>

                        {/* Programas */}
                        <div>
                            <h3 className="font-bold mb-2">Programas</h3>
                            <ul className="space-y-1">
                                <li><a href="#" className="hover:underline">Diplomas</a></li>
                                <li><a href="#" className="hover:underline">Cursos Extensivos</a></li>
                                <li><a href="#" className="hover:underline">Pós-graduação</a></li>
                            </ul>
                        </div>

                        {/* Comunidade */}
                        <div>
                            <h3 className="font-bold mb-2">Comunidade</h3>
                            <ul className="space-y-1">
                                <li><a href="#" className="hover:underline">Jovem+</a></li>
                                <li><a href="#" className="hover:underline">Parceiros</a></li>
                                <li><a href="#" className="hover:underline">Blogue e Notícias</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="font-bold mb-2">Legal</h3>
                            <ul className="space-y-1">
                                <li><a href="#" className="hover:underline">Termo de uso</a></li>
                                <li><a href="#" className="hover:underline">Política de privacidade</a></li>
                            </ul>
                        </div>

                        {/* Fale Conosco */}
                        <div>
                            <h3 className="font-bold mb-2">Fale Conosco</h3>
                            <div className="flex gap-3">
                                <a href="#"><img src="/assets/aeplus/linkidin.png" alt="LinkedIn" className="w-5 h-5" /></a>
                                <a href="#"><img src="/assets/aeplus/facebook.png" alt="Facebook" className="w-5 h-5" /></a>
                                <a href="#"><img src="/assets/aeplus/instagram.png" alt="Instagram" className="w-5 h-5" /></a>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className={`mt-${showFooter ? "5" : "3"} mb-${showFooter ? "5" : "3"} text-center text-sm text-gray-500`}>
                        Copyright © 2025 Angola Educa Mas
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DefaultBody;
