import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useContext,
} from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"

const ConfettiContext = createContext({})

// Full-screen overlay confetti
const ConfettiComponent = forwardRef((props, ref) => {
  const {
    options,
    // Let the library size the canvas to the viewport and keep it updated
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    children,
    style,
    ...rest
  } = props

  const instanceRef = useRef(null)

  // Bigger defaults
  const BIG = useMemo(() => {
    return {
      scalar: 2.0,            // particle size multiplier
      particleCount: 160,     // more particles
      spread: 130,            // wider spread
      startVelocity: 60,      // launch speed
      ticks: 240,             // longer lifetime
      gravity: 0.9,           // fall behavior
      zIndex: 9999,           // ensure on top
      colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4"],
    }
  }, [])

  const canvasRef = useCallback(
    (node) => {
      if (node !== null) {
        if (instanceRef.current) return
        // Important: let confetti own the canvas and its image size
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        })
      } else if (instanceRef.current) {
        instanceRef.current.reset()
        instanceRef.current = null
      }
    },
    [globalOptions]
  )

  // Fire once with big defaults
  const fire = useCallback(
    async (opts = {}) => {
      try {
        await instanceRef.current?.({
          ...BIG,
          ...options,
          ...opts,
        })
      } catch (error) {
        console.error("Confetti error:", error)
      }
    },
    [BIG, options]
  )

  // Fireworks loop across the full viewport
  const fireworks = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const randomInRange = (min, max) => Math.random() * (max - min) + min

    const base = {
      ...BIG,
      spread: 360,
      startVelocity: 40,
      ticks: 80,
    }

    function frame() {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return

      const particleCount = Math.round(80 * (timeLeft / duration))
      instanceRef.current?.({
        ...base,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      instanceRef.current?.({
        ...base,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })

      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [BIG])

  const api = useMemo(() => ({ fire, fireworks }), [fire, fireworks])
  useImperativeHandle(ref, () => api, [api])

  useEffect(() => {
    if (!manualstart) {
      ; (async () => {
        try {
          await fire()
        } catch (error) {
          console.error("Confetti effect error:", error)
        }
      })()
    }
  }, [manualstart, fire])

  return (
    <ConfettiContext.Provider value={api}>
      <canvas
        ref={canvasRef}
        // Full-screen overlay; pointer-events none so it doesn't block clicks
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
          ...style,
        }}
        {...rest}
      />
      {children}
    </ConfettiContext.Provider>
  )
})

ConfettiComponent.displayName = "Confetti"
export const Confetti = ConfettiComponent

// Optional hook
export const useConfetti = () => useContext(ConfettiContext)

// Button that uses the same full-screen instance (not the global)
const ConfettiButtonComponent = ({ options, children, ...props }) => {
  const api = useConfetti()
  const handleClick = async (event) => {
    try {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      await api.fire?.({
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        ...options,
      })
    } catch (error) {
      console.error("Confetti button error:", error)
    }
  }
  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}

ConfettiButtonComponent.displayName = "ConfettiButton"
export const ConfettiButton = ConfettiButtonComponent

