import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = '01アイウエオカキクケコサシスセソタチツテトハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array.from({ length: columns }, () => Math.random() * -100)

    function draw() {
      ctx.fillStyle = 'rgba(8, 11, 15, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(0, 180, 216, 0.12)'
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.5
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />
}

function StatusBar() {
  const ref = useRef(null)

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let interval

    interval = setInterval(() => {
      if (!ref.current) return
      const scrambled = Array.from({ length: 32 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
      ref.current.textContent = scrambled
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#0d1117]/80 border-t border-[#1e2d3d] flex items-center px-4 z-50">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
        <span className="font-mono text-[10px] text-[#4a5568]">SECURE CONNECTION ESTABLISHED</span>
      </div>
      <div className="flex-1" />
      <span ref={ref} className="font-mono text-[10px] text-[#1e2d3d] tracking-wider" />
      <div className="flex-1" />
      <span className="font-mono text-[10px] text-[#4a5568]">
        {new Date().toISOString().replace('T', ' ').slice(0, 19)}
      </span>
    </div>
  )
}

export default function BriefingRoom() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const taglineRef = useRef(null)
  const ctaRef = useRef(null)
  const statusRef = useRef(null)

  useEffect(() => {
    // Set initial states explicitly
    gsap.set(titleRef.current, { opacity: 0 })
    gsap.set(subtitleRef.current, { opacity: 0 })
    gsap.set(taglineRef.current, { opacity: 0, y: 10 })
    gsap.set(statusRef.current, { opacity: 0 })
    gsap.set(ctaRef.current, { opacity: 0, y: 20 })

    const tl = gsap.timeline({ delay: 0.3 })

    // Title: CIPHER text with typing
    tl.to(titleRef.current, {
      opacity: 1,
      duration: 0.1,
    })
    .to(titleRef.current, {
      duration: 1.5,
      text: {
        value: 'CIPHER',
        delimiter: '',
      },
      ease: 'none',
    })
    // Glow pulse on title
    .to(titleRef.current, {
      textShadow: '0 0 30px rgba(0, 180, 216, 0.6), 0 0 60px rgba(0, 180, 216, 0.3)',
      duration: 0.5,
      ease: 'power2.out',
    })

    // Subtitle typing
    .to(subtitleRef.current, { opacity: 1, duration: 0.1 }, '-=0.2')
    .to(subtitleRef.current, {
      duration: 1.2,
      text: {
        value: 'CYBER INVESTIGATION AGENCY',
        delimiter: '',
      },
      ease: 'none',
    })

    // Tagline fade in
    .to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, '+=0.3')

    // Status text typing
    .to(statusRef.current, { opacity: 1, duration: 0.1 })
    .to(statusRef.current, {
      duration: 0.8,
      text: {
        value: 'Every attack leaves a trace. Find it.',
        delimiter: '',
      },
      ease: 'none',
    })

    // CTA button appear
    .to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'back.out(1.4)',
    }, '+=0.2')

    return () => tl.kill()
  }, [])

  function handleEnter() {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => navigate('/setup'),
    })
  }

  return (
    <>
      <MatrixRain />

      <div
        ref={containerRef}
        className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10"
      >
        {/* Classified badge */}
        <div className="mb-8 inline-flex items-center gap-2 bg-[#f4a522]/10 border border-[#f4a522]/30 rounded px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f4a522] animate-pulse" />
          <span className="font-mono text-[10px] text-[#f4a522] tracking-widest">CLASSIFIED</span>
        </div>

        {/* Logo */}
        <div className="mb-2">
          <h1
            ref={titleRef}
            className="font-mono text-7xl md:text-9xl font-bold tracking-wider text-[#00b4d8]"
            style={{ textShadow: '0 0 20px rgba(0, 180, 216, 0.3)' }}
          />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-mono text-sm md:text-base tracking-[0.3em] text-[#8892a4] mb-6"
        />

        {/* Tagline */}
        <p ref={taglineRef} className="text-[#4a5568] text-sm mb-2">
          Welcome, Agent. Your first briefing awaits.
        </p>

        {/* Status */}
        <p
          ref={statusRef}
          className="font-mono text-xs text-[#00b4d8]/60 mb-10"
        />

        {/* CTA */}
        <div ref={ctaRef}>
          <button
            onClick={handleEnter}
            className="group relative font-mono text-sm tracking-widest bg-transparent border border-[#00b4d8]/40 text-[#00b4d8] px-10 py-4 rounded hover:bg-[#00b4d8]/10 hover:border-[#00b4d8] hover:shadow-[0_0_20px_rgba(0,180,216,0.2)] active:scale-[0.97] transition-all cursor-pointer"
          >
            <span className="relative z-10">REPORT FOR DUTY</span>
            <div className="absolute inset-0 bg-[#00b4d8]/5 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Decorative grid corners */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[#1e2d3d]" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-[#1e2d3d]" />
        <div className="absolute bottom-16 left-8 w-16 h-16 border-l border-b border-[#1e2d3d]" />
        <div className="absolute bottom-16 right-8 w-16 h-16 border-r border-b border-[#1e2d3d]" />
      </div>

      <StatusBar />
    </>
  )
}
