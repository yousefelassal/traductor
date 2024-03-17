import { create } from 'zustand'

type translation = {
    from_lang: string
    translation: string
    to_lang: string
    audioUrl: string
}

type translationStore = {
    allTranslations: translation[],
    currentTranslation: translation | null,
    addTranslation: (translation: translation) => void,
    setCurrentTranslation: (translation: translation | null) => void
}

export const useTranslationStore = create<translationStore>((set) => ({
    allTranslations: [],
    currentTranslation: null,
    addTranslation: (translation) => set((state) => ({ allTranslations: [...state.allTranslations, translation] })),
    setCurrentTranslation: (translation) => set(() => ({ currentTranslation: translation }))
}))
