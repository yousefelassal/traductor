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
    audio: audio
}


type translationStore = {
    allTranslations: translation[],
    currentTranslation: translation | null,
    currentAudio: audio | null,
    loading: boolean
    addTranslation: (translation: translation) => void,
    setCurrentTranslation: (translation: translation | null) => void
    setCurrentAudio: (audio: audio | null) => void
    setLoading: (loading: boolean) => void
}

export const useTranslationStore = create<translationStore>((set) => ({
    allTranslations: [],
    currentTranslation: null,
    currentAudio: null,
    loading: false,
    addTranslation: (translation) => set((state) => ({ allTranslations: [...state.allTranslations, translation] })),
    setCurrentTranslation: (translation) => set(() => ({ currentTranslation: translation })),
    setCurrentAudio: (audio) => set(() => ({ currentAudio: audio })),
    setLoading: (loading) => set(() => ({ loading })),

}))
