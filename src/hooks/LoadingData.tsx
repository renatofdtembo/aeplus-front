const LoadingData = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-gradient-x">
            <div className="text-center relative z-10">
                <div className="inline-flex relative mb-6">
                    {/* Anel externo pulsante */}
                    <div className="w-24 h-24 bg-white/10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-150 pulse-slow"></div>
                    
                    {/* Orbita de partículas */}
                    <div className="absolute top-0 left-0 w-full h-full animate-spin-slow">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full absolute"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${i * 45}deg) translate(40px) rotate(-${i * 45}deg)`
                                }}
                            ></div>
                        ))}
                    </div>
                    
                    {/* Esfera central */}
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full relative z-10 shadow-2xl shadow-purple-500/50"></div>
                    
                    {/* Brilho interno */}
                    <div className="w-10 h-10 bg-white/30 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-md"></div>
                    
                    {/* Destaques de brilho */}
                    <div className="w-5 h-5 bg-white rounded-full absolute top-4 left-4 opacity-70"></div>
                </div>
                
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-3">
                    Carregando Conteúdo
                </h2>
                <p className="text-lg text-white/80 mb-6">Aguarde enquanto preparamos tudo para você</p>
                
                {/* Barra de progresso sutil */}
                <div className="w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full w-1/2 animate-progress"></div>
                </div>
            </div>
            
            {/* Partículas de fundo */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default LoadingData;