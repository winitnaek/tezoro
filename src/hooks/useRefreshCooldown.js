import { useEffect, useState } from 'react'

function useRefreshCooldown(durationSeconds = 10) {
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [remainingSeconds])

  function startCooldown() {
    setRemainingSeconds(durationSeconds)
  }

  return {
    cooldownRemaining: remainingSeconds,
    isCoolingDown: remainingSeconds > 0,
    startCooldown,
  }
}

export default useRefreshCooldown
