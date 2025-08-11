'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { IoMenuOutline, IoCloseOutline } from '.'

export default function Header() {
  const [isNavbarActive, setIsNavbarActive] = useState(false)
  const [isOverlayActive, setIsOverlayActive] = useState(false)
  const [isHeaderActive, setIsHeaderActive] = useState(false)

  const toggleNavbar = useCallback(() => {
    setIsNavbarActive(prev => !prev)
    setIsOverlayActive(prev => !prev)
  }, [])

  const closeNavbar = useCallback(() => {
    setIsNavbarActive(false)
    setIsOverlayActive(false)
  }, [])

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldBeActive = window.scrollY >= 5
          setIsHeaderActive(shouldBeActive)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerClassName = useMemo(() => 
    `header ${isHeaderActive ? 'active' : ''}`, 
    [isHeaderActive]
  )

  const overlayClassName = useMemo(() => 
    `overlay ${isOverlayActive ? 'active' : ''}`, 
    [isOverlayActive]
  )

  const navbarClassName = useMemo(() => 
    `navbar ${isNavbarActive ? 'active' : ''}`, 
    [isNavbarActive]
  )

  return (
    <header className={headerClassName}>
      <div className={overlayClassName} onClick={closeNavbar}></div>

      <div className="header-bottom">
        <div className="container">
          <Link href="/" className="logo">
            <h1 className="logo-text">Tony Properties</h1>
          </Link>

          <nav className={navbarClassName}>
            <div className="navbar-top">
              <Link href="/" className="logo">
                <h1 className="logo-text">Tony Properties</h1>
              </Link>

              <button 
                className="nav-close-btn" 
                onClick={closeNavbar}
                aria-label="Close Menu"
              >
                <IoCloseOutline />
              </button>
            </div>

            <div className="navbar-bottom">
              <ul className="navbar-list">
                <li>
                  <Link href="/" className="navbar-link" onClick={closeNavbar}>Home</Link>
                </li>
                <li>
                  <Link href="/about" className="navbar-link" onClick={closeNavbar}>About</Link>
                </li>
                <li>
                  <Link href="/services" className="navbar-link" onClick={closeNavbar}>Services</Link>
                </li>
                <li>
                  <Link href="/properties" className="navbar-link" onClick={closeNavbar}>Properties</Link>
                </li>
                <li>
                  <Link href="/contact" className="navbar-link" onClick={closeNavbar}>Contact</Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="header-bottom-actions">
            <button 
              className="header-bottom-actions-btn" 
              onClick={toggleNavbar}
              aria-label="Open Menu"
            >
              <IoMenuOutline />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
