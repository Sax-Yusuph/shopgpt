import { getShadowRootPanel } from '@/utils/content-actions'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

export type ColorMode = 'light' | 'dark'

export type ColorModeContextType = {
  colorMode: ColorMode
  setColorMode: (value: ColorMode) => void
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextType | null>(null)

export type ColorModeProviderProps = {
  children: React.ReactNode
}

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [colorMode, setColorMode] = useState<ColorMode>('dark')

  const toggleColorMode = () =>
    setColorMode(colorMode === 'light' ? 'dark' : 'light')

  useEffect(() => {
    storage
      .get('theme')
      .then((theme) => {
        if (theme && (theme === 'light' || theme === 'dark')) {
          setColorMode(theme)
        }
      })
      .catch(logger)
  }, [])

  useEffect(() => {
    const root = getShadowRootPanel()
    if (root) {
      // root.setAttribute('data-theme', colorMode)
      if (colorMode === 'dark') {
        root.classList.remove('light')
      } else {
        root.classList.remove('dark')
      }

      root.classList.add(colorMode)
    }
  }, [colorMode])

  return (
    <ColorModeContext.Provider
      value={{
        colorMode,
        setColorMode,
        toggleColorMode,
      }}
    >
      {children}
    </ColorModeContext.Provider>
  )
}

export const useColorMode = (): ColorModeContextType => {
  const context = useContext(ColorModeContext)

  if (!context) {
    throw new Error('useColorMode must be used inside a ColorModeProvider')
  }

  return context
}
