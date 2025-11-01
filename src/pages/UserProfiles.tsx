import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { User } from "../services/classes/User";
import { useAuth } from "../services/AuthService";
import { Funcao } from "../services/classes/Funcao";
import { formatarAngolano } from "../services/Util";
import { FaEye } from 'react-icons/fa';

export default function UserProfiles() {
  const { id } = useParams();
  const { isAuthenticated, currentfuncao, user, changePerfil } = useAuth();
  const [profile, setProfile] = useState<User>(new User());
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function Inicializar() {
      if (!isAuthenticated) return;
      try {
        const [userData, funcoes] = await Promise.all([
          User.findId(Number(id)),
          User.funcoesId(Number(id))
        ]);
        setProfile(userData);
        setFuncoes(funcoes)
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    Inicializar();
  }, [isAuthenticated, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
            Profile not found
          </h3>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-AO', options);
  };

  return (
    <>
      <PageMeta
        title={`${profile.pessoa?.nome} | Profile`}
        description={`Profile page for ${profile.pessoa?.nome}`}
      />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Profile Picture and Basic Info */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${profile.pessoa?.urlImg}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                  />
                  <div className="absolute bottom-0 right-2 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 text-center">
                  {profile.pessoa?.nome}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {profile.pessoa?.tipo}
                </p>

                <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">Informações de Contacto</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">{profile.email}</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">{profile.pessoa?.contacto}</span>
                    </li>
                  </ul>
                </div>

                {/* Funções Section */}
                <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">Funções</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Função
                          </th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Departamento
                          </th>
                          {user && user.id == profile.id &&
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Ações
                            </th>
                          }
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {funcoes?.map((f: Funcao, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white/90">
                              {f.nome}
                              <p className="text-xs text-gray-500 dark:text-gray-400">{f.nivel}</p>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                              {f.departamento.nome}
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatarAngolano(f.salario_base)}</p>
                            </td>
                            {user && user.id == profile.id &&
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
                                <button
                                  disabled={currentfuncao == f.id}
                                  onClick={() => changePerfil(f.id)}
                                  className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                  title={currentfuncao == f.id ? "Perfil atual" : "Mudar de perfil"}
                                >
                                  <FaEye color={currentfuncao == f.id ? '#6ac7d1ff' : '#cd5dafff'} size={20} />
                                </button>
                              </td>
                            }
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {(!funcoes || funcoes.length === 0) ? (
                      <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                        Nenhuma função atribuída
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Salário Total:
                        </span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatarAngolano(funcoes.reduce((total, f) => total + Number(f.salario_base), 0))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h4 className="font-medium text-gray-800 dark:text-white/90 mb-4">Personal Details</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.genero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{formatDate(profile.pessoa?.nascimento)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Marital Status</p>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.estadocivil}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">NIF</p>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.nif || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Employee Type</p>
                  <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.tipo}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-800 dark:text-white/90 mb-4">Location Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
                    <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.endereco.rua.bairro.comuna.municipio.provincia.pais.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Province</p>
                    <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.endereco.rua.bairro.comuna.municipio.provincia.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Municipality</p>
                    <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.endereco.rua.bairro.comuna.municipio.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Neighborhood</p>
                    <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.endereco.rua.bairro.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Street</p>
                    <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.endereco.rua.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Place of Birth</p>
                    <p className="text-gray-800 dark:text-white/90 font-medium">{profile.pessoa?.naturalidade.nome}, {profile.pessoa?.naturalidade.provincia.nome}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h4 className="font-medium text-gray-800 dark:text-white/90 mb-4">Account Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
                    <p className="text-gray-800 dark:text-white/90 font-medium">{formatDate(profile.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="text-gray-800 dark:text-white/90 font-medium">{formatDate(profile.updated_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className={`font-medium ${profile.status == 'online' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {profile.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}