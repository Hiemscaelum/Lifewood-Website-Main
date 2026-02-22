import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import { IconBrandLinkedin, IconBrandInstagram, IconBrandFacebook, IconBrandYoutube, IconBrandGoogle, IconBrandApple, IconBrandGithub, IconEye, IconEyeOff, IconLayoutDashboard, IconBook2, IconReport, IconChevronRight, IconLogout, IconMenu2, IconX, IconCamera, IconDeviceFloppy } from '@tabler/icons-react'
import L from 'leaflet'
import LiquidEther from './LiquidEther'
import FlowingMenu from './FlowingMenu'
import CountUp from './CountUp'
import Plasma from './Plasma'
import mercProfile from '../merc.jpeg'
import 'leaflet/dist/leaflet.css'
import './App.css'

// Logo component
const Logo = () => (
  <img 
    src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
    alt="Lifewood"
    className="logo-img"
  />
)

const FooterLogo = () => (
  <img
    src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=1024&width=2624&height=474"
    alt="Lifewood"
    className="footer-logo-img"
  />
)

const QuoteLogo = ({ className }) => (
  <img
    src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
    alt="Lifewood"
    className={className}
    loading="lazy"
  />
)

// Navigation Component
const Navigation = ({ currentPath = '/', onNavigate = () => {}, onSetAuthMode = () => {} }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileSection, setOpenMobileSection] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenMobileSection(null)
  }, [currentPath])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) {
        setIsMobileMenuOpen(false)
        setOpenMobileSection(null)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { title: 'Home', href: '/', submenu: [] },
    {
      title: 'AI Initiatives',
      href: '#',
      submenu: [
        { label: 'AI Services', href: '/ai-services' },
        { label: 'AI Projects', href: '/ai-projects' },
      ],
    },
    {
      title: 'Our Company',
      href: '#',
      submenu: [
        { label: 'About Us', href: '/about' },
        { label: 'Offices', href: '/offices' },
      ],
    },
    {
      title: 'What We Offer',
      href: '#',
      submenu: [
        { label: 'Type A-Data Servicing', href: '/data-service' },
        { label: 'Type B-Horizontal LLM Data', href: '/horizontal-llm-data' },
        { label: 'Type C-Vertical LLM Data', href: '/vertical-llm-data' },
        { label: 'Type D-AIGC', href: '/aigc' },
      ],
    },
    { title: 'Philanthropy & Impact', href: '/phil-impact', submenu: [] },
    { title: 'Careers', href: '/careers', submenu: [] },
    { title: 'Contact Us', href: '/contact-us', submenu: [] },
    { title: 'Internal News', href: '/internal-news', submenu: [] },
  ]

  const handleNavClick = (event, href) => {
    if (href.startsWith('/')) {
      event.preventDefault()
      setOpenSubmenu(null)
      onNavigate(href)
    }
  }

  const handleMobileItemClick = (event, item, index) => {
    if (item.submenu.length > 0) {
      event.preventDefault()
      setOpenMobileSection(openMobileSection === index ? null : index)
      return
    }
    handleNavClick(event, item.href)
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="nav-container">
        <button type="button" className="nav-logo-link" onClick={() => onNavigate('/')} aria-label="Go to home page">
          <Logo />
        </button>

        <button
          type="button"
          className={`nav-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          onMouseEnter={() => setIsMobileMenuOpen(true)}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5L19 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M19 5L5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M4 17H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          )}
        </button>
        
        <div className="nav-links">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="nav-item"
              onMouseEnter={() => item.submenu.length && setOpenSubmenu(index)}
              onMouseLeave={() => setOpenSubmenu(null)}
            >
              <a
                href={item.href}
                className={`nav-link ${currentPath === item.href ? 'active' : ''}`}
                onClick={(event) => handleNavClick(event, item.href)}
              >
                <span>{item.title}</span>
                {item.submenu.length > 0 && (
                  <svg
                    className={`nav-chevron ${openSubmenu === index ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </a>

              <AnimatePresence>
                {item.submenu.length > 0 && openSubmenu === index && (
                  <motion.div
                    className="nav-submenu"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        className="nav-submenu-link"
                        onClick={(event) => handleNavClick(event, subItem.href)}
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="nav-auth">
          <button
            type="button"
            className="nav-login-link"
            onClick={() => {
              onSetAuthMode('signin')
              onNavigate('/get-started')
            }}
          >
            Login
          </button>
          <button
            type="button"
            className="nav-start-btn"
            onClick={() => {
              onSetAuthMode('signup')
              onNavigate('/get-started')
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-nav-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mobile-nav-list">
              {menuItems.map((item, index) => {
                const isExpanded = openMobileSection === index
                return (
                  <div key={item.title} className={`mobile-nav-item ${isExpanded ? 'expanded' : ''}`}>
                    <a
                      href={item.href}
                      className={`mobile-nav-link ${currentPath === item.href ? 'active' : ''}`}
                      onClick={(event) => handleMobileItemClick(event, item, index)}
                    >
                      <span>{item.title}</span>
                      {item.submenu.length > 0 && (
                        <svg className={`mobile-nav-chevron ${isExpanded ? 'open' : ''}`} width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      )}
                    </a>

                    {item.submenu.length > 0 && isExpanded && (
                      <div className="mobile-nav-submenu">
                        {item.submenu.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            className={`mobile-nav-sublink ${currentPath === subItem.href ? 'active' : ''}`}
                            onClick={(event) => {
                              handleNavClick(event, subItem.href)
                              setIsMobileMenuOpen(false)
                            }}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              <button
                type="button"
                className="mobile-nav-login-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onSetAuthMode('signup')
                  onNavigate('/get-started')
                }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

const GetStartedPage = ({ authMode = 'signup', onAuthModeChange = () => {}, onNavigate = () => {} }) => {
  const isSignIn = authMode === 'signin'
  const isSignUp = authMode === 'signup'
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false)
  const [signInIdentifier, setSignInIdentifier] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signInError, setSignInError] = useState('')

  const handleSignIn = (event) => {
    event.preventDefault()
    const normalizedUser = signInIdentifier.trim().toLowerCase()

    if (normalizedUser === 'admin1' && signInPassword === '123456') {
      setSignInError('')
      onNavigate('/dashboard')
      return
    }

    setSignInError('Invalid credentials. Use admin1 / 123456.')
  }

  return (
    <main className={`get-started-page ${isSignIn ? 'is-signin' : ''}`}>
      <section className="get-started-section">
        <div className="container">
          <div className={`get-started-card ${isSignIn ? 'is-signin' : ''}`}>
            <motion.div
              className="get-started-form-pane"
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`form-${authMode}`}
                  className="get-started-pane-inner transition-opacity duration-500"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isSignIn ? (
                    <>
                      <h1>Welcome!</h1>
                      <p>Please login to your account.</p>

                      <div className="get-started-socials" aria-label="Sign in with social providers">
                        <button type="button" className="get-started-social-btn" aria-label="Continue with Google">
                          <IconBrandGoogle />
                        </button>
                        <button type="button" className="get-started-social-btn" aria-label="Continue with Apple">
                          <IconBrandApple />
                        </button>
                        <button type="button" className="get-started-social-btn" aria-label="Continue with GitHub">
                          <IconBrandGithub />
                        </button>
                      </div>

                      <form className="get-started-form" onSubmit={handleSignIn}>
                        <input
                          type="text"
                          placeholder="Username or Email"
                          aria-label="Username or Email"
                          value={signInIdentifier}
                          onChange={(event) => {
                            setSignInIdentifier(event.target.value)
                            if (signInError) setSignInError('')
                          }}
                        />
                        <div className="sign-in-password-row">
                          <input
                            type={showSignInPassword ? 'text' : 'password'}
                            placeholder="Password"
                            aria-label="Password"
                            value={signInPassword}
                            onChange={(event) => {
                              setSignInPassword(event.target.value)
                              if (signInError) setSignInError('')
                            }}
                          />
                          <button
                            type="button"
                            className="sign-in-eye-btn"
                            aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowSignInPassword((prev) => !prev)}
                          >
                            {showSignInPassword ? <IconEyeOff /> : <IconEye />}
                          </button>
                        </div>
                        <div className="sign-in-meta">
                          <a href="#" className="sign-in-forgot">Forgot Password?</a>
                        </div>
                        {signInError && <p className="get-started-error">{signInError}</p>}
                        <button type="submit" className="get-started-submit-btn">Login</button>
                      </form>

                      <p className="get-started-footnote">
                        Don&apos;t have an account? <a href="#" onClick={(event) => { event.preventDefault(); onAuthModeChange('signup') }}>Create one</a>
                      </p>
                    </>
                  ) : (
                    <>
                      <h1>Create New Account</h1>
                      <p>Join us for an exceptional experience.</p>

                      <div className="get-started-socials" aria-label="Sign up with social providers">
                        <button type="button" className="get-started-social-btn" aria-label="Continue with Google">
                          <IconBrandGoogle />
                        </button>
                        <button type="button" className="get-started-social-btn" aria-label="Continue with Apple">
                          <IconBrandApple />
                        </button>
                        <button type="button" className="get-started-social-btn" aria-label="Continue with GitHub">
                          <IconBrandGithub />
                        </button>
                      </div>

                      <form className="get-started-form" onSubmit={(event) => event.preventDefault()}>
                        <input type="text" placeholder="Username" aria-label="Username" />
                        <input type="email" placeholder="Email" aria-label="Email" />
                        <div className="sign-in-password-row">
                          <input
                            type={showSignUpPassword ? 'text' : 'password'}
                            placeholder="Password"
                            aria-label="Password"
                          />
                          <button
                            type="button"
                            className="sign-in-eye-btn"
                            aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowSignUpPassword((prev) => !prev)}
                          >
                            {showSignUpPassword ? <IconEyeOff /> : <IconEye />}
                          </button>
                        </div>
                        <div className="sign-in-password-row">
                          <input
                            type={showSignUpConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            aria-label="Confirm Password"
                          />
                          <button
                            type="button"
                            className="sign-in-eye-btn"
                            aria-label={showSignUpConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            onClick={() => setShowSignUpConfirmPassword((prev) => !prev)}
                          >
                            {showSignUpConfirmPassword ? <IconEyeOff /> : <IconEye />}
                          </button>
                        </div>
                        <button type="submit" className="get-started-submit-btn">Sign up</button>
                      </form>

                      <p className="get-started-footnote">
                        Already have an account? <a href="#" onClick={(event) => { event.preventDefault(); onAuthModeChange('signin') }}>Click here</a>
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.aside
              className="get-started-info-pane"
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`panel-${authMode}`}
                  className="get-started-pane-inner transition-opacity duration-500"
                  initial={{ opacity: 0, x: isSignIn ? -22 : 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignIn ? 22 : -22 }}
                  transition={{ duration: 0.26, ease: 'easeOut' }}
                >
                  <img
                    className="get-started-pane-logo"
                    src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=1024&width=2624&height=474"
                    alt="Lifewood"
                    loading="lazy"
                  />
                  <h2>Hello User!</h2>
                  <p>
                    {isSignIn
                      ? 'Enter your personal details and start your journey with us.'
                      : 'To be the global champion in AI data solutions, igniting a culture of innovation and sustainability that enriches lives and transforms communities worldwide.'}
                  </p>
                  <button
                    type="button"
                    className="get-started-signin-btn"
                    onClick={() => onAuthModeChange(isSignIn ? 'signup' : 'signin')}
                  >
                    {isSignIn ? 'Sign up' : 'Login'}
                  </button>
                </motion.div>
              </AnimatePresence>
            </motion.aside>
          </div>
        </div>
      </section>
    </main>
  )
}

const DashboardPage = ({ onNavigate = () => {} }) => {
  const [activePanel, setActivePanel] = useState('dashboard')
  const [activeModuleIndex, setActiveModuleIndex] = useState(4)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: 'Francis',
    lastName: 'Barluado',
    email: 'admin1',
    phone: '+69 969 355 2175',
    school: 'University of Cebu',
  })

  const lessonTracks = [
    {
      label: 'Active',
      title: 'Web Development',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80',
      description: 'Build and ship a production-ready React app with clean architecture and accessibility.',
      bullets: ['Semantic HTML and Layout Foundations', 'React Component Architecture', 'Routing and Page Composition', 'Form UX and Validation'],
    },
    {
      label: 'Start',
      title: 'LLM Prompt Engineering',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
      description: 'Design prompts that are reliable, testable, and safe for real product use.',
      bullets: ['Prompt Design Basics', 'Few-Shot Prompting Strategy', 'Grounding and Retrieval', 'Prompt Evaluation Workflow'],
    },
    {
      label: 'Start',
      title: 'Product Delivery',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      description: 'Plan, execute, and communicate software delivery with measurable sprint outcomes.',
      bullets: ['User Stories and Acceptance Criteria', 'Sprint Planning and Task Slicing', 'Quality Gates and Handoff', 'Stakeholder Reporting'],
    },
  ]

  const courseModules = [
    {
      title: 'Semantic HTML and Layout Foundations',
      duration: '45 min',
      objective: 'Define semantic structure for maintainable pages.',
      content: 'Use landmarks, accessible form controls, and meaningful heading flow.',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'React Component Architecture',
      duration: '60 min',
      objective: 'Build reusable component trees with clear responsibilities.',
      content: 'Split UI by domain concerns and avoid prop-drilling with composition patterns.',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Routing and Page Composition',
      duration: '50 min',
      objective: 'Organize route-level layouts and content transitions.',
      content: 'Create nested route shells and state-safe transitions between views.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Form UX and Validation',
      duration: '55 min',
      objective: 'Improve form usability and validation feedback loops.',
      content: 'Add inline feedback, validation hints, and robust error edge-case handling.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Performance and QA',
      duration: '40 min',
      objective: 'Optimize application speed and ensure code quality.',
      content: 'Apply memoization, lazy loading, and automated testing strategies.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
    },
  ]

  const activeModule = courseModules[activeModuleIndex]
  const handleProfileFieldChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const renderDashboardOverview = () => (
    <div className="dashboard-main-shell">
      <section className="dashboard-main-welcome">
        <h1>
          Welcome back,
          <span>Lifewood Intern</span>
        </h1>
        <p>Always on, never off. Track your progress and continue your journey in AI data solutions.</p>
      </section>

      <section className="dashboard-main-stats">
        <article className="dashboard-main-stat-card">
          <div className="dashboard-main-stat-head">
            <p>01 Completion</p>
            <span>↗</span>
          </div>
          <h3>98%</h3>
          <strong>↗+6%</strong>
          <small>Weekly progress update</small>
        </article>

        <article className="dashboard-main-stat-card">
          <div className="dashboard-main-stat-head">
            <p>02 Weekly Goals</p>
            <span>◎</span>
          </div>
          <h3>04</h3>
          <small>2 completed, 2 in progress</small>
        </article>

        <article className="dashboard-main-stat-card">
          <div className="dashboard-main-stat-head">
            <p>03 Alerts</p>
            <span>◠</span>
          </div>
          <h3>01</h3>
          <small>Evaluation unlocks tomorrow</small>
        </article>
      </section>

      <section className="dashboard-main-activity">
        <div className="dashboard-main-activity-head">
          <div>
            <h2>Activity</h2>
            <p>Recent updates from your workspace</p>
          </div>
          <button type="button" aria-label="More activity actions">...</button>
        </div>

        <div className="dashboard-main-activity-list">
          <article className="dashboard-main-activity-item">
            <div className="dashboard-main-activity-badge muted">98%</div>
            <div className="dashboard-main-activity-copy">
              <h3>Quiz Score: React Hooks</h3>
              <p>27 Feb, 2026</p>
            </div>
            <span>↗</span>
          </article>

          <article className="dashboard-main-activity-item">
            <div className="dashboard-main-activity-badge muted">x2</div>
            <div className="dashboard-main-activity-copy">
              <h3>Productivity Streak</h3>
              <p>Increased limits on tasks</p>
            </div>
            <span>↗</span>
          </article>

          <article className="dashboard-main-activity-item">
            <div className="dashboard-main-activity-badge muted">2%</div>
            <div className="dashboard-main-activity-copy">
              <h3>Optimization Bonus</h3>
              <p>Code quality improvement</p>
            </div>
            <span>↗</span>
          </article>

          <article className="dashboard-main-activity-item">
            <div className="dashboard-main-activity-badge muted">◉</div>
            <div className="dashboard-main-activity-copy">
              <h3>Profile Sync Complete</h3>
              <p>+69 969 355 2175</p>
            </div>
            <span>↗</span>
          </article>
        </div>
      </section>
    </div>
  )

  const renderLessonsPanel = () => (
    <div className="dashboard-lessons-shell">
      <section className="dashboard-lessons-hero">
        <p>Internal Workspace</p>
        <h1>Lessons Center</h1>
        <span>Review active modules, upcoming sessions, and learning milestones.</span>
      </section>

      <section className="dashboard-lessons-tracks-head">
        <h2>Featured Learning Tracks</h2>
        <p>Next class in 02:10:25</p>
      </section>

      <section className="dashboard-lessons-tracks-grid">
        {lessonTracks.map((track) => (
          <article key={track.title} className="dashboard-lessons-track-card">
            <div className="dashboard-lessons-track-image-wrap">
              <img src={track.image} alt={track.title} loading="lazy" />
              <span>{track.label}</span>
            </div>
            <div className="dashboard-lessons-track-content">
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <ul>
                {track.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-lessons-course">
        <div className="dashboard-lessons-course-head">
          <div>
            <p>Active Course</p>
            <h3>Web Development</h3>
            <span>Build and ship a production-ready React app with clean architecture and accessibility.</span>
          </div>
          <b>5 Modules</b>
        </div>

        <div className="dashboard-lessons-course-grid">
          <div className="dashboard-lessons-module-list">
            <small>Course Modules</small>
            {courseModules.map((module, index) => (
              <button
                key={module.title}
                type="button"
                className={index === activeModuleIndex ? 'active' : ''}
                onClick={() => setActiveModuleIndex(index)}
              >
                <span>{module.title}</span>
                <em>{module.duration}</em>
              </button>
            ))}
          </div>

          <article className="dashboard-lessons-detail-card">
            <small>Current Lesson</small>
            <h4>{activeModule.title}</h4>
            <img
              className="dashboard-lessons-detail-image"
              src={activeModule.image}
              alt={activeModule.title}
              loading="lazy"
            />

            <small>Objective</small>
            <p>{activeModule.objective}</p>

            <small>Lesson Content</small>
            <p>{activeModule.content}</p>

            <div className="dashboard-lessons-task">
              <small>Hands-on Task</small>
              <p>Audit an existing app and improve its performance score by 20%.</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  )

  const renderReportsPanel = () => (
    <div className="dashboard-reports-shell">
      <section className="dashboard-reports-hero">
        <p>Internal Workspace</p>
        <h1>Reports Center</h1>
        <span>Monitor performance, quality trends, and delivery outcomes.</span>
      </section>

      <section className="dashboard-reports-grid">
        <article className="dashboard-reports-timeline">
          <div className="dashboard-reports-title-row">
            <h2>Performance Timeline</h2>
            <span>↗↗</span>
          </div>

          <div className="dashboard-reports-metric">
            <div>
              <b>Code Quality</b>
              <strong>92%</strong>
            </div>
            <i><em style={{ width: '92%' }} /></i>
          </div>

          <div className="dashboard-reports-metric">
            <div>
              <b>Prompt Reliability</b>
              <strong>87%</strong>
            </div>
            <i><em className="is-accent" style={{ width: '87%' }} /></i>
          </div>

          <div className="dashboard-reports-metric">
            <div>
              <b>Delivery Speed</b>
              <strong>90%</strong>
            </div>
            <i><em style={{ width: '90%' }} /></i>
          </div>
        </article>

        <article className="dashboard-reports-latest">
          <div className="dashboard-reports-title-row">
            <h2>Latest Reports</h2>
          </div>

          <div className="dashboard-reports-list">
            <div className="dashboard-reports-item">
              <span>📖</span>
              <b>Weekly Internship Health</b>
              <small>Updated 2h ago</small>
            </div>
            <div className="dashboard-reports-item">
              <span>📖</span>
              <b>Prompt Accuracy Summary</b>
              <small>Updated yesterday</small>
            </div>
            <div className="dashboard-reports-item">
              <span>📖</span>
              <b>Frontend Delivery Metrics</b>
              <small>Updated 3 days ago</small>
            </div>
          </div>

          <button type="button" className="dashboard-reports-archive-btn">View Archive</button>
        </article>
      </section>
    </div>
  )

  return (
    <main className="dashboard-page">
      <section className="dashboard-basic-layout">
        <aside className="dashboard-basic-sidebar">
          <div className="dashboard-basic-sidebar-head">
            <div className="dashboard-basic-brand">
              <img
                src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=1024&width=2624&height=474"
                alt="Lifewood"
                loading="lazy"
              />
            </div>
            <button type="button" className="dashboard-basic-menu-btn" aria-label="Open sidebar menu">
              <IconMenu2 size={19} />
            </button>
          </div>

          <div className="dashboard-basic-profile">
            <img
              src={mercProfile}
              alt="Francis Merc Barluado"
              loading="lazy"
            />
            <div>
              <h3>Francis Merc Barluado</h3>
              <button
                type="button"
                className="dashboard-basic-manage-btn"
                onClick={() => setIsProfileModalOpen(true)}
              >
                Manage Profile
              </button>
            </div>
          </div>

          <p className="dashboard-basic-menu-label">Menu</p>

          <nav className="dashboard-basic-nav" aria-label="Dashboard Sidebar">
            <a
              href="#"
              className={activePanel === 'dashboard' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                setActivePanel('dashboard')
              }}
            >
              <span>
                <IconLayoutDashboard size={18} />
                Dashboard
              </span>
              {activePanel === 'dashboard' ? <IconChevronRight size={16} /> : null}
            </a>
            <a
              href="#"
              className={activePanel === 'lessons' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                setActivePanel('lessons')
              }}
            >
              <span>
                <IconBook2 size={18} />
                Lessons
              </span>
              {activePanel === 'lessons' ? <IconChevronRight size={16} /> : null}
            </a>
            <a
              href="#"
              className={activePanel === 'reports' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                setActivePanel('reports')
              }}
            >
              <span>
                <IconReport size={18} />
                Reports
              </span>
              {activePanel === 'reports' ? <IconChevronRight size={16} /> : null}
            </a>
          </nav>

          <button type="button" className="dashboard-basic-logout" onClick={() => setIsLogoutModalOpen(true)}>
            <IconLogout size={18} />
            Logout
          </button>
        </aside>
        <section className="dashboard-basic-content">
          {activePanel === 'dashboard' && renderDashboardOverview()}
          {activePanel === 'lessons' && renderLessonsPanel()}
          {activePanel === 'reports' && renderReportsPanel()}
        </section>
      </section>

      <AnimatePresence>
        {isProfileModalOpen ? (
          <motion.div
            className="dashboard-profile-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileModalOpen(false)}
          >
            <motion.section
              className="dashboard-profile-modal"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="dashboard-profile-modal-close"
                aria-label="Close profile modal"
                onClick={() => setIsProfileModalOpen(false)}
              >
                <IconX size={18} />
              </button>

              <div className="dashboard-profile-modal-head">
                <h2>Edit Profile</h2>
                <p>Update your personal details</p>
              </div>

              <div className="dashboard-profile-modal-body">
                <div className="dashboard-profile-avatar-block">
                  <div className="dashboard-profile-avatar-wrap">
                    <img src={mercProfile} alt="Profile avatar" loading="lazy" />
                    <button type="button" aria-label="Change profile photo">
                      <IconCamera size={16} />
                    </button>
                  </div>
                  <span>Tap to change</span>
                </div>

                <form className="dashboard-profile-form" onSubmit={(event) => event.preventDefault()}>
                  <label>
                    First Name
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(event) => handleProfileFieldChange('firstName', event.target.value)}
                    />
                  </label>
                  <label>
                    Last Name
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(event) => handleProfileFieldChange('lastName', event.target.value)}
                    />
                  </label>
                  <label className="full">
                    Gmail / Email
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(event) => handleProfileFieldChange('email', event.target.value)}
                    />
                  </label>
                  <label className="full">
                    Phone Number
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(event) => handleProfileFieldChange('phone', event.target.value)}
                    />
                  </label>
                  <label className="full">
                    School / University
                    <select
                      value={profileForm.school}
                      onChange={(event) => handleProfileFieldChange('school', event.target.value)}
                    >
                      <option>University of Cebu</option>
                      <option>Cebu Institute of Technology</option>
                      <option>University of San Carlos</option>
                      <option>University of the Philippines</option>
                    </select>
                  </label>
                </form>
              </div>

              <div className="dashboard-profile-modal-actions">
                <button type="button" onClick={() => setIsProfileModalOpen(false)}>
                  <IconDeviceFloppy size={16} />
                  Save Changes
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isLogoutModalOpen ? (
          <motion.div
            className="dashboard-logout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLogoutModalOpen(false)}
          >
            <motion.section
              className="dashboard-logout-modal"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
              <div className="dashboard-logout-modal-actions">
                <button type="button" onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
                <button
                  type="button"
                  className="confirm"
                  onClick={() => {
                    setIsLogoutModalOpen(false)
                    onNavigate('/get-started')
                  }}
                >
                  Yes, Logout
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}

// Animated Counter Component
const AnimatedCounter = ({ end, suffix = '', duration = 2, formatNumber = false }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let start = 0
      const increment = end / (duration * 60)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [isInView, end, duration])

  const displayValue = formatNumber ? count.toLocaleString('en-US') : count
  return <span ref={ref}>{displayValue}{suffix}</span>
}

// Hero Section
const Hero = ({ onNavigate = () => {} }) => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-liquid-wrap">
          <LiquidEther
            colors={['#29ff69', '#9effb6', '#d19f66']}
            mouseForce={20}
            cursorSize={140}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <div className="hero-gradient"></div>
        <motion.div style={{ y: y1 }} className="hero-shape shape-1"></motion.div>
        <motion.div style={{ y: y2 }} className="hero-shape shape-2"></motion.div>
      </div>

      <div className="hero-content">
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Bridging East & West<br />
          <span className="highlight">Through Innovation</span>
        </motion.h1>

        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Empowering enterprises with cutting-edge AI solutions while driving sustainable, 
          purpose-led transformation across the globe.
        </motion.p>

        <motion.div 
          className="hero-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('/contact-us')}>
            Contact Us
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </div>

    </section>
  )
}

// About Section
const About = ({ onNavigate = () => {} }) => {
  return (
    <section className="section about-section">
      <div className="container">
        <div className="about-grid">
          <motion.div 
            className="about-content"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="section-label">About Lifewood</span>
            <h2>About <span className="text-gradient">Us</span></h2>
            <p className="about-text">
              At Lifewood we empower our company and our clients to realize the transformative power of AI:
              bringing big data to life and launching new ways of thinking, learning and doing for the
              good of humankind.
            </p>
            <p className="about-text">
              By connecting local expertise with our global AI data infrastructure, we create opportunities,
              empower communities, and drive inclusive growth worldwide.
            </p>
            <button type="button" className="btn about-know-btn" onClick={() => onNavigate('/about')}>
              Know Us Better
            </button>
          </motion.div>

          <motion.div 
            className="about-visual"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="about-card about-image-card">
              <img
                className="about-image"
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Lifewood team collaborating"
              />
            </div>
            <div className="about-shapes">
              <div className="shape-circle"></div>
              <div className="shape-ring"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Global Impact Stats Section
const ImpactStats = () => {
  const demoItems = [
    {
      link: '#',
      text: '40+ Global Delivery Centers',
      description:
        'Lifewood Data Technology operates over 40 secure delivery centers worldwide to safely process and manage AI data.',
    },
    {
      link: '#',
      text: '30+ Countries Across All Continents',
      description:
        'Lifewood has operations in more than 30 countries, allowing it to provide AI data services globally.',
    },
    {
      link: '#',
      text: '50+ Language Capabilities and Dialects',
      description:
        'Lifewood supports over 50 languages and dialects to help train and improve multilingual AI systems.',
    },
    {
      link: '#',
      text: '56,000+ Global Online Resources',
      description:
        'Lifewood uses a network of over 56,000 online workers to handle large-scale AI data tasks efficiently.',
    },
  ]

  return (
    <section className="section impact-section">
      <div className="container">
        <motion.div 
          className="section-header text-center impact-header-wrap"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Global <span className="text-gradient">Scale</span></h2>
          <p>
            By connecting local expertise with our global AI data infrastructure, we create opportunities, empower communities, and drive inclusive growth worldwide.
          </p>
        </motion.div>

        <div style={{ height: '380px', position: 'relative' }}>
          <FlowingMenu
            items={demoItems}
            speed={15}
            textColor="#0f1114"
            bgColor="transparent"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#060010"
            borderColor="transparent"
          />
        </div>
      </div>
    </section>
  )
}

// Capabilities Grid Section
const Capabilities = () => {
  const capabilities = [
    { icon: '🎙️', title: 'Audio', description: 'Collection, labelling, voice categorization, music categorization, and intelligent conversational support.' },
    { icon: '🖼️', title: 'Image', description: 'Collection, labelling, classification, audit, object detection, and precision tagging workflows.' },
    { icon: '🎬', title: 'Video', description: 'Collection, labelling, audit, live broadcast support, and subtitle generation for AI pipelines.' },
    { icon: '📝', title: 'Text', description: 'Text collection, labelling, transcription, utterance collection, and sentiment analysis services.' },
  ]

  return (
    <section className="section capabilities-section">
      <div className="container">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="section-label">AI DATA SERVICES</span>
          <h2>Built for Every <span className="text-gradient">Data Type</span></h2>
          <p>Lifewood offers AI and IT services that enhance decision-making, reduce costs, and improve productivity.</p>
        </motion.div>

        <div className="capabilities-grid">
          {capabilities.map((cap, index) => (
            <motion.div 
              key={index}
              className="capability-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="capability-icon">{cap.icon}</div>
              <h3>{cap.title}</h3>
              <p>{cap.description}</p>
              <motion.div 
                className="capability-link"
                whileHover={{ x: 5 }}
              >
                Explore service →
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ESG Section
const ESG = () => {
  const [activeService, setActiveService] = useState(null)
  const hoverTimerRef = useRef(null)

  const serviceCards = [
    {
      title: 'Audio',
      description: 'Collection, labelling, voice categorization, music categorization, and intelligent conversational support.',
      image:
        'https://i.pinimg.com/1200x/4f/5d/65/4f5d65c6542f9b7b884fb43a2d3660dd.jpg',
    },
    {
      title: 'Text',
      description: 'Text collection, labelling, transcription, utterance collection, and sentiment analysis services.',
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Image',
      description: 'Collection, labelling, classification, audit, object detection, and precision tagging workflows.',
      image:
        'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Video',
      description: 'Collection, labelling, audit, live broadcast support, and subtitle generation for AI pipelines.',
      image:
        'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  const startExpand = (index) => {
    clearHoverTimer()
    hoverTimerRef.current = setTimeout(() => {
      setActiveService(index)
    }, 140)
  }

  useEffect(() => {
    return () => clearHoverTimer()
  }, [])

  return (
    <section className="section esg-section">
      <div className="container">
        <div className="ai-services-layout">
          <motion.div 
            className="ai-services-content"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>AI DATA SERVICES</h2>
            <p>
              Lifewood offers AI and IT services that enhance decision-making, reduce costs, and improve productivity to optimize organizational performance.
            </p>
          </motion.div>

          <div className="ai-services-stage">
            <motion.div
              className={`ai-services-table ${activeService !== null ? 'is-dimmed' : ''}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
            >
              {serviceCards.map((item, index) => (
                <div
                  key={index}
                  className="ai-service-cell"
                  style={{ '--card-image': `url(${item.image})` }}
                  onMouseEnter={() => startExpand(index)}
                  onMouseLeave={clearHoverTimer}
                  onClick={() => setActiveService(index)}
                >
                  <span className="ai-card-glare" aria-hidden="true"></span>
                  <h3>{item.title}</h3>
                </div>
              ))}
            </motion.div>

            <AnimatePresence>
              {activeService !== null && (
                <motion.div
                  key={`service-overlay-${activeService}`}
                  className="ai-service-expanded"
                  style={{ '--card-image': `url(${serviceCards[activeService].image})` }}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.985 }}
                  transition={{ duration: 0.33, ease: 'easeOut' }}
                  onMouseLeave={() => setActiveService(null)}
                  onClick={() => setActiveService(null)}
                >
                  <span className="ai-card-glare" aria-hidden="true"></span>
                  <h3>{serviceCards[activeService].title}</h3>
                  <p>{serviceCards[activeService].description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

// Global Presence Section
const GlobalPresence = () => {
  const locations = [
    { region: 'ASEAN', countries: ['Singapore', 'Thailand', 'Vietnam', 'Indonesia', 'Malaysia'], highlight: true },
    { region: 'China', countries: ['Shanghai', 'Beijing', 'Shenzhen', 'Hong Kong'], highlight: true },
    { region: 'Europe', countries: ['UK', 'Germany', 'France', 'Netherlands'] },
    { region: 'Americas', countries: ['USA', 'Canada', 'Mexico', 'Brazil'] },
  ]

  return (
    <section className="section global-section">
      <div className="container">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="section-label">Global Presence</span>
          <h2>A <span className="text-gradient">World of Opportunity</span></h2>
          <p>Strategic presence across key markets, bridging East and West.</p>
        </motion.div>

        <div className="global-map">
          <div className="map-visual">
            <div className="world-map">
              <div className="map-region asean" style={{ top: '45%', left: '75%' }}>
                <div className="map-point highlight"></div>
                <div className="map-tooltip">ASEAN Hub</div>
              </div>
              <div className="map-region china" style={{ top: '35%', left: '82%' }}>
                <div className="map-point highlight"></div>
                <div className="map-tooltip">China Operations</div>
              </div>
              <div className="map-region europe" style={{ top: '25%', left: '48%' }}>
                <div className="map-point"></div>
                <div className="map-tooltip">Europe</div>
              </div>
              <div className="map-region americas" style={{ top: '35%', left: '15%' }}>
                <div className="map-point"></div>
                <div className="map-tooltip">Americas</div>
              </div>
            </div>
          </div>

          <div className="locations-list">
            {locations.map((loc, index) => (
              <motion.div 
                key={index}
                className={`location-card glass-card ${loc.highlight ? 'highlight' : ''}`}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3>{loc.region}</h3>
                <p>{loc.countries.join(' • ')}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Clients & Partners Section
const Clients = () => {
  const clientImages = [
    'https://framerusercontent.com/images/cjJDncfOy71yWizT3ZRdsZB4W0.png?height=1080&width=1920',
    'https://framerusercontent.com/images/HWbvpkExIBUbdXEGILLSX4PTcEE.png?height=551&width=1920',
    'https://framerusercontent.com/images/m37jhLfPRl449iXOe8op7cY68c.png?height=1080&width=1920',
    'https://framerusercontent.com/images/Yq2A1QFJLXgGQ3b7NZPthsD9RBk.png?height=1080&width=1920',
    'https://framerusercontent.com/images/2rRd2Mk1HzeDgPbL0e8wwkUPo.png?height=1080&width=1920',
    'https://framerusercontent.com/images/5mxPuoDvu4IebUtQtNowrZOfWSg.png?height=1080&width=1920',
    'https://framerusercontent.com/images/RyIkooWlUn6nQYbljETePWzd2Ac.png?height=713&width=1243',
  ]
  const rowOneImages = clientImages.slice(0, 4)
  const rowTwoImages = clientImages.slice(4)

  return (
    <section className="section clients-section">
      <div className="container">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="section-label">Clients & Partners</span>
          <h2>Our Clients <span className="text-gradient">And Partners</span></h2>
          <p>
            We are proud to partner with leading organizations worldwide in transforming data
            into meaningful AI-ready solutions.
          </p>
        </motion.div>

        <div className="clients-image-track">
          <div className="clients-image-row">
            <div className="clients-image-slide">
              {[...rowOneImages, ...rowOneImages].map((image, index) => (
                <div key={`row-a-${index}`} className="client-image-card">
                  <img src={image} alt={`Client showcase ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="clients-image-row">
            <div className="clients-image-slide reverse">
              {[...rowTwoImages, ...rowTwoImages].map((image, index) => (
                <div key={`row-b-${index}`} className="client-image-card">
                  <img src={image} alt={`Client showcase ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

// CTA Section
const CTA = ({ onNavigate = () => {}, onSetAuthMode = () => {} }) => {
  return (
    <section className="section cta-section">
      <div className="cta-bg">
        <div className="cta-gradient"></div>
      </div>
      <div className="container">
        <motion.div 
          className="cta-content text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>We provide global Data Engineering Services to enable AI Solutions.</h2>
          <p>Connect with Lifewood to build scalable, production-ready data foundations for AI.</p>
          <div className="cta-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onSetAuthMode('signin')
                onNavigate('/get-started')
              }}
            >
              Get Started
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate('/contact-us')}>
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// AI Services Page
const AIServicesPage = ({ onNavigate = () => {} }) => {
  const [isSolutionMarqueePaused, setIsSolutionMarqueePaused] = useState(false)

  const solutionCards = [
    {
      title: 'Text',
      text: 'Text collection, labelling, transcription, utterance collection, sentiment analysis.',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Video',
      text: 'Collection, labelling, audit, live broadcast, subtitle generation.',
      image: 'https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      title: 'Image',
      text: 'Collection, labelling, classification, audit, object detection and tagging.',
      image: 'https://www.nyip.edu/media/zoo/images/6-cameras-for-new-photographers_0942096857216f4144e5624dc2d78b8b.png',
    },
    {
      title: 'Audio',
      text: 'Collection, labelling, voice categorization, music categorization, intelligent conversational support.',
      image: 'https://i.pinimg.com/1200x/4f/5d/65/4f5d65c6542f9b7b884fb43a2d3660dd.jpg',
    },
  ]
  const showcaseCards = [
    {
      title: 'Data Validation',
      text: 'We build consistency checks to detect transfer errors, formatting issues, and structural anomalies before data reaches model training.',
      tone: 'dark',
    },
    {
      title: 'Data Collection',
      text: 'Lifewood delivers multilingual, multi-modal collection workflows across text, audio, image, and video for global AI programs.',
      tone: 'light',
    },
    {
      title: 'Data Acquisition',
      text: 'End-to-end acquisition pipelines for large-scale and domain-specific datasets, optimized for quality and throughput.',
      tone: 'light',
    },
    {
      title: 'Data Curation',
      text: 'We normalize, refine, and enrich datasets to improve reliability, accessibility, and model readiness.',
      tone: 'light',
    },
    {
      title: 'Data Annotation',
      text: 'Human-in-the-loop annotation services designed for precise labeling across computer vision, NLP, and conversational AI.',
      tone: 'light-wide',
    },
  ]
  return (
    <main className="ai-page">
      <section className="ai-page-hero">
        <div className="container">
          <h1>AI DATA SERVICES</h1>
          <p>
            Lifewood delivers end-to-end AI data solutions from collection and processing to training-ready
            datasets, helping organizations scale efficiently and accelerate decision-making.
          </p>
          <button type="button" className="ai-page-cta" onClick={() => onNavigate('/contact-us')}>
            Contact Us
          </button>
        </div>
      </section>

      <section className="ai-page-solutions">
        <div className="container">
          <div className="ai-solution-marquee">
            <div className={`ai-solution-track ${isSolutionMarqueePaused ? 'is-paused' : ''}`}>
              {[...solutionCards, ...solutionCards].map((card, index) => (
                <article
                  key={`${card.title}-${index}`}
                  className="ai-solution-mosaic-card"
                  onMouseEnter={() => setIsSolutionMarqueePaused(true)}
                  onMouseLeave={() => setIsSolutionMarqueePaused(false)}
                >
                  <img src={card.image} alt={card.title} className="ai-solution-image" loading="lazy" />
                  <div className="ai-solution-idle">
                    <h3>{card.title}</h3>
                  </div>
                  <div className="ai-solution-hover">
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ai-page-video">
        <div className="container">
          <div className="ai-video-frame">
            <iframe
              src="https://www.youtube.com/embed/g_JvAVL0WY4"
              title="Lifewood AI Services"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="ai-page-showcase">
        <div className="container">
          <div className="ai-showcase-head">
            <h2>Comprehensive Data Solutions</h2>
          </div>
          <div className="ai-showcase-grid">
            {showcaseCards.map((card, index) => (
              <article
                key={`${card.title}-${index}`}
                className={`ai-showcase-card ${card.tone || 'light'}`}
              >
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}

// Type A Data Servicing Page
const DataServicePage = ({ onNavigate }) => {
  const heroMode = 'a'
  const processPanels = [
    {
      title: 'Objective',
      text: 'Scan and preserve documents, then extract fields and structure them into usable database-ready records.',
    },
    {
      title: 'Key Features',
      text: 'Features include Auto Crop, Auto De-skew, Blur Detection, Foreign Object Detection, and AI Data Extraction.',
    },
    {
      title: 'Results',
      text: 'Validated outputs improve precision, scale quickly, support multiple languages and document formats, and provide structured data that is easier to consume in downstream AI systems.',
    },
  ]

  const heroObjects = [
    {
      src: 'https://framerusercontent.com/images/Es0UNVEZFUO6pTmc3NI38eovew.png?width=1600',
      alt: 'Glossy black 3D object',
      className: 'object-a',
    },
    {
      src: 'https://framerusercontent.com/images/LFAxsa4CpX7e4qBI72ijOV2sHg.png?width=1600',
      alt: 'Glossy abstract black 3D object',
      className: 'object-b',
    },
    {
      src: 'https://framerusercontent.com/images/Tq3lgO9Qy66CFuDaYW99KQ5xoLM.png?width=2040',
      alt: 'Glossy black 3D cluster object',
      className: 'object-c',
    },
  ]

  return (
    <main className="data-service-page">
      <section className="data-service-hero">
        <div className="container">
          <div className="data-service-hero-shell">
            <div className="data-service-hero-grid">
              <div className="data-service-copy">
                <h1>Type A -<br />Data Servicing</h1>
                <p>
                  End-to-end data services specializing in multi-language datasets, including document capture, data collection and preparation, extraction, cleaning, labeling, annotation, quality assurance, and formatting.
                </p>
                <button type="button" className="btn about-know-btn data-service-contact-btn" onClick={() => onNavigate('/contact-us')}>
                  Contact Us
                </button>
              </div>

              <motion.div
                className={`data-service-hero-visual mode-${heroMode}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {heroObjects.map((item) => (
                  <img
                    key={item.className}
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className={`data-service-hero-object ${item.className} ${item.className === `object-${heroMode}` ? 'is-primary' : ''}`}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="data-service-workflow data-service-workflow-simple">
        <div className="container">
          <h2 className="data-service-simple-title">Type A- Data Servicing</h2>
          <div className="data-service-timeline">
            {processPanels.map((item, index) => (
              <motion.article
                key={item.title}
                className="data-service-step data-service-step-simple"
                tabIndex={0}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="data-service-step-simple-top">
                  <div className="data-service-step-simple-head">
                    <strong>{`0${index + 1}`}</strong>
                    <h3>{item.title}</h3>
                  </div>
                  <span className="data-service-step-simple-sign" aria-hidden="true">
                    <span></span>
                    <span></span>
                  </span>
                </div>
                <div className="data-service-step-simple-body">
                  <p>{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="data-service-quote">
        <div className="container">
          <blockquote>
            “Great data is not just collected, it is carefully shaped: when quality, context, and clarity align, every AI decision becomes faster, smarter, and more human.”
          </blockquote>
          <QuoteLogo className="data-service-quote-logo" />
        </div>
      </section>
    </main>
  )
}

const HorizontalLLMDataPage = ({ onNavigate }) => {
  const heroMode = 'b'
  const processPanels = [
    {
      title: 'Target',
      text: 'Capture and transcribe recordings from native speakers across 23 countries, spanning 6 project types and 9 data domains, totaling 25,400 valid hours.',
    },
    {
      title: 'Solutions',
      text: 'Mobilized 30,000+ native-speaking resources from 30+ countries, used flexible industrial workflows, and tracked daily collection/transcription progress in real time with PBI.',
    },
    {
      title: 'Results',
      text: 'Completed voice collection and annotation of 25,400 valid hours within 5 months, delivered on time and with quality.',
    },
  ]

  const heroObjects = [
    {
      src: 'https://framerusercontent.com/images/Es0UNVEZFUO6pTmc3NI38eovew.png?width=1600',
      alt: 'Glossy black 3D object',
      className: 'object-a',
    },
    {
      src: 'https://framerusercontent.com/images/LFAxsa4CpX7e4qBI72ijOV2sHg.png?width=1600',
      alt: 'Glossy abstract black 3D object',
      className: 'object-b',
    },
    {
      src: 'https://framerusercontent.com/images/Tq3lgO9Qy66CFuDaYW99KQ5xoLM.png?width=2040',
      alt: 'Glossy black 3D cluster object',
      className: 'object-c',
    },
  ]

  return (
    <main className="data-service-page">
      <section className="data-service-hero">
        <div className="container">
          <div className="data-service-hero-shell">
            <div className="data-service-hero-grid">
              <div className="data-service-copy">
                <h1>Type B -<br />Horizontal LLM Data</h1>
                <p>
                  Comprehensive AI data solutions that cover the full spectrum from data collection and annotation to model testing, creating multimodal datasets for deep learning and large language models.
                </p>
                <button type="button" className="btn about-know-btn data-service-contact-btn" onClick={() => onNavigate('/contact-us')}>
                  Contact Us
                </button>
              </div>

              <motion.div
                className={`data-service-hero-visual mode-${heroMode}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {heroObjects.map((item) => (
                  <img
                    key={item.className}
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className={`data-service-hero-object ${item.className} ${item.className === `object-${heroMode}` ? 'is-primary' : ''}`}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="data-service-workflow data-service-workflow-simple">
        <div className="container">
          <h2 className="data-service-simple-title">Type B- Horizontal LLM Data</h2>
          <div className="data-service-timeline">
            {processPanels.map((item, index) => (
              <motion.article
                key={item.title}
                className="data-service-step data-service-step-simple"
                tabIndex={0}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="data-service-step-simple-top">
                  <div className="data-service-step-simple-head">
                    <strong>{`0${index + 1}`}</strong>
                    <h3>{item.title}</h3>
                  </div>
                  <span className="data-service-step-simple-sign" aria-hidden="true">
                    <span></span>
                    <span></span>
                  </span>
                </div>
                <div className="data-service-step-simple-body">
                  <p>{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="data-service-quote">
        <div className="container">
          <blockquote>
            “Breadth wins only when quality keeps pace: global language coverage, clear workflows, and disciplined validation are what turn large-scale LLM data into reliable model performance.”
          </blockquote>
          <QuoteLogo className="data-service-quote-logo" />
        </div>
      </section>
    </main>
  )
}

const VerticalLLMDataPage = ({ onNavigate }) => {
  const heroMode = 'c'
  const processPanels = [
    {
      title: 'Target',
      text: 'Annotate vehicles, pedestrians, and road objects with 2D and 3D techniques to enable accurate object detection for autonomous driving systems in real-world conditions.',
    },
    {
      title: 'Solutions',
      text: 'Deployed a dedicated Process Engineering team, applied AI-enhanced workflows with multi-level quality checks, and scaled delivery globally through crowdsourced workforce operations.',
    },
    {
      title: 'Results',
      text: 'Achieved 25% production in month 1 with 95% accuracy (target: 90%) and 50% production in month 2 with 99% accuracy (target: 95%), then expanded to Malaysia and Indonesia.',
    },
  ]

  const heroObjects = [
    {
      src: 'https://framerusercontent.com/images/Es0UNVEZFUO6pTmc3NI38eovew.png?width=1600',
      alt: 'Glossy black 3D object',
      className: 'object-a',
    },
    {
      src: 'https://framerusercontent.com/images/LFAxsa4CpX7e4qBI72ijOV2sHg.png?width=1600',
      alt: 'Glossy abstract black 3D object',
      className: 'object-b',
    },
    {
      src: 'https://framerusercontent.com/images/Tq3lgO9Qy66CFuDaYW99KQ5xoLM.png?width=2040',
      alt: 'Glossy black 3D cluster object',
      className: 'object-c',
    },
  ]

  return (
    <main className="data-service-page">
      <section className="data-service-hero">
        <div className="container">
          <div className="data-service-hero-shell">
            <div className="data-service-hero-grid">
              <div className="data-service-copy">
                <h1>Type C -<br />Vertical LLM Data</h1>
                <p>
                  AI data solutions across specific industry verticals including autonomous driving data annotation, in-vehicle data collection, and specialized data services for industry, enterprise, or private LLM systems.
                </p>
                <button type="button" className="btn about-know-btn data-service-contact-btn" onClick={() => onNavigate('/contact-us')}>
                  Contact Us
                </button>
              </div>

              <motion.div
                className={`data-service-hero-visual mode-${heroMode}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {heroObjects.map((item) => (
                  <img
                    key={item.className}
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className={`data-service-hero-object ${item.className} ${item.className === `object-${heroMode}` ? 'is-primary' : ''}`}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="data-service-workflow data-service-workflow-simple">
        <div className="container">
          <h2 className="data-service-simple-title">Type C- Vertical LLM Data</h2>
          <div className="data-service-timeline">
            {processPanels.map((item, index) => (
              <motion.article
                key={item.title}
                className="data-service-step data-service-step-simple"
                tabIndex={0}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="data-service-step-simple-top">
                  <div className="data-service-step-simple-head">
                    <strong>{`0${index + 1}`}</strong>
                    <h3>{item.title}</h3>
                  </div>
                  <span className="data-service-step-simple-sign" aria-hidden="true">
                    <span></span>
                    <span></span>
                  </span>
                </div>
                <div className="data-service-step-simple-body">
                  <p>{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="data-service-quote">
        <div className="container">
          <blockquote>
            “Specialized AI systems demand specialized data: deep domain context, precise annotation, and rigorous QA are the foundation of safe, scalable vertical LLM outcomes.”
          </blockquote>
          <QuoteLogo className="data-service-quote-logo" />
        </div>
      </section>
    </main>
  )
}

const AIGCPage = () => {
  return (
    <main className="aigc-page">
      <section className="aigc-intro">
        <div className="container">
          <motion.div
            className="aigc-intro-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>AI Generated Content (AIGC)</h1>
            <p>
              Lifewood&apos;s early adoption of AI tools has seen the company rapidly evolve the use of AI generated content, which has been integrated into video production for the company&apos;s communication requirements. This has been enormously successful, and these text, voice, image and video skills that comprise AIGC production, combined with more traditional production methods and our story development skills, are now being sought by other companies.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="aigc-media">
        <div className="container">
          <div className="aigc-media-grid">
            <motion.article
              className="aigc-media-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <video
                src="https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </motion.article>

            <motion.div
              className="aigc-side-card dark aigc-media-dark"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <img
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1100&q=80"
                alt="Studio microphone for multilingual voice content"
                loading="lazy"
              />
              <span>Multiple Languages</span>
            </motion.div>

            <motion.div
              className="aigc-side-card stat aigc-media-stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <small>Global Reach</small>
              <strong>100+</strong>
              <span>Countries</span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="aigc-approach">
        <div className="container aigc-approach-grid">
          <motion.div
            className="aigc-approach-copy"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>Our Approach</h2>
            <p>
              Our motivation is to express the personality of your brand in a compelling and distinctive way. We specialize in story-driven content, for companies looking to join the communication revolution.
            </p>
          </motion.div>

          <motion.div
            className="aigc-approach-collage"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <img
              className="aigc-photo photo-back"
              src="https://framerusercontent.com/images/2uF9Ksrf98DxfWsjGrIvBbyRWs.jpeg?width=1456&height=816"
              alt="AIGC creative visual composition"
              loading="lazy"
            />
            <img
              className="aigc-photo photo-mid"
              src="https://framerusercontent.com/images/ptHrgNDD082Sa0EZcDea0FYhulM.jpeg?width=1600&height=897"
              alt="AIGC environment concept scene"
              loading="lazy"
            />
            <img
              className="aigc-photo photo-front"
              src="https://framerusercontent.com/images/1Pnyjmjwo7FWEAoCcEszS2Fngns.jpeg?width=1600&height=897"
              alt="AIGC portrait detail"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      <section className="data-service-quote">
        <div className="container">
          <blockquote>
            “We understand that your customers spend hours looking at screens: so finding the one, most important thing, on which to build your message is integral to our approach, as we seek to deliver surprise and originality.”
          </blockquote>
          <QuoteLogo className="data-service-quote-logo" />
        </div>
      </section>
    </main>
  )
}

// AI Projects Page
const AIProjectsPage = () => {
  const projects = [
    {
      title: 'AI Data Extraction',
      text: 'Acquisition of image and text from distributed sources using scanning workflows, field capture, and secure digital pipelines.',
      tag: 'Data Pipeline',
      accent: 'forest',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Machine Learning Enablement',
      text: 'Dataset preparation pipelines that improve data usability for training, validation, and iterative model improvement.',
      tag: 'Model Ops',
      accent: 'amber',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Autonomous Driving Technology',
      text: 'Specialized visual and sensor data programs supporting perception, scene understanding, and edge-case coverage.',
      tag: 'Computer Vision',
      accent: 'slate',
      image: 'https://as2.ftcdn.net/jpg/01/46/93/31/1000_F_146933196_7j8jULlsQLDBVP97zrQy4LCqgqyFBz39.jpg',
    },
    {
      title: 'AI-Enabled Customer Service',
      text: 'Conversation datasets and intent frameworks that power intelligent support experiences across multiple languages.',
      tag: 'Conversational AI',
      accent: 'forest',
      image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'NLP & Speech Acquisition',
      text: 'Collection and curation of text and speech corpora for multilingual natural language and voice model development.',
      tag: 'Speech',
      accent: 'amber',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Computer Vision (CV)',
      text: 'Image and video labeling workflows for detection, segmentation, tracking, and quality-controlled model training.',
      tag: 'Vision',
      accent: 'slate',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Genealogy',
      text: 'Digitization and structured indexing of historical archives to make records searchable, linked, and AI-ready.',
      tag: 'Historical Data',
      accent: 'forest',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  return (
    <main className="ai-projects-page">
      <section className="ai-projects-hero">
        <div className="container">
          <h1>
            AI Projects
          </h1>
          <p>
            We design and deliver AI projects that connect global data operations with practical business
            outcomes, combining multilingual execution and scalable infrastructure.
          </p>
        </div>
      </section>

      <section className="ai-projects-grid-section">
        <div className="container">
          <div className="ai-projects-head">
            <h2>Projects we currently handle</h2>
          </div>
          <div className="ai-projects-grid">
            {projects.map((project, index) => (
              <article
                key={`${project.title}-${index}`}
                className={`ai-project-card ${project.accent} ${index === 0 ? 'featured' : ''}`}
              >
                <img src={project.image} alt={project.title} className="ai-project-image" loading="lazy" />
                <div className="ai-project-idle">
                  <span className="ai-project-tag">{project.tag}</span>
                  <h3>{project.title}</h3>
                </div>
                <div className="ai-project-hover">
                  <h3>{project.title}</h3>
                  <p>{project.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

// About Page
const AboutPage = () => {
  const [aboutTab, setAboutTab] = useState('mission')

  const coreValues = [
    {
      title: 'Diversity',
      text: 'We celebrate differences in belief, philosophy, and ways of life, because they bring unique perspectives and ideas that encourage everyone to move forward.',
      tone: 'card-one',
    },
    {
      title: 'Caring',
      text: 'We care for every person deeply and equally, because without care work becomes meaningless.',
      tone: 'card-two',
    },
    {
      title: 'Innovation',
      text: 'Innovation is at the heart of all we do, enriching our lives and challenging us to continually improve ourselves and our service.',
      tone: 'card-three',
    },
    {
      title: 'Integrity',
      text: 'We are dedicated to act ethically and sustainably in everything we do. More than just the bare minimum. It is the basis of our existence as a company.',
      tone: 'card-four',
    },
  ]

  const missionVision = {
    mission: {
      title: 'Our Mission',
      text: 'To develop and deploy cutting-edge AI technologies that solve real-world problems, empower communities, and advance sustainable practices. We are committed to fostering a culture of innovation, collaborating with stakeholders across sectors, and making a meaningful impact on society and the environment.',
      video: 'https://videos.pexels.com/video-files/3209211/3209211-hd_1920_1080_25fps.mp4',
    },
    vision: {
      title: 'Our Vision',
      text: 'To be the global champion in AI data solutions, igniting a culture of innovation and sustainability that enriches lives and transforms communities worldwide.',
      video: 'https://videos.pexels.com/video-files/19225485/19225485-hd_1080_1920_30fps.mp4',
    },
  }

  const aboutWordCloud = [
    { text: 'Transformative', size: 'lg', tone: 'soft' },
    { text: 'Innovative', size: 'xl', tone: 'dark' },
    { text: 'Bridging', size: 'xl', tone: 'deep' },
    { text: 'Determined', size: 'lg', tone: 'muted' },
    { text: 'Purposeful', size: 'md', tone: 'soft' },
    { text: 'Explorative', size: 'lg', tone: 'soft' },
    { text: 'Adaptive', size: 'xl', tone: 'mid' },
    { text: 'Evolve', size: 'xl', tone: 'deep' },
    { text: 'Speed', size: 'lg', tone: 'accent' },
    { text: 'Concise', size: 'md', tone: 'soft' },
    { text: 'Culture', size: 'xl', tone: 'mid' },
    { text: 'People', size: 'xxl', tone: 'deep' },
    { text: 'Trust', size: 'lg', tone: 'mid' },
    { text: 'Proactive', size: 'xl', tone: 'mid' },
    { text: 'Relentless', size: 'xl', tone: 'deep' },
    { text: 'Technology', size: 'xxl', tone: 'dark' },
    { text: 'Global', size: 'lg', tone: 'soft' },
    { text: 'Inclusive', size: 'lg', tone: 'soft' },
    { text: 'Tenacious', size: 'xl', tone: 'muted' },
    { text: 'Always switch on never off', size: 'xxl', tone: 'accent', wide: true },
  ]

  return (
    <main className="about-page">
      <section className="ai-page-hero">
        <div className="container">
          <h1>About our company</h1>
          <p>
            While we are motivated by business and economic objectives, we remain committed to our core
            business beliefs that shape our corporate and individual behaviour around the world.
          </p>
        </div>
      </section>

      <section className="about-top-banner" aria-label="About Lifewood banner image">
        <img
          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=2200&q=80"
          alt="Business team meeting and collaboration in an office"
          loading="lazy"
        />
      </section>

      <section className="about-values-section">
        <div className="container">
          <div className="about-values-head">
            <h2>Core Value</h2>
            <p>
              At Lifewood we empower our company and our clients to realise the transformative power of AI:
              bringing big data to life, launching new ways of thinking, innovating, learning, and doing.
            </p>
          </div>
          <div className="about-values-grid">
            {coreValues.map((value) => (
              <article key={value.title} className={`about-value-card ${value.tone}`}>
                <div className="about-value-top">
                  <h3>{value.title}</h3>
                </div>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-mission-section">
        <div className="container about-mission-grid">
          <div className="about-mission-content">
            <div className="about-mission-tabs" role="tablist" aria-label="Mission and Vision tabs">
              <button
                type="button"
                className={`about-mission-tab ${aboutTab === 'mission' ? 'active' : ''}`}
                onClick={() => setAboutTab('mission')}
                onMouseEnter={() => setAboutTab('mission')}
                role="tab"
                aria-selected={aboutTab === 'mission'}
              >
                Mission
              </button>
              <button
                type="button"
                className={`about-mission-tab ${aboutTab === 'vision' ? 'active' : ''}`}
                onClick={() => setAboutTab('vision')}
                onMouseEnter={() => setAboutTab('vision')}
                role="tab"
                aria-selected={aboutTab === 'vision'}
              >
                Vision
              </button>
            </div>

            <div className="about-mission-body">
              <h3>{missionVision[aboutTab].title}</h3>
              <p>{missionVision[aboutTab].text}</p>
            </div>
          </div>

          <div className="about-mission-side-image">
            <video
              key={aboutTab}
              src={missionVision[aboutTab].video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`${missionVision[aboutTab].title} team collaboration video`}
            />
          </div>
        </div>
      </section>

      <section className="about-word-cloud-section">
        <div className="container">
          <div className="about-word-cloud">
            {aboutWordCloud.map((word, index) => (
              <motion.span
                key={word.text}
                className={`about-word about-word-${word.size} tone-${word.tone} ${word.wide ? 'about-word-wide' : ''}`}
                initial={{ opacity: 0, y: 28, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.48,
                  delay: Math.min(index * 0.035, 0.55),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word.text}
              </motion.span>
            ))}
          </div>
          <img
            className="about-word-cloud-logo"
            src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
            alt="Lifewood logo"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  )
}

const OfficesPage = () => {
  const officeMarkerIcon = L.divIcon({
    className: 'offices-map-marker-wrap',
    html: '<span class="offices-map-marker"></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -18],
  })

  const OfficesMapViewport = ({ center, zoom }) => {
    const map = useMap()

    useEffect(() => {
      map.flyTo(center, zoom, { duration: 0.8 })
    }, [center, zoom, map])

    return null
  }

  const officeRegions = [
    { id: 'all', label: 'All Regions', count: 20, mapFocus: 'Global', center: [15, 22], zoom: 2 },
    { id: 'africa', label: 'Africa', count: 2, mapFocus: 'Africa', center: [4, 20], zoom: 3 },
    { id: 'asia', label: 'Asia', count: 10, mapFocus: 'Asia', center: [24, 94], zoom: 3 },
    { id: 'oceania', label: 'Oceania', count: 1, mapFocus: 'Oceania', center: [-23, 134], zoom: 4 },
    { id: 'europe', label: 'Europe', count: 3, mapFocus: 'Europe', center: [52, 12], zoom: 4 },
    { id: 'americas', label: 'Americas', count: 2, mapFocus: 'Americas', center: [14, -78], zoom: 3 },
    { id: 'hub', label: 'Regional Hub', count: 2, mapFocus: 'Regional Hub', center: [21, 72], zoom: 4 },
  ]

  const [activeRegion, setActiveRegion] = useState('oceania')

  const officePins = [
    { city: 'San Francisco', region: 'americas', lat: 37.7749, lng: -122.4194 },
    { city: 'Sao Paulo', region: 'americas', lat: -23.5505, lng: -46.6333 },
    { city: 'Madrid', region: 'europe', lat: 40.4168, lng: -3.7038 },
    { city: 'Berlin', region: 'europe', lat: 52.52, lng: 13.405 },
    { city: 'Stockholm', region: 'europe', lat: 59.3293, lng: 18.0686 },
    { city: 'Cairo', region: 'africa', lat: 30.0444, lng: 31.2357 },
    { city: 'Johannesburg', region: 'africa', lat: -26.2041, lng: 28.0473 },
    { city: 'Dubai', region: 'asia', lat: 25.2048, lng: 55.2708 },
    { city: 'Bengaluru', region: 'asia', lat: 12.9716, lng: 77.5946 },
    { city: 'Delhi', region: 'asia', lat: 28.6139, lng: 77.209 },
    { city: 'Bangkok', region: 'asia', lat: 13.7563, lng: 100.5018 },
    { city: 'Kuala Lumpur', region: 'asia', lat: 3.139, lng: 101.6869 },
    { city: 'Singapore', region: 'asia', lat: 1.3521, lng: 103.8198 },
    { city: 'Manila', region: 'asia', lat: 14.5995, lng: 120.9842 },
    { city: 'Tokyo', region: 'asia', lat: 35.6762, lng: 139.6503 },
    { city: 'Seoul', region: 'asia', lat: 37.5665, lng: 126.978 },
    { city: 'Sydney', region: 'oceania', lat: -33.8688, lng: 151.2093 },
    { city: 'Singapore Hub', region: 'hub', lat: 1.3521, lng: 103.8198 },
    { city: 'Dubai Hub', region: 'hub', lat: 25.2048, lng: 55.2708 },
    { city: 'Jakarta', region: 'asia', lat: -6.2088, lng: 106.8456 },
  ]

  const officeCountries = [
    'United States',
    'Brazil',
    'Spain',
    'Germany',
    'Sweden',
    'Egypt',
    'South Africa',
    'United Arab Emirates',
    'India',
    'Thailand',
    'Malaysia',
    'Singapore',
    'Philippines',
    'Japan',
    'South Korea',
    'Australia',
    'Indonesia',
  ]
  const officeStats = [
    { value: 56788, label: 'Online Resources', separator: ',', duration: 1.2 },
    { value: 30, label: 'Countries', duration: 1 },
    { value: 40, label: 'Centers', duration: 1 },
  ]

  const selectedRegion = officeRegions.find((region) => region.id === activeRegion) || officeRegions[0]
  const visiblePins = activeRegion === 'all'
    ? officePins
    : officePins.filter((pin) => pin.region === activeRegion)

  return (
    <main className="offices-page">
      <section className="offices-hero">
        <div className="container">
          <div className="offices-head">
            <h1>Largest Global Data Collection Distribution</h1>
          </div>

          <div className="offices-layout">
            <aside className="offices-region-panel">
              <h2>Regions</h2>
              <div className="offices-region-list">
                {officeRegions.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    className={`offices-region-item ${activeRegion === region.id ? 'active' : ''}`}
                    onClick={() => setActiveRegion(region.id)}
                  >
                    <span>{region.label}</span>
                    <em>{region.count}</em>
                  </button>
                ))}
              </div>
              <div className="offices-region-selected">
                <h3>Selected</h3>
                <p>{selectedRegion.label}</p>
                <span>{visiblePins.length} pinned location{visiblePins.length > 1 ? 's' : ''}</span>
              </div>
            </aside>

            <article className="offices-map-panel">
              <div className="offices-map-focus">
                <span>Map Focus</span>
                <strong>{selectedRegion.mapFocus}</strong>
                <p>{visiblePins.length} location{visiblePins.length > 1 ? 's' : ''}</p>
              </div>

              <div className="offices-map-stage" role="img" aria-label={`${selectedRegion.label} office map`}>
                <MapContainer
                  center={selectedRegion.center}
                  zoom={selectedRegion.zoom}
                  zoomControl={false}
                  className="offices-map-leaflet"
                >
                  <TileLayer
                    attribution="Tiles &copy; Esri"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                  <ZoomControl position="topright" />
                  <OfficesMapViewport center={selectedRegion.center} zoom={selectedRegion.zoom} />
                  {visiblePins.map((pin) => (
                    <Marker key={pin.city} position={[pin.lat, pin.lng]} icon={officeMarkerIcon}>
                      <Tooltip direction="top" offset={[0, -10]}>{pin.city}</Tooltip>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </article>

            <aside className="offices-stats-rail" aria-label="Offices statistics">
              {officeStats.map((item) => (
                <div key={item.label} className="offices-stats-item">
                  <strong>
                    <span className="offices-stats-value">
                      <CountUp
                        from={0}
                        to={item.value}
                        separator={item.separator || ''}
                        direction="up"
                        duration={item.duration}
                        startCounting={true}
                        className="offices-stats-count"
                      />
                      {item.suffix ? <span className="offices-stats-suffix">{item.suffix}</span> : null}
                    </span>
                  </strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </aside>

          </div>

          <div className="offices-marquee" aria-label="Office countries">
            <div className="offices-marquee-track">
              {[...officeCountries, ...officeCountries].map((country, index) => (
                <span key={`${country}-${index}`} className="offices-marquee-item">
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const PhilImpactPage = () => {
  const PhilImpactMapViewport = ({ center, zoom }) => {
    const map = useMap()

    useEffect(() => {
      const refreshMapSize = () => {
        map.invalidateSize({ pan: false })
      }

      map.setView(center, zoom, { animate: false })
      refreshMapSize()

      const frame = requestAnimationFrame(refreshMapSize)
      const timer = setTimeout(refreshMapSize, 180)
      window.addEventListener('resize', refreshMapSize)

      return () => {
        cancelAnimationFrame(frame)
        clearTimeout(timer)
        window.removeEventListener('resize', refreshMapSize)
      }
    }, [center, zoom, map])

    return null
  }

  const philImpactMarkerIcon = L.divIcon({
    className: 'offices-map-marker-wrap',
    html: '<span class="offices-map-marker"></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -18],
  })

  const philImpactPins = [
    { city: 'Cairo', lat: 30.0444, lng: 31.2357 },
    { city: 'Addis Ababa', lat: 8.9806, lng: 38.7578 },
    { city: 'Lagos', lat: 6.5244, lng: 3.3792 },
    { city: 'Accra', lat: 5.6037, lng: -0.187 },
    { city: 'Abidjan', lat: 5.3599, lng: -4.0083 },
    { city: 'Douala', lat: 4.0511, lng: 9.7679 },
    { city: 'Nairobi', lat: -1.2921, lng: 36.8219 },
    { city: 'Kampala', lat: 0.3476, lng: 32.5825 },
    { city: 'Dar es Salaam', lat: -6.7924, lng: 39.2083 },
    { city: 'Kinshasa', lat: -4.4419, lng: 15.2663 },
    { city: 'Lusaka', lat: -15.3875, lng: 28.3228 },
    { city: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
  ]
  const philImpactMarqueeItems = philImpactPins.map((pin) => pin.city)

  const impactCards = [
    {
      title: 'Partnership',
      text: 'In partnership with our philanthropic allies, we continue to expand practical training pathways and local employment opportunities across African communities.',
      image: 'https://framerusercontent.com/images/06PBWoX2dQvZzJ4GCFpMLVH9ZA.jpg?scale-down-to=2048&width=3458&height=5187',
    },
    {
      title: 'Application',
      text: 'This requires applying our operational methods and AI-enabled delivery model to develop people in under-resourced economies with measurable long-term outcomes.',
      image: 'https://framerusercontent.com/images/H6g74f7ON0rYqleh3DuDC7wLLn4.png?width=1004&height=591',
    },
    {
      title: 'Expanding',
      text: 'We are expanding access to training, fair wage structures, and long-term career progression so individuals can lead business growth in their own communities.',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=80',
    },
  ]

  return (
    <main className="phil-page">
      <section className="phil-hero">
        <div className="container">
          <div className="phil-title-wrap">
            <h1>Philanthropy and Impact</h1>
            <p>
              We direct resources into education and developmental projects that create lasting change. Our
              approach goes beyond giving: it builds sustainable growth and empowers communities for the future.
            </p>
          </div>
        </div>
      </section>

      <section className="phil-hero-banner" aria-label="Philanthropy hero image">
        <video
          src="https://videos.pexels.com/video-files/9365162/9365162-hd_1920_1080_25fps.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="AI themed philanthropy hero video"
        />
      </section>

      <section className="phil-map">
        <div className="container">
          <p className="phil-map-description">
            We direct resources into education and development programs across Africa and beyond, helping create
            inclusive opportunities, stronger local economies, and long-term community resilience.
          </p>
          <div className="phil-map-head">
            <h2>Transforming Communities Worldwide</h2>
          </div>
          <div className="phil-map-stage" role="img" aria-label="Community impact locations map">
            <MapContainer
              center={[4, 18]}
              zoom={3}
              zoomControl={false}
              className="phil-map-leaflet"
            >
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <PhilImpactMapViewport center={[4, 18]} zoom={3} />
              {philImpactPins.map((pin) => (
                <Marker key={pin.city} position={[pin.lat, pin.lng]} icon={philImpactMarkerIcon}>
                  <Tooltip direction="top" offset={[0, -10]}>{pin.city}</Tooltip>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <div className="phil-map-marquee" aria-label="Impact locations">
            <div className="phil-map-marquee-track">
              {[...philImpactMarqueeItems, ...philImpactMarqueeItems].map((location, index) => (
                <span key={`${location}-${index}`} className="phil-map-marquee-item">
                  {location}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="phil-vision">
        <div className="container phil-vision-grid">
          <div className="phil-vision-media">
            <img
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=80"
              alt="People collaborating in a learning environment"
              loading="lazy"
            />
          </div>
          <article className="phil-vision-quote">
            <p>
              Our vision is of a world where financial investment plays a central role in solving the social
              and environmental challenges facing the global community, specifically in Africa and the Indian
              sub-continent.
            </p>
          </article>
        </div>
      </section>

      <section className="phil-focus">
        <div className="container">
          <div className="phil-impact-intro">
            <div className="phil-impact-kicker">
              <span aria-hidden="true" />
              <p>Impact</p>
            </div>
            <p className="phil-impact-intro-copy">
              Through purposeful partnerships and sustainable investment, we empower communities across Africa
              and the Indian sub-continent to create lasting economic and social transformation.
            </p>
          </div>

          <div className="phil-impact-rows">
            {impactCards.map((item, index) => (
              <article
                key={item.title}
                className={`phil-impact-row ${index % 2 === 1 ? 'reverse' : ''}`}
              >
                <h3 className="phil-impact-row-title">{item.title}</h3>
                <p className="phil-impact-row-text">{item.text}</p>
                <div className="phil-impact-row-media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

const CareersPage = () => {
  const cultureBenefits = [
    'Flexible',
    'Supportive',
    'Collaborative',
    'Innovative',
    'Transparent',
    'Reliable',
    'Trustworthy',
    'Respectful',
    'Accountable',
    'Responsible',
    'Honest',
    'Professional',
    'Ethical',
    'Adaptable',
    'Inclusive',
    'Diverse',
    'Positive',
    'Motivated',
    'Dedicated',
    'Committed',
    'Efficient',
    'Productive',
    'Organized',
    'Creative',
    'Open-minded',
    'Proactive',
    'Goal-oriented',
    'Customer-focused',
    'Results-driven',
    'Passionate',
    'Loyal',
    'Fair',
    'Empowering',
    'Engaging',
    'Friendly',
    'Cooperative',
    'Growth-focused',
    'Balanced (work-life balance)',
    'Resilient',
    'Solution-oriented',
    'Detail-oriented',
    'Team-oriented',
    'Excellence-driven',
    'Continuous learning',
    'Forward-thinking',
    'Compassionate',
    'Dependable',
    'Integrity',
    'Purpose-driven',
    'Agile',
  ]
  const [benefitStart, setBenefitStart] = useState(0)
  const visibleBenefits = Array.from({ length: 6 }, (_, index) => (
    cultureBenefits[(benefitStart + index) % cultureBenefits.length]
  ))

  useEffect(() => {
    const timer = setInterval(() => {
      setBenefitStart((prev) => (prev + 6) % cultureBenefits.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [cultureBenefits.length])

  return (
    <main className="careers-page">
      <section className="careers-hero">
        <div className="container">
          <div className="careers-hero-layout">
            <div className="careers-hero-copy">
              <p className="careers-kicker">Careers</p>
              <h1>Careers in Lifewood</h1>
              <blockquote className="careers-hero-quote">
                "Excellence is built every day through integrity, discipline, and teamwork."
              </blockquote>
              <p className="careers-subtitle">
                Join Lifewood and work at the intersection of technology, quality, and social impact. We are
                hiring people who care about high standards, inclusive teams, and meaningful outcomes.
              </p>
            </div>

            <aside className="careers-hero-panel" aria-label="Careers highlights">
              <video
                src="https://videos.pexels.com/video-files/7805032/7805032-hd_1920_1080_25fps.mp4"
                className="careers-hero-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Computer industry team collaboration video"
              />
            </aside>
          </div>
        </div>
      </section>

      <section className="careers-culture">
        <div className="container">
          <div className="careers-culture-layout">
            <article className="careers-culture-copy">
              <h2>A culture of growth and adventure</h2>
              <p>
                Innovation, especially across borders, has never been the easy path. We provide the support and
                flexibility you need to excel in a fast-paced AI landscape.
              </p>

              <div className="careers-culture-benefits">
                {visibleBenefits.map((benefit, index) => (
                  <motion.div
                    key={`${benefitStart}-${benefit}-${index}`}
                    className="careers-culture-benefit"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    <span aria-hidden="true">✓</span>
                    <strong>{benefit}</strong>
                  </motion.div>
                ))}
              </div>
            </article>

            <div className="careers-culture-media" aria-label="Culture and adventure gallery">
              <div className="careers-culture-media-main">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
                  alt="Professionals collaborating in office meeting"
                  loading="lazy"
                />
              </div>
              <div className="careers-culture-media-top">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80"
                  alt="Office collaboration"
                  loading="lazy"
                />
              </div>
              <div className="careers-culture-media-bottom">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
                  alt="Business team discussion"
                  loading="lazy"
                />
              </div>
              <div className="careers-culture-media-foot">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80"
                  alt="Coworkers in office"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="careers-quote-section" aria-label="Careers quote">
        <div className="container careers-quote-wrap">
          <p className="careers-quote-text">
            “Excellence is built every day through integrity, discipline, and teamwork.”
          </p>
          <QuoteLogo className="careers-quote-logo" />
        </div>
      </section>

    </main>
  )
}

const ContactUsPage = () => {
  return (
    <main className="contact-page">
      <section className="contact-shell">
        <Plasma 
          color="#046241"
          speed={0.42}
          direction="forward"
          scale={1.28}
          opacity={0.55}
          mouseInteractive={false}
        />
        <div className="container">
          <div className="contact-layout">
            <article className="contact-intro">
              <h1>
                Let&apos;s shape the <span>future</span> of AI.
              </h1>
              <p>
                We provide global Data Engineering Services to enable AI Solutions. Reach out to our team to
                discuss your next project.
              </p>
            </article>

            <form className="contact-form-card" aria-label="Send us a message">
              <h2>Send us a message</h2>

              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" type="text" placeholder="Your full name" />

              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" placeholder="name@company.com" />

              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" placeholder="How can we help you?" />

              <button type="submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

const InternalNewsPage = () => {
  return (
    <main className="internal-news-page">
      <section className="internal-news-hero">
        <div className="container">
          <h1>RootsTech 2026</h1>
          <p>Coming Soon!</p>
        </div>
      </section>

      <section className="internal-news-frame-section">
        <div className="container">
          <div className="internal-news-frame">
            <iframe
              src="https://www.youtube.com/embed/ccyrQ87EJag"
              title="Lifewood Internal News Video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

// Footer
const Footer = ({ onNavigate = () => {} }) => {
  const footerLinks = {
    Company: ['Home', 'AI Initiatives', 'Our Company', 'What We Offer'],
    Impact: ['Philanthropy & Impact', 'Careers', 'Contact Us'],
    Legal: ['Privacy Policy', 'Cookie Policy', 'Terms and Conditions'],
    Connect: ['LinkedIn', 'Facebook', 'Instagram', 'YouTube'],
  }
  const internalLinks = {
    Home: '/',
    'AI Initiatives': '/ai-services',
    'Our Company': '/about',
    'What We Offer': '/ai-services',
    'Philanthropy & Impact': '/phil-impact',
    Careers: '/careers',
    'Contact Us': '/contact-us',
  }
  const connectLinks = {
    LinkedIn: 'https://www.linkedin.com/company/lifewood-data-technology-ltd./posts/?feedView=all',
    Facebook: 'https://www.facebook.com/LifewoodPH',
    Instagram: 'https://www.instagram.com/lifewood_official/?hl=af',
    YouTube: 'https://www.youtube.com/@LifewoodDataTechnology',
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <button type="button" className="footer-logo-link" onClick={() => onNavigate('/')} aria-label="Go to home page">
              <FooterLogo />
            </button>
            <p>The world’s leading provider of AI-powered data solutions.</p>
            <div className="social-links">
              <a href="https://www.linkedin.com/company/lifewood-data-technology-ltd./posts/?feedView=all" className="social-icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><IconBrandLinkedin /></a>
              <a href="https://www.instagram.com/lifewood_official/?hl=af" className="social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><IconBrandInstagram /></a>
              <a href="https://www.facebook.com/LifewoodPH" className="social-icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><IconBrandFacebook /></a>
              <a href="https://www.youtube.com/@LifewoodDataTechnology" className="social-icon" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><IconBrandYoutube /></a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-column">
              <h4>{category}</h4>
              <ul>
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={category === 'Connect' ? connectLinks[link] : internalLinks[link] || '#'}
                      target={category === 'Connect' ? '_blank' : undefined}
                      rel={category === 'Connect' ? 'noopener noreferrer' : undefined}
                      onClick={
                        category !== 'Connect' && internalLinks[link]
                          ? (event) => {
                              event.preventDefault()
                              onNavigate(internalLinks[link])
                            }
                          : undefined
                      }
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© 2026 Lifewood - All Rights Reserved</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main App
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [authMode, setAuthMode] = useState('signup')

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigateTo = (path) => {
    if (path === currentPath) return
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let pageContent
  if (currentPath === '/ai-services') {
    pageContent = <AIServicesPage onNavigate={navigateTo} />
  } else if (currentPath === '/ai-projects') {
    pageContent = <AIProjectsPage />
  } else if (currentPath === '/data-service') {
    pageContent = <DataServicePage onNavigate={navigateTo} />
  } else if (currentPath === '/horizontal-llm-data') {
    pageContent = <HorizontalLLMDataPage onNavigate={navigateTo} />
  } else if (currentPath === '/vertical-llm-data') {
    pageContent = <VerticalLLMDataPage onNavigate={navigateTo} />
  } else if (currentPath === '/aigc') {
    pageContent = <AIGCPage />
  } else if (currentPath === '/about') {
    pageContent = <AboutPage />
  } else if (currentPath === '/offices') {
    pageContent = <OfficesPage />
  } else if (currentPath === '/phil-impact') {
    pageContent = <PhilImpactPage />
  } else if (currentPath === '/careers') {
    pageContent = <CareersPage />
  } else if (currentPath === '/contact-us') {
    pageContent = <ContactUsPage />
  } else if (currentPath === '/internal-news') {
    pageContent = <InternalNewsPage />
  } else if (currentPath === '/get-started') {
    pageContent = <GetStartedPage authMode={authMode} onAuthModeChange={setAuthMode} onNavigate={navigateTo} />
  } else if (currentPath === '/sign-in') {
    pageContent = <GetStartedPage authMode="signin" onAuthModeChange={setAuthMode} onNavigate={navigateTo} />
  } else if (currentPath === '/dashboard') {
    pageContent = <DashboardPage onNavigate={navigateTo} />
  } else {
    pageContent = (
      <>
        <Hero onNavigate={navigateTo} />
        <About onNavigate={navigateTo} />
        <ImpactStats />
        <ESG />
        <Clients />
        <CTA onNavigate={navigateTo} onSetAuthMode={setAuthMode} />
      </>
    )
  }

  const isDashboardRoute = currentPath === '/dashboard'

  return (
    <div className="app">
      {!isDashboardRoute && (
        <Navigation currentPath={currentPath} onNavigate={navigateTo} onSetAuthMode={setAuthMode} />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPath}
          className="route-transition"
          initial={{ opacity: 0, y: 8, filter: 'blur(1px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(1px)' }}
          transition={{ duration: 0.26, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {pageContent}
        </motion.div>
      </AnimatePresence>
      {!isDashboardRoute && <Footer onNavigate={navigateTo} />}
    </div>
  )
}

export default App
