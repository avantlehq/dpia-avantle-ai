import { create } from 'zustand'
import type { AppState, Assessment, Workspace } from '@/lib/types'

export const useAppStore = create<AppState & {
  setWorkspace: (workspace: Workspace | null) => void
  setAssessments: (assessments: Assessment[]) => void
  addAssessment: (assessment: Assessment) => void
  updateAssessment: (id: string, updates: Partial<Assessment>) => void
  removeAssessment: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}>((set) => ({
  user: null,
  workspace: null,
  assessments: [],
  loading: false,
  error: null,
  
  setWorkspace: (workspace) => set({ workspace }),
  
  setAssessments: (assessments) => set({ assessments }),
  
  addAssessment: (assessment) => set((state) => ({
    assessments: [assessment, ...state.assessments]
  })),
  
  updateAssessment: (id, updates) => set((state) => ({
    assessments: state.assessments.map((assessment) =>
      assessment.id === id ? { ...assessment, ...updates } : assessment
    )
  })),
  
  removeAssessment: (id) => set((state) => ({
    assessments: state.assessments.filter((assessment) => assessment.id !== id)
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error })
}))