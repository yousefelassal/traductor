import TypingForm from '../components/TypingForm'
import { useTranslationStore } from '../../stores/translation'
import Sidebar from '../components/Sidebar'

const Home = () => {
  const { currentTranslation } = useTranslationStore()

  return (
    <div className="relative min-h-screen w-screen flex">
      <Sidebar />
      <main className="py-20 flex items-center justify-center w-full">
        {currentTranslation ? (
          <p className="text-2xl">{currentTranslation.translation}</p>
        )
        :
        (
          <p className="text-2xl">Type something to translate</p>
        )}
      </main>
      <TypingForm />
    </div>
  )
}

export default Home