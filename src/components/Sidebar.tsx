
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useTranslationStore } from '../../stores/translation'

const Sidebar = () => {
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
    <div
        ref={animationParent}
        className="sticky inset-y-0 left-0 flex flex-col gap-1 bg-gradient-to-b from-blue-400/60 via-blue-500/60 to-blue-500/80 min-w-60 overflow-y-auto backdrop-blur-md border-blue-100/30 border z-40"
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
  )
}

export default Sidebar