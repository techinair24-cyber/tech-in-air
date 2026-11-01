import { useEffect } from 'react'
import './DeepavaliFireworks.css'

const SESSION_KEY = 'techinair-deepavali-fireworks-shown'
const COLORS = ['#ffd166', '#ff8c42', '#60c7ff', '#ff5c6c', '#c084fc', '#fff0bd']
const CELEBRATION_MS = 6800
const LAUNCHES_END_MS = 4700

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function launchRocket(width, height) {
  return {
    x: randomBetween(width * 0.1, width * 0.9),
    y: height + 8,
    targetY: randomBetween(height * 0.16, height * 0.5),
    speed: randomBetween(850, 1050),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    trail: [],
  }
}

function burst(particles, x, y, color) {
  const count = 30
  const offset = Math.random() * Math.PI * 2

  for (let index = 0; index < count; index += 1) {
    const angle = offset + (Math.PI * 2 * index) / count + randomBetween(-0.06, 0.06)
    const speed = randomBetween(65, 220)
    particles.push({
      x,
      y,
      previousX: x,
      previousY: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: randomBetween(0.9, 1.55),
      maxLife: 1.55,
      size: randomBetween(1, 2.2),
      color: Math.random() < 0.16 ? COLORS[Math.floor(Math.random() * COLORS.length)] : color,
    })
  }
}

export default function DeepavaliFireworks() {
  useEffect(() => {
    let alreadyShown = false
    try {
      alreadyShown = window.sessionStorage.getItem(SESSION_KEY) === 'true'
    } catch (error) {
      console.warn('Unable to check Deepavali fireworks session state:', error)
    }

    if (alreadyShown || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const canvas = document.createElement('canvas')
    canvas.className = 'deepavali-fireworks-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    const context = canvas.getContext('2d')

    if (!context) {
      console.error('Unable to start Deepavali fireworks: canvas 2D context is unavailable.')
      return undefined
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(window.innerWidth * ratio)
      canvas.height = Math.round(window.innerHeight * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const rockets = []
    const particles = []
    let frameId
    let startTime
    let previousTime
    let nextLaunch = 180
    let timeoutId
    let width = window.innerWidth
    let height = window.innerHeight

    const draw = (timestamp) => {
      if (startTime === undefined) {
        startTime = timestamp
        previousTime = timestamp
      }

      const elapsed = timestamp - startTime
      const delta = Math.min((timestamp - previousTime) / 1000, 0.04)
      previousTime = timestamp
      canvas.style.opacity = String(Math.min(1, Math.max(0, (CELEBRATION_MS - elapsed) / 1000)))
      context.clearRect(0, 0, width, height)

      if (elapsed < LAUNCHES_END_MS && elapsed >= nextLaunch) {
        rockets.push(launchRocket(width, height))
        if (Math.random() < 0.28) rockets.push(launchRocket(width, height))
        nextLaunch = elapsed + randomBetween(360, 520) + elapsed * 0.035
      }

      for (let index = rockets.length - 1; index >= 0; index -= 1) {
        const rocket = rockets[index]
        rocket.trail.push({ x: rocket.x, y: rocket.y })
        if (rocket.trail.length > 5) rocket.trail.shift()
        rocket.y -= rocket.speed * delta

        context.beginPath()
        context.moveTo(rocket.trail[0].x, rocket.trail[0].y)
        for (let trailIndex = 1; trailIndex < rocket.trail.length; trailIndex += 1) {
          context.lineTo(rocket.trail[trailIndex].x, rocket.trail[trailIndex].y)
        }
        context.lineTo(rocket.x, rocket.y)
        context.strokeStyle = rocket.color
        context.globalAlpha = 0.7
        context.lineWidth = 2
        context.shadowBlur = 10
        context.shadowColor = rocket.color
        context.stroke()
        context.shadowBlur = 0
        context.globalAlpha = 1

        if (rocket.y <= rocket.targetY) {
          burst(particles, rocket.x, rocket.y, rocket.color)
          rockets.splice(index, 1)
        }
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]
        particle.previousX = particle.x
        particle.previousY = particle.y
        particle.x += particle.vx * delta
        particle.y += particle.vy * delta
        particle.vy += 105 * delta
        particle.vx *= 1 - delta * 0.28
        particle.vy *= 1 - delta * 0.18
        particle.life -= delta

        if (particle.life <= 0) {
          particles.splice(index, 1)
          continue
        }

        context.globalAlpha = Math.min(particle.life / particle.maxLife, 1)
        context.strokeStyle = particle.color
        context.lineWidth = particle.size
        context.shadowBlur = 5
        context.shadowColor = particle.color
        context.beginPath()
        context.moveTo(particle.previousX, particle.previousY)
        context.lineTo(particle.x, particle.y)
        context.stroke()
      }

      context.globalAlpha = 1
      context.shadowBlur = 0
      if (elapsed < CELEBRATION_MS) frameId = window.requestAnimationFrame(draw)
    }

    resize()
    document.body.appendChild(canvas)
    window.addEventListener('resize', resize, { passive: true })
    frameId = window.requestAnimationFrame(draw)
    timeoutId = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, 'true')
      } catch (error) {
        console.warn('Unable to save Deepavali fireworks session state:', error)
      }
      canvas.remove()
    }, CELEBRATION_MS + 100)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
      window.removeEventListener('resize', resize)
      canvas.remove()
    }
  }, [])

  return null
}
