import { create } from 'zustand'

export interface Object3D {
  id: string
  type:  'chair' | 'table' | 'sofa'
  model_url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  color: string
  user_id: string
  username: string
}


type ObjectState = {
  objects: Object3D[]
  addObject: (obj: Object3D) => void
  updateObject: (id: string, newObj: Object3D) => void
  removeObject: (id: string) => void
}

export const useObjectStore = create<ObjectState>((set) => ({
  objects: [],
  addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
  updateObject: (id, newObj) =>
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? newObj : o)),
    })),
  removeObject: (id) => set((state) => ({ objects: state.objects.filter((o) => o.id !== id) })),
}))
