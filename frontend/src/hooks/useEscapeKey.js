import { useEffect } from 'react'

function useEscapeKey(onEscape) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onEscape()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onEscape])
}

export default useEscapeKey
