
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useTranslationStore } from '../../stores/translation'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'

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
    <div className="sticky inset-y-0 left-2 min-w-60 z-40 py-2 hidden md:block">
        <div ref={animationParent} className="flex flex-col py-4 px-2 rounded-lg gap-1 bg-gradient-to-b from-slate-300/30 via-gray-400/30 to-slate-600/30 overflow-y-auto h-[calc(100vh-16px)] backdrop-blur-md">
        {allTranslations.map((translation) => (
          <div key={translation.id} className="flex flex-col rounded-md border bg-gray-300/80 px-2 py-1 shadow-md">
            <div className="flex justify-between">
              <p>from: {convertLangCode(translation.from_lang)}</p>
              <p>to: {convertLangCode(translation.to_lang)}</p>
            </div>
            <div className="flex justify-between">
            <p>{translation.translation}</p>
            {currentTranslation?.id === translation.id ? (
              <button
                onClick={() => {
                  setCurrentTranslation(null)
                  translation.audio.pause()
                }}
                className="rounded-full flex w-fit items-center justify-center border shadow p-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
              >
                <PauseIcon className="w-6 h-6 fill-white/90" />
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
                className="rounded-full flex w-fit items-center justify-center border shadow p-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
                >
                <PlayIcon className="w-6 h-6 fill-white/90" />
              </button>
            )}
          </div>
        </div>
        ))}
        </div>
    </div>
  )
}

export default Sidebar