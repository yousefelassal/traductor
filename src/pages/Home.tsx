import TypingForm from '../components/TypingForm'
import { useTranslationStore } from '../../stores/translation'
import Sidebar from '../components/Sidebar'
import { BackgroundGradientAnimation } from '../components/ui/background-gradient'
import { convertLangToFlag, convertLangCode } from '../lib/utils'
import ReactCountryFlag from 'react-country-flag'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { TextGenerateEffect } from '../components/ui/text-generate-effect'
import { cn } from '../lib/utils'

const Home = () => {
  const {
    currentTranslation,
    loading,
    currentAudio,
    setCurrentAudio,
    playAudio,
    stopAudio,
    isPronouncing
  } = useTranslationStore()

  return (
    <BackgroundGradientAnimation>
      <div className="relative min-h-[100dvh] w-screen flex">
        <Sidebar />
        <main className="py-20 flex text-white items-center justify-center w-full font-bold px-4 text-3xl text-center md:text-4xl">
          {currentTranslation ? (
            loading ? 
            <div className="flex flex-col items-center justify-center gap-2">
              <img
                src="https://utfs.io/f/48e43dfb-9f94-404f-a052-726b7df9637c-tmua4d.png"
                alt="translate illustration"
                className="animate-spin w-16 h-16"
              />
            </div>
            : 
              <div className="flex flex-col justify-between w-full h-full">
                <div className="flex justify-between text-base">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                        {convertLangCode(currentTranslation.from_lang)}
                      </p>
                      <ReactCountryFlag
                        countryCode={convertLangToFlag(currentTranslation.from_lang)}
                        className="text-4xl"
                        svg 
                      />
                      <p className="bg-clip-text font-thin text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                        From
                      </p>
                    </div>
                    <p className="bg-clip-text text-xl text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                      {currentTranslation.text}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                      {convertLangCode(currentTranslation.to_lang)}
                    </p>
                    <ReactCountryFlag
                      countryCode={convertLangToFlag(currentTranslation.to_lang)}
                      className="text-4xl"
                      svg 
                    />
                    <p className="bg-clip-text font-thin text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                      To
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-6 flex-1 items-center justify-center">
                  {isPronouncing ? (
                    <TextGenerateEffect words={currentTranslation.translation} />
                  ) : (
                    <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                      {currentTranslation.translation}
                    </p>
                  )}
                  {currentAudio?.id === currentTranslation.audio.id ? (
                    <button
                      onClick={() => stopAudio(currentAudio.audio)}
                      className="rounded-full z-10 font-medium text-lg px-4 py-1 gap-2 flex w-fit items-center justify-center border border-violet-400/30 shadow p-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
                    >
                      Stop
                      <PauseIcon className="w-6 h-6 fill-white/90" />
                    </button>
                  )
                  : 
                  (
                    <button
                      onClick={() => {
                        if (currentAudio) {
                          stopAudio(currentAudio.audio)
                          setCurrentAudio(null)
                        }
                        playAudio(currentTranslation)
                      }}
                      className="rounded-full text-lg font-medium z-10 flex gap-2 w-fit items-center justify-center border border-violet-400/30 shadow px-4 py-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
                    >
                      Play
                      <PlayIcon className="w-6 h-6 fill-white/90" />
                    </button>
                  )}
                </div>
              </div>
          )
          :
          (
            <div className="flex flex-col items-center justify-center gap-2">
              <img
                src="https://utfs.io/f/48e43dfb-9f94-404f-a052-726b7df9637c-tmua4d.png"
                alt="translate illustration"
                className={cn("w-16 h-16", 
                  loading && "animate-spin"
                )}
              />
              <p className="bg-clip-text text-2xl text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                  {loading ? '' : 'Type something to translate'}
              </p>
            </div>
          )}
        </main>
        <TypingForm />
      </div>
    </BackgroundGradientAnimation>
  )
}

export default Home