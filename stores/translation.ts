import { create } from 'zustand'

type audio = {
    id: string
    audio: HTMLAudioElement
}

type translation = {
    id: string
    from_lang: string
    translation: string
    to_lang: string
    audioUrl: string
    audio: audio
    text: string
}


type translationStore = {
    allTranslations: translation[],
    currentTranslation: translation | null,
    currentAudio: audio | null,
    loading: boolean
    isPronouncing: boolean
    addTranslation: (translation: translation) => void,
    setCurrentTranslation: (translation: translation | null) => void
    setCurrentAudio: (audio: audio | null) => void
    setLoading: (loading: boolean) => void
    setIsPronouncing: (isPronouncing: boolean) => void
    playAudio: (translation: translation) => void
    stopAudio: (audio: HTMLAudioElement) => void
}

export const useTranslationStore = create<translationStore>((set) => ({
    allTranslations: [],
    currentTranslation: null,
    currentAudio: null,
    loading: false,
    isPronouncing: false,
    addTranslation: (translation) => set((state) => ({ allTranslations: [...state.allTranslations, translation] })),
    setCurrentTranslation: (translation) => set(() => ({ currentTranslation: translation })),
    setCurrentAudio: (audio) => set(() => ({ currentAudio: audio })),
    setLoading: (loading) => set(() => ({ loading })),
    setIsPronouncing: (isPronouncing) => set(() => ({ isPronouncing })),
    playAudio: (translation) => {
        const audio = new Audio(translation.audioUrl)
        const audioObject = {
            id: translation.id,
            audio
        }
        set((state) => ({
            allTranslations:
                state.allTranslations.map(t => t.id === translation.id ? { ...t, audio: audioObject } : t),
            }
        ))
        audio.onplay = () => set(() => ({
            currentAudio: audioObject,
            isPronouncing: true
        }))
        audio.onended = () => set(() => ({
            currentAudio: null,
            isPronouncing: false
        }))
        audio.play()
    },
    stopAudio: (audio) => {
        audio.pause()
        set(() => ({
            currentAudio: null,
            isPronouncing: false
        }))
    }
}))
