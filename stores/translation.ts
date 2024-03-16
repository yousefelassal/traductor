import { create } from 'zustand'

type translation = {
    lang: string,
    translation: string
}

type translationStore = {
    allTranslations: translation[],
    currentTranslation: translation,
    addTranslation: (translation: translation) => void,
    setCurrentTranslation: (translation: translation) => void
}

export const useTranslationStore = create<translationStore>((set) => ({
    allTranslations: [],
    currentTranslation: { lang: '', translation: '' },
    addTranslation: (translation) => set((state) => ({ allTranslations: [...state.allTranslations, translation] })),
    setCurrentTranslation: (translation) => set(() => ({ currentTranslation: translation }))
}))
