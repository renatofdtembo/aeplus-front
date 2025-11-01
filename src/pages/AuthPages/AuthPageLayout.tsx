import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white dark:bg-gray-900 sm:p-0 min-h-screen">
      {/* Background Image com Overlay preto claro */}
      <div className="fixed inset-0 z-0">
        {/* Imagem de fundo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${import.meta.env.VITE_IMAGE_BASE_PATH || ''}/design-em-fundo-escuro-vetor.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        {/* Overlay preto claro com transparência */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      </div>

      <div className="relative flex flex-col justify-center w-full min-h-screen lg:flex-row z-10">

        {children}

        <div className="items-center hidden w-full h-full lg:w-1/2 lg:grid relative">
          <div className="absolute top-4 lg:bottom-6 left-0 right-0 flex justify-center">
            <div className="text-center transform hover:scale-102 transition-transform duration-200">
              <div className="bg-white-800 dark:bg-gray-800 rounded-md">
                <p className="font-extrabold text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 drop-shadow-md">
                  {/* Município do Mussulo */}
                </p>
                <p className="font-medium text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {/* Sistema Integrado de Gestão Urbana */}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}