import TypingForm from '../components/TypingForm'
import { useTranslationStore } from '../../stores/translation'
import Sidebar from '../components/Sidebar'
import { BackgroundGradientAnimation } from '../components/ui/background-gradient'

const Home = () => {
  const { currentTranslation } = useTranslationStore()

  return (
    <BackgroundGradientAnimation>
      <div className="relative min-h-screen w-screen flex">
        <Sidebar />
        <main className="py-20 flex items-center justify-center w-full font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl">
          {currentTranslation ? (
            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
              {currentTranslation.translation}
            </p>
          )
          :
          (
            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
              Type something to translate
            </p>
          )}
        </main>
        <TypingForm />
      </div>
    </BackgroundGradientAnimation>
  )
}

export default Home