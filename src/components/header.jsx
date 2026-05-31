import { useEffect, useState } from 'react'
import logoImage from '../assets/logooo.png'

const navItems = [
  { label: 'Home', href: '#home', key: 'home' },
  {
    label: 'Destinations',
    href: '#destinations',
    key: 'destinations',
  },
  {label: 'Trek', href: '#trek', key: 'trek'},
  { label: 'Stories', href: '#stories', key: 'stories' },
  {
    label: 'Support',
    // href: '#support',
    // key: 'support',
    menu: [
      { label: 'About Us', href: '#about', key: 'about' },
      { label: 'Ask for help / Contact us', href: '#support-contact', key: 'support-contact' },
    ],
  },
]

function Header({ activePage = 'home', onNavigate, variant = 'hero' }) {
  const [activeNav, setActiveNav] = useState(activePage)
  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setActiveNav(activePage)
  }, [activePage])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navigate = (event, key) => {
    setActiveNav(key)
    setMenuOpen(false)

    if (!onNavigate) return

    event.preventDefault()

    if (key === 'trek') {
      onNavigate('destinations', { region: 'Trek' })
    } else if (key === 'home' || key === 'destinations' || key === 'stories' || key === 'support-contact' || key === 'about') {
      onNavigate(key === 'support' ? 'support-contact' : key)
    } else {
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const searchDestinations = (event) => {
    event.preventDefault()

    if (onNavigate) {
      onNavigate('destinations', { searchQuery: searchTerm.trim() })
    }
  }

  const navigateDestinationMenu = (event, menuItem, itemKey) => {
    if (menuItem.searchQuery && onNavigate) {
      event.preventDefault()
      setActiveNav('destinations')
      setSearchTerm(menuItem.searchQuery)
      onNavigate('destinations', { searchQuery: menuItem.searchQuery })
      return
    }

    navigate(event, menuItem.key || itemKey)
  }

  return (
    <header className={`header ${variant === 'page' ? 'is-page-header' : ''}`}>
      <a
        className="brand"
        href="#home"
        aria-label="Aariyana Tours and Travels home"
        onClick={(event) => navigate(event, 'home')}
      >
        <span className="brand-logo" aria-hidden="true">
          <img className="brand-logo-mark" src={logoImage} alt="" />
        </span>
        <span>Aariyana Tours and Travels</span>
      </a>

      <button
        className="header-menu-toggle"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>

      <p className="offer">
        <span>GET 20% OFF Book Now</span>
      </p>

      <form className="destination-search" onSubmit={searchDestinations}>
        <button className="search-submit-icon" type="submit" aria-label="Search destinations">
          <span className="search-icon" aria-hidden="true" />
        </button>
        <input
          type="search"
          placeholder="Search destinations..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </form>

      <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        {navItems.map((item) => (
          <div className="nav-item" key={item.key}>
            <a
              className={activeNav === item.key ? 'active' : undefined}
              href={item.href}
              onClick={(event) => navigate(event, item.key)}
              aria-current={activeNav === item.key ? 'page' : undefined}
              aria-haspopup={item.menu ? 'true' : undefined}
            >
              {item.label}
              {item.menu && <span className="nav-arrow" aria-hidden="true" />}
            </a>

            {item.menu && (
              <div className="nav-dropdown" role="menu" aria-label={`${item.label} menu`}>
                {item.menu.map((menuItem) => (
                  <a
                    href={menuItem.href}
                    key={menuItem.label}
                    role="menuitem"
                    onClick={(event) => navigateDestinationMenu(event, menuItem, item.key)}
                  >
                    {menuItem.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  )
}

export default Header
