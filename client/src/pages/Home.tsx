import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import SearchOverlay from "../components/SearchOverlay"
import gsap from "gsap"

const ANIMATION_DURATION = 1
const SCROLL_COOLDOWN = 1000
const SCROLL_THRESHOLD = 40

const Home: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "null")

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const currentIndex = useRef<number>(0)
  const isAnimating = useRef<boolean>(false)
  const lastScrollTime = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  const [openSearch, setOpenSearch] = useState(false)

  useEffect(() => {
    if (location.pathname !== "/") return
    if (!wrapperRef.current) return

    const panels =
      wrapperRef.current.querySelectorAll<HTMLElement>(".panel")

    const dots =
      document.querySelectorAll<HTMLElement>(".scroll-dot")

    if (!panels.length) return

    /* INIT PANELS */
    gsap.set(panels, { yPercent: 100 })
    gsap.set(panels[0], { yPercent: 0 })

    const updateScrollMenu = (index: number) => {
      dots.forEach(dot => dot.classList.remove("active"))
      dots[index]?.classList.add("active")
    }

    const goToSection = (index: number, direction: number) => {
      if (index < 0 || index >= panels.length) return
      if (isAnimating.current) return

      isAnimating.current = true

      const currentPanel = panels[currentIndex.current]
      const nextPanel = panels[index]

      const tl = gsap.timeline({
        defaults: {
          duration: ANIMATION_DURATION,
          ease: "power3.inOut"
        },
        onComplete: () => {
          currentIndex.current = index
          isAnimating.current = false
        }
      })

      tl.to(currentPanel, {
        yPercent: direction > 0 ? -100 : 100
      })

      tl.fromTo(
        nextPanel,
        {
          yPercent: direction > 0 ? 100 : -100
        },
        {
          yPercent: 0
        },
        "<"
      )

      tl.from(
        nextPanel.querySelectorAll("h1, p"),
        {
          opacity: 0,
          y: 60,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out"
        },
        "-=0.6"
      )

      updateScrollMenu(index)
    }

    /* WHEEL */
    const handleWheel = (e: WheelEvent) => {
      if (openSearch) return

      const now = Date.now()

      if (isAnimating.current) return
      if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return

      lastScrollTime.current = now

      if (e.deltaY > 0)
        goToSection(currentIndex.current + 1, 1)
      else
        goToSection(currentIndex.current - 1, -1)
    }

    window.addEventListener("wheel", handleWheel, { passive: true })

    /* TOUCH */
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (openSearch) return

      const delta =
        touchStartY.current -
        e.changedTouches[0].clientY

      const now = Date.now()

      if (isAnimating.current) return
      if (Math.abs(delta) < SCROLL_THRESHOLD) return
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return

      lastScrollTime.current = now

      if (delta > 0)
        goToSection(currentIndex.current + 1, 1)
      else
        goToSection(currentIndex.current - 1, -1)
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })

    /* CLICK DOT */
    const dotHandlers: Array<() => void> = []

    dots.forEach(dot => {
      const handler = () => {
        if (openSearch) return

        const index = parseInt(dot.dataset.index || "0")

        if (index === currentIndex.current) return

        const direction =
          index > currentIndex.current ? 1 : -1

        goToSection(index, direction)
      }

      dot.addEventListener("click", handler)
      dotHandlers.push(handler)
    })

    updateScrollMenu(0)

    /* CLEANUP */
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)

      dots.forEach((dot, i) => {
        dot.removeEventListener("click", dotHandlers[i])
      })
    }
  }, [location.pathname, openSearch])

  useEffect(() => {
    if (location.pathname !== "/") return

    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = `${scrollBarWidth}px`

    return () => {
      document.body.style.overflow = "auto"
      document.body.style.paddingRight = "0px"
    }
  }, [location.pathname])

  return (
    <>
      <header className="web-header">
        <div className="web-logo">
          <img src="/assets/icons/logotmdt3.png" alt="logo" />
        </div>

        <nav className="web-menu">
          <Link to="/nu" className="menu-item">NỮ</Link>
          <Link to="/nam" className="menu-item">NAM</Link>
          {/* <Link to="/unisex" className="menu-item">UNISEX</Link> */}
        </nav>
      </header>

      <div className="wrapper" ref={wrapperRef}>
        <section className="panel banner1">
          <img src="/assets/icons/banner1.jpg" className="banner-img" />
        </section>
        <section className="panel banner2">
          <img src="/assets/icons/banner2.jpg" className="banner-img" />
        </section>
        <section className="panel banner3">
          <img src="/assets/icons/banner3.jpg" className="banner-img" />
        </section>
        <section className="panel banner4">
          <img src="/assets/icons/banner4.jpg" className="banner-img" />
        </section>
        <section className="panel banner5">
          <img src="/assets/icons/banner5.jpg" className="banner-img" />
        </section>
      </div>

      <div className="web-scroll">
        <div className="scroll-dots">
          <div className="scroll-dot active" data-index="0"></div>
          <div className="scroll-dot" data-index="1"></div>
          <div className="scroll-dot" data-index="2"></div>
          <div className="scroll-dot" data-index="3"></div>
          <div className="scroll-dot" data-index="4"></div>
        </div>
      </div>

      <div className={`bottom-nav ${openSearch ? "hide" : ""}`}>
        <Link to="/">
          <div className="nav-btn nav-left">
            <img src="/assets/icons/191.png" alt="left" />
          </div>
        </Link>

        <div
          className="nav-btn nav-center"
          onClick={() => setOpenSearch(true)}
        >
          <img src="/assets/icons/192.png" alt="center" />
        </div>

        <div
          className="nav-btn nav-right"
          onClick={() => navigate(user ? "/profile" : "/auth")}
        >
          <img src="/assets/icons/193.png" alt="auth" />
        </div>
      </div>

      <SearchOverlay
        open={openSearch}
        close={() => setOpenSearch(false)}
      />
    </>
  )
}

export default Home


