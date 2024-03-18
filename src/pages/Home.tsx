import TypingForm from '../components/TypingForm'
import { useTranslationStore } from '../../stores/translation'
import Sidebar from '../components/Sidebar'
import { BackgroundGradientAnimation } from '../components/ui/background-gradient'

const Home = () => {
  const { currentTranslation, loading } = useTranslationStore()

  return (
    <BackgroundGradientAnimation>
      <div className="relative min-h-screen w-screen flex">
        <Sidebar />
        <main className="py-20 flex text-white items-center justify-center w-full font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl">
          {currentTranslation ? (
            loading ? 
              <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                  Translating...
              </p>
            : 
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-base">
                  <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                    {currentTranslation.from_lang}
                  </p>
                  <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                    {currentTranslation.to_lang}
                  </p>
                </div>
                <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                  {currentTranslation.translation}
                </p>
              </div>
          )
          :
          (
            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
              {loading ? 'Translating...' : 'Type something to translate'}
            </p>
          )}
        </main>
        <TypingForm />
      </div>
    </BackgroundGradientAnimation>
  )
}

export default Home