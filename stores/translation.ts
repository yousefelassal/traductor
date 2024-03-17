import { create } from 'zustand'

type translation = {
    from_lang: string
    translation: string
    to_lang: string
}

type translationStore = {
    allTranslations: translation[],
    currentTranslation: translation,
    addTranslation: (translation: translation) => void,
    setCurrentTranslation: (translation: translation) => void
}

export const useTranslationStore = create<translationStore>((set) => ({
    allTranslations: [],
    currentTranslation: { from_lang: '', translation: '', to_lang: ''},
    addTranslation: (translation) => set((state) => ({ allTranslations: [...state.allTranslations, translation] })),
    setCurrentTranslation: (translation) => set(() => ({ currentTranslation: translation }))
}))
