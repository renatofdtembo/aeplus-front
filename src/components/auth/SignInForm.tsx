import { useState } from "react";
import { Link } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useAuth } from "../../services/AuthService";
import { ChevronLeftIcon, EyeClosedIcon, EyeIcon } from "lucide-react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fakeUser: any = { id: 1, name: email, email, password, role: 'admin' };
      await login(fakeUser);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md p-3 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-xs text-gray-300 transition-colors hover:text-white dark:text-gray-400 dark:hover:text-gray-300 sm:text-sm"
        >
          <ChevronLeftIcon className="size-4" />
          Voltar para o painel
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto p-3 px-10">
        {/* Container do formulário com fundo cinza escuro transparente */}
        <div className="bg-gray-800/80 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-8 border border-gray-700/30 shadow-2xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 font-bold text-white text-xl sm:text-2xl">
              Município do Mussulo
            </h1>
            <p className="text-sm text-gray-300 dark:text-gray-400">
              Sistema Integrado de Gestão Urbana
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label className="text-sm text-white dark:text-gray-200">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>

            <div>
              <Label className="text-sm text-white dark:text-gray-200">
                Senha <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-300 dark:fill-gray-400 size-5 hover:fill-white" />
                  ) : (
                    <EyeClosedIcon className="fill-gray-300 dark:fill-gray-400 size-5 hover:fill-white" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={isChecked} 
                  onChange={setIsChecked}
                  className="text-blue-400 border-gray-500 bg-gray-700/50"
                />
                <span className="text-sm text-gray-300 dark:text-gray-400">
                  Manter conectado
                </span>
              </div>
              <Link
                to="/reset-password"
                className="text-sm text-blue-400 hover:text-blue-300 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-xl transition-all duration-200 font-medium text-sm ${
                  loading ? "opacity-80 cursor-not-allowed" : "hover:shadow-lg"
                }`}
              >
                {loading && (
                  <svg
                    className="w-5 h-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Não tem uma conta?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}