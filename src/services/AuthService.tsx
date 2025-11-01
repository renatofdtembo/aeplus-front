import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback
} from 'react';
import { useNavigate } from 'react-router';
import { MenuItem } from '../layout/AppSidebar';
import { User } from './classes/User';
import { rtalert } from '../hooks/rtalert';
import { apiRequest } from './httpAxios';
import { Funcao } from './classes/Funcao';

// 1. Definimos o tipo exato das permissões
type Permissao = {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  findMenuByUrl: (exactMatch: boolean, path?: string) => Permissao | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  currentMenus: MenuItem[];
  currentfuncao: Funcao | null;
  currentPermicao: Permissao | undefined;
  changePerfil: (id: number) => Promise<void>;
  permissoes: Record<string, Permissao>; // Adicionado para acesso direto
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

let tokenCheckInterval: NodeJS.Timeout;
let originalExpirationTime = 0;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentMenus, setMenus] = useState<MenuItem[]>([]);
  const [currentfuncao, setFuncao] = useState<Funcao | null>(null);
  const [currentPermicao] = useState<Permissao | undefined>(undefined);
  const [permissoes, setPermissoes] = useState<Record<string, Permissao>>({});

  const findMenuByUrl = useCallback((buscaExata: boolean, url: string = ''): Permissao | null => {
    const normalizedPath = url.replace(/^\/|\/$/g, '') || window.location.pathname.replace(/^\/|\/$/g, '');

    if (buscaExata) {
      return permissoes[normalizedPath] || null;
    }

    // Encontra todas as correspondências possíveis
    const matchingPaths = Object.keys(permissoes).filter(path =>
      normalizedPath.startsWith(path + '/') || normalizedPath === path
    );

    if (matchingPaths.length === 0) return null;

    // Pega a correspondência mais específica (mais longa)
    const bestMatch = matchingPaths.reduce((a, b) =>
      a.split('/').length > b.split('/').length ? a : b
    );

    return permissoes[bestMatch];
  }, [permissoes]);

  const changePerfil = useCallback(async (id: number) => {
    try {
      const response = await apiRequest('GET', `/api/me?currentfuncao=${id}`);
      if (response && response.user && response.menus) {
        if (response.menus.length === 0) {
          rtalert.warning('Nenhum menu foi encontrado para este perfil.');
          return;
        }
        setMenus(response.menus);
        setFuncao(response.currentfuncao);
        setPermissoes(response.permissoes || {});
      }
    } catch (error) {
      console.error('Erro ao mudar perfil:', error);
      rtalert.error('Erro ao mudar perfil');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest('POST', '/api/logout');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      sessionStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_exp');
      localStorage.removeItem('auth_current_role');
      setUser(null);
      setMenus([]);
      setFuncao(null);
      setPermissoes({});
      clearInterval(tokenCheckInterval);
      removeActivityListeners();
      navigate('/signin', { replace: true });
    }
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      const result = await apiRequest('POST', '/api/refresh-token');
      if (result?.exp) {
        const newExp = result.exp * 1000;
        localStorage.setItem('auth_exp', String(newExp));
        startTokenTimer(newExp);
        console.log("🔄 Token renovado com sucesso.");
      }
    } catch (err) {
      console.error("Erro ao renovar token", err);
      logout();
    }
  }, [logout]);

  const resetTokenTimer = useCallback(() => {
    if (!originalExpirationTime) return;
    const newExpTime = Date.now() + (originalExpirationTime - Date.now());
    startTokenTimer(newExpTime);
  }, []);

  const setupActivityListeners = useCallback(() => {
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(event =>
      window.addEventListener(event, resetTokenTimer)
    );
  }, [resetTokenTimer]);

  const removeActivityListeners = useCallback(() => {
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(event =>
      window.removeEventListener(event, resetTokenTimer)
    );
  }, [resetTokenTimer]);

  const startTokenTimer = useCallback((expirationTime: number) => {
    if (tokenCheckInterval) clearInterval(tokenCheckInterval);
    originalExpirationTime = expirationTime;

    tokenCheckInterval = setInterval(() => {
      const timeLeft = expirationTime - Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (timeLeft <= fiveMinutes && timeLeft > 0) {
        console.warn('⚠️ Token expirará em breve, tentando renovar...');
        refreshToken();
      }

      if (timeLeft <= 0) {
        console.warn('🔒 Token expirado. Redirecionando para login...');
        logout();
        clearInterval(tokenCheckInterval);
      }
    }, 30000);

    setupActivityListeners();
  }, [refreshToken, logout, setupActivityListeners]);

  const login = useCallback(async (userData: User) => {
    try {
      const result = await User.login({
        email: userData.email,
        password: userData.password
      });
      console.log(result)
      if (result.authorization?.token) {
        sessionStorage.setItem('auth_token', result.authorization.token);
        
        // setMenus(result.menus || []);
        // setPermissoes(result.permissoes || {});
        
        // const newUser = new User(result.user);
        // setUser(newUser);

        // // Carrega a função do funcionário
        // try {
        //   const response = await Funcionario.findByPessoaId(result.user.pessoa.id);
        //   if (response.data?.funcoes?.[0]) {
        //     setFuncao(response.data.funcoes[0]);
        //   }
        // } catch (error) {
        //   console.error('Erro ao carregar função:', error);
        // }

        // if (result.exp) {
        //   const expTime = result.exp * 1000;
        //   localStorage.setItem('auth_exp', String(expTime));
        //   startTokenTimer(expTime);
        // }
        const response = await User.me();
        if (response && response.user) {
          setMenus(response.menus || []);
          setPermissoes(response.permissoes || {});
          
          const newUser = new User(response.user);
          setUser(newUser);

          // Carrega a função do funcionário
          try {
            console.log()
            // const result = await Funcionario.findByPessoaId(response.user.pessoa.id);
            // if (result.data?.funcoes?.[0]) {
            //   setFuncao(result.data.funcoes[0]);
            // }
          } catch (error) {
            console.error('Erro ao carregar função:', error);
          }

          const storedExp = localStorage.getItem('auth_exp');
          if (storedExp) {
            startTokenTimer(Number(storedExp));
          }
        }

        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }, [navigate, startTokenTimer]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await User.me();
        if (response && response.user) {
          setMenus(response.menus || []);
          setPermissoes(response.permissoes || {});
          
          const newUser = new User(response.user);
          setUser(newUser);

          // Carrega a função do funcionário
          // try {
          //   const result = await Funcionario.findByPessoaId(response.user.pessoa.id);
          //   if (result.data?.funcoes?.[0]) {
          //     setFuncao(result.data.funcoes[0]);
          //   }
          // } catch (error) {
          //   console.error('Erro ao carregar função:', error);
          // }

          const storedExp = localStorage.getItem('auth_exp');
          if (storedExp) {
            startTokenTimer(Number(storedExp));
          }
        }
      } catch (err) {
        console.error('Erro ao buscar usuário logado', err);
        logout();
      }
    };

    fetchUser();

    return () => {
      clearInterval(tokenCheckInterval);
      removeActivityListeners();
    };
  }, [logout, startTokenTimer, removeActivityListeners]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        findMenuByUrl,
        login,
        logout,
        currentMenus,
        currentfuncao,
        currentPermicao,
        changePerfil,
        permissoes // expondo as permissões diretamente
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};