import AuthButton from '@/components/ui/AuthButton';
import AuthRedirect from '@/components/ui/AuthRedirect';
import WalkingCharacter from '@/components/ui/WalkingMiner';
import MaintenanceBlock from '@/components/ui/MaintenanceBlock';
import { getTranslation } from '@/lib/i18n-server';

interface HomeProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function App({ params }: HomeProps) {
  const { lang } = await params;

  return (
    <div className="bg-[#3f3033] min-h-screen">
      {/* Maintenance Header */}
      <div className="bg-yellow-500 text-black py-3 px-4 text-center font-bold text-lg sticky top-0 z-50 shadow-lg">
        🛠️ MAINTENANCE MODE - Site is currently under maintenance. Please check back soon.
      </div>
      <section className="bg-[url('/assets/images/background.png')] bg-cover bg-left h-[80vh] w-full relative">
        <section className="container mx-auto pt-20 md:pt-28 flex flex-col items-center  opacity-0  animate-[fadeIn_0.8s_ease-out_forwards]">
          <h1 className="text-yellow-50 mythic-text-shadow text-5xl md:text-7xl font-bold mb-4 font-ceaser">
            {getTranslation(lang, 'hero.title')}
          </h1>
          <p className="absolute top-0 text-transparent text-xs">
            RAFAEL BIROCHI CERRI CONSULTORIA EM TECNOLOGIA DA INFORMACAO LTDA
          </p>
          <div className="mt-14 md:mt-20">
            <AuthButton />
          </div>
        </section>
        <div className="absolute bottom-[5px] left-0 right-0">
          <WalkingCharacter />
          <div className="bg-[url('/assets/images/ground.png')] bg-left bg-size-[70px] h-[71px] w-full absolute "></div>
        </div>
      </section>
      <MaintenanceBlock />
      <AuthRedirect />
    </div>
  );
}
