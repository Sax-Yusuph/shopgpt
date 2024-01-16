import { useEffect } from 'react'
import { getShadowRoot } from './content-actions'

export const useEnableScroll = () => {
  useEffect(() => {
    const handleWheel = (e: Event) => {
      e.stopPropagation()
    }

    const handleTouchMove = (e: Event) => {
      e.stopPropagation()
    }

    const host = getShadowRoot()

    host?.addEventListener('wheel', handleWheel, true)
    host?.addEventListener('touchmove', handleTouchMove, true)

    return () => {
      document.removeEventListener('wheel', handleWheel, true)
      document.removeEventListener('touchmove', handleTouchMove, true)
    }
  }, [])
}
