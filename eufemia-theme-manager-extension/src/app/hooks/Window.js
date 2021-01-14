import React from 'react'
import { useWindowStore } from '../core/Store'

export const useScrollPosition = (elem = window) => {
  const { getHostData, setByHost } = useWindowStore()
  const { selectedThemeId } = getHostData()

  return React.useEffect(() => {
    let timeout
    const onScroll = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        setByHost({
          [`scroll-pos-${selectedThemeId}`]: window.scrollY,
        })
      }, 100)
    }
    elem.addEventListener('scroll', onScroll)

    const top = parseFloat(getHostData()[`scroll-pos-${selectedThemeId}`]) || 0
    if (top > -1) {
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo({
        top,
        behavior: 'auto',
      })
      document.documentElement.style.scrollBehavior = 'smooth'
    }

    return () => {
      clearTimeout(timeout)
      elem.removeEventListener('scroll', onScroll)
    }
  }, [selectedThemeId, elem, getHostData, setByHost])
}
