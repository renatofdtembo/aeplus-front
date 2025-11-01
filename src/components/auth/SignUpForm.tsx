import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
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
          <div className="mb-6">
            <h1 className="mb-2 font-bold text-white text-xl">
              Criar Nova Conta
            </h1>
            <p className="text-sm text-gray-300 dark:text-gray-400">
              Preencha seus dados para criar sua conta
            </p>
          </div>
          
          <form>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm text-white dark:text-gray-200">
                    Nome <span className="text-red-400">*</span>
                  </Label>
                  <Input 
                    placeholder="Primeiro nome" 
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                
                <div>
                  <Label className="text-sm text-white dark:text-gray-200">
                    Sobrenome <span className="text-red-400">*</span>
                  </Label>
                  <Input 
                    placeholder="Último nome" 
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-white dark:text-gray-200">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <Label className="text-sm text-white dark:text-gray-200">
                  Senha <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Crie uma senha"
                    type={showPassword ? "text" : "password"}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-3 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-300 dark:fill-gray-400 size-5 hover:fill-white" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-300 dark:fill-gray-400 size-5 hover:fill-white" />
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  className="w-5 h-5 mt-0.5 text-blue-400 border-gray-500 bg-gray-700/50"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="text-xs text-gray-300 dark:text-gray-400 leading-relaxed">
                  Concordo com os <Link to="/terms" className="text-blue-400 hover:text-blue-300">Termos</Link> e <Link to="/privacy" className="text-blue-400 hover:text-blue-300">Política de Privacidade</Link>
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-200 hover:shadow-lg"
                  size="sm"
                >
                  Criar Conta
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Já tem conta?{" "}
              <Link
                to="/signin"
                className="text-blue-400 hover:text-blue-300 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}