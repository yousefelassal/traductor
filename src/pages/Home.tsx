import { useTranslationStore } from '../../stores/translation'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import TypingForm from '../components/TypingForm'

const Home = () => {
  const [animationParent] = useAutoAnimate()

  const {
    allTranslations,
    currentTranslation,
    setCurrentTranslation
  } = useTranslationStore()

  const convertLangCode = (code: string) => {
    const lang = new Intl.DisplayNames(['en'], { type: 'language' });
    return lang.of(code)
  }

  return (
    <div className="relative min-h-screen container mx-auto py-12 flex flex-col gap-2 items-center">
      <h1 className="text-3xl font-bold">{currentTranslation?.translation} </h1>
      <TypingForm />
      <div
        ref={animationParent}
        className="flex flex-col gap-1 mb-24"
      >
        {allTranslations.map((translation) => (
          <div key={translation.id} className="rounded-md border shadow-md">
            <p>from: {convertLangCode(translation.from_lang)}</p>
            <p>to: {convertLangCode(translation.to_lang)}</p>
            <p>{translation.translation}</p>
            {currentTranslation?.id === translation.id ? (
              <button
                onClick={() => {
                  setCurrentTranslation(null)
                  translation.audio.pause()
                }}
                className="rounded-md border shadow px-2 py-1 bg-black/10 hover:bg-black/20 transition-colors duration-200"
              >
                Stop
              </button>
            )
            : 
            (
              <button
                onClick={() => {
                  setCurrentTranslation(translation)
                  translation.audio.currentTime = 0
                  translation.audio.onended = () => setCurrentTranslation(null)
                  translation.audio.play()
                }}
                className="rounded-md border shadow px-2 py-1 bg-black/10 hover:bg-black/20 transition-colors duration-200"
              >
                Play
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home