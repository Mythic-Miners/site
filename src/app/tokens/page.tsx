export default async function TokensPage() {
  // const [isEntered, setIsEntered] = useState(false);
  const isEntered = true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950/80 to-gray-900/80 p-8">
      <button className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Voltar
      </button>

      {!isEntered ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl font-bold text-cyan-500 mb-12 mythic-text-shadow">
            Acompanhe os seus tokens
          </h1>
          <button className="bg-gradient-to-r from-cyan-500 to-amber-500 text-black font-bold py-4 px-12 rounded-lg text-xl hover:from-cyan-600 hover:to-amber-600 transition-all transform hover:scale-105 border-2 border-neutral-950">
            Entrar
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-cyan-500 mb-8 mythic-text-shadow">
            Seus Tokens
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Tokens */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                Total de Tokens
              </h3>
              <p className="text-3xl font-bold text-cyan-400">1,234.56 $AMZ</p>
            </div>

            {/* Claimable Tokens */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                Tokens para Claim
              </h3>
              <p className="text-3xl font-bold text-emerald-400">123.45 $AMZ</p>
              <button className="mt-4 bg-emerald-500 text-black font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors border-2 border-neutral-950">
                Fazer Claim
              </button>
            </div>

            {/* Last Claim */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                Último Claim
              </h3>
              <p className="text-2xl font-bold text-amber-400">15/03/2024</p>
              <p className="text-gray-400 mt-2">123.45 $AMZ</p>
            </div>

            {/* APR Earnings */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950">
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                Ganhos com APR
              </h3>
              <p className="text-3xl font-bold text-amber-400">45.67 $AMZ</p>
              <p className="text-gray-400 mt-2">APR Atual: 10%</p>
            </div>

            {/* Vesting Progress */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-neutral-950 md:col-span-2">
              <h3 className="text-xl font-bold text-gray-300 mb-4">
                Progresso do Vesting
              </h3>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-amber-500 h-4 rounded-full"
                  style={{ width: '65%' }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>0%</span>
                <span>65%</span>
                <span>100%</span>
              </div>
              <p className="text-gray-300 mt-4">
                Próximo desbloqueio: 15/04/2024
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
