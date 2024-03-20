import { useEffect } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useTranslationStore } from '../../stores/translation'
import { PauseIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { cn, convertLangToFlag } from '../lib/utils'
import ReactCountryFlag from 'react-country-flag'
import useNavStore from '../../stores/nav'
import { useMediaQuery } from '@uidotdev/usehooks'
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const Sidebar = () => {
  const [animationParent] = useAutoAnimate()
  const isSmallDevice = useMediaQuery('only screen and (max-width: 768px)')
  const { isOpen, toggle } = useNavStore()

  useEffect(() => {
    if (isSmallDevice) {
      if (isOpen) {
        disableBodyScroll(document.body)
      } else {
        enableBodyScroll(document.body)
      }
    }
  }, [isOpen, isSmallDevice])

  const {
    allTranslations,
    currentTranslation,
    setCurrentTranslation,
    currentAudio,
    setCurrentAudio,
    playAudio,
    stopAudio
  } = useTranslationStore()

  return (
    <div className={cn("fixed md:sticky w-full inset-y-0 inset-x-0 md:inset-x-auto md:left-2 min-w-60 md:max-w-60 py-2 px-2 md:px-0 hidden z-50 md:block",
      isOpen ? "block" : "hidden",
    )}>
        <div ref={animationParent} className="flex flex-col py-4 px-2 rounded-lg gap-1 bg-gradient-to-b from-slate-300/30 via-gray-400/30 to-slate-600/30 overflow-y-auto h-[calc(100dvh-16px)] backdrop-blur-md border border-violet-400/30">
        {isSmallDevice && (
          <div className="flex items-center -mt-1 px-2 pb-2">
            <button
              onClick={toggle}
              className="rounded-full flex w-fit items-center justify-center border shadow p-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
            >
              <XMarkIcon className="w-6 h-6 fill-white/90" />
            </button>
          </div>
        )}
        {allTranslations.length === 0 && (
          <div className="flex.flex-col.items-center.justify.center.gap-2">
            <p className="text-center text-gray-400">No translations yet</p>
            <img
              src="https://utfs.io/f/5cd92b88-7e64-4595-9e5b-cf3523e6d86e-whm8p2.png"
              alt="illustration knitted man learning new languages"
            />
          </div>
        )}
        {allTranslations.map((translation) => (
          <div
            key={translation.id}
            className={cn("flex flex-col gap-1 rounded-xl hover:cursor-pointer  transition-all px-2 py-1 text-white", 
              currentTranslation?.id === translation.id ? "bg-gradient-to-tr from-purple-400/70 via-violet-400/70 to-purple-300 shadow-md" : "hover:bg-purple-300/60"
            )}
            onClick={() => {
              setCurrentTranslation(translation)
              isSmallDevice && toggle()
            }}
            aria-label="Select"
          >
            <div className="flex gap-1 w-full">
              <div className="flex flex-col items-center">
                <ReactCountryFlag countryCode={convertLangToFlag(translation.from_lang)} svg />
              </div>
              <div className="flex flex-col items-center">
                <ReactCountryFlag countryCode={convertLangToFlag(translation.to_lang)} svg />
              </div>
            </div>
            <div className="flex gap-1 justify-between w-full">
            <p className="truncate">{translation.translation}</p>
            {currentAudio?.id === translation.audio.id ? (
              <button
                onClick={(e) => {
                  isSmallDevice && e.stopPropagation()
                  stopAudio(translation.audio.audio)
                }}
                className="rounded-full flex w-fit items-center justify-center border shadow p-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
              >
                <PauseIcon className="w-6 h-6 fill-white/90" />
              </button>
            )
            : 
            (
              <button
                onClick={(e) => {
                  isSmallDevice && e.stopPropagation()
                  if (currentAudio) {
                    stopAudio(currentAudio.audio)
                    setCurrentAudio(null)
                  }
                  playAudio(translation)
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