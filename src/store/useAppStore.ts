import { create } from 'zustand'

interface AppState {
  selectedState: string | null
  selectedDistrict: string | null
  isCopilotOpen: boolean
  setSelectedState: (state: string | null) => void
  setSelectedDistrict: (district: string | null) => void
  setCopilotOpen: (isOpen: boolean) => void
}

export const useAppStore = create<AppState>()((set) => ({
  selectedState: null,
  selectedDistrict: null,
  isCopilotOpen: false,
  setSelectedState: (state) => set({ selectedState: state, selectedDistrict: null }),
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  setCopilotOpen: (isOpen) => set({ isCopilotOpen: isOpen }),
}))
