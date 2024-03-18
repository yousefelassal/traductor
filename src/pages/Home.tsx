import TypingForm from '../components/TypingForm'
import { useTranslationStore } from '../../stores/translation'
import Sidebar from '../components/Sidebar'
import { BackgroundGradientAnimation } from '../components/ui/background-gradient'
import { convertLangToFlag, convertLangCode } from '../libs/utils'
import ReactCountryFlag from 'react-country-flag'

const Home = () => {
  const { currentTranslation, loading } = useTranslationStore()

  return (
    <BackgroundGradientAnimation>
      <div className="relative min-h-screen w-screen flex">
        <Sidebar />
        <main className="py-20 flex text-white items-center justify-center w-full font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl">
          {currentTranslation ? (
            loading ? 
              <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                  Translating...
              </p>
            : 
              <div className="flex flex-col gap-4 w-full h-full">
                <div className="flex justify-between text-base">
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
                <div className="flex flex-1 items-center justify-center">
                  <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-br from-white/80 to-white/75">
                    {currentTranslation.translation}
                  </p>
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