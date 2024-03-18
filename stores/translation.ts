import { create } from 'zustand'

type translation = {
    id: string
    from_lang: string
    translation: string
    to_lang: string
    audio: HTMLAudioElement
}

type translationStore = {
    allTranslations: translation[],
    currentTranslation: translation | null,
    loading: boolean
    isAudioPlaying: boolean
    addTranslation: (translation: translation) => void,
    setCurrentTranslation: (translation: translation | null) => void
    setLoading: (loading: boolean) => void
    setIsAudioPlaying: (isAudioPlaying: boolean) => void
}

export const useTranslationStore = create<translationStore>((set) => ({
    allTranslations: [],
    currentTranslation: null,
    loading: false,
    isAudioPlaying: false,
    addTranslation: (translation) => set((state) => ({ allTranslations: [...state.allTranslations, translation] })),
    setCurrentTranslation: (translation) => set(() => ({ currentTranslation: translation })),
    setLoading: (loading) => set(() => ({ loading })),
    setIsAudioPlaying: (isAudioPlaying) => set(() => ({ isAudioPlaying }))

}))
