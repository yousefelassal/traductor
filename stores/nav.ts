import { create } from 'zustand'

type navStore = {
    isOpen: boolean
    toggle: () => void
}

const useNavStore = create<navStore>((set) => ({
    isOpen: true,
    toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}))

export default useNavStore