import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useScrollToTop(options = {}) {
  const { pathname } = useLocation()
  const { behavior = 'smooth', top = 0, left = 0 } = options

  useEffect(() => {
    window.scrollTo({
      top,
      left,
      behavior
    })
  }, [pathname, behavior, top, left])
}
