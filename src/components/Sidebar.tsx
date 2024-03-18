
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useTranslationStore } from '../../stores/translation'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { cn } from '../libs/utils'
import ReactCountryFlag from 'react-country-flag'

const Sidebar = () => {
  const [animationParent] = useAutoAnimate()

  const {
    allTranslations,
    currentTranslation,
    currentAudio,
    setCurrentAudio,
    setCurrentTranslation
  } = useTranslationStore()

  const convertLangCode = (code: string) => {
    const lang = new Intl.DisplayNames(['en'], { type: 'language' });
    return lang.of(code)
  }

  const convertLangToFlag = (code: string) => {
    switch (code) {
      case 'en':
        return 'GB'
      case 'es':
        return 'ES'
      case 'fr':
        return 'FR'
      case 'it':
        return 'IT'
      case 'pt':
        return 'PT'
      case 'ru':
        return 'RU'
      case 'ja':
        return 'JP'
      case 'ko':
        return 'KR'
      case 'ar':
        return 'SA'
      case 'de':
        return 'DE'
      default:
        return ''
    }
  }

  return (
    <div className="sticky inset-y-0 left-2 min-w-60 max-w-60 z-40 py-2 hidden md:block">
        <div ref={animationParent} className="flex flex-col py-4 px-2 rounded-lg gap-1 bg-gradient-to-b from-slate-300/30 via-gray-400/30 to-slate-600/30 overflow-y-auto h-[calc(100vh-16px)] backdrop-blur-md">
        {allTranslations.length === 0 && (
          <p className="text-center text-gray-400">No translations yet</p>
        )}
        {allTranslations.map((translation) => (
          <button
            key={translation.id}
            className={cn("flex flex-col gap-1 rounded-xl transition-all px-2 py-1 text-white", 
              currentTranslation?.id === translation.id ? "bg-gradient-to-tr from-purple-400/70 via-violet-400/70 to-purple-300 shadow-md" : "hover:bg-purple-300/60"
            )}
            onClick={() => setCurrentTranslation(translation)}
          >
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-center">
                <ReactCountryFlag countryCode={convertLangToFlag(translation.from_lang)} svg />
                <p className="font-thin text-xs">{convertLangCode(translation.from_lang)}</p>
              </div>
              <div className="flex flex-col items-center">
                <ReactCountryFlag countryCode={convertLangToFlag(translation.to_lang)} svg />
                <p className="font-thin text-xs">{convertLangCode(translation.to_lang)}</p>
              </div>
            </div>
            <div className="flex justify-between w-full">
            <p className="truncate">{translation.translation}</p>
            {currentAudio?.id === translation.audio.id ? (
              <button
                onClick={() => {
                  setCurrentAudio(null)
                  translation.audio.audio.pause()
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
                  setCurrentAudio(translation.audio)
                  translation.audio.audio.currentTime = 0
                  translation.audio.audio.onended = () => setCurrentAudio(null)
                  translation.audio.audio.play()
                }}
                className="rounded-full flex w-fit items-center justify-center border shadow p-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
                >
                <PlayIcon className="w-6 h-6 fill-white/90" />
              </button>
            )}
          </div>
        </button>
        ))}
        </div>
    </div>
  )
}

export default Sidebar