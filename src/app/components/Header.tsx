'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5'

export default function Header() {
  const [isNavbarActive, setIsNavbarActive] = useState(false)
  const [isOverlayActive, setIsOverlayActive] = useState(false)
  const [isHeaderActive, setIsHeaderActive] = useState(false)

  const toggleNavbar = () => {
    setIsNavbarActive(!isNavbarActive)
    setIsOverlayActive(!isOverlayActive)
  }

  const closeNavbar = () => {
    setIsNavbarActive(false)
    setIsOverlayActive(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderActive(window.scrollY >= 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${isHeaderActive ? 'active' : ''}`}>
      <div className={`overlay ${isOverlayActive ? 'active' : ''}`} onClick={closeNavbar}></div>

      <div className="header-bottom">
        <div className="container">
          <Link href="/" className="logo">
            <h1 className="logo-text">Tony Properties</h1>
          </Link>

          <nav className={`navbar ${isNavbarActive ? 'active' : ''}`}>
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
                  <Link href="/#home" className="navbar-link" onClick={closeNavbar}>Home</Link>
                </li>
                <li>
                  <Link href="/#about" className="navbar-link" onClick={closeNavbar}>About</Link>
                </li>
                <li>
                  <Link href="/#service" className="navbar-link" onClick={closeNavbar}>Service</Link>
                </li>
                <li>
                  <Link href="/#property" className="navbar-link" onClick={closeNavbar}>Property</Link>
                </li>
                <li>
                  <Link href="/#contact" className="navbar-link" onClick={closeNavbar}>Contact</Link>
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
