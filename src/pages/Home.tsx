import TypingForm from '../components/TypingForm'
import { useTranslationStore } from '../../stores/translation'
import Sidebar from '../components/Sidebar'

const Home = () => {
  const { currentTranslation } = useTranslationStore()

  return (
    <div className="relative min-h-screen w-screen flex">
      <Sidebar />
      <h1 className="text-3xl font-bold">{currentTranslation?.translation} </h1>
      <div className="z-40 md:justify-center fixed bottom-4 left-60 right-4 flex gap-3 flex-wrap justify-stretch">
        <TypingForm />
      </div>
    </div>
  )
}

export default Home