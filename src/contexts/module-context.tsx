'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Module } from '@/types/module'
import type { Feature } from '@/types/feature'
import { modulesApi, featuresApi } from '@/lib/api'

interface ModuleContextValue {
  modules: Module[]
  selectedModule: Module | null
  features: Feature[]
  loadModules: () => Promise<void>
  selectModule: (module: Module) => Promise<void>
  setModules: (modules: Module[]) => void
  setSelectedModule: (module: Module | null) => void
  setFeatures: (features: Feature[]) => void
}

const ModuleContext = createContext<ModuleContextValue>({
  modules: [],
  selectedModule: null,
  features: [],
  loadModules: async () => {},
  selectModule: async () => {},
  setModules: () => {},
  setSelectedModule: () => {},
  setFeatures: () => {},
})

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<Module[]>([])
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])

  const loadModules = useCallback(async () => {
    try {
      const data = await modulesApi.list()
      setModules(data.modules ?? [])
    } catch {
      setModules([])
    }
  }, [])

  const selectModule = useCallback(async (module: Module) => {
    setSelectedModule(module)
    try {
      const data = await featuresApi.listByModule(module.id)
      setFeatures(data.features ?? [])
    } catch {
      setFeatures([])
    }
  }, [])

  const value = useMemo(
    () => ({
      modules,
      selectedModule,
      features,
      loadModules,
      selectModule,
      setModules,
      setSelectedModule,
      setFeatures,
    }),
    [modules, selectedModule, features, loadModules, selectModule]
  )

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
}

export function useModules() {
  return useContext(ModuleContext)
}
