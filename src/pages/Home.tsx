import TypingForm from '../components/TypingForm'
import { useTranslationStore } from '../../stores/translation'
import Sidebar from '../components/Sidebar'

const Home = () => {
  const { currentTranslation } = useTranslationStore()

  return (
    <div className="relative min-h-screen w-screen flex">
      <Sidebar />
      <h1 className="text-3xl font-bold">{currentTranslation?.translation} </h1>
      <TypingForm />
    </div>
  )
}

export default Home