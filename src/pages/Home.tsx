import TypingForm from '../components/TypingForm'
import { useTranslationStore } from '../../stores/translation'
import Sidebar from '../components/Sidebar'
import { BackgroundGradientAnimation } from '../components/ui/background-gradient'
import { convertLangToFlag, convertLangCode } from '../libs/utils'
import ReactCountryFlag from 'react-country-flag'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'

const Home = () => {
  const {
    currentTranslation,
    loading,
    setCurrentAudio,
    currentAudio
  } = useTranslationStore()

  return (
    <BackgroundGradientAnimation>
      <div className="relative min-h-screen w-screen flex">
        <Sidebar />
        <main className="py-20 flex text-white items-center justify-center w-full font-bold px-4 text-3xl text-center md:text-4xl">
          {currentTranslation ? (
            loading ? 
              <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                  Translating...
              </p>
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
                  <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                    {currentTranslation.translation}
                  </p>
                  {currentAudio?.id === currentTranslation.audio.id ? (
                    <button
                      onClick={() => {
                        setCurrentAudio(null)
                        currentTranslation.audio.audio.stop()
                      }}
                      className="rounded-full z-10 touch-manipulation font-medium text-lg px-4 py-1 gap-2 flex w-fit items-center justify-center border border-violet-400/30 shadow p-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
                    >
                      Stop
                      <PauseIcon className="w-6 h-6 fill-white/90" />
                    </button>
                  )
                  : 
                  (
                    <button
                      onClick={() => {
                        setCurrentAudio(currentTranslation.audio)
                        currentTranslation.audio.audio.on('end', () => setCurrentAudio(null))
                        currentTranslation.audio.audio.play()
                      }}
                      className="rounded-full touch-manipulation text-lg font-medium z-10 flex gap-2 w-fit items-center justify-center border border-violet-400/30 shadow px-4 py-1 bg-white/50 hover:bg-white/60 transition-colors duration-200"
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
            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
              {loading ? 'Translating...' : 'Type something to translate'}
            </p>
          )}
        </main>
        <TypingForm />
      </div>
    </BackgroundGradientAnimation>
  )
}

export default Home