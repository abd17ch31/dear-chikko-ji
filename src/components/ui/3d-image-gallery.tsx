"use client"

import React, { Suspense, useEffect, useMemo, useRef, useState, createContext, useContext } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Html,
  Plane,
  Sphere,
} from "@react-three/drei"
import { Download, Heart, X } from "lucide-react"

export type CardType = {
  id: string
  imageUrl: string
  alt: string
  title: string
}

type CardContextType = {
  selectedCard: CardType | null
  setSelectedCard: (card: CardType | null) => void
  cards: CardType[]
  onCardClick?: (card: CardType) => void
}

const CardContext = createContext<CardContextType | undefined>(undefined)

function useCard() {
  const ctx = useContext(CardContext)
  if (!ctx) throw new Error("useCard must be used within CardProvider")
  return ctx
}

function CardProvider({ children, cards, onCardClick }: { children: React.ReactNode, cards: CardType[], onCardClick?: (card: CardType) => void }) {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  
  return (
    <CardContext.Provider value={{ selectedCard, setSelectedCard, cards, onCardClick }}>
      {children}
    </CardContext.Provider>
  )
}

function StarfieldBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 1)
    mountRef.current.appendChild(renderer.domElement)

    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 10000
    const positions = new Float32Array(starsCount * 3)
    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    camera.position.z = 10

    let animationId = 0
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      stars.rotation.y += 0.0001
      stars.rotation.x += 0.00005
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      starsGeometry.dispose()
      starsMaterial.dispose()
    }
  }, [])

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0 bg-black" />
}

function FloatingCard({
  card,
  position,
}: {
  card: CardType
  position: { x: number; y: number; z: number }
}) {
  const [hovered, setHovered] = useState(false)
  const [imgSrc, setImgSrc] = useState(card.imageUrl)
  const { setSelectedCard, onCardClick } = useCard()

  useEffect(() => {
    setImgSrc(card.imageUrl)
  }, [card.imageUrl])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCard(card)
    if (onCardClick) onCardClick(card)
  }
  const handlePointerOver = (e: React.PointerEvent) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = "pointer"
  }
  const handlePointerOut = (e: React.PointerEvent) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = "auto"
  }

  const handleImageError = () => {
    if (imgSrc.includes('/Flipbook/')) {
      setImgSrc(imgSrc.replace('/Flipbook/', '/flipbook/'))
    } else if (imgSrc.includes('/flipbook/')) {
      setImgSrc(imgSrc.replace('/flipbook/', '/Flipbook/'))
    } else {
      setImgSrc('/images/photo-1.jpg')
    }
  }

  return (
    <group position={[position.x, position.y, position.z]}>
      <Html
        sprite
        center
        distanceFactor={14}
        position={[0, 0, 0]}
        style={{
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          transform: hovered ? "scale(1.2)" : "scale(1)",
          pointerEvents: "auto",
        }}
      >
        <div
          className="w-44 h-56 rounded-xl overflow-hidden shadow-2xl bg-[#12131C]/90 p-2.5 select-none cursor-pointer border border-white/20 backdrop-blur-md flex flex-col justify-between"
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          style={{
            boxShadow: hovered
              ? "0 20px 40px rgba(49, 184, 198, 0.6), 0 0 25px rgba(49, 184, 198, 0.4)"
              : "0 10px 25px rgba(0, 0, 0, 0.8)",
            borderColor: hovered ? "rgba(49, 184, 198, 0.8)" : "rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="w-full h-40 overflow-hidden rounded-lg bg-slate-800/50">
            <img
              src={imgSrc}
              alt={card.alt || card.title}
              className="w-full h-full object-cover rounded-lg pointer-events-none"
              loading="eager"
              draggable={false}
              onError={handleImageError}
            />
          </div>
          <div className="mt-1.5 text-center pointer-events-none">
            <p className="text-white text-xs font-semibold truncate px-1">{card.title}</p>
          </div>
        </div>
      </Html>
    </group>
  )
}

function CardGalaxy() {
  const { cards } = useCard()
  const galaxyGroupRef = useRef<THREE.Group>(null)

  useFrame((_state, delta) => {
    if (galaxyGroupRef.current) {
      galaxyGroupRef.current.rotation.y += delta * 0.08
    }
  })

  const cardPositions = useMemo(() => {
    const positions: { x: number; y: number; z: number }[] = []
    const numCards = cards.length

    for (let i = 0; i < numCards; i++) {
      const fraction = i / (numCards || 1)
      const angle = fraction * Math.PI * 2
      const radius = 9 + (i % 2) * 2.5
      const y = (fraction - 0.5) * 7
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      positions.push({ x, y, z })
    }
    return positions
  }, [cards])

  return (
    <group ref={galaxyGroupRef}>
      <Sphere args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.15} wireframe />
      </Sphere>
      <Sphere args={[10, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.05} wireframe />
      </Sphere>
      <Sphere args={[14, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.03} wireframe />
      </Sphere>

      {cards.map((card, i) => (
        <FloatingCard key={card.id} card={card} position={cardPositions[i]} />
      ))}
    </group>
  )
}

export default function StellarCardGallery({ cards, onCardClick, active = true }: { cards: CardType[], onCardClick?: (card: CardType) => void, active?: boolean }) {
  if (!active) {
    return <div className="w-full h-full bg-black" />;
  }

  return (
    <CardProvider cards={cards} onCardClick={onCardClick}>
      <div className="w-full h-full relative overflow-hidden bg-black">
        <StarfieldBackground />

        <Canvas
          camera={{ position: [0, 0, 24], fov: 50 }}
          className="absolute inset-0 z-10"
          onCreated={({ gl }) => {
            gl.domElement.style.pointerEvents = "auto"
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[10, 20, 15]} intensity={1.2} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#31b8c6" />
            <CardGalaxy />
            <OrbitControls
              enablePan
              enableZoom={true}
              enableRotate
              minDistance={8}
              maxDistance={40}
              autoRotate={true}
              autoRotateSpeed={0.8}
              rotateSpeed={0.5}
              zoomSpeed={1.2}
              panSpeed={0.8}
              target={[0, 0, 0]}
            />
          </Suspense>
        </Canvas>
      </div>
    </CardProvider>
  )
}
