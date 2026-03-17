import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { LayerGroup, LayersControl, MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import { IconBrandLinkedin, IconBrandInstagram, IconBrandFacebook, IconBrandYoutube, IconBrandGoogle, IconBrandApple, IconBrandGithub, IconEye, IconEyeOff, IconLayoutDashboard, IconBook2, IconReport, IconChevronRight, IconLogout, IconMenu2, IconX, IconCamera, IconDeviceFloppy, IconSearch, IconBell, IconFilter, IconDotsVertical, IconUsers, IconUserPlus, IconUserCheck, IconUserX, IconUserEdit } from '@tabler/icons-react'
import L from 'leaflet'
import LiquidEther from './LiquidEther'
import FlowingMenu from './FlowingMenu'
import CountUp from './CountUp'
import Plasma from './Plasma'
import OfferHoverCard from './OfferHoverCard'
import { supabase } from './supabaseClient'
import mercProfile from '../merc.jpeg'
import 'leaflet/dist/leaflet.css'
import './App.css'

const OFFER_PANEL_IMAGES = [
  'https://framerusercontent.com/images/1edPwLJhGXCUhlh38ixQSMOTFA.png?width=1024&height=1024',
  'https://framerusercontent.com/images/m7OC7BU1eSVf04CkU0jmNPRkf8.png?width=1024&height=1024',
  'https://framerusercontent.com/images/iI5MBUQ9ctQdcDHjCLNvD4j4kxc.png?width=1024&height=1024',
]
const INTERN_DASHBOARD_PATH = '/dashboard'
const ADMIN_DASHBOARD_PATH = '/admin-dashboard'
const ADMIN_NAME_ROWS = [
  { last: 'Antopina', first: 'John Wrexel', email: 'jw.antopina@gmail.com' },
  { last: 'Barluado', first: 'Francis Merc', email: 'fmbarluado25@gmail.com' },
  { last: 'Cabrillos', first: 'Dane Kiev', email: 'danekiev2003@gmail.com' },
  { last: 'Cagampang', first: 'Emmanuel Jr.', email: 'orientaleac@gmail.com' },
  { last: 'Casidsid', first: 'Twinky', email: 'twinkycasidsidx@gmail.com' },
  { last: 'Castrodes', first: 'Atilla Hadrian', email: 'atillahadrianc@gmail.com' },
  { last: 'Damayo', first: 'Jholmer', email: 'damayojholmer@gmail.com' },
  { last: 'Francisco', first: 'Ezzel Jan', email: 'ezzelfrancisco95@gmail.com' },
  { last: 'Gelborion', first: 'Francis Dave', email: 'gelboriondave@gmail.com' },
  { last: 'Inocentes', first: 'Jose Danielle', email: 'daniel.inocentes30@gmail.com' },
  { last: 'Jumao-as', first: 'Andre Daniel', email: 'jumaoasandre2003@gmail.com' },
  { last: 'Jusga', first: 'Ailyn', email: 'ailynjusga99@gmail.com' },
  { last: 'Lastimosa', first: 'Julius Jr.', email: 'juliusjrclastimosa@gmail.com' },
  { last: 'Lico', first: 'Trixie Sandra', email: 'licotrixie@gmail.com' },
  { last: 'Mahasol', first: 'Jayred Deil', email: 'jayredmahasol@gmail.com' },
  { last: 'Mandado', first: 'Gerard Luis', email: 'gerardmandado@gmail.com' },
  { last: 'Mumar', first: 'Justine Mhars', email: 'justinemharsmumar@gmail.com' },
  { last: 'Prandas', first: 'Jumar', email: 'prandasmarie@gmail.com' },
  { last: 'Quitco', first: 'Kyle Matthew', email: 'kylequitco3212@gmail.com' },
  { last: 'Soriano', first: 'Darin Jan', email: 'darinjan13@gmail.com' },
  { last: 'Sungahid', first: 'Raily', email: 'railysungahid@gmail.com' },
  { last: 'Tacatani', first: 'Dominic', email: 'dominictacatani123@gmail.com' },
  { last: 'Tampepe', first: 'Prince Christian', email: 'tadeochristianprince@gmail.com' },
  { last: 'Tumungha', first: 'Hara Alexa', email: 'haraalexatumungha@gmail.com' },
  { last: 'Ugdamin', first: 'Willa Mae', email: 'willamaeu@gmail.com' },
  { last: 'Vargas', first: 'Harvey', email: 'harveycvargas@gmail.com' },
  { last: 'Vergara', first: 'Aleah June', email: 'azeleah1@gmail.com' },
  { last: 'Paug', first: 'Mart Francesfil', email: 'pmartfrancesfilromarate@gmail.com' },
  { last: 'Pegarido', first: 'Sol Andrew', email: 'solandrewlabradapegarido@gmail.com' },
  { last: 'Villaflor', first: 'Philip Vincent', email: 'philsulvil@gmail.com' },
  { last: 'Nillama', first: 'Francis Garry', email: 'paengwapokaayo123@gmail.com' },
]
const ADMIN_COURSES = [
  'BS Information Technology',
  'BS Computer Science',
  'BS Information Systems',
  'BS Office Administration',
  'BS Business Administration',
]
const ADMIN_UNIVERSITIES = [
  'University of Cebu',
  'Cebu Institute of Technology',
  'University of San Carlos',
  'University of the Philippines',
  'University of Southern Philippines Foundation',
]
const ADD_MEMBER_UNIVERSITIES = [
  'University of San Carlos',
  'University of San Jose–Recoletos',
  'University of the Visayas',
  'Cebu Normal University',
  'Cebu Technological University',
  'Southwestern University PHINMA',
  'Cebu Institute of Technology – University',
  'University of Southern Philippines Foundation',
  'University of the Philippines Cebu',
  'Asian College of Technology',
  'University of Cebu Main Campus',
  'University of Cebu Banilad',
  'University of Cebu Lapu-Lapu and Mandaue',
  'University of Cebu Pardo–Talisay',
]

const formatAdminDate = (dateValue) => dateValue.toLocaleDateString('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})

const normalizeContactNumber = (value) => value.replace(/\D/g, '').slice(0, 11)

const getRoleOptionFromLabel = (role = '') => {
  const normalizedRole = role.trim().toLowerCase()
  if (normalizedRole === 'employee') return 'employee'
  if (normalizedRole === 'admin') return 'admin'
  return 'intern'
}

const getInitialAddMemberFormState = () => ({
  role: 'intern',
  fullName: '',
  email: '',
  contactNumber: '',
  course: '',
  internshipHours: '',
  university: '',
  customUniversity: '',
  username: '',
  password: '',
  confirmPassword: '',
})

const getInitialEvaluationFormState = () => ({
  accuracy: 5,
  quality: 5,
  progress: 5,
  consistency: 5,
  submissionLink: '',
  notes: '',
  recommendation: '',
})

const EVALUATION_TASKS = ['Genealogy', 'Website Development', 'Heygen', 'Gamma Presentation', 'Production Planning']

const createSubmissionLink = (user, task) => {
  const userSlug = (user.username || user.email.split('@')[0] || 'intern')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const taskSlug = task
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `https://submissions.lifewood.local/${userSlug}/${taskSlug}`
}

const getVisiblePageNumbers = (currentPage, totalPages, maxVisible = 3) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const halfWindow = Math.floor(maxVisible / 2)
  let startPage = Math.max(1, currentPage - halfWindow)
  let endPage = startPage + maxVisible - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = endPage - maxVisible + 1
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
}

const createAdminUsers = () => ADMIN_NAME_ROWS.map((entry, index) => {
  const firstToken = entry.first.split(' ')[0] || ''
  const isAdminUser = entry.first === 'Francis Merc' && entry.last === 'Barluado'
  const role = isAdminUser ? 'Admin' : 'Intern'
  const isIntern = role === 'Intern'
  const joinedDate = new Date(2024, 2, (index % 28) + 1)
  return {
    id: `seed-${index + 1}`,
    initials: `${firstToken.charAt(0)}${entry.last.charAt(0)}`.toUpperCase(),
    name: `${entry.first} ${entry.last}`.trim(),
    email: entry.email,
    role,
    status: index % 6 === 0 ? 'inactive' : 'active',
    joined: joinedDate.toISOString().slice(0, 10),
    contactNumber: `09${String(170000000 + index * 137).padStart(9, '0')}`.slice(0, 11),
    course: isIntern ? ADMIN_COURSES[index % ADMIN_COURSES.length] : '—',
    internshipHours: isIntern ? `${240 + (index % 4) * 60} hrs` : '—',
    university: isIntern ? ADMIN_UNIVERSITIES[index % ADMIN_UNIVERSITIES.length] : '—',
    access: role,
    activity: ['2 mins ago', '1 hour ago', '2 days ago', '5 mins ago', 'Just now'][index % 5] || 'Recently',
    onboarding: formatAdminDate(joinedDate),
    verified: index % 5 !== 2,
    username: entry.email.split('@')[0],
  }
})

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
    handleResize()
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
    <>
      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''} is-visible`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35 }}
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
    </>
  )
}

const GetStartedPage = ({ authMode = 'signup', onAuthModeChange = () => {}, onNavigate = () => {} }) => {
  const isSignIn = authMode === 'signin'
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false)
  const [signInIdentifier, setSignInIdentifier] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signInError, setSignInError] = useState('')
  const [signupStep, setSignupStep] = useState(1)
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    contactNumber: '',
    role: 'intern',
    course: '',
    internshipHours: '',
    university: '',
    customUniversity: '',
  })

  useEffect(() => {
    if (authMode !== 'signup') {
      setSignupStep(1)
    }
  }, [authMode])

  const handleSignIn = (event) => {
    event.preventDefault()
    const normalizedUser = signInIdentifier.trim().toLowerCase()

    if (normalizedUser === 'adminuser' && signInPassword === 'adminuser') {
      setSignInError('')
      onNavigate(ADMIN_DASHBOARD_PATH)
      return
    }

    setSignInError('Invalid credentials. Use adminuser / adminuser.')
  }

  const handleSignupFieldChange = (field, value) => {
    setSignupForm((prev) => {
      const nextForm = {
        ...prev,
        [field]: field === 'contactNumber' ? normalizeContactNumber(value) : value,
      }

      if (field === 'role' && value !== 'intern') {
        nextForm.course = ''
        nextForm.internshipHours = ''
        nextForm.university = ''
        nextForm.customUniversity = ''
      }

      return nextForm
    })
  }

  const handleSignupSubmit = (event) => {
    event.preventDefault()
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
                      <h1>{signupStep === 1 ? 'Personal Profile' : 'Create New Account'}</h1>
                      <p>
                        {signupStep === 1
                          ? 'Complete your profile details for onboarding.'
                          : 'Set up your account credentials before continuing.'}
                      </p>

                      <div className="get-started-stepper" aria-label="Sign up steps">
                        <div className={`get-started-step-chip ${signupStep === 1 ? 'active' : ''}`}>
                          <span>1</span>
                          <strong>Profile</strong>
                        </div>
                        <div className="get-started-step-divider" />
                        <div className={`get-started-step-chip ${signupStep === 2 ? 'active' : ''}`}>
                          <span>2</span>
                          <strong>Account</strong>
                        </div>
                      </div>

                      <form className="get-started-form" onSubmit={handleSignupSubmit}>
                        {signupStep === 1 ? (
                          <>
                            <div className="get-started-select-wrap">
                              <select
                                aria-label="Select Role"
                                value={signupForm.role}
                                onChange={(event) => handleSignupFieldChange('role', event.target.value)}
                              >
                                <option value="intern">Intern</option>
                                <option value="employee">Employee</option>
                              </select>
                            </div>
                            <input
                              type="text"
                              placeholder="Full Name"
                              aria-label="Full Name"
                              value={signupForm.fullName}
                              onChange={(event) => handleSignupFieldChange('fullName', event.target.value)}
                            />
                            <input
                              type="tel"
                              placeholder="Contact Number"
                              aria-label="Contact Number"
                              value={signupForm.contactNumber}
                              onChange={(event) => handleSignupFieldChange('contactNumber', event.target.value)}
                              inputMode="numeric"
                              maxLength={11}
                            />
                            {signupForm.role === 'intern' ? (
                              <>
                                <input
                                  type="text"
                                  placeholder="Course"
                                  aria-label="Course"
                                  value={signupForm.course}
                                  onChange={(event) => handleSignupFieldChange('course', event.target.value)}
                                />
                                <input
                                  type="text"
                                  placeholder="Required Internship Hours"
                                  aria-label="Required Internship Hours"
                                  value={signupForm.internshipHours}
                                  onChange={(event) => handleSignupFieldChange('internshipHours', event.target.value)}
                                />
                                <select
                                  aria-label="University"
                                  value={signupForm.university}
                                  onChange={(event) => handleSignupFieldChange('university', event.target.value)}
                                >
                                  <option value="">Select University</option>
                                  {ADD_MEMBER_UNIVERSITIES.map((university) => (
                                    <option key={university} value={university}>
                                      {university}
                                    </option>
                                  ))}
                                  <option value="others">Others</option>
                                </select>
                                {signupForm.university === 'others' ? (
                                  <input
                                    type="text"
                                    placeholder="Type university name"
                                    aria-label="Other University"
                                    value={signupForm.customUniversity}
                                    onChange={(event) => handleSignupFieldChange('customUniversity', event.target.value)}
                                  />
                                ) : null}
                              </>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              placeholder="Username"
                              aria-label="Username"
                              value={signupForm.username}
                              onChange={(event) => handleSignupFieldChange('username', event.target.value)}
                            />
                            <input
                              type="email"
                              placeholder="Email"
                              aria-label="Email"
                              value={signupForm.email}
                              onChange={(event) => handleSignupFieldChange('email', event.target.value)}
                            />
                            <div className="sign-in-password-row">
                              <input
                                type={showSignUpPassword ? 'text' : 'password'}
                                placeholder="Password"
                                aria-label="Password"
                                value={signupForm.password}
                                onChange={(event) => handleSignupFieldChange('password', event.target.value)}
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
                                value={signupForm.confirmPassword}
                                onChange={(event) => handleSignupFieldChange('confirmPassword', event.target.value)}
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
                          </>
                        )}

                        <div className="get-started-form-actions">
                          {signupStep === 2 ? (
                            <button
                              type="button"
                              className="get-started-secondary-btn"
                              onClick={() => setSignupStep(1)}
                            >
                              Previous
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="get-started-secondary-btn"
                              onClick={() => onNavigate('/')}
                            >
                              Cancel
                            </button>
                          )}
                          {signupStep === 1 ? (
                            <button
                              type="button"
                              className="get-started-submit-btn"
                              onClick={() => setSignupStep(2)}
                            >
                              Next
                              <IconChevronRight size={18} />
                            </button>
                          ) : (
                            <button type="submit" className="get-started-submit-btn">
                              Sign up
                            </button>
                          )}
                        </div>
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
  const DASHBOARD_MOBILE_BREAKPOINT = 640
  const [activePanel, setActivePanel] = useState('dashboard')
  const [activeModuleIndex, setActiveModuleIndex] = useState(4)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth > DASHBOARD_MOBILE_BREAKPOINT
  })
  const [profileForm, setProfileForm] = useState({
    firstName: 'Francis',
    lastName: 'Barluado',
    email: 'adminuser',
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > DASHBOARD_MOBILE_BREAKPOINT) {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [DASHBOARD_MOBILE_BREAKPOINT])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth <= DASHBOARD_MOBILE_BREAKPOINT) {
      document.body.style.overflow = isSidebarOpen ? 'hidden' : ''
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isSidebarOpen, DASHBOARD_MOBILE_BREAKPOINT])

  const handleSidebarSelect = (panel) => (event) => {
    event.preventDefault()
    setActivePanel(panel)
    if (typeof window !== 'undefined' && window.innerWidth <= DASHBOARD_MOBILE_BREAKPOINT) {
      setIsSidebarOpen(false)
    }
  }

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
      <div className="dashboard-ambient" aria-hidden="true">
        <span className="dashboard-ambient-orb orb-one" />
        <span className="dashboard-ambient-orb orb-two" />
      </div>
      <section className={`dashboard-basic-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className="dashboard-basic-sidebar">
          <div className="dashboard-basic-sidebar-head">
            <div className="dashboard-basic-brand">
              <img
                src="https://framerusercontent.com/images/Ca8ppNsvJIfTsWEuHr50gvkDow.png?scale-down-to=1024&width=2624&height=474"
                alt="Lifewood"
                loading="lazy"
              />
            </div>
            <button
              type="button"
              className="dashboard-basic-menu-btn"
              aria-label={isSidebarOpen ? 'Close sidebar menu' : 'Open sidebar menu'}
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              onMouseEnter={() => setIsSidebarOpen(true)}
            >
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
              onClick={handleSidebarSelect('dashboard')}
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
              onClick={handleSidebarSelect('lessons')}
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
              onClick={handleSidebarSelect('reports')}
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
        <button
          type="button"
          className={`dashboard-basic-sidebar-overlay ${isSidebarOpen ? 'is-visible' : ''}`}
          aria-label="Close sidebar menu"
          onClick={() => setIsSidebarOpen(false)}
        />
        <section className="dashboard-basic-content">
          {!isSidebarOpen ? (
            <button
              type="button"
              className="dashboard-basic-mobile-toggle"
              aria-label="Open sidebar menu"
              onClick={() => setIsSidebarOpen(true)}
              onMouseEnter={() => setIsSidebarOpen(true)}
            >
              <IconMenu2 size={20} />
            </button>
          ) : null}
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

const AdminDashboardPage = ({ onNavigate = () => {} }) => {
  const [isAdminSidebarExpanded, setIsAdminSidebarExpanded] = useState(true)
  const [isAdminUserMenuOpen, setIsAdminUserMenuOpen] = useState(false)
  const [isAdminNotificationOpen, setIsAdminNotificationOpen] = useState(false)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [selectedDashboardUser, setSelectedDashboardUser] = useState(null)
  const [selectedEvaluationItem, setSelectedEvaluationItem] = useState(null)
  const [editingMemberId, setEditingMemberId] = useState(null)
  const [openMemberActionMenuId, setOpenMemberActionMenuId] = useState(null)
  const [notificationTab, setNotificationTab] = useState('view-all')
  const [isTableSearchOpen, setIsTableSearchOpen] = useState(false)
  const [isTableFilterOpen, setIsTableFilterOpen] = useState(false)
  const [isEvaluationSearchOpen, setIsEvaluationSearchOpen] = useState(false)
  const [isApprovalSearchOpen, setIsApprovalSearchOpen] = useState(false)
  const [isApprovalFilterOpen, setIsApprovalFilterOpen] = useState(false)
  const [isApprovalHistorySearchOpen, setIsApprovalHistorySearchOpen] = useState(false)
  const [isApprovalHistoryFilterOpen, setIsApprovalHistoryFilterOpen] = useState(false)
  const [isEvaluationHistorySearchOpen, setIsEvaluationHistorySearchOpen] = useState(false)
  const [isEvaluationHistoryFilterOpen, setIsEvaluationHistoryFilterOpen] = useState(false)
  const [isAnalyticsSearchOpen, setIsAnalyticsSearchOpen] = useState(false)
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false)
  const [evaluationSearchQuery, setEvaluationSearchQuery] = useState('')
  const [approvalSearchQuery, setApprovalSearchQuery] = useState('')
  const [approvalSortMode, setApprovalSortMode] = useState('all')
  const [approvalYearFilter, setApprovalYearFilter] = useState('all')
  const [approvalRoleFilter, setApprovalRoleFilter] = useState('all')
  const [approvalHistorySearchQuery, setApprovalHistorySearchQuery] = useState('')
  const [approvalHistorySortMode, setApprovalHistorySortMode] = useState('all')
  const [approvalHistoryYearFilter, setApprovalHistoryYearFilter] = useState('all')
  const [approvalHistoryRoleFilter, setApprovalHistoryRoleFilter] = useState('all')
  const [evaluationHistorySearchQuery, setEvaluationHistorySearchQuery] = useState('')
  const [evaluationHistorySortMode, setEvaluationHistorySortMode] = useState('all')
  const [evaluationHistoryYearFilter, setEvaluationHistoryYearFilter] = useState('all')
  const [analyticsSearchQuery, setAnalyticsSearchQuery] = useState('')
  const [analyticsSortMode, setAnalyticsSortMode] = useState('all')
  const [selectedEvaluationDetailTask, setSelectedEvaluationDetailTask] = useState('')
  const [selectedEvaluationModalTask, setSelectedEvaluationModalTask] = useState('')
  const [approvalSubtab, setApprovalSubtab] = useState('pending')
  const [evaluationSubtab, setEvaluationSubtab] = useState('queue')
  const [tableSortMode, setTableSortMode] = useState('date')
  const [tableRoleFilter, setTableRoleFilter] = useState('all')
  const [tableSearchQuery, setTableSearchQuery] = useState('')
  const [manageUsers, setManageUsers] = useState(() => createAdminUsers())
  const [applications, setApplications] = useState([])
  const [applicationsError, setApplicationsError] = useState('')
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false)
  const [evaluationRecords, setEvaluationRecords] = useState({})
  const [evaluationForm, setEvaluationForm] = useState(() => getInitialEvaluationFormState())
  const [evaluationFeedback, setEvaluationFeedback] = useState('')
  const [addMemberStep, setAddMemberStep] = useState(1)
  const [addMemberForm, setAddMemberForm] = useState(() => getInitialAddMemberFormState())
  const [addMemberError, setAddMemberError] = useState('')
  const [approvalHistory, setApprovalHistory] = useState([
    {
      id: 'history-1',
      name: 'Karen Dominguez',
      email: 'karendominguez@gmail.com',
      role: 'Employee',
      decision: 'declined',
      time: 'Yesterday',
      year: '2026',
    },
    {
      id: 'history-2',
      name: 'Amber Avery',
      email: 'amberavery@gmail.com',
      role: 'Intern',
      decision: 'accepted',
      time: '2 days ago',
      year: '2026',
    },
  ])
  const [archivedApprovalHistoryIds, setArchivedApprovalHistoryIds] = useState(() => new Set())
  const [archivedEvaluationHistoryIds, setArchivedEvaluationHistoryIds] = useState(() => new Set())
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Approval Request', description: 'Aleah June Vergara requested Intern access. Review and accept or decline the registration.', time: '8H', read: false, status: 'pending', type: 'approval', section: 'current' },
    { id: 2, title: 'Role Update Request', description: 'Julius Jr. Lastimosa requested role update to Employee.', time: '10H', read: false, status: 'action', type: 'messages', section: 'current' },
    { id: 3, title: 'Approval Request', description: 'Mark Maon submitted an Employee account request. Accept or decline after checking the profile details.', time: '18H', read: false, status: 'pending', type: 'approval', section: 'current' },
    { id: 4, title: 'Approval Request', description: 'Hara Alexa Tumungha is awaiting Admin review for onboarding access.', time: '1 DAY', read: true, status: 'pending', type: 'approval', section: 'current' },
    { id: 5, title: 'Reminder Scheduled', description: 'Morgan May set a reminder for Amber Avery follow-up.', time: 'YESTERDAY', read: true, status: 'info', type: 'messages', section: 'previous' },
    { id: 6, title: 'Approval Closed', description: 'Karen Dominguez account request was declined and archived.', time: 'YESTERDAY', read: true, status: 'info', type: 'approval', section: 'previous' },
  ])
  const adminUserMenuRef = useRef(null)
  const adminNotificationRef = useRef(null)
  const tableSearchInputRef = useRef(null)
  const evaluationSearchInputRef = useRef(null)
  const approvalSearchInputRef = useRef(null)
  const approvalHistorySearchInputRef = useRef(null)
  const evaluationHistorySearchInputRef = useRef(null)
  const analyticsSearchInputRef = useRef(null)
  const tableFilterRef = useRef(null)
  const approvalFilterRef = useRef(null)
  const approvalHistoryFilterRef = useRef(null)
  const evaluationHistoryFilterRef = useRef(null)
  const analyticsFilterRef = useRef(null)
  const PAGE_SIZE = 5
  const MANAGE_PAGE_SIZE = 5
  const EVALUATION_PAGE_SIZE = 4
  const APPROVAL_PAGE_SIZE = 5
  const ANALYTICS_PAGE_SIZE = 3
  const [currentPage, setCurrentPage] = useState(1)
  const [manageCurrentPage, setManageCurrentPage] = useState(1)
  const [evaluationCurrentPage, setEvaluationCurrentPage] = useState(1)
  const [evaluationHistoryCurrentPage, setEvaluationHistoryCurrentPage] = useState(1)
  const [approvalCurrentPage, setApprovalCurrentPage] = useState(1)
  const [approvalHistoryCurrentPage, setApprovalHistoryCurrentPage] = useState(1)
  const [analyticsCurrentPage, setAnalyticsCurrentPage] = useState(1)
  const [adminActivePanel, setAdminActivePanel] = useState('dashboard')
  const normalizedSearch = tableSearchQuery.trim().toLowerCase()
  const hasTableSearchValue = normalizedSearch.length > 0
  const isTableSearchVisible = isTableSearchOpen || hasTableSearchValue
  const filteredUsers = manageUsers.filter((user) => {
    const matchesRole = tableRoleFilter === 'all' || user.role.toLowerCase() === tableRoleFilter
    const matchesSearch = !normalizedSearch || (
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.role.toLowerCase().includes(normalizedSearch)
    )
    return matchesRole && matchesSearch
  })
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (tableSortMode === 'az') {
      return a.name.localeCompare(b.name)
    }
    return new Date(b.joined) - new Date(a.joined)
  })
  const totalResults = sortedUsers.length
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE))
  const activePage = Math.min(currentPage, totalPages)
  const startIndex = totalResults === 0 ? 0 : (activePage - 1) * PAGE_SIZE
  const endIndex = totalResults === 0 ? 0 : Math.min(startIndex + PAGE_SIZE, totalResults)
  const pagedUsers = sortedUsers.slice(startIndex, endIndex)
  const visiblePages = getVisiblePageNumbers(activePage, totalPages)
  const topScores = [98.5, 97.2, 95.8, 94.5, 92.1]
  const topPerformers = manageUsers.slice(0, 5).map((user, index) => ({
    ...user,
    score: topScores[index] ?? 90,
    tasks: 95 + (4 - index) * 9,
  }))
  const analyticsUsers = manageUsers
    .filter((user) => user.role !== 'Admin')
    .map((user, index) => {
      const accuracy = Math.max(78, 97 - (index % 6) * 2.1)
      const productivity = 72 + (index % 5) * 5
      const consistency = 80 + (index % 4) * 4
      const completedTasks = 64 + index * 3
      return {
        ...user,
        accuracy: Number(accuracy.toFixed(1)),
        productivity,
        consistency,
        completedTasks,
        averageScore: Math.round((accuracy + productivity + consistency) / 3),
      }
    })
  const analyticsTopUsers = [...analyticsUsers]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 5)
  const analyticsSummary = [
    { label: 'Tracked Users', value: analyticsUsers.length, note: 'Current performance roster', icon: <IconUsers size={18} /> },
    { label: 'Avg Accuracy', value: `${Math.round(analyticsUsers.reduce((sum, user) => sum + user.accuracy, 0) / Math.max(analyticsUsers.length, 1))}%`, note: 'Across active user output', icon: <IconReport size={18} /> },
    { label: 'Tasks Completed', value: analyticsUsers.reduce((sum, user) => sum + user.completedTasks, 0).toLocaleString(), note: 'Tracked delivery volume', icon: <IconBook2 size={18} /> },
  ]
  const normalizedAnalyticsSearch = analyticsSearchQuery.trim().toLowerCase()
  const hasAnalyticsSearchValue = normalizedAnalyticsSearch.length > 0
  const isAnalyticsSearchVisible = isAnalyticsSearchOpen || hasAnalyticsSearchValue
  const analyticsBreakdown = [...analyticsUsers]
    .map((user) => ({
    id: `analytics-${user.id}`,
    name: user.name,
    role: user.role,
    accuracy: user.accuracy,
    productivity: user.productivity,
    consistency: user.consistency,
    completedTasks: user.completedTasks,
    averageScore: user.averageScore,
  }))
  const filteredAnalyticsBreakdown = analyticsBreakdown.filter((user) => (
    !normalizedAnalyticsSearch || (
      user.name.toLowerCase().includes(normalizedAnalyticsSearch) ||
      user.role.toLowerCase().includes(normalizedAnalyticsSearch) ||
      String(user.averageScore).includes(normalizedAnalyticsSearch)
    )
  ))
  const sortedAnalyticsBreakdown = [...filteredAnalyticsBreakdown].sort((a, b) => {
    if (analyticsSortMode === 'all') {
      return 0
    }
    if (analyticsSortMode === 'az') {
      return a.name.localeCompare(b.name)
    }
    if (analyticsSortMode === 'lowest') {
      return a.averageScore - b.averageScore
    }
    return b.averageScore - a.averageScore
  })
  const analyticsTotalResults = sortedAnalyticsBreakdown.length
  const analyticsTotalPages = Math.max(1, Math.ceil(analyticsTotalResults / ANALYTICS_PAGE_SIZE))
  const analyticsActivePage = Math.min(analyticsCurrentPage, analyticsTotalPages)
  const analyticsStartIndex = analyticsTotalResults === 0 ? 0 : (analyticsActivePage - 1) * ANALYTICS_PAGE_SIZE
  const analyticsEndIndex = analyticsTotalResults === 0 ? 0 : Math.min(analyticsStartIndex + ANALYTICS_PAGE_SIZE, analyticsTotalResults)
  const pagedAnalyticsBreakdown = sortedAnalyticsBreakdown.slice(analyticsStartIndex, analyticsEndIndex)
  const visibleAnalyticsPages = getVisiblePageNumbers(analyticsActivePage, analyticsTotalPages)
  const manageTotalResults = manageUsers.length
  const manageTotalPages = Math.max(1, Math.ceil(manageTotalResults / MANAGE_PAGE_SIZE))
  const manageActivePage = Math.min(manageCurrentPage, manageTotalPages)
  const manageStartIndex = manageTotalResults === 0 ? 0 : (manageActivePage - 1) * MANAGE_PAGE_SIZE
  const manageEndIndex = manageTotalResults === 0 ? 0 : Math.min(manageStartIndex + MANAGE_PAGE_SIZE, manageTotalResults)
  const visibleManagePages = getVisiblePageNumbers(manageActivePage, manageTotalPages)

  const manageMembers = manageUsers.slice(manageStartIndex, manageEndIndex)
  const approvalQueue = applications.map((application) => {
    const firstName = application.first_name || ''
    const lastName = application.last_name || ''
    const name = `${firstName} ${lastName}`.trim() || 'Applicant'
    const initialsBase = `${firstName.charAt(0) || 'A'}${lastName.charAt(0) || ''}`.toUpperCase()
    const createdAt = application.created_at ? new Date(application.created_at) : null
    const phone = [application.phone_country_code, application.phone_number].filter(Boolean).join(' ')

    return {
      id: application.id,
      name,
      email: application.email || '—',
      initials: initialsBase || 'NA',
      requestedRole: application.position_applied || 'Applicant',
      contactNumber: phone || '—',
      university: application.university || '—',
      requestedAt: createdAt ? createdAt.toLocaleDateString() : 'Recently',
      joined: application.created_at || new Date().toISOString(),
      status: 'inactive',
    }
  })
  const normalizedApprovalSearch = approvalSearchQuery.trim().toLowerCase()
  const hasApprovalSearchValue = normalizedApprovalSearch.length > 0
  const isApprovalSearchVisible = isApprovalSearchOpen || hasApprovalSearchValue
  const filteredApprovalQueue = approvalQueue.filter((user) => (
    (approvalRoleFilter === 'all' || user.requestedRole.toLowerCase() === approvalRoleFilter) &&
    (approvalYearFilter === 'all' || String(new Date(user.joined).getFullYear()) === approvalYearFilter) &&
    (
      !normalizedApprovalSearch ||
      user.name.toLowerCase().includes(normalizedApprovalSearch) ||
      user.email.toLowerCase().includes(normalizedApprovalSearch) ||
      user.requestedRole.toLowerCase().includes(normalizedApprovalSearch)
    )
  ))
  const sortedApprovalQueue = [...filteredApprovalQueue].sort((a, b) => {
    if (approvalSortMode === 'az') {
      return a.name.localeCompare(b.name)
    }
    return 0
  })
  const approvalTotalResults = sortedApprovalQueue.length
  const approvalTotalPages = Math.max(1, Math.ceil(approvalTotalResults / APPROVAL_PAGE_SIZE))
  const approvalActivePage = Math.min(approvalCurrentPage, approvalTotalPages)
  const approvalStartIndex = approvalTotalResults === 0 ? 0 : (approvalActivePage - 1) * APPROVAL_PAGE_SIZE
  const approvalEndIndex = approvalTotalResults === 0 ? 0 : Math.min(approvalStartIndex + APPROVAL_PAGE_SIZE, approvalTotalResults)
  const pagedApprovalQueue = sortedApprovalQueue.slice(approvalStartIndex, approvalEndIndex)
  const visibleApprovalPages = getVisiblePageNumbers(approvalActivePage, approvalTotalPages)
  const normalizedApprovalHistorySearch = approvalHistorySearchQuery.trim().toLowerCase()
  const hasApprovalHistorySearchValue = normalizedApprovalHistorySearch.length > 0
  const isApprovalHistorySearchVisible = isApprovalHistorySearchOpen || hasApprovalHistorySearchValue
  const visibleApprovalHistoryEntries = approvalHistory.filter((entry) => !archivedApprovalHistoryIds.has(entry.id))
  const filteredApprovalHistory = visibleApprovalHistoryEntries.filter((entry) => {
    if (approvalHistoryRoleFilter !== 'all' && entry.role.toLowerCase() !== approvalHistoryRoleFilter) return false
    if (approvalHistoryYearFilter !== 'all' && entry.year !== approvalHistoryYearFilter) return false
    if (!normalizedApprovalHistorySearch) return true
    return (
      entry.name.toLowerCase().includes(normalizedApprovalHistorySearch) ||
      entry.email.toLowerCase().includes(normalizedApprovalHistorySearch) ||
      entry.role.toLowerCase().includes(normalizedApprovalHistorySearch) ||
      entry.decision.toLowerCase().includes(normalizedApprovalHistorySearch)
    )
  })
  const sortedApprovalHistory = [...filteredApprovalHistory].sort((a, b) => {
    if (approvalHistorySortMode === 'az') {
      return a.name.localeCompare(b.name)
    }
    return 0
  })
  const approvalHistoryTotalResults = sortedApprovalHistory.length
  const approvalHistoryTotalPages = Math.max(1, Math.ceil(approvalHistoryTotalResults / APPROVAL_PAGE_SIZE))
  const approvalHistoryActivePage = Math.min(approvalHistoryCurrentPage, approvalHistoryTotalPages)
  const approvalHistoryStartIndex = approvalHistoryTotalResults === 0 ? 0 : (approvalHistoryActivePage - 1) * APPROVAL_PAGE_SIZE
  const approvalHistoryEndIndex = approvalHistoryTotalResults === 0 ? 0 : Math.min(approvalHistoryStartIndex + APPROVAL_PAGE_SIZE, approvalHistoryTotalResults)
  const pagedApprovalHistory = sortedApprovalHistory.slice(approvalHistoryStartIndex, approvalHistoryEndIndex)
  const visibleApprovalHistoryPages = getVisiblePageNumbers(approvalHistoryActivePage, approvalHistoryTotalPages)
  const tabFilteredNotifications = notifications.filter((item) => (
    notificationTab === 'view-all' ? true : item.type === notificationTab
  ))
  const currentNotifications = tabFilteredNotifications.filter((item) => item.section === 'current')
  const previousNotifications = tabFilteredNotifications.filter((item) => item.section === 'previous')
  const unreadNotificationCount = notifications.filter((item) => !item.read).length
  const activeMembersCount = manageUsers.filter((user) => user.status === 'active').length
  const pendingApprovalCount = approvalQueue.length
  const pendingInternApprovals = approvalQueue.filter((user) => user.requestedRole === 'Intern').length
  const pendingEmployeeApprovals = approvalQueue.filter((user) => user.requestedRole === 'Employee').length
  const internUsers = manageUsers.filter((user) => user.role === 'Intern')
  const internAnalyticsUsers = analyticsUsers.filter((user) => user.role === 'Intern')
  const completedEvaluationCount = Object.values(evaluationRecords).filter((entry) => entry.status === 'completed').length
  const inProgressEvaluationCount = Object.values(evaluationRecords).filter((entry) => entry.status === 'in-progress').length
  const averageInternProgress = internAnalyticsUsers.length > 0
    ? `${Math.round(internAnalyticsUsers.reduce((sum, user) => sum + user.averageScore, 0) / internAnalyticsUsers.length)}%`
    : '0%'
  const evaluationSummary = [
    { label: 'Interns For Review', value: Math.max(internUsers.length - completedEvaluationCount, 0), note: 'Active queue awaiting scoring', icon: <IconBook2 size={18} /> },
    { label: 'Now Evaluating', value: inProgressEvaluationCount, note: 'Drafts currently in progress', icon: <IconUserCheck size={18} /> },
    { label: 'Average Progress', value: averageInternProgress, note: 'Overall intern benchmark', icon: <IconReport size={18} /> },
  ]
  const evaluationDueTimes = ['Today, 3:00 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 1:00 PM', 'Mar 12, 9:00 AM', 'Mar 14, 2:00 PM']
  const evaluationStatuses = ['urgent', 'scheduled', 'scheduled', 'queued', 'queued']
  const evaluationQueue = internUsers.map((user, index) => {
    const record = evaluationRecords[user.email]
    const completedTasks = record?.completedTasks ?? []
    const pendingTasks = EVALUATION_TASKS.filter((task) => !completedTasks.includes(task))
    const nextTask = pendingTasks[0] || EVALUATION_TASKS[0]
    const taskIndex = EVALUATION_TASKS.indexOf(nextTask)
    const normalizedTaskIndex = taskIndex >= 0 ? taskIndex : 0
    const status = pendingTasks.length === 0
      ? 'completed'
      : (record?.status || evaluationStatuses[index % evaluationStatuses.length])
    const pendingSubmissions = pendingTasks.map((task) => ({
      task,
      link: record?.submissionLinks?.[task] || createSubmissionLink(user, task),
    }))
    return {
      id: `eval-${user.email}`,
      name: user.name,
      email: user.email,
      initials: user.initials,
      track: nextTask,
      reviewer: 'Francis Merc Barluado',
      due: evaluationDueTimes[normalizedTaskIndex % evaluationDueTimes.length],
      status,
      score: record?.score ?? null,
      pendingCount: pendingTasks.length,
      pendingTasks,
      pendingSubmissions,
      currentSubmissionLink: pendingSubmissions[0]?.link || '',
      notes: record?.notes ?? '',
      recommendation: record?.recommendation ?? '',
      course: user.course,
      university: user.university,
      internshipHours: user.internshipHours,
      activity: user.activity,
      updatedAt: record?.updatedAt ?? '',
    }
  })
  const activeEvaluationQueue = evaluationQueue.filter((item) => item.pendingCount > 0)
  const normalizedEvaluationSearch = evaluationSearchQuery.trim().toLowerCase()
  const hasEvaluationSearchValue = normalizedEvaluationSearch.length > 0
  const isEvaluationSearchVisible = isEvaluationSearchOpen || hasEvaluationSearchValue
  const filteredEvaluationQueue = activeEvaluationQueue.filter((item) => (
    !normalizedEvaluationSearch ||
    item.name.toLowerCase().includes(normalizedEvaluationSearch) ||
    item.track.toLowerCase().includes(normalizedEvaluationSearch) ||
    item.reviewer.toLowerCase().includes(normalizedEvaluationSearch)
  ))
  const evaluationTotalResults = filteredEvaluationQueue.length
  const evaluationTotalPages = Math.max(1, Math.ceil(evaluationTotalResults / EVALUATION_PAGE_SIZE))
  const evaluationActivePage = Math.min(evaluationCurrentPage, evaluationTotalPages)
  const evaluationStartIndex = evaluationTotalResults === 0 ? 0 : (evaluationActivePage - 1) * EVALUATION_PAGE_SIZE
  const evaluationEndIndex = evaluationTotalResults === 0 ? 0 : Math.min(evaluationStartIndex + EVALUATION_PAGE_SIZE, evaluationTotalResults)
  const pagedEvaluationQueue = filteredEvaluationQueue.slice(evaluationStartIndex, evaluationEndIndex)
  const visibleEvaluationPages = getVisiblePageNumbers(evaluationActivePage, evaluationTotalPages)
  const evaluationHistoryEntries = Object.entries(evaluationRecords)
    .flatMap(([email, record]) => {
      const matchedUser = manageUsers.find((user) => user.email === email)
      if (!record?.completedTasks?.length || !matchedUser) return []
      const pendingTasks = EVALUATION_TASKS.filter((task) => !(record.completedTasks || []).includes(task))
      return record.completedTasks.map((task) => ({
        id: `eval-history-${email}-${task}`,
        name: matchedUser.name,
        email,
        task,
        reviewer: 'Francis Merc Barluado',
        submittedAt: record.taskUpdatedAt?.[task] || record.updatedAt || '—',
        score: record.taskScores?.[task] ?? record.score ?? null,
        submissionLink: record.submissionLinks?.[task] || '',
        pendingCount: pendingTasks.length,
        pendingTasks,
        year: String(new Date(record.taskUpdatedAt?.[task] || record.updatedAt || Date.now()).getFullYear()),
        course: matchedUser.course,
        university: matchedUser.university,
      }))
    })
  const normalizedEvaluationHistorySearch = evaluationHistorySearchQuery.trim().toLowerCase()
  const hasEvaluationHistorySearchValue = normalizedEvaluationHistorySearch.length > 0
  const isEvaluationHistorySearchVisible = isEvaluationHistorySearchOpen || hasEvaluationHistorySearchValue
  const visibleEvaluationHistoryEntries = evaluationHistoryEntries.filter((entry) => !archivedEvaluationHistoryIds.has(entry.id))
  const evaluationHistoryYears = Array.from(new Set(visibleEvaluationHistoryEntries.map((entry) => entry.year))).sort((a, b) => b.localeCompare(a))
  const filteredEvaluationHistory = visibleEvaluationHistoryEntries.filter((entry) => {
    if (evaluationHistoryYearFilter !== 'all' && entry.year !== evaluationHistoryYearFilter) return false
    if (!normalizedEvaluationHistorySearch) return true
    return (
      entry.name.toLowerCase().includes(normalizedEvaluationHistorySearch) ||
      entry.email.toLowerCase().includes(normalizedEvaluationHistorySearch) ||
      entry.task.toLowerCase().includes(normalizedEvaluationHistorySearch) ||
      entry.reviewer.toLowerCase().includes(normalizedEvaluationHistorySearch)
    )
  })
  const sortedEvaluationHistory = [...filteredEvaluationHistory].sort((a, b) => {
    if (evaluationHistorySortMode === 'az') {
      return a.name.localeCompare(b.name)
    }
    return (Date.parse(b.submittedAt) || 0) - (Date.parse(a.submittedAt) || 0)
  })
  const evaluationHistoryTotalResults = sortedEvaluationHistory.length
  const evaluationHistoryTotalPages = Math.max(1, Math.ceil(evaluationHistoryTotalResults / EVALUATION_PAGE_SIZE))
  const evaluationHistoryActivePage = Math.min(evaluationHistoryCurrentPage, evaluationHistoryTotalPages)
  const evaluationHistoryStartIndex = evaluationHistoryTotalResults === 0 ? 0 : (evaluationHistoryActivePage - 1) * EVALUATION_PAGE_SIZE
  const evaluationHistoryEndIndex = evaluationHistoryTotalResults === 0
    ? 0
    : Math.min(evaluationHistoryStartIndex + EVALUATION_PAGE_SIZE, evaluationHistoryTotalResults)
  const pagedEvaluationHistory = sortedEvaluationHistory.slice(evaluationHistoryStartIndex, evaluationHistoryEndIndex)
  const visibleEvaluationHistoryPages = getVisiblePageNumbers(evaluationHistoryActivePage, evaluationHistoryTotalPages)
  const evaluationRubric = [
    { title: 'Task Accuracy', description: 'Measure intern output quality, instruction-following, and correction rate.' },
    { title: 'Attendance and Hours', description: 'Check internship hours submitted, schedule consistency, and required progress.' },
    { title: 'Coaching Notes', description: 'Record strengths, blockers, and next-step guidance for each intern review.' },
  ]

  useEffect(() => {
    let isMounted = true
    const loadApplications = async () => {
      setIsApplicationsLoading(true)
      setApplicationsError('')
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
      if (!isMounted) return
      if (error) {
        console.error('Failed to load applications', error)
        setApplicationsError('Unable to load applications.')
        setApplications([])
      } else {
        setApplications(data || [])
      }
      setIsApplicationsLoading(false)
    }

    loadApplications()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (adminUserMenuRef.current && !adminUserMenuRef.current.contains(event.target)) {
        setIsAdminUserMenuOpen(false)
      }
      if (adminNotificationRef.current && !adminNotificationRef.current.contains(event.target)) {
        setIsAdminNotificationOpen(false)
      }
      if (tableFilterRef.current && !tableFilterRef.current.contains(event.target)) {
        setIsTableFilterOpen(false)
      }
      if (approvalFilterRef.current && !approvalFilterRef.current.contains(event.target)) {
        setIsApprovalFilterOpen(false)
      }
      if (approvalHistoryFilterRef.current && !approvalHistoryFilterRef.current.contains(event.target)) {
        setIsApprovalHistoryFilterOpen(false)
      }
      if (evaluationHistoryFilterRef.current && !evaluationHistoryFilterRef.current.contains(event.target)) {
        setIsEvaluationHistoryFilterOpen(false)
      }
      if (analyticsFilterRef.current && !analyticsFilterRef.current.contains(event.target)) {
        setIsAnalyticsFilterOpen(false)
      }
      if (!event.target.closest('.admin-manage-row-actions')) {
        setOpenMemberActionMenuId(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [tableSearchQuery, tableRoleFilter])

  useEffect(() => {
    setEvaluationCurrentPage(1)
  }, [evaluationSearchQuery])

  useEffect(() => {
    setEvaluationHistoryCurrentPage(1)
  }, [evaluationSubtab, evaluationRecords, evaluationHistorySearchQuery, evaluationHistoryYearFilter, evaluationHistorySortMode])

  useEffect(() => {
    setApprovalCurrentPage(1)
  }, [approvalSearchQuery, approvalYearFilter, approvalSortMode, approvalRoleFilter])

  useEffect(() => {
    setApprovalHistoryCurrentPage(1)
  }, [approvalHistorySearchQuery, approvalHistoryYearFilter, approvalHistorySortMode, approvalHistoryRoleFilter])

  useEffect(() => {
    setAnalyticsCurrentPage(1)
  }, [analyticsSearchQuery, analyticsSortMode])

  useEffect(() => {
    if (isTableSearchOpen) {
      tableSearchInputRef.current?.focus()
    }
  }, [isTableSearchOpen])

  useEffect(() => {
    if (isEvaluationSearchOpen) {
      evaluationSearchInputRef.current?.focus()
    }
  }, [isEvaluationSearchOpen])

  useEffect(() => {
    if (isApprovalSearchOpen) {
      approvalSearchInputRef.current?.focus()
    }
  }, [isApprovalSearchOpen])

  useEffect(() => {
    if (isApprovalHistorySearchOpen) {
      approvalHistorySearchInputRef.current?.focus()
    }
  }, [isApprovalHistorySearchOpen])

  useEffect(() => {
    if (isEvaluationHistorySearchOpen) {
      evaluationHistorySearchInputRef.current?.focus()
    }
  }, [isEvaluationHistorySearchOpen])

  useEffect(() => {
    if (isAnalyticsSearchOpen) {
      analyticsSearchInputRef.current?.focus()
    }
  }, [isAnalyticsSearchOpen])

  useEffect(() => {
    if (!isAddMemberModalOpen && !selectedDashboardUser && !selectedEvaluationItem) return undefined
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [isAddMemberModalOpen, selectedDashboardUser, selectedEvaluationItem])

  const handleAddMemberFieldChange = (field, value) => {
    setAddMemberForm((prev) => {
      const nextForm = {
        ...prev,
        [field]: field === 'contactNumber' ? normalizeContactNumber(value) : value,
      }

      if (field === 'role' && value !== 'intern') {
        nextForm.course = ''
        nextForm.internshipHours = ''
        nextForm.university = ''
        nextForm.customUniversity = ''
      }

      return nextForm
    })

    if (addMemberError) {
      setAddMemberError('')
    }
  }

  const handleCloseAddMemberModal = () => {
    setIsAddMemberModalOpen(false)
    setEditingMemberId(null)
    setAddMemberStep(1)
    setAddMemberError('')
    setAddMemberForm(getInitialAddMemberFormState())
  }

  const handleOpenAddMemberModal = () => {
    setEditingMemberId(null)
    setOpenMemberActionMenuId(null)
    setAddMemberStep(1)
    setAddMemberError('')
    setAddMemberForm(getInitialAddMemberFormState())
    setIsAddMemberModalOpen(true)
  }

  const handleEditMember = (member) => {
    const matchedUniversity = ADD_MEMBER_UNIVERSITIES.includes(member.university) ? member.university : ''
    const isOtherUniversity = member.role === 'Intern' && member.university !== '—' && !matchedUniversity
    setEditingMemberId(member.id)
    setOpenMemberActionMenuId(null)
    setAddMemberStep(1)
    setAddMemberError('')
    setAddMemberForm({
      role: getRoleOptionFromLabel(member.role),
      fullName: member.name,
      email: member.email,
      contactNumber: member.contactNumber === '—' ? '' : member.contactNumber,
      course: member.course === '—' ? '' : member.course,
      internshipHours: member.internshipHours === '—' ? '' : member.internshipHours,
      university: member.role === 'Intern' ? (isOtherUniversity ? 'others' : matchedUniversity) : '',
      customUniversity: isOtherUniversity ? member.university : '',
      username: member.username || member.email.split('@')[0],
      password: '',
      confirmPassword: '',
    })
    setIsAddMemberModalOpen(true)
  }

  const handleDeleteMember = (memberId) => {
    setOpenMemberActionMenuId(null)
    setManageUsers((prev) => prev.filter((user) => user.id !== memberId))
    setManageCurrentPage((prev) => Math.max(1, prev))
  }

  const handleAddMemberNextStep = () => {
    const trimmedName = addMemberForm.fullName.trim()
    const trimmedContact = addMemberForm.contactNumber.trim()
    const trimmedCourse = addMemberForm.course.trim()
    const trimmedHours = addMemberForm.internshipHours.trim()
    const trimmedUniversity = (addMemberForm.university === 'others'
      ? addMemberForm.customUniversity
      : addMemberForm.university).trim()

    if (!trimmedName || !trimmedContact) {
      setAddMemberError('Full name and contact number are required.')
      return
    }

    if (addMemberForm.role === 'intern' && (!trimmedCourse || !trimmedHours || !trimmedUniversity)) {
      setAddMemberError('Course, internship hours, and university are required for interns.')
      return
    }

    setAddMemberError('')
    setAddMemberStep(2)
  }

  const handleAddMemberSubmit = (event) => {
    event.preventDefault()

    const trimmedName = addMemberForm.fullName.trim()
    const trimmedEmail = addMemberForm.email.trim().toLowerCase()
    const trimmedContact = addMemberForm.contactNumber.trim()
    const trimmedCourse = addMemberForm.course.trim()
    const trimmedHours = addMemberForm.internshipHours.trim()
    const trimmedUniversity = (addMemberForm.university === 'others'
      ? addMemberForm.customUniversity
      : addMemberForm.university).trim()
    const trimmedUsername = addMemberForm.username.trim()
    const trimmedPassword = addMemberForm.password.trim()
    const trimmedConfirmPassword = addMemberForm.confirmPassword.trim()

    if (!trimmedName || !trimmedContact) {
      setAddMemberError('Full name and contact number are required.')
      return
    }

    if (addMemberForm.role === 'intern' && (!trimmedCourse || !trimmedHours || !trimmedUniversity)) {
      setAddMemberError('Course, internship hours, and university are required for interns.')
      return
    }

    if (!trimmedUsername || !trimmedEmail) {
      setAddMemberError('Username and email are required.')
      return
    }

    if (!editingMemberId && (!trimmedPassword || !trimmedConfirmPassword)) {
      setAddMemberError('Password and confirm password are required for new members.')
      return
    }

    if ((trimmedPassword || trimmedConfirmPassword) && trimmedPassword !== trimmedConfirmPassword) {
      setAddMemberError('Password and confirm password must match.')
      return
    }

    if (manageUsers.some((user) => user.email.toLowerCase() === trimmedEmail && user.id !== editingMemberId)) {
      setAddMemberError('That email already exists in the user list.')
      return
    }

    const nameParts = trimmedName.split(/\s+/).filter(Boolean)
    const firstInitial = nameParts[0]?.charAt(0) || ''
    const lastInitial = nameParts[nameParts.length - 1]?.charAt(0) || firstInitial
    const roleLabel = addMemberForm.role === 'intern'
      ? 'Intern'
      : addMemberForm.role === 'employee'
        ? 'Employee'
        : 'Admin'
    const addedDate = new Date()
    const newMember = {
      id: editingMemberId || `member-${Date.now()}`,
      initials: `${firstInitial}${lastInitial}`.toUpperCase(),
      name: trimmedName,
      email: trimmedEmail,
      role: roleLabel,
      access: roleLabel,
      status: 'active',
      joined: addedDate.toISOString().slice(0, 10),
      contactNumber: trimmedContact,
      course: addMemberForm.role === 'intern' ? trimmedCourse : '—',
      internshipHours: addMemberForm.role === 'intern' ? trimmedHours : '—',
      university: addMemberForm.role === 'intern' ? trimmedUniversity : '—',
      activity: 'Just now',
      onboarding: formatAdminDate(addedDate),
      verified: true,
      username: trimmedUsername,
    }

    setManageUsers((prev) => {
      if (editingMemberId) {
        return prev.map((user) => (user.id === editingMemberId ? { ...user, ...newMember } : user))
      }
      return [newMember, ...prev]
    })
    setManageCurrentPage(1)
    handleCloseAddMemberModal()
  }

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const handleClearAllNotifications = () => {
    setNotifications([])
  }

  const getEvaluationFormForTask = (record, item, task) => {
    const taskScoreBreakdown = record?.taskScoreBreakdown?.[task]
    return {
      accuracy: taskScoreBreakdown?.accuracy ?? record?.scores?.accuracy ?? 5,
      quality: taskScoreBreakdown?.quality ?? record?.scores?.quality ?? 5,
      progress: taskScoreBreakdown?.progress ?? record?.scores?.progress ?? 5,
      consistency: taskScoreBreakdown?.consistency ?? record?.scores?.consistency ?? 5,
      submissionLink: record?.submissionLinks?.[task] || item?.pendingSubmissions?.find((entry) => entry.task === task)?.link || '',
      notes: record?.taskNotes?.[task] ?? record?.notes ?? '',
      recommendation: record?.taskRecommendations?.[task] ?? record?.recommendation ?? '',
    }
  }

  const handleOpenEvaluation = (item) => {
    const existingRecord = evaluationRecords[item.email]
    setSelectedEvaluationItem(item)
    setSelectedEvaluationModalTask(item.track)
    setEvaluationFeedback('')
    setEvaluationForm(getEvaluationFormForTask(existingRecord, item, item.track))
    setEvaluationRecords((prev) => ({
      ...prev,
      [item.email]: {
        ...prev[item.email],
        status: prev[item.email]?.status === 'completed' ? 'completed' : 'in-progress',
      },
    }))
  }

  const handleSelectEvaluationModalTask = (task) => {
    if (!selectedEvaluationItem) return
    const existingRecord = evaluationRecords[selectedEvaluationItem.email]
    setSelectedEvaluationModalTask(task)
    setEvaluationForm(getEvaluationFormForTask(existingRecord, selectedEvaluationItem, task))
  }

  const handleOpenEvaluationDetails = (item) => {
    const matchedUser = manageUsers.find((user) => user.email === item.email)
    const evaluationRecord = evaluationRecords[item.email]
    const evaluationStatus = evaluationRecord?.status || item.status || 'queued'
    const evaluationUpdatedAt = evaluationRecord?.updatedAt || item.updatedAt || '—'
    const submittedAt = evaluationStatus === 'completed' ? evaluationUpdatedAt : 'Not submitted yet'
    const fallbackInitials = item.name
      .split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase()

    const baseUserDetails = matchedUser || {
      id: item.id,
      initials: fallbackInitials || 'NA',
      name: item.name,
      email: item.email,
      role: 'Intern',
      status: 'active',
      joined: new Date().toISOString().slice(0, 10),
      contactNumber: '—',
      course: item.course || '—',
      internshipHours: item.internshipHours || '—',
      university: item.university || '—',
      access: 'Intern',
      activity: item.activity || '—',
      onboarding: '—',
      verified: true,
      username: item.email?.split('@')[0] || '—',
    }

    const completedTaskSet = new Set(evaluationRecord?.completedTasks ?? [])
    const evaluationTaskMap = EVALUATION_TASKS.reduce((acc, task, index) => {
      acc[task] = {
        status: completedTaskSet.has(task) ? 'completed' : (task === item.track ? evaluationStatus : 'queued'),
        due: evaluationDueTimes[index % evaluationDueTimes.length],
        submittedAt: evaluationRecord?.taskUpdatedAt?.[task] || 'Not submitted yet',
        score: evaluationRecord?.taskScores?.[task] != null
          ? `${evaluationRecord.taskScores[task]}/10`
          : 'Not scored',
        submissionLink: evaluationRecord?.submissionLinks?.[task]
          || item.pendingSubmissions?.find((entry) => entry.task === task)?.link
          || createSubmissionLink(baseUserDetails, task),
      }
      return acc
    }, {})

    setSelectedDashboardUser({
      ...baseUserDetails,
      detailType: 'evaluation',
      evaluationTrack: item.track,
      evaluationReviewer: item.reviewer,
      evaluationDue: item.due,
      evaluationStatus,
      evaluationSubmittedAt: submittedAt,
      evaluationUpdatedAt,
      evaluationScore: item.score ? `${item.score}/10` : 'Not scored',
      evaluationSubmissionLink: evaluationRecord?.submissionLinks?.[item.track] || item.currentSubmissionLink || '',
      evaluationPendingCount: item.pendingCount,
      evaluationPendingTasks: item.pendingTasks,
      evaluationTasks: EVALUATION_TASKS,
      evaluationTaskMap,
    })
    setSelectedEvaluationDetailTask(item.track)
  }

  const handleOpenEvaluationHistoryDetails = (entry) => {
    handleOpenEvaluationDetails({
      id: `eval-${entry.email}`,
      name: entry.name,
      email: entry.email,
      track: entry.task,
      reviewer: entry.reviewer,
      due: entry.submittedAt,
      status: 'completed',
      score: entry.score,
      pendingCount: entry.pendingCount,
      pendingTasks: entry.pendingTasks,
      currentSubmissionLink: entry.submissionLink,
      updatedAt: entry.submittedAt,
      course: entry.course,
      university: entry.university,
    })
  }

  const handleCloseEvaluation = () => {
    setSelectedEvaluationItem(null)
    setSelectedEvaluationModalTask('')
    setEvaluationForm(getInitialEvaluationFormState())
  }

  const handleEvaluationFieldChange = (field, value) => {
    setEvaluationForm((prev) => ({
      ...prev,
      [field]: ['accuracy', 'quality', 'progress', 'consistency'].includes(field)
        ? Math.min(10, Math.max(1, Number(value)))
        : value,
    }))
  }

  const getEvaluationOverallScore = (formState) => {
    const total = formState.accuracy + formState.quality + formState.progress + formState.consistency
    return Number((total / 4).toFixed(1))
  }

  const persistEvaluationRecord = (status) => {
    if (!selectedEvaluationItem) return
    const activeTask = selectedEvaluationModalTask || selectedEvaluationItem.track
    const nowLabel = formatAdminDate(new Date())
    const nextScore = getEvaluationOverallScore(evaluationForm)

    setEvaluationRecords((prev) => ({
      ...prev,
      [selectedEvaluationItem.email]: {
        status: (() => {
          if (status === 'in-progress') return 'in-progress'
          const previousCompletedTasks = prev[selectedEvaluationItem.email]?.completedTasks ?? []
          const completedTaskSet = new Set(previousCompletedTasks)
          completedTaskSet.add(activeTask)
          return completedTaskSet.size >= EVALUATION_TASKS.length ? 'completed' : 'queued'
        })(),
        scores: {
          accuracy: evaluationForm.accuracy,
          quality: evaluationForm.quality,
          progress: evaluationForm.progress,
          consistency: evaluationForm.consistency,
        },
        score: nextScore,
        submissionLinks: {
          ...(prev[selectedEvaluationItem.email]?.submissionLinks ?? {}),
          [activeTask]: evaluationForm.submissionLink.trim(),
        },
        taskScores: {
          ...(prev[selectedEvaluationItem.email]?.taskScores ?? {}),
          [activeTask]: nextScore,
        },
        taskScoreBreakdown: {
          ...(prev[selectedEvaluationItem.email]?.taskScoreBreakdown ?? {}),
          [activeTask]: {
            accuracy: evaluationForm.accuracy,
            quality: evaluationForm.quality,
            progress: evaluationForm.progress,
            consistency: evaluationForm.consistency,
          },
        },
        taskUpdatedAt: {
          ...(prev[selectedEvaluationItem.email]?.taskUpdatedAt ?? {}),
          [activeTask]: nowLabel,
        },
        completedTasks: (() => {
          const previousCompletedTasks = prev[selectedEvaluationItem.email]?.completedTasks ?? []
          if (status !== 'completed') return previousCompletedTasks
          const completedTaskSet = new Set(previousCompletedTasks)
          completedTaskSet.add(activeTask)
          return Array.from(completedTaskSet)
        })(),
        taskNotes: {
          ...(prev[selectedEvaluationItem.email]?.taskNotes ?? {}),
          [activeTask]: evaluationForm.notes.trim(),
        },
        taskRecommendations: {
          ...(prev[selectedEvaluationItem.email]?.taskRecommendations ?? {}),
          [activeTask]: evaluationForm.recommendation.trim(),
        },
        notes: evaluationForm.notes.trim(),
        recommendation: evaluationForm.recommendation.trim(),
        updatedAt: nowLabel,
      },
    }))

    const previousCompletedTasks = evaluationRecords[selectedEvaluationItem.email]?.completedTasks ?? []
    const completedTaskSet = new Set(previousCompletedTasks)
    if (status === 'completed') completedTaskSet.add(activeTask)
    const remainingCount = Math.max(EVALUATION_TASKS.length - completedTaskSet.size, 0)

    setEvaluationFeedback(
      status === 'completed'
        ? `${selectedEvaluationItem.name} completed ${activeTask}. ${remainingCount} pending submission(s) remaining.`
        : `Draft evaluation saved for ${selectedEvaluationItem.name}.`
    )
    handleCloseEvaluation()
  }

  const handleArchiveApprovalHistory = (entryId) => {
    setArchivedApprovalHistoryIds((prev) => {
      const next = new Set(prev)
      next.add(entryId)
      return next
    })
  }

  const handleDeleteApprovalHistory = (entryId) => {
    setApprovalHistory((prev) => prev.filter((entry) => entry.id !== entryId))
    setArchivedApprovalHistoryIds((prev) => {
      if (!prev.has(entryId)) return prev
      const next = new Set(prev)
      next.delete(entryId)
      return next
    })
  }

  const removeTaskFromRecordMap = (sourceMap, task) => {
    if (!sourceMap || typeof sourceMap !== 'object') return sourceMap
    const { [task]: _removedTask, ...remaining } = sourceMap
    return remaining
  }

  const handleArchiveEvaluationHistory = (entryId) => {
    setArchivedEvaluationHistoryIds((prev) => {
      const next = new Set(prev)
      next.add(entryId)
      return next
    })
  }

  const handleDeleteEvaluationHistory = (entry) => {
    setEvaluationRecords((prev) => {
      const existingRecord = prev[entry.email]
      if (!existingRecord) return prev
      const nextCompletedTasks = (existingRecord.completedTasks || []).filter((task) => task !== entry.task)
      const nextRecord = {
        ...existingRecord,
        status: nextCompletedTasks.length === 0 && existingRecord.status === 'completed' ? 'in-progress' : existingRecord.status,
        completedTasks: nextCompletedTasks,
        taskScores: removeTaskFromRecordMap(existingRecord.taskScores, entry.task),
        taskScoreBreakdown: removeTaskFromRecordMap(existingRecord.taskScoreBreakdown, entry.task),
        taskUpdatedAt: removeTaskFromRecordMap(existingRecord.taskUpdatedAt, entry.task),
        taskNotes: removeTaskFromRecordMap(existingRecord.taskNotes, entry.task),
        taskRecommendations: removeTaskFromRecordMap(existingRecord.taskRecommendations, entry.task),
        submissionLinks: removeTaskFromRecordMap(existingRecord.submissionLinks, entry.task),
      }
      return {
        ...prev,
        [entry.email]: nextRecord,
      }
    })
    setArchivedEvaluationHistoryIds((prev) => {
      if (!prev.has(entry.id)) return prev
      const next = new Set(prev)
      next.delete(entry.id)
      return next
    })
  }

  const handleNotificationClick = (notificationId) => {
    setNotifications((prev) => prev.map((item) => (
      item.id === notificationId ? { ...item, read: true } : item
    )))
  }

  const handleApprovalDecision = (event, notificationId, decision) => {
    event.stopPropagation()
    setNotifications((prev) => prev.map((item) => {
      if (item.id !== notificationId) return item
      const decisionLabel = decision === 'accepted' ? 'accepted' : 'declined'
      return {
        ...item,
        read: true,
        section: 'previous',
        status: 'info',
        title: 'Approval Closed',
        description: `${item.description.split('. ')[0]}. Request was ${decisionLabel}.`,
      }
    }))
  }

  const handleRemoveNotification = (event, notificationId) => {
    event.stopPropagation()
    setNotifications((prev) => prev.filter((item) => item.id !== notificationId))
  }

  const handleApprovalQueueAction = (email, decision) => {
    const matchedUser = manageUsers.find((user) => user.email === email)
    if (matchedUser) {
      setApprovalHistory((prev) => [
        {
          id: `history-${Date.now()}`,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.requestedRole || matchedUser.role,
          decision: decision === 'approve' ? 'accepted' : 'declined',
          time: 'Just now',
          year: String(new Date().getFullYear()),
        },
        ...prev,
      ])
    }

    setManageUsers((prev) => prev.flatMap((user) => {
      if (user.email !== email) return [user]
      if (decision === 'decline') return []
      return [{
        ...user,
        status: 'active',
        verified: true,
        activity: 'Just now',
        access: user.requestedRole || user.role,
        role: user.requestedRole || user.role,
      }]
    }))
  }

  const adminPanelTitle = adminActivePanel === 'manage-users'
    ? 'Users'
    : adminActivePanel === 'analytics'
      ? 'Data Analytics'
    : adminActivePanel === 'evaluation'
      ? 'Evaluation'
    : adminActivePanel === 'user-approval'
      ? 'User Approval'
      : 'Dashboard'
  const activeEvaluationDetailTask = selectedDashboardUser?.detailType === 'evaluation'
    ? (selectedEvaluationDetailTask || selectedDashboardUser.evaluationTrack)
    : ''
  const activeEvaluationTaskDetail = selectedDashboardUser?.detailType === 'evaluation'
    ? (
      selectedDashboardUser.evaluationTaskMap?.[activeEvaluationDetailTask]
      || {
        status: selectedDashboardUser.evaluationStatus,
        due: selectedDashboardUser.evaluationDue,
        submittedAt: selectedDashboardUser.evaluationSubmittedAt,
        score: selectedDashboardUser.evaluationScore,
        submissionLink: selectedDashboardUser.evaluationSubmissionLink,
      }
    )
    : null
  const activeEvaluationModalTask = selectedEvaluationModalTask || selectedEvaluationItem?.track || ''
  const activeEvaluationModalTaskIndex = EVALUATION_TASKS.indexOf(activeEvaluationModalTask)
  const activeEvaluationModalDue = activeEvaluationModalTaskIndex >= 0
    ? evaluationDueTimes[activeEvaluationModalTaskIndex % evaluationDueTimes.length]
    : (selectedEvaluationItem?.due || '—')

  return (
    <main className="dashboard-page admin-dashboard-page">
      <AnimatePresence>
        {selectedDashboardUser ? (
          <motion.div
            className="admin-member-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedDashboardUser(null)
              setSelectedEvaluationDetailTask('')
            }}
          >
            <motion.section
              className="admin-member-modal admin-dashboard-detail-modal"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-member-modal-close"
                aria-label="Close user details modal"
                onClick={() => {
                  setSelectedDashboardUser(null)
                  setSelectedEvaluationDetailTask('')
                }}
              >
                <IconX size={18} />
              </button>

	              <div className="admin-member-modal-head">
	                <h2>{selectedDashboardUser.name}</h2>
	                <p>
	                  {selectedDashboardUser.detailType === 'evaluation'
	                    ? 'Task and submission details for this evaluation queue item.'
	                    : 'Complete account and onboarding details for the selected dashboard user.'}
	                </p>
	              </div>

		              <div className="admin-dashboard-detail-summary">
		                <span>{selectedDashboardUser.initials}</span>
		                <div>
		                  <strong>{selectedDashboardUser.detailType === 'evaluation' ? 'Evaluation Task' : selectedDashboardUser.role}</strong>
		                  <small>{selectedDashboardUser.detailType === 'evaluation' ? activeEvaluationDetailTask : selectedDashboardUser.email}</small>
		                </div>
		              </div>

		              {selectedDashboardUser.detailType === 'evaluation' ? (
                    <>
                      <div className="admin-evaluation-task-bubbles" aria-label="Evaluation task picker">
                        {selectedDashboardUser.evaluationTasks?.map((task) => (
                          <button
                            key={`evaluation-task-bubble-${selectedDashboardUser.email}-${task}`}
                            type="button"
                            className={activeEvaluationDetailTask === task ? 'active' : ''}
                            onClick={() => setSelectedEvaluationDetailTask(task)}
                          >
                            {task}
                          </button>
                        ))}
                      </div>
		                <div className="admin-dashboard-detail-grid">
		                  <article>
		                    <small>Task</small>
		                    <strong>{activeEvaluationDetailTask}</strong>
		                  </article>
	                  <article>
	                    <small>Reviewer</small>
	                    <strong>{selectedDashboardUser.evaluationReviewer}</strong>
	                  </article>
		                  <article>
		                    <small>Due</small>
		                    <strong>{activeEvaluationTaskDetail?.due || '—'}</strong>
		                  </article>
		                  <article>
		                    <small>Submission Status</small>
		                    <strong>{activeEvaluationTaskDetail?.status || '—'}</strong>
		                  </article>
	                  <article>
	                    <small>Pending Submissions</small>
	                    <strong>{selectedDashboardUser.evaluationPendingCount}</strong>
	                  </article>
	                  <article>
	                    <small>Pending Tasks</small>
	                    <strong>{selectedDashboardUser.evaluationPendingTasks?.join(', ') || 'None'}</strong>
	                  </article>
		                  <article>
		                    <small>Submitted On</small>
		                    <strong>{activeEvaluationTaskDetail?.submittedAt || 'Not submitted yet'}</strong>
		                  </article>
		                  <article>
		                    <small>Latest Score</small>
		                    <strong>{activeEvaluationTaskDetail?.score || 'Not scored'}</strong>
		                  </article>
		                  <article>
		                    <small>Submission Link</small>
		                    <strong>
		                      {activeEvaluationTaskDetail?.submissionLink ? (
		                        <a href={activeEvaluationTaskDetail.submissionLink} target="_blank" rel="noreferrer">
		                          Open Submission
		                        </a>
		                      ) : 'No submission link yet'}
		                    </strong>
		                  </article>
		                </div>
                    </>
		              ) : (
	                <div className="admin-dashboard-detail-grid">
	                  <article>
	                    <small>Status</small>
	                    <strong>{selectedDashboardUser.status === 'active' ? 'Active' : 'Inactive'}</strong>
	                  </article>
	                  <article>
	                    <small>Contact</small>
	                    <strong>{selectedDashboardUser.contactNumber}</strong>
	                  </article>
	                  <article>
	                    <small>Course</small>
	                    <strong>{selectedDashboardUser.course}</strong>
	                  </article>
	                  <article>
	                    <small>Hours</small>
	                    <strong>{selectedDashboardUser.internshipHours}</strong>
	                  </article>
	                  <article>
	                    <small>University</small>
	                    <strong>{selectedDashboardUser.university}</strong>
	                  </article>
	                  <article>
	                    <small>Date Added</small>
	                    <strong>{selectedDashboardUser.onboarding}</strong>
	                  </article>
	                  <article>
	                    <small>Username</small>
	                    <strong>{selectedDashboardUser.username}</strong>
	                  </article>
	                  <article>
	                    <small>Last Activity</small>
	                    <strong>{selectedDashboardUser.activity}</strong>
	                  </article>
	                </div>
	              )}
	            </motion.section>
          </motion.div>
        ) : null}
        {selectedEvaluationItem ? (
          <motion.div
            className="admin-member-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseEvaluation}
          >
            <motion.section
              className="admin-member-modal admin-evaluation-modal"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-member-modal-close"
                aria-label="Close evaluation modal"
                onClick={handleCloseEvaluation}
              >
                <IconX size={18} />
              </button>

              <div className="admin-member-modal-head">
                <h2>Evaluate {selectedEvaluationItem.name}</h2>
                <p>Review the intern queue item, score the current assessment, and save a draft or submit the evaluation.</p>
              </div>

              <div className="admin-evaluation-modal-summary">
                <article>
                  <small>Track</small>
                  <strong>{activeEvaluationModalTask}</strong>
                </article>
                <article>
                  <small>Reviewer</small>
                  <strong>{selectedEvaluationItem.reviewer}</strong>
                </article>
                <article>
                  <small>Due</small>
                  <strong>{activeEvaluationModalDue}</strong>
                </article>
                <article>
                  <small>Overall Score</small>
                  <strong>{getEvaluationOverallScore(evaluationForm)}/10</strong>
                </article>
              </div>

              <div className="admin-evaluation-task-bubbles" aria-label="Evaluation task picker">
                {EVALUATION_TASKS.map((task) => (
                  <button
                    key={`evaluation-modal-task-${selectedEvaluationItem.email}-${task}`}
                    type="button"
                    className={activeEvaluationModalTask === task ? 'active' : ''}
                    onClick={() => handleSelectEvaluationModalTask(task)}
                  >
                    {task}
                  </button>
                ))}
              </div>

              <form
                className="admin-evaluation-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  persistEvaluationRecord('completed')
                }}
              >
                <div className="admin-evaluation-score-grid">
                  <label>
                    Accuracy
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={evaluationForm.accuracy}
                      onChange={(event) => handleEvaluationFieldChange('accuracy', event.target.value)}
                    />
                    <span>{evaluationForm.accuracy}/10</span>
                  </label>
                  <label>
                    Quality
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={evaluationForm.quality}
                      onChange={(event) => handleEvaluationFieldChange('quality', event.target.value)}
                    />
                    <span>{evaluationForm.quality}/10</span>
                  </label>
                  <label>
                    Progress
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={evaluationForm.progress}
                      onChange={(event) => handleEvaluationFieldChange('progress', event.target.value)}
                    />
                    <span>{evaluationForm.progress}/10</span>
                  </label>
                  <label>
                    Consistency
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={evaluationForm.consistency}
                      onChange={(event) => handleEvaluationFieldChange('consistency', event.target.value)}
                    />
                    <span>{evaluationForm.consistency}/10</span>
	                  </label>
	                </div>

	                <label className="admin-evaluation-link-field">
	                  <span>Submission Link (Optional)</span>
	                  <input
	                    type="url"
	                    value={evaluationForm.submissionLink}
	                    readOnly
	                    aria-readonly="true"
	                    placeholder="No submission link provided yet"
	                  />
	                  <small>
	                    {evaluationForm.submissionLink
	                      ? 'Submitted link is view-only during evaluation.'
	                      : 'No link submitted yet.'}
	                  </small>
	                </label>

	                <label className="admin-evaluation-textarea">
	                  Reviewer Notes
                  <textarea
                    value={evaluationForm.notes}
                    onChange={(event) => handleEvaluationFieldChange('notes', event.target.value)}
                    placeholder="Add performance observations, blockers, or coaching points."
                  />
                </label>

                <label className="admin-evaluation-textarea">
                  Next Recommendation
                  <textarea
                    value={evaluationForm.recommendation}
                    onChange={(event) => handleEvaluationFieldChange('recommendation', event.target.value)}
                    placeholder="Define the next action, improvement focus, or follow-up task."
                  />
                </label>

                <div className="admin-evaluation-form-actions">
                  <button type="button" onClick={handleCloseEvaluation}>
                    Cancel
                  </button>
                  <button type="button" className="secondary" onClick={() => persistEvaluationRecord('in-progress')}>
                    <IconDeviceFloppy size={16} />
                    Save Draft
                  </button>
                  <button type="submit" className="primary">
                    Submit Evaluation
                  </button>
                </div>
              </form>
            </motion.section>
          </motion.div>
        ) : null}
        {isAddMemberModalOpen ? (
          <motion.div
            className="admin-member-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAddMemberModal}
          >
            <motion.section
              className="admin-member-modal"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
                <button
                  type="button"
                  className="admin-member-modal-close"
                aria-label="Close add team member modal"
                onClick={handleCloseAddMemberModal}
              >
                <IconX size={18} />
              </button>

              <div className="admin-member-modal-head">
                <h2>{editingMemberId ? 'Edit Team Member' : 'Add Team Member'}</h2>
                <p>
                  {editingMemberId
                    ? 'Update the selected team member using the same two-step onboarding flow.'
                    : 'Create a new team record using the same role-based flow as signup.'}
                </p>
              </div>

              <div className="admin-member-stepper" aria-label="Add team member steps">
                <div className={`admin-member-step-chip ${addMemberStep === 1 ? 'active' : ''}`}>
                  <span>1</span>
                  <strong>Personal</strong>
                </div>
                <div className="admin-member-step-divider" />
                <div className={`admin-member-step-chip ${addMemberStep === 2 ? 'active' : ''}`}>
                  <span>2</span>
                  <strong>Account</strong>
                </div>
              </div>

              <form className="admin-member-form" onSubmit={handleAddMemberSubmit}>
                {addMemberStep === 1 ? (
                  <>
                    <div className="admin-member-form-panel">
                      <div className="admin-member-form-panel-head">
                        <h3>Personal Details</h3>
                        <p>Set the role and onboarding profile details first.</p>
                      </div>
                      <div className="admin-member-form-grid">
                        <label>
                          Role
                          <select
                            value={addMemberForm.role}
                            onChange={(event) => handleAddMemberFieldChange('role', event.target.value)}
                          >
                            <option value="intern">Intern</option>
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                          </select>
                        </label>
                        <label>
                          Full Name
                          <input
                            type="text"
                            value={addMemberForm.fullName}
                            onChange={(event) => handleAddMemberFieldChange('fullName', event.target.value)}
                            placeholder="Enter full name"
                          />
                        </label>
                        <label className="full">
                          Contact Number
                          <input
                            type="tel"
                            value={addMemberForm.contactNumber}
                            onChange={(event) => handleAddMemberFieldChange('contactNumber', event.target.value)}
                            placeholder="0917 123 4567"
                            inputMode="numeric"
                            maxLength={11}
                          />
                        </label>
                        {addMemberForm.role === 'intern' ? (
                          <>
                            <label>
                              Course
                              <input
                                type="text"
                                value={addMemberForm.course}
                                onChange={(event) => handleAddMemberFieldChange('course', event.target.value)}
                                placeholder="Enter course"
                              />
                            </label>
                            <label>
                              Required Internship Hours
                              <input
                                type="text"
                                value={addMemberForm.internshipHours}
                                onChange={(event) => handleAddMemberFieldChange('internshipHours', event.target.value)}
                                placeholder="240 hrs"
                              />
                            </label>
                            <label className="full">
                              University
                              <select
                                value={addMemberForm.university}
                                onChange={(event) => handleAddMemberFieldChange('university', event.target.value)}
                              >
                                <option value="">Select university</option>
                                {ADD_MEMBER_UNIVERSITIES.map((university) => (
                                  <option key={university} value={university}>
                                    {university}
                                  </option>
                                ))}
                                <option value="others">Others</option>
                              </select>
                            </label>
                            {addMemberForm.university === 'others' ? (
                              <label className="full">
                                Other University
                                <input
                                  type="text"
                                  value={addMemberForm.customUniversity}
                                  onChange={(event) => handleAddMemberFieldChange('customUniversity', event.target.value)}
                                  placeholder="Type university name"
                                />
                              </label>
                            ) : null}
                          </>
                        ) : (
                          <div className="admin-member-role-note">
                            Internship-only fields will be marked as `—` for this role in the user table.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="admin-member-form-panel">
                      <div className="admin-member-form-panel-head">
                        <h3>Account Details</h3>
                        <p>
                          {editingMemberId
                            ? 'Update account identity details. Leave password blank to keep the current password.'
                            : 'Finish the account setup credentials for this team member.'}
                        </p>
                      </div>
                      <div className="admin-member-form-grid">
                        <label>
                          Username
                          <input
                            type="text"
                            value={addMemberForm.username}
                            onChange={(event) => handleAddMemberFieldChange('username', event.target.value)}
                            placeholder="Enter username"
                          />
                        </label>
                        <label>
                          Email
                          <input
                            type="email"
                            value={addMemberForm.email}
                            onChange={(event) => handleAddMemberFieldChange('email', event.target.value)}
                            placeholder="Enter email address"
                          />
                        </label>
                        <label>
                          Password
                          <input
                            type="password"
                            value={addMemberForm.password}
                            onChange={(event) => handleAddMemberFieldChange('password', event.target.value)}
                            placeholder="Enter password"
                          />
                        </label>
                        <label>
                          Confirm Password
                          <input
                            type="password"
                            value={addMemberForm.confirmPassword}
                            onChange={(event) => handleAddMemberFieldChange('confirmPassword', event.target.value)}
                            placeholder="Confirm password"
                          />
                        </label>
                      </div>
                    </div>
                  </>
                )}
                {addMemberError ? <p className="admin-member-form-error">{addMemberError}</p> : null}
                <div className="admin-member-form-actions">
                  {addMemberStep === 1 ? (
                    <>
                      <button type="button" className="secondary" onClick={handleCloseAddMemberModal}>
                        Cancel
                      </button>
                      <button type="button" className="primary" onClick={handleAddMemberNextStep}>
                        Continue
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="secondary" onClick={() => setAddMemberStep(1)}>
                        Previous
                      </button>
                      <button type="submit" className="primary">
                        <IconUserPlus size={16} />
                        {editingMemberId ? 'Save Changes' : 'Add Member'}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="dashboard-ambient admin-ambient" aria-hidden="true">
        <span className="dashboard-ambient-orb orb-one" />
        <span className="dashboard-ambient-orb orb-two" />
      </div>
      <section className={`admin-dashboard-shell ${isAdminSidebarExpanded ? 'admin-expanded' : 'admin-collapsed'}`}>
        <aside className={`admin-dashboard-sidebar ${isAdminSidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="admin-dashboard-brand">
            <img
              src="https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429"
              alt="Lifewood"
              loading="lazy"
            />
            <button
              type="button"
              className="admin-dashboard-brand-menu"
              aria-label={isAdminSidebarExpanded ? 'Collapse admin menu' : 'Expand admin menu'}
              onMouseEnter={() => {
                if (!isAdminSidebarExpanded) setIsAdminSidebarExpanded(true)
              }}
              onClick={() => setIsAdminSidebarExpanded((prev) => !prev)}
            >
              <IconMenu2 size={18} />
            </button>
          </div>
          <div className="admin-dashboard-profile">
            <img src={mercProfile} alt="Francis Merc Barluado" loading="lazy" />
            <p>FRANCIS MERC BARLUADO</p>
          </div>

          <nav className="admin-dashboard-nav" aria-label="Admin Dashboard">
            <button
              type="button"
              className={adminActivePanel === 'dashboard' ? 'active' : ''}
              onClick={() => setAdminActivePanel('dashboard')}
            >
              <IconLayoutDashboard size={18} />
              <span className="admin-dashboard-nav-label">Dashboard</span>
            </button>
            <button
              type="button"
              className={adminActivePanel === 'analytics' ? 'active' : ''}
              onClick={() => setAdminActivePanel('analytics')}
            >
              <IconReport size={18} />
              <span className="admin-dashboard-nav-label">Data Analytics</span>
            </button>
            <button
              type="button"
              className={`admin-dashboard-nav-parent ${adminActivePanel === 'evaluation' ? 'active' : ''}`}
              onClick={() => {
                setAdminActivePanel('evaluation')
                setEvaluationSubtab('queue')
              }}
            >
              <IconBook2 size={18} />
              <span className="admin-dashboard-nav-label">Evaluation</span>
              <span className="admin-dashboard-nav-arrow" aria-hidden="true">&#8250;</span>
            </button>
            {adminActivePanel === 'evaluation' ? (
              <div className="admin-dashboard-subnav" aria-label="Evaluation sections">
                <button
                  type="button"
                  className={evaluationSubtab === 'queue' ? 'active' : ''}
                  onClick={() => setEvaluationSubtab('queue')}
                >
                  <span className="admin-dashboard-nav-label">Evaluation Queue</span>
                </button>
                <button
                  type="button"
                  className={evaluationSubtab === 'history' ? 'active' : ''}
                  onClick={() => setEvaluationSubtab('history')}
                >
                  <span className="admin-dashboard-nav-label">Evaluation History</span>
                </button>
              </div>
            ) : null}
            <button
              type="button"
              className={`admin-dashboard-nav-parent ${adminActivePanel === 'user-approval' ? 'active' : ''}`}
              onClick={() => {
                setAdminActivePanel('user-approval')
                setApprovalSubtab('pending')
              }}
            >
              <IconUserCheck size={18} />
              <span className="admin-dashboard-nav-label">User Approval</span>
              <span className="admin-dashboard-nav-arrow" aria-hidden="true">&#8250;</span>
            </button>
            {adminActivePanel === 'user-approval' ? (
              <div className="admin-dashboard-subnav" aria-label="User approval sections">
                <button
                  type="button"
                  className={approvalSubtab === 'pending' ? 'active' : ''}
                  onClick={() => setApprovalSubtab('pending')}
                >
                  <span className="admin-dashboard-nav-label">Pending Approvals</span>
                </button>
                <button
                  type="button"
                  className={approvalSubtab === 'history' ? 'active' : ''}
                  onClick={() => setApprovalSubtab('history')}
                >
                  <span className="admin-dashboard-nav-label">Approval History</span>
                </button>
              </div>
            ) : null}
            <button
              type="button"
              className={adminActivePanel === 'manage-users' ? 'active' : ''}
              onClick={() => setAdminActivePanel('manage-users')}
            >
              <IconUsers size={18} />
              <span className="admin-dashboard-nav-label">User Management</span>
            </button>
          </nav>

          <button type="button" className="admin-dashboard-logout" onClick={() => onNavigate('/get-started')}>
            <IconLogout size={18} />
            <span className="admin-dashboard-nav-label">Logout</span>
          </button>
        </aside>

        <section className="admin-dashboard-content">
          <header className="admin-dashboard-topbar">
            <h1>{adminPanelTitle}</h1>
            <div className="admin-dashboard-top-right">
              <div className="admin-dashboard-notif-wrap" ref={adminNotificationRef}>
                <button
                  type="button"
                  className="admin-dashboard-icon-btn admin-dashboard-notif-btn"
                  aria-label="Notifications"
                  aria-expanded={isAdminNotificationOpen}
                  onClick={() => setIsAdminNotificationOpen((prev) => !prev)}
                >
                  <IconBell size={18} />
                  {unreadNotificationCount > 0 ? (
                    <span className="admin-dashboard-notif-badge">{unreadNotificationCount}</span>
                  ) : null}
                </button>
                {isAdminNotificationOpen ? (
                  <div className="admin-dashboard-notif-menu" role="menu" aria-label="Notifications panel">
                    <div className="admin-dashboard-notif-head">
                      <div className="admin-dashboard-notif-head-copy">
                        <strong>Your Notifications</strong>
                        <span className="admin-dashboard-notif-pill">{unreadNotificationCount} New</span>
                      </div>
                      <button type="button" className="admin-dashboard-notif-clear-btn" onClick={handleClearAllNotifications}>Clear All</button>
                    </div>
                    <div className="admin-dashboard-notif-tabs">
                      <button type="button" className={notificationTab === 'view-all' ? 'active' : ''} onClick={() => setNotificationTab('view-all')}>View All</button>
                      <button type="button" className={notificationTab === 'approval' ? 'active' : ''} onClick={() => setNotificationTab('approval')}>Approval</button>
                      <button type="button" className={notificationTab === 'messages' ? 'active' : ''} onClick={() => setNotificationTab('messages')}>Messages</button>
                    </div>
                    <div className="admin-dashboard-notif-list">
                      {currentNotifications.length > 0 ? (
                        <div className="admin-dashboard-notif-section">
                          <div className="admin-dashboard-notif-section-head">
                            <small>Your Notifications</small>
                            <button type="button" onClick={handleMarkAllNotificationsRead}>Mark all read</button>
                          </div>
                          {currentNotifications.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              role="menuitem"
                              className={`admin-dashboard-notif-item ${item.read ? 'is-read' : 'is-unread'}`}
                              onClick={() => handleNotificationClick(item.id)}
                            >
                              <span className="admin-dashboard-notif-dot" aria-hidden="true" />
                              <div className="admin-dashboard-notif-item-body">
                                <div className="admin-dashboard-notif-title-row">
                                  <b>{item.title}</b>
                                  <em className={`admin-dashboard-notif-status ${item.status}`}>{item.status}</em>
                                </div>
                                <p>{item.description}</p>
                                {item.type === 'approval' ? (
                                  <div className="admin-dashboard-notif-actions">
                                    <button
                                      type="button"
                                      className="admin-dashboard-notif-action accept"
                                      onClick={(event) => handleApprovalDecision(event, item.id, 'accepted')}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      className="admin-dashboard-notif-action decline"
                                      onClick={(event) => handleApprovalDecision(event, item.id, 'declined')}
                                    >
                                      Decline
                                    </button>
                                  </div>
                                ) : null}
                                <div className="admin-dashboard-notif-meta">
                                  <small>{item.time}</small>
                                  {!item.read ? <span>Mark as read</span> : <span>Read</span>}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {previousNotifications.length > 0 ? (
                        <div className="admin-dashboard-notif-section">
                          <div className="admin-dashboard-notif-section-head">
                            <small>Previous Notifications</small>
                          </div>
                          {previousNotifications.map((item) => (
                            <div key={item.id} className={`admin-dashboard-notif-item is-archived ${item.read ? 'is-read' : 'is-unread'}`}>
                              <span className="admin-dashboard-notif-dot" aria-hidden="true" />
                              <div className="admin-dashboard-notif-item-body">
                                <div className="admin-dashboard-notif-title-row">
                                  <b>{item.title}</b>
                                  <button
                                    type="button"
                                    className="admin-dashboard-notif-remove-btn"
                                    aria-label="Remove notification"
                                    onClick={(event) => handleRemoveNotification(event, item.id)}
                                  >
                                    <IconX size={14} />
                                  </button>
                                </div>
                                <p>{item.description}</p>
                                <div className="admin-dashboard-notif-meta">
                                  <small>{item.time}</small>
                                  <span>Archived</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {tabFilteredNotifications.length === 0 ? (
                        <div className="admin-dashboard-notif-empty">
                          <p>No notifications in this tab.</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="admin-dashboard-user-wrap" ref={adminUserMenuRef}>
                <button
                  type="button"
                  className="admin-dashboard-user"
                  aria-label="Open profile menu"
                  aria-expanded={isAdminUserMenuOpen}
                  onClick={() => setIsAdminUserMenuOpen((prev) => !prev)}
                >
                  <div>
                    <strong>Barluado, Francis Merc</strong>
                    <small>Super Admin</small>
                  </div>
                  <img src={mercProfile} alt="Francis Merc Barluado" loading="lazy" />
                </button>
                {isAdminUserMenuOpen ? (
                  <div className="admin-dashboard-user-menu" role="menu" aria-label="Profile menu">
                    <button type="button" role="menuitem" onClick={() => setIsAdminUserMenuOpen(false)}>
                      <IconUserEdit size={16} />
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsAdminUserMenuOpen(false)
                        onNavigate('/get-started')
                      }}
                    >
                      <IconLogout size={16} />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          {adminActivePanel === 'manage-users' ? (
            <>
              <section className="admin-manage-hero admin-evaluation-hero">
                <div>
                  <h2>User Management</h2>
                  <p>Configure team roles, permissions and security settings</p>
                </div>
                <button
                  type="button"
                  className="admin-manage-add-btn"
                  onClick={handleOpenAddMemberModal}
                >
                  <IconUserPlus size={16} />
                  Add Team Member
                </button>
              </section>

              <section className="admin-manage-stats">
                <article className="admin-dashboard-stat-card admin-manage-stat">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUserCheck size={18} />
                    </span>
                    <b className="positive">+4 this month</b>
                  </div>
                  <p>Total Members</p>
                  <h3>{manageUsers.length}</h3>
                </article>
                <article className="admin-dashboard-stat-card admin-manage-stat">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUsers size={18} />
                    </span>
                    <b className="positive">Live</b>
                  </div>
                  <p>Active Now</p>
                  <h3>{activeMembersCount}</h3>
                </article>
                <article className="admin-dashboard-stat-card admin-manage-stat">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconBell size={18} />
                    </span>
                    <b>2 expiring soon</b>
                  </div>
                  <p>Pending Approvals</p>
                  <h3>{pendingApprovalCount}</h3>
                </article>
              </section>

              <section className="admin-dashboard-table-card admin-manage-table-card">
                <div className="admin-dashboard-table-head admin-manage-table-head">
                  <div>
                    <h2>User Accounts</h2>
                    <p>Latest registrations and updates</p>
                  </div>
                  <div className="admin-dashboard-table-tools">
                    <button type="button" className="admin-dashboard-icon-btn" aria-label="Search users">
                      <IconSearch size={18} />
                    </button>
                    <button type="button" className="admin-dashboard-icon-btn" aria-label="Filter users">
                      <IconFilter size={18} />
                    </button>
                  </div>
                </div>

                <div className="admin-manage-table-grid admin-manage-table-columns">
                  <span>User Identity</span>
                  <span>Role</span>
                  <span>Contact</span>
                  <span>Course</span>
                  <span>Hours</span>
                  <span>University</span>
                  <span>Date Added</span>
                  <span>Actions</span>
                </div>

                <div className="admin-dashboard-table-body">
                  {manageMembers.map((member) => (
                    <article key={`manage-${member.email}`} className="admin-manage-table-grid admin-manage-user-row">
                      <div className="admin-dashboard-user-cell">
                        <span>{member.initials}</span>
                        <div>
                          <strong>{member.name}</strong>
                          <small>{member.email}</small>
                        </div>
                      </div>
                      <p><em>{member.access}</em></p>
                      <p>{member.contactNumber}</p>
                      <p>{member.course}</p>
                      <p>{member.internshipHours}</p>
                      <p>{member.university}</p>
                      <p>
                        {member.onboarding}
                        <small>{member.verified ? 'Verified' : 'Pending'}</small>
                      </p>
                      <div className="admin-manage-row-actions">
                        <button
                          type="button"
                          className="admin-dashboard-row-action"
                          aria-label={`More actions for ${member.name}`}
                          aria-expanded={openMemberActionMenuId === member.id}
                          onClick={() => setOpenMemberActionMenuId((prev) => (prev === member.id ? null : member.id))}
                        >
                          <IconDotsVertical size={16} />
                        </button>
                        {openMemberActionMenuId === member.id ? (
                          <div className="admin-dashboard-filter-menu admin-manage-row-menu" role="menu" aria-label={`Actions for ${member.name}`}>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => handleEditMember(member)}
                            >
                              Edit member
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className="danger"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              Remove member
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>

                <div className="admin-dashboard-pagination">
                  <p className="admin-dashboard-pagination-summary">
                    Showing <b>{manageTotalResults === 0 ? 0 : manageStartIndex + 1}</b> to <b>{manageEndIndex}</b> of <b>{manageTotalResults}</b> results
                  </p>
                  <div className="admin-dashboard-pagination-controls" aria-label="Manage users pagination">
                    <button
                      type="button"
                      className="admin-dashboard-page-btn arrow"
                      aria-label="Previous page"
                      disabled={manageActivePage === 1}
                      onClick={() => setManageCurrentPage((prev) => Math.max(1, prev - 1))}
                    >
                      &#8249;
                    </button>
                    {visibleManagePages.map((page) => (
                      <button
                        key={`manage-page-${page}`}
                        type="button"
                        className={`admin-dashboard-page-btn ${manageActivePage === page ? 'active' : ''}`}
                        onClick={() => setManageCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    {visibleManagePages[visibleManagePages.length - 1] < manageTotalPages ? (
                      <span className="admin-dashboard-page-ellipsis">...</span>
                    ) : null}
                    <button
                      type="button"
                      className="admin-dashboard-page-btn arrow"
                      aria-label="Next page"
                      disabled={manageActivePage === manageTotalPages}
                      onClick={() => setManageCurrentPage((prev) => Math.min(manageTotalPages, prev + 1))}
                    >
                      &#8250;
                    </button>
                  </div>
                </div>
              </section>
            </>
          ) : adminActivePanel === 'analytics' ? (
            <>
              <section className="admin-manage-hero admin-analytics-hero">
                <div>
                  <h2>Data Analytics</h2>
                  <p>Monitor user-based performance, output quality, and delivery consistency across the active roster.</p>
                </div>
              </section>

              <section className="admin-manage-stats admin-analytics-stats">
                {analyticsSummary.map((item) => (
                  <article key={item.label} className="admin-dashboard-stat-card admin-manage-stat">
                    <div className="admin-dashboard-stat-head">
                      <span className="admin-dashboard-stat-icon">
                        {item.icon}
                      </span>
                      <b className="positive">{item.note}</b>
                    </div>
                    <p>{item.label}</p>
                    <h3>{item.value}</h3>
                  </article>
                ))}
              </section>

              <section className="admin-dashboard-data-grid admin-analytics-grid">
                <section className="admin-dashboard-table-card admin-analytics-card">
                  <div className="admin-dashboard-table-head">
                    <div>
                      <h2>User Performance Overview</h2>
                      <p>Top-performing users ranked by current quality and throughput metrics.</p>
                    </div>
                  <div className="admin-dashboard-table-tools">
                    <div
                      className="admin-dashboard-search-trigger"
                      onMouseEnter={() => setIsAnalyticsSearchOpen(true)}
                      onMouseLeave={() => {
                        if (!hasAnalyticsSearchValue) setIsAnalyticsSearchOpen(false)
                      }}
                    >
                      <label className={`admin-dashboard-table-search ${isAnalyticsSearchVisible ? 'is-open' : ''}`}>
                        <IconSearch size={18} />
                        <input
                          ref={analyticsSearchInputRef}
                          type="text"
                          placeholder="Search performance..."
                          aria-label="Search user performance"
                          value={analyticsSearchQuery}
                          onChange={(event) => setAnalyticsSearchQuery(event.target.value)}
                        />
                      </label>
                      <button
                        type="button"
                        className="admin-dashboard-icon-btn"
                        aria-label="Search user performance"
                        aria-pressed={isAnalyticsSearchVisible}
                        onClick={() => {
                          if (hasAnalyticsSearchValue) return
                          setIsAnalyticsSearchOpen((prev) => !prev)
                        }}
                      >
                        <IconSearch size={18} />
                      </button>
                    </div>
                      <div className="admin-dashboard-filter-wrap" ref={analyticsFilterRef}>
                        <button
                          type="button"
                          className="admin-dashboard-icon-btn"
                          aria-label="Sort user performance"
                          aria-expanded={isAnalyticsFilterOpen}
                          onClick={() => setIsAnalyticsFilterOpen((prev) => !prev)}
                        >
                          <IconFilter size={18} />
                        </button>
                        {isAnalyticsFilterOpen ? (
                          <div className="admin-dashboard-filter-menu" role="menu" aria-label="User performance sort options">
                            <button
                              type="button"
                              role="menuitem"
                              className={analyticsSortMode === 'all' ? 'active' : ''}
                              onClick={() => {
                                setAnalyticsSortMode('all')
                                setIsAnalyticsFilterOpen(false)
                              }}
                            >
                              All
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className={analyticsSortMode === 'highest' ? 'active' : ''}
                              onClick={() => {
                                setAnalyticsSortMode('highest')
                                setIsAnalyticsFilterOpen(false)
                              }}
                            >
                              Highest Score
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className={analyticsSortMode === 'lowest' ? 'active' : ''}
                              onClick={() => {
                                setAnalyticsSortMode('lowest')
                                setIsAnalyticsFilterOpen(false)
                              }}
                            >
                              Lowest Score
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className={analyticsSortMode === 'az' ? 'active' : ''}
                              onClick={() => {
                                setAnalyticsSortMode('az')
                                setIsAnalyticsFilterOpen(false)
                              }}
                            >
                              A-Z
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="admin-analytics-list">
                    {pagedAnalyticsBreakdown.length > 0 ? pagedAnalyticsBreakdown.map((user) => (
                      <article key={user.id} className="admin-analytics-item">
                        <div className="admin-analytics-item-main">
                          <div className="admin-analytics-item-user">
                            <span>{user.name.split(' ').map((part) => part.charAt(0)).slice(0, 2).join('').toUpperCase()}</span>
                            <div>
                              <strong>{user.name}</strong>
                              <small>{user.role}</small>
                            </div>
                          </div>
                          <p className="admin-analytics-overall-score">
                            Overall Score <b>{user.averageScore}%</b>
                          </p>
                        </div>
                        <div className="admin-analytics-metrics">
                          <article className="admin-analytics-metric-card">
                            <small>Accuracy</small>
                            <strong>{user.accuracy}%</strong>
                          </article>
                          <article className="admin-analytics-metric-card">
                            <small>Productivity</small>
                            <strong>{user.productivity}%</strong>
                          </article>
                          <article className="admin-analytics-metric-card">
                            <small>Consistency</small>
                            <strong>{user.consistency}%</strong>
                          </article>
                          <article className="admin-analytics-metric-card highlight">
                            <small>Tasks Completed</small>
                            <strong>{user.completedTasks}</strong>
                          </article>
                        </div>
                      </article>
                    )) : (
                      <div className="admin-dashboard-table-empty admin-analytics-empty">
                        {normalizedAnalyticsSearch
                          ? 'No users matched your performance filters.'
                          : 'No user performance data is available right now.'}
                      </div>
                    )}
                  </div>
                  <div className="admin-dashboard-pagination">
                    <p className="admin-dashboard-pagination-summary">
                      Showing <b>{analyticsTotalResults === 0 ? 0 : analyticsStartIndex + 1}</b> to <b>{analyticsEndIndex}</b> of <b>{analyticsTotalResults}</b> results
                    </p>
                    <div className="admin-dashboard-pagination-controls" aria-label="Analytics performance pagination">
                      <button
                        type="button"
                        className="admin-dashboard-page-btn arrow"
                        aria-label="Previous analytics page"
                        disabled={analyticsActivePage === 1}
                        onClick={() => setAnalyticsCurrentPage((prev) => Math.max(1, prev - 1))}
                      >
                        &#8249;
                      </button>
                      {visibleAnalyticsPages.map((page) => (
                        <button
                          key={`analytics-page-${page}`}
                          type="button"
                          className={`admin-dashboard-page-btn ${analyticsActivePage === page ? 'active' : ''}`}
                          onClick={() => setAnalyticsCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      {visibleAnalyticsPages[visibleAnalyticsPages.length - 1] < analyticsTotalPages ? <span className="admin-dashboard-page-ellipsis">...</span> : null}
                      <button
                        type="button"
                        className="admin-dashboard-page-btn arrow"
                        aria-label="Next analytics page"
                        disabled={analyticsActivePage === analyticsTotalPages}
                        onClick={() => setAnalyticsCurrentPage((prev) => Math.min(analyticsTotalPages, prev + 1))}
                      >
                        &#8250;
                      </button>
                    </div>
                  </div>
                </section>

                <aside className="admin-dashboard-top-performers admin-analytics-sidebar">
                  <div className="admin-dashboard-top-performers-head">
                    <h3>Performance Leaders</h3>
                    <small>User-based leaderboard</small>
                  </div>
                  <div className="admin-dashboard-top-performers-list">
                    {analyticsTopUsers.map((member, index) => (
                      <article key={`analytics-top-${member.email}`} className="admin-dashboard-top-performer-item admin-analytics-leader">
                        <div className="admin-dashboard-top-performer-user">
                          <span>{index + 1}</span>
                          <div>
                            <strong>{member.name}</strong>
                            <small>{member.role}</small>
                          </div>
                        </div>
                        <div className="admin-dashboard-top-performer-score">
                          <b>{member.accuracy}%</b>
                          <small>{member.completedTasks} tasks</small>
                        </div>
                      </article>
                    ))}
                  </div>
                </aside>
              </section>
            </>
	          ) : adminActivePanel === 'evaluation' ? (
	            <>
	              <section className="admin-manage-hero admin-evaluation-hero">
	                <div>
	                  <h2>{evaluationSubtab === 'history' ? 'Evaluation History' : 'Evaluation Center'}</h2>
	                  <p>
	                    {evaluationSubtab === 'history'
	                      ? 'Review completed evaluations and previously submitted assessment records.'
	                      : 'Monitor intern assessments, progress checks, and upcoming review assignments.'}
	                  </p>
	                </div>
	              </section>

              <section className="admin-manage-stats admin-evaluation-stats">
                {evaluationSummary.map((item) => (
                  <article key={item.label} className="admin-dashboard-stat-card admin-manage-stat">
                    <div className="admin-dashboard-stat-head">
                      <span className="admin-dashboard-stat-icon">
                        {item.icon}
                      </span>
                      <b className="positive">{item.note}</b>
                    </div>
                    <p>{item.label}</p>
                    <h3>{item.value}</h3>
                  </article>
                ))}
              </section>

              <section className="admin-dashboard-data-grid admin-evaluation-grid">
	                <section className="admin-dashboard-table-card admin-evaluation-card">
	                  <div className="admin-dashboard-table-head">
	                    <div>
	                      <h2>{evaluationSubtab === 'history' ? 'Evaluation History' : 'Evaluation Queue'}</h2>
	                      <p>
	                        {evaluationSubtab === 'history'
	                          ? 'Completed evaluations with task-level records and submitted outcomes.'
	                          : 'Intern evaluations awaiting review and scoring.'}
	                      </p>
	                    </div>
	                    {evaluationSubtab === 'queue' ? (
	                      <div className="admin-dashboard-table-tools">
	                        <div
	                          className="admin-dashboard-search-trigger"
	                          onMouseEnter={() => setIsEvaluationSearchOpen(true)}
	                          onMouseLeave={() => {
	                            if (!hasEvaluationSearchValue) setIsEvaluationSearchOpen(false)
	                          }}
	                        >
	                          <label className={`admin-dashboard-table-search ${isEvaluationSearchVisible ? 'is-open' : ''}`}>
	                            <IconSearch size={18} />
	                            <input
	                              ref={evaluationSearchInputRef}
	                              type="text"
	                              placeholder="Search evaluations..."
	                              aria-label="Search evaluations"
	                              value={evaluationSearchQuery}
	                              onChange={(event) => setEvaluationSearchQuery(event.target.value)}
	                            />
	                          </label>
	                          <button
	                            type="button"
	                            className="admin-dashboard-icon-btn"
	                            aria-label="Search evaluations"
	                            aria-pressed={isEvaluationSearchVisible}
	                            onClick={() => {
	                              if (hasEvaluationSearchValue) return
	                              setIsEvaluationSearchOpen((prev) => !prev)
	                            }}
	                          >
	                            <IconSearch size={18} />
	                          </button>
	                        </div>
	                      </div>
	                    ) : (
                        <div className="admin-dashboard-table-tools">
                          <div
                            className="admin-dashboard-search-trigger"
                            onMouseEnter={() => setIsEvaluationHistorySearchOpen(true)}
                            onMouseLeave={() => {
                              if (!hasEvaluationHistorySearchValue) setIsEvaluationHistorySearchOpen(false)
                            }}
                          >
                            <label className={`admin-dashboard-table-search ${isEvaluationHistorySearchVisible ? 'is-open' : ''}`}>
                              <IconSearch size={18} />
                              <input
                                ref={evaluationHistorySearchInputRef}
                                type="text"
                                placeholder="Search evaluation history..."
                                aria-label="Search evaluation history"
                                value={evaluationHistorySearchQuery}
                                onChange={(event) => setEvaluationHistorySearchQuery(event.target.value)}
                              />
                            </label>
                            <button
                              type="button"
                              className="admin-dashboard-icon-btn"
                              aria-label="Search evaluation history"
                              aria-pressed={isEvaluationHistorySearchVisible}
                              onClick={() => {
                                if (hasEvaluationHistorySearchValue) return
                                setIsEvaluationHistorySearchOpen((prev) => !prev)
                              }}
                            >
                              <IconSearch size={18} />
                            </button>
                          </div>
                          <div className="admin-dashboard-filter-wrap" ref={evaluationHistoryFilterRef}>
                            <button
                              type="button"
                              className="admin-dashboard-icon-btn"
                              aria-label="Filter evaluation history by year"
                              aria-expanded={isEvaluationHistoryFilterOpen}
                              onClick={() => setIsEvaluationHistoryFilterOpen((prev) => !prev)}
                            >
                              <IconFilter size={18} />
                            </button>
                            {isEvaluationHistoryFilterOpen ? (
                              <div className="admin-dashboard-filter-menu" role="menu" aria-label="Evaluation history filters">
                                <button
                                  type="button"
                                  role="menuitem"
                                  className={evaluationHistorySortMode === 'all' ? 'active' : ''}
                                  onClick={() => {
                                    setEvaluationHistorySortMode('all')
                                    setEvaluationHistoryYearFilter('all')
                                    setIsEvaluationHistoryFilterOpen(false)
                                  }}
                                >
                                  All
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className={evaluationHistorySortMode === 'az' ? 'active' : ''}
                                  onClick={() => {
                                    setEvaluationHistorySortMode('az')
                                    setEvaluationHistoryYearFilter('all')
                                    setIsEvaluationHistoryFilterOpen(false)
                                  }}
                                >
                                  A-Z
                                </button>
                                {evaluationHistoryYears.map((year) => (
                                  <button
                                    key={`evaluation-history-year-${year}`}
                                    type="button"
                                    role="menuitem"
                                    className={evaluationHistoryYearFilter === year ? 'active' : ''}
                                    onClick={() => {
                                      setEvaluationHistoryYearFilter(year)
                                      setIsEvaluationHistoryFilterOpen(false)
                                    }}
                                  >
                                    {year}
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
	                  </div>
	                  {evaluationSubtab === 'queue' ? (
	                    <>
	                      {evaluationFeedback ? (
	                        <div className="admin-evaluation-feedback">{evaluationFeedback}</div>
	                      ) : null}
	                      <div className="admin-evaluation-list">
	                        {pagedEvaluationQueue.length > 0 ? pagedEvaluationQueue.map((item) => (
	                          <article key={item.id} className="admin-evaluation-item">
	                            <div className="admin-evaluation-item-main">
	                              <strong>{item.name}</strong>
	                              <p>Next task: {item.track}</p>
	                              <small>Pending submissions: {item.pendingCount}</small>
	                              {item.score ? <small>Latest score: {item.score}/10</small> : null}
	                            </div>
	                            <div className="admin-evaluation-item-actions">
	                              <button
	                                type="button"
	                                className="secondary"
	                                onClick={() => handleOpenEvaluationDetails(item)}
	                              >
	                                View Full Details
	                              </button>
	                              <button type="button" onClick={() => handleOpenEvaluation(item)}>
	                                {item.status === 'in-progress' ? 'Continue Evaluation' : 'Start Evaluation'}
	                              </button>
	                            </div>
	                          </article>
	                        )) : (
	                          <div className="admin-dashboard-table-empty">
	                            {normalizedEvaluationSearch
	                              ? 'No evaluations matched your search.'
	                              : 'No intern evaluations are queued right now.'}
	                          </div>
	                        )}
	                      </div>
	                      <div className="admin-dashboard-pagination admin-evaluation-pagination">
	                        <p className="admin-dashboard-pagination-summary">
	                          Showing <b>{evaluationTotalResults === 0 ? 0 : evaluationStartIndex + 1}</b> to <b>{evaluationEndIndex}</b> of <b>{evaluationTotalResults}</b> results
	                        </p>
	                        <div className="admin-dashboard-pagination-controls admin-evaluation-pagination-controls" aria-label="Evaluation queue pagination">
	                          <button
	                            type="button"
	                            className="admin-dashboard-page-btn admin-evaluation-page-btn arrow"
	                            aria-label="Previous evaluation page"
	                            disabled={evaluationActivePage === 1}
	                            onClick={() => setEvaluationCurrentPage((prev) => Math.max(1, prev - 1))}
	                          >
	                            &#8249;
	                          </button>
	                          {visibleEvaluationPages.map((page) => (
	                            <button
	                              key={`evaluation-page-${page}`}
	                              type="button"
	                              className={`admin-dashboard-page-btn admin-evaluation-page-btn ${evaluationActivePage === page ? 'active' : ''}`}
	                              onClick={() => setEvaluationCurrentPage(page)}
	                            >
	                              {page}
	                            </button>
	                          ))}
	                          {visibleEvaluationPages[visibleEvaluationPages.length - 1] < evaluationTotalPages ? (
	                            <span className="admin-dashboard-page-ellipsis admin-evaluation-page-ellipsis">...</span>
	                          ) : null}
	                          <button
	                            type="button"
	                            className="admin-dashboard-page-btn admin-evaluation-page-btn arrow"
	                            aria-label="Next evaluation page"
	                            disabled={evaluationActivePage === evaluationTotalPages}
	                            onClick={() => setEvaluationCurrentPage((prev) => Math.min(evaluationTotalPages, prev + 1))}
	                          >
	                            &#8250;
	                          </button>
	                        </div>
	                      </div>
	                    </>
	                  ) : (
	                    <>
	                      <div className="admin-evaluation-list">
	                        {pagedEvaluationHistory.length > 0 ? pagedEvaluationHistory.map((entry) => (
	                          <article key={entry.id} className="admin-evaluation-item admin-evaluation-history-item">
	                            <div className="admin-evaluation-item-main">
	                              <strong>{entry.name}</strong>
	                              <p>Task: {entry.task}</p>
	                              <small>Submitted: {entry.submittedAt}</small>
	                              {entry.score !== null ? <small>Score: {entry.score}/10</small> : null}
	                            </div>
	                            <div className="admin-evaluation-item-actions">
	                              <span className="admin-evaluation-status completed">completed</span>
	                              <button
	                                type="button"
	                                className="secondary"
	                                onClick={() => handleOpenEvaluationHistoryDetails(entry)}
	                              >
	                                View Full Details
	                              </button>
                                <div className="admin-history-action-group" aria-label="Evaluation history actions">
	                                <button
	                                  type="button"
	                                  className="secondary admin-history-action-btn"
	                                  onClick={() => handleArchiveEvaluationHistory(entry.id)}
	                                >
	                                  Archive
	                                </button>
	                                <button
	                                  type="button"
	                                  className="secondary admin-history-action-btn danger"
	                                  onClick={() => handleDeleteEvaluationHistory(entry)}
	                                >
	                                  Delete
	                                </button>
	                              </div>
	                            </div>
	                          </article>
	                        )) : (
	                          <div className="admin-dashboard-table-empty">
	                            {normalizedEvaluationHistorySearch || evaluationHistoryYearFilter !== 'all'
	                              ? 'No evaluation history matched your filters.'
	                              : 'No completed evaluations yet.'}
	                          </div>
	                        )}
	                      </div>
	                      <div className="admin-dashboard-pagination admin-evaluation-pagination">
	                        <p className="admin-dashboard-pagination-summary">
	                          Showing <b>{evaluationHistoryTotalResults === 0 ? 0 : evaluationHistoryStartIndex + 1}</b> to <b>{evaluationHistoryEndIndex}</b> of <b>{evaluationHistoryTotalResults}</b> results
	                        </p>
	                        <div className="admin-dashboard-pagination-controls admin-evaluation-pagination-controls" aria-label="Evaluation history pagination">
	                          <button
	                            type="button"
	                            className="admin-dashboard-page-btn admin-evaluation-page-btn arrow"
	                            aria-label="Previous evaluation history page"
	                            disabled={evaluationHistoryActivePage === 1}
	                            onClick={() => setEvaluationHistoryCurrentPage((prev) => Math.max(1, prev - 1))}
	                          >
	                            &#8249;
	                          </button>
	                          {visibleEvaluationHistoryPages.map((page) => (
	                            <button
	                              key={`evaluation-history-page-${page}`}
	                              type="button"
	                              className={`admin-dashboard-page-btn admin-evaluation-page-btn ${evaluationHistoryActivePage === page ? 'active' : ''}`}
	                              onClick={() => setEvaluationHistoryCurrentPage(page)}
	                            >
	                              {page}
	                            </button>
	                          ))}
	                          {visibleEvaluationHistoryPages[visibleEvaluationHistoryPages.length - 1] < evaluationHistoryTotalPages ? (
	                            <span className="admin-dashboard-page-ellipsis admin-evaluation-page-ellipsis">...</span>
	                          ) : null}
	                          <button
	                            type="button"
	                            className="admin-dashboard-page-btn admin-evaluation-page-btn arrow"
	                            aria-label="Next evaluation history page"
	                            disabled={evaluationHistoryActivePage === evaluationHistoryTotalPages}
	                            onClick={() => setEvaluationHistoryCurrentPage((prev) => Math.min(evaluationHistoryTotalPages, prev + 1))}
	                          >
	                            &#8250;
	                          </button>
	                        </div>
	                      </div>
	                    </>
	                  )}
	                </section>

                <aside className="admin-dashboard-top-performers admin-evaluation-rubric">
                  <div className="admin-dashboard-top-performers-head">
                    <h3>Evaluation Focus</h3>
                    <small>Current Intern Review Criteria</small>
                  </div>
                  <div className="admin-evaluation-rubric-list">
                    {evaluationRubric.map((item) => (
                      <article key={item.title} className="admin-evaluation-rubric-item">
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </article>
                    ))}
                  </div>
                </aside>
              </section>
            </>
          ) : adminActivePanel === 'user-approval' ? (
            <>
              <section className="admin-manage-hero admin-approval-hero">
                <div>
                  <h2>{approvalSubtab === 'history' ? 'Approval History' : 'User Approval Queue'}</h2>
                  <p>
                    {approvalSubtab === 'history'
                      ? 'Review previously accepted and declined approval decisions'
                      : 'Review and approve newly registered user accounts'}
                  </p>
                </div>
              </section>

              <section className="admin-manage-stats admin-approval-stats">
                <article className="admin-dashboard-stat-card admin-manage-stat">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUserCheck size={18} />
                    </span>
                    <b className="positive">Needs review</b>
                  </div>
                  <p>Total Pending</p>
                  <h3>{pendingApprovalCount}</h3>
                </article>
                <article className="admin-dashboard-stat-card admin-manage-stat">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUsers size={18} />
                    </span>
                    <b className="positive">Intern</b>
                  </div>
                  <p>Intern Requests</p>
                  <h3>{pendingInternApprovals}</h3>
                </article>
                <article className="admin-dashboard-stat-card admin-manage-stat">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUserPlus size={18} />
                    </span>
                    <b className="positive">Employee</b>
                  </div>
                  <p>Employee Requests</p>
                  <h3>{pendingEmployeeApprovals}</h3>
                </article>
              </section>

              <section className="admin-dashboard-table-card admin-manage-table-card">
                {approvalSubtab === 'pending' ? (
                  <>
                <div className="admin-dashboard-table-head admin-manage-table-head">
                  <div>
                    <h2>Pending Approvals</h2>
                    <p>Accounts waiting for admin approval</p>
                  </div>
                  <div className="admin-dashboard-table-tools">
                    <div
                      className="admin-dashboard-search-trigger"
                      onMouseEnter={() => setIsApprovalSearchOpen(true)}
                      onMouseLeave={() => {
                        if (!hasApprovalSearchValue) setIsApprovalSearchOpen(false)
                      }}
                    >
                    <label className={`admin-dashboard-table-search ${isApprovalSearchVisible ? 'is-open' : ''}`}>
                      <IconSearch size={18} />
                      <input
                        ref={approvalSearchInputRef}
                        type="text"
                        placeholder="Search approvals..."
                        aria-label="Search approvals"
                        value={approvalSearchQuery}
                        onChange={(event) => setApprovalSearchQuery(event.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className="admin-dashboard-icon-btn"
                      aria-label="Search approvals"
                      aria-pressed={isApprovalSearchVisible}
                      onClick={() => {
                        if (hasApprovalSearchValue) return
                        setIsApprovalSearchOpen((prev) => !prev)
                        }}
                      >
                        <IconSearch size={18} />
                      </button>
                    </div>
                    <div className="admin-dashboard-filter-wrap" ref={approvalFilterRef}>
                      <button
                        type="button"
                        className="admin-dashboard-icon-btn"
                        aria-label="Filter pending approvals"
                        aria-expanded={isApprovalFilterOpen}
                        onClick={() => setIsApprovalFilterOpen((prev) => !prev)}
                      >
                        <IconFilter size={18} />
                      </button>
                      {isApprovalFilterOpen ? (
                        <div className="admin-dashboard-filter-menu" role="menu" aria-label="Pending approval year filters">
                          <button
                            type="button"
                            role="menuitem"
                            className={approvalSortMode === 'all' ? 'active' : ''}
                            onClick={() => {
                              setApprovalSortMode('all')
                              setApprovalYearFilter('all')
                              setApprovalRoleFilter('all')
                              setIsApprovalFilterOpen(false)
                            }}
                          >
                            By Date
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className={approvalSortMode === 'az' ? 'active' : ''}
                            onClick={() => {
                              setApprovalSortMode('az')
                              setApprovalYearFilter('all')
                              setApprovalRoleFilter('all')
                              setIsApprovalFilterOpen(false)
                            }}
                          >
                            By A-Z
                          </button>
                          <div className={`admin-dashboard-filter-item ${approvalRoleFilter !== 'all' ? 'active' : ''}`}>
                            <button
                              type="button"
                              role="menuitem"
                              className="admin-dashboard-filter-parent"
                              aria-haspopup="menu"
                            >
                              Role
                            </button>
                            <div className="admin-dashboard-filter-submenu" role="menu" aria-label="Filter pending approvals by role">
                              <button
                                type="button"
                                role="menuitem"
                                className={approvalRoleFilter === 'all' ? 'active' : ''}
                                onClick={() => {
                                  setApprovalRoleFilter('all')
                                  setIsApprovalFilterOpen(false)
                                }}
                              >
                                All Roles
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={approvalRoleFilter === 'admin' ? 'active' : ''}
                                onClick={() => {
                                  setApprovalRoleFilter('admin')
                                  setIsApprovalFilterOpen(false)
                                }}
                              >
                                Admin
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={approvalRoleFilter === 'employee' ? 'active' : ''}
                                onClick={() => {
                                  setApprovalRoleFilter('employee')
                                  setIsApprovalFilterOpen(false)
                                }}
                              >
                                Employee
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={approvalRoleFilter === 'intern' ? 'active' : ''}
                                onClick={() => {
                                  setApprovalRoleFilter('intern')
                                  setIsApprovalFilterOpen(false)
                                }}
                              >
                                Intern
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="admin-approval-table-grid admin-manage-table-columns">
                  <span>User Identity</span>
                  <span>Requested Role</span>
                  <span>Contact</span>
                  <span>University</span>
                  <span>Requested</span>
                  <span>Actions</span>
                </div>

                <div className="admin-dashboard-table-body">
                  {pagedApprovalQueue.length > 0 ? pagedApprovalQueue.map((member) => (
                    <article key={`approval-${member.email}`} className="admin-approval-table-grid admin-manage-user-row admin-approval-user-row">
                      <div className="admin-dashboard-user-cell">
                        <span>{member.initials}</span>
                        <div>
                          <strong>{member.name}</strong>
                          <small>{member.email}</small>
                        </div>
                      </div>
                      <p><em>{member.requestedRole}</em></p>
                      <p>{member.contactNumber}</p>
                      <p>{member.university}</p>
                      <p>{member.requestedAt}</p>
                      <div className="admin-approval-row-actions">
                        <button
                          type="button"
                          className="admin-approval-action approve"
                          onClick={() => handleApprovalQueueAction(member.email, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="admin-approval-action decline"
                          onClick={() => handleApprovalQueueAction(member.email, 'decline')}
                        >
                          Decline
                        </button>
                      </div>
                    </article>
                  )) : (
                    <div className="admin-dashboard-table-empty">
                      {isApplicationsLoading
                        ? 'Loading applications...'
                        : applicationsError
                          ? applicationsError
                          : (normalizedApprovalSearch || approvalYearFilter !== 'all'
                            ? 'No approvals matched your filters.'
                            : 'No pending approvals right now.')}
                    </div>
                  )}
                </div>
                <div className="admin-dashboard-pagination">
                  <p className="admin-dashboard-pagination-summary">
                    Showing <b>{approvalTotalResults === 0 ? 0 : approvalStartIndex + 1}</b> to <b>{approvalEndIndex}</b> of <b>{approvalTotalResults}</b> results
                  </p>
                  <div className="admin-dashboard-pagination-controls" aria-label="Pending approvals pagination">
                    <button
                      type="button"
                      className="admin-dashboard-page-btn arrow"
                      aria-label="Previous pending approvals page"
                      disabled={approvalActivePage === 1}
                      onClick={() => setApprovalCurrentPage((prev) => Math.max(1, prev - 1))}
                    >
                      &#8249;
                    </button>
                    {visibleApprovalPages.map((page) => (
                      <button
                        key={`approval-page-${page}`}
                        type="button"
                        className={`admin-dashboard-page-btn ${approvalActivePage === page ? 'active' : ''}`}
                        onClick={() => setApprovalCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    {visibleApprovalPages[visibleApprovalPages.length - 1] < approvalTotalPages ? <span className="admin-dashboard-page-ellipsis">...</span> : null}
                    <button
                      type="button"
                      className="admin-dashboard-page-btn arrow"
                      aria-label="Next pending approvals page"
                      disabled={approvalActivePage === approvalTotalPages}
                      onClick={() => setApprovalCurrentPage((prev) => Math.min(approvalTotalPages, prev + 1))}
                    >
                      &#8250;
                    </button>
                  </div>
                </div>
                  </>
                ) : (
                  <>
                <div className="admin-dashboard-table-head admin-manage-table-head">
                  <div>
                    <h2>User Approval History</h2>
                    <p>Recently accepted and declined requests</p>
                  </div>
                  <div className="admin-dashboard-table-tools">
                    <div
                      className="admin-dashboard-search-trigger"
                      onMouseEnter={() => setIsApprovalHistorySearchOpen(true)}
                      onMouseLeave={() => {
                        if (!hasApprovalHistorySearchValue) setIsApprovalHistorySearchOpen(false)
                      }}
                    >
                    <label className={`admin-dashboard-table-search ${isApprovalHistorySearchVisible ? 'is-open' : ''}`}>
                      <IconSearch size={18} />
                      <input
                        ref={approvalHistorySearchInputRef}
                        type="text"
                        placeholder="Search history..."
                        aria-label="Search approval history"
                        value={approvalHistorySearchQuery}
                        onChange={(event) => setApprovalHistorySearchQuery(event.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className="admin-dashboard-icon-btn"
                      aria-label="Search approval history"
                      aria-pressed={isApprovalHistorySearchVisible}
                      onClick={() => {
                        if (hasApprovalHistorySearchValue) return
                        setIsApprovalHistorySearchOpen((prev) => !prev)
                        }}
                      >
                        <IconSearch size={18} />
                      </button>
                    </div>
                    <div className="admin-dashboard-filter-wrap" ref={approvalHistoryFilterRef}>
                      <button
                        type="button"
                        className="admin-dashboard-icon-btn"
                        aria-label="Filter approval history"
                        aria-expanded={isApprovalHistoryFilterOpen}
                        onClick={() => setIsApprovalHistoryFilterOpen((prev) => !prev)}
                      >
                        <IconFilter size={18} />
                      </button>
                      {isApprovalHistoryFilterOpen ? (
                        <div className="admin-dashboard-filter-menu" role="menu" aria-label="Approval history year filters">
                          <button
                            type="button"
                            role="menuitem"
                            className={approvalHistorySortMode === 'all' ? 'active' : ''}
                            onClick={() => {
                              setApprovalHistorySortMode('all')
                              setApprovalHistoryYearFilter('all')
                              setApprovalHistoryRoleFilter('all')
                              setIsApprovalHistoryFilterOpen(false)
                            }}
                          >
                            By Date
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className={approvalHistorySortMode === 'az' ? 'active' : ''}
                            onClick={() => {
                              setApprovalHistorySortMode('az')
                              setApprovalHistoryYearFilter('all')
                              setApprovalHistoryRoleFilter('all')
                              setIsApprovalHistoryFilterOpen(false)
                            }}
                          >
                            By A-Z
                          </button>
                          <div className={`admin-dashboard-filter-item ${approvalHistoryRoleFilter !== 'all' ? 'active' : ''}`}>
                            <button
                              type="button"
                              role="menuitem"
                              className="admin-dashboard-filter-parent"
                              aria-haspopup="menu"
                            >
                              Role
                            </button>
                            <div className="admin-dashboard-filter-submenu" role="menu" aria-label="Filter approval history by role">
                              <button
                                type="button"
                                role="menuitem"
                                className={approvalHistoryRoleFilter === 'all' ? 'active' : ''}
                                onClick={() => {
                                  setApprovalHistoryRoleFilter('all')
                                  setIsApprovalHistoryFilterOpen(false)
                                }}
                              >
                                All Roles
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={approvalHistoryRoleFilter === 'admin' ? 'active' : ''}
                                onClick={() => {
                                  setApprovalHistoryRoleFilter('admin')
                                  setIsApprovalHistoryFilterOpen(false)
                                }}
                              >
                                Admin
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={approvalHistoryRoleFilter === 'employee' ? 'active' : ''}
                                onClick={() => {
                                  setApprovalHistoryRoleFilter('employee')
                                  setIsApprovalHistoryFilterOpen(false)
                                }}
                              >
                                Employee
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={approvalHistoryRoleFilter === 'intern' ? 'active' : ''}
                                onClick={() => {
                                  setApprovalHistoryRoleFilter('intern')
                                  setIsApprovalHistoryFilterOpen(false)
                                }}
                              >
                                Intern
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="admin-approval-history-list">
                  {pagedApprovalHistory.length > 0 ? pagedApprovalHistory.map((entry) => (
                    <article key={entry.id} className="admin-approval-history-item">
                      <div className="admin-approval-history-user">
                        <span>{entry.name.split(' ').map((part) => part.charAt(0)).slice(0, 2).join('').toUpperCase()}</span>
                        <div>
                          <strong>{entry.name}</strong>
                          <small>{entry.email}</small>
                        </div>
                      </div>
                      <p>{entry.role}</p>
                      <p className={`admin-approval-history-decision ${entry.decision}`}>
                        {entry.decision === 'accepted' ? 'Accepted' : 'Declined'}
                      </p>
                      <p>{entry.time}</p>
                      <div className="admin-history-action-group" aria-label="Approval history actions">
                        <button
                          type="button"
                          className="admin-history-action-btn"
                          onClick={() => handleArchiveApprovalHistory(entry.id)}
                        >
                          Archive
                        </button>
                        <button
                          type="button"
                          className="admin-history-action-btn danger"
                          onClick={() => handleDeleteApprovalHistory(entry.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  )) : (
                    <div className="admin-dashboard-table-empty">
                      {normalizedApprovalHistorySearch || approvalHistoryYearFilter !== 'all'
                        ? 'No approval history matched your filters.'
                        : 'No approval history yet.'}
                    </div>
                  )}
                </div>
                <div className="admin-dashboard-pagination">
                  <p className="admin-dashboard-pagination-summary">
                    Showing <b>{approvalHistoryTotalResults === 0 ? 0 : approvalHistoryStartIndex + 1}</b> to <b>{approvalHistoryEndIndex}</b> of <b>{approvalHistoryTotalResults}</b> results
                  </p>
                  <div className="admin-dashboard-pagination-controls" aria-label="Approval history pagination">
                    <button
                      type="button"
                      className="admin-dashboard-page-btn arrow"
                      aria-label="Previous approval history page"
                      disabled={approvalHistoryActivePage === 1}
                      onClick={() => setApprovalHistoryCurrentPage((prev) => Math.max(1, prev - 1))}
                    >
                      &#8249;
                    </button>
                    {visibleApprovalHistoryPages.map((page) => (
                      <button
                        key={`approval-history-page-${page}`}
                        type="button"
                        className={`admin-dashboard-page-btn ${approvalHistoryActivePage === page ? 'active' : ''}`}
                        onClick={() => setApprovalHistoryCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    {visibleApprovalHistoryPages[visibleApprovalHistoryPages.length - 1] < approvalHistoryTotalPages ? <span className="admin-dashboard-page-ellipsis">...</span> : null}
                    <button
                      type="button"
                      className="admin-dashboard-page-btn arrow"
                      aria-label="Next approval history page"
                      disabled={approvalHistoryActivePage === approvalHistoryTotalPages}
                      onClick={() => setApprovalHistoryCurrentPage((prev) => Math.min(approvalHistoryTotalPages, prev + 1))}
                    >
                      &#8250;
                    </button>
                  </div>
                </div>
                  </>
                )}
              </section>
            </>
          ) : (
            <>
              <section className="admin-dashboard-stats">
                <article className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUsers size={18} />
                    </span>
                    <b className="positive">+12%</b>
                  </div>
                  <p>Total Users</p>
                  <h3>12,450</h3>
                </article>

                <article className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUserPlus size={18} />
                    </span>
                    <b className="positive">+5.4%</b>
                  </div>
                  <p>New Signups</p>
                  <h3>1,240</h3>
                </article>

                <article className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUserCheck size={18} />
                    </span>
                    <b className="positive">+8.2%</b>
                  </div>
                  <p>Verified Users</p>
                  <h3>11,842</h3>
                </article>

                <article className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUserX size={18} />
                    </span>
                    <b className="negative">-2.1%</b>
                  </div>
                  <p>Inactive Accounts</p>
                  <h3>156</h3>
                </article>
              </section>

              <section className="admin-dashboard-data-grid">
                <section className="admin-dashboard-table-card">
                <div className="admin-dashboard-table-head">
                  <div>
                    <h2>Recent User Accounts</h2>
                    <p>Latest registrations and updates</p>
                  </div>
                  <div className="admin-dashboard-table-tools">
                    <div
                      className="admin-dashboard-search-trigger"
                      onMouseEnter={() => setIsTableSearchOpen(true)}
                      onMouseLeave={() => {
                        if (!hasTableSearchValue) setIsTableSearchOpen(false)
                      }}
                    >
                      <label
                        className={`admin-dashboard-table-search ${isTableSearchVisible ? 'is-open' : ''}`}
                      >
                        <IconSearch size={18} />
                        <input
                          ref={tableSearchInputRef}
                          type="text"
                          placeholder="Search users..."
                          aria-label="Search users"
                          value={tableSearchQuery}
                          onChange={(event) => setTableSearchQuery(event.target.value)}
                        />
                      </label>
                      <button
                        type="button"
                        className="admin-dashboard-icon-btn"
                        aria-label="Search users"
                        aria-pressed={isTableSearchVisible}
                        onClick={() => {
                          if (hasTableSearchValue) return
                          setIsTableSearchOpen((prev) => !prev)
                        }}
                      >
                        <IconSearch size={18} />
                      </button>
                    </div>
                    <div className="admin-dashboard-filter-wrap" ref={tableFilterRef}>
                      <button
                        type="button"
                        className="admin-dashboard-icon-btn"
                        aria-label="Filter users"
                        aria-expanded={isTableFilterOpen}
                        onClick={() => setIsTableFilterOpen((prev) => !prev)}
                      >
                        <IconFilter size={18} />
                      </button>
                      {isTableFilterOpen ? (
                        <div className="admin-dashboard-filter-menu" role="menu" aria-label="User filters">
                          <button
                            type="button"
                            role="menuitem"
                            className={tableSortMode === 'date' ? 'active' : ''}
                            onClick={() => {
                              setTableSortMode('date')
                              setIsTableFilterOpen(false)
                            }}
                          >
                            By Date
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className={tableSortMode === 'az' ? 'active' : ''}
                            onClick={() => {
                              setTableSortMode('az')
                              setIsTableFilterOpen(false)
                            }}
                          >
                            By A-Z
                          </button>
                          <div className={`admin-dashboard-filter-item has-submenu ${tableRoleFilter !== 'all' ? 'active' : ''}`}>
                            <button
                              type="button"
                              role="menuitem"
                              className="admin-dashboard-filter-parent"
                              aria-haspopup="menu"
                            >
                              Role
                            </button>
                            <div className="admin-dashboard-filter-submenu" role="menu" aria-label="Filter users by role">
                              <button
                                type="button"
                                role="menuitem"
                                className={tableRoleFilter === 'all' ? 'active' : ''}
                                onClick={() => {
                                  setTableRoleFilter('all')
                                  setIsTableFilterOpen(false)
                                }}
                              >
                                All Roles
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={tableRoleFilter === 'admin' ? 'active' : ''}
                                onClick={() => {
                                  setTableRoleFilter('admin')
                                  setIsTableFilterOpen(false)
                                }}
                              >
                                Admin
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={tableRoleFilter === 'intern' ? 'active' : ''}
                                onClick={() => {
                                  setTableRoleFilter('intern')
                                  setIsTableFilterOpen(false)
                                }}
                              >
                                Intern
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="admin-dashboard-table-grid admin-dashboard-table-columns">
                  <span>User</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Joined</span>
                  <span>Actions</span>
                </div>

                <div className="admin-dashboard-table-body">
                  {pagedUsers.length > 0 ? (
                    pagedUsers.map((user) => (
                      <article key={user.email} className="admin-dashboard-table-grid admin-dashboard-user-row">
                        <div className="admin-dashboard-user-cell">
                          <span>{user.initials}</span>
                          <div>
                            <strong>{user.name}</strong>
                            <small>{user.email}</small>
                          </div>
                        </div>
                        <p>{user.role}</p>
                        <p className={`admin-dashboard-status ${user.status}`}>
                          <i />
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </p>
                        <p>{user.joined}</p>
                        <button
                          type="button"
                          className="admin-dashboard-detail-btn"
                          onClick={() => setSelectedDashboardUser(user)}
                        >
                          View Full Details
                        </button>
                      </article>
                    ))
                  ) : (
                    <div className="admin-dashboard-table-empty">No matching users found.</div>
                  )}
                </div>

                <div className="admin-dashboard-pagination">
                  <p className="admin-dashboard-pagination-summary">
                    Showing <b>{totalResults === 0 ? 0 : startIndex + 1}</b> to <b>{endIndex}</b> of <b>{totalResults}</b> results
                  </p>
                  <div className="admin-dashboard-pagination-controls" aria-label="Pagination">
                    <button
                      type="button"
                      className="admin-dashboard-page-btn arrow"
                      aria-label="Previous page"
                      disabled={activePage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    >
                      &#8249;
                    </button>
                    {visiblePages.map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`admin-dashboard-page-btn ${activePage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    {visiblePages[visiblePages.length - 1] < totalPages ? <span className="admin-dashboard-page-ellipsis">...</span> : null}
                    <button
                      type="button"
                      className="admin-dashboard-page-btn arrow"
                      aria-label="Next page"
                      disabled={activePage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    >
                      &#8250;
                    </button>
                  </div>
                </div>
                </section>

                <aside className="admin-dashboard-top-performers">
                  <div className="admin-dashboard-top-performers-head">
                    <h3>Top Performers</h3>
                    <small>Weekly Leaderboard</small>
                  </div>
                  <div className="admin-dashboard-top-performers-list">
                    {topPerformers.map((member) => (
                      <article key={`top-${member.email}`} className="admin-dashboard-top-performer-item">
                        <div className="admin-dashboard-top-performer-user">
                          <span>{member.initials}</span>
                          <div>
                            <strong>{member.name}</strong>
                            <small>{member.role}</small>
                          </div>
                        </div>
                        <div className="admin-dashboard-top-performer-score">
                          <b>{member.score.toFixed(1)}%</b>
                          <small>{member.tasks} tasks</small>
                        </div>
                      </article>
                    ))}
                  </div>
                </aside>
              </section>
            </>
          )}

          <footer className="admin-dashboard-footnote">
            © 2024 Lifewood AI Data Solutions. All rights reserved. Always switch on never off.
          </footer>
        </section>
      </section>
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
            mouseForce={14}
            cursorSize={110}
            isViscous
            viscous={24}
            iterationsViscous={18}
            iterationsPoisson={18}
            resolution={0.36}
            isBounce={false}
            autoDemo
            autoSpeed={0.38}
            autoIntensity={1.5}
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
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <OfferHoverCard
                  step={`0${index + 1}`}
                  title={item.title}
                  text={item.text}
                  imageSrc={OFFER_PANEL_IMAGES[index % OFFER_PANEL_IMAGES.length]}
                  imageAlt={item.title}
                />
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
  const horizontalPanelImages = [
    'https://framerusercontent.com/images/2GAiSbiawE1R7sXuFDwNLfEovRM.jpg?width=711&height=400',
    'https://framerusercontent.com/images/AtSZKyVin3X5lENphObnH6Puw.jpg?lossless=1&width=612&height=408',
    'https://framerusercontent.com/images/prEubFztlVx6VnuokfOrkAs.jpg?width=612&height=353',
  ]
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
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <OfferHoverCard
                  step={`0${index + 1}`}
                  title={item.title}
                  text={item.text}
                  imageSrc={horizontalPanelImages[index % horizontalPanelImages.length]}
                  imageAlt={item.title}
                />
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
  const verticalPanelImages = [
    'https://framerusercontent.com/images/GhKqWw4urSIcFZGZ3kWTXG7c.png?width=1536&height=1024',
    'https://framerusercontent.com/images/9KyWAYBvYkUbASCckXa16Fgc.jpg?width=4032&height=3024',
    'https://framerusercontent.com/images/mqqWNbBnY0EOUvSMgGlDain8M.jpg?width=1004&height=591',
  ]
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
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <OfferHoverCard
                  step={`0${index + 1}`}
                  title={item.title}
                  text={item.text}
                  imageSrc={verticalPanelImages[index % verticalPanelImages.length]}
                  imageAlt={item.title}
                />
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
                  <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="🗺️ Map View">
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="🛰️ Satellite View">
                      <TileLayer
                        attribution="Tiles &copy; Esri"
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="🌐 Hybrid View">
                      <LayerGroup>
                        <TileLayer
                          attribution="Tiles &copy; Esri"
                          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                        <TileLayer
                          attribution="Labels &copy; Esri"
                          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                        />
                      </LayerGroup>
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="⚪ Light Gray View">
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      />
                    </LayersControl.BaseLayer>
                  </LayersControl>
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

      map.flyTo(center, zoom, { duration: 0.9, easeLinearity: 0.22 })
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
    { city: 'Cairo', region: 'north-africa', lat: 30.0444, lng: 31.2357 },
    { city: 'Addis Ababa', region: 'east-africa', lat: 8.9806, lng: 38.7578 },
    { city: 'Lagos', region: 'west-africa', lat: 6.5244, lng: 3.3792 },
    { city: 'Accra', region: 'west-africa', lat: 5.6037, lng: -0.187 },
    { city: 'Abidjan', region: 'west-africa', lat: 5.3599, lng: -4.0083 },
    { city: 'Douala', region: 'central-africa', lat: 4.0511, lng: 9.7679 },
    { city: 'Nairobi', region: 'east-africa', lat: -1.2921, lng: 36.8219 },
    { city: 'Kampala', region: 'east-africa', lat: 0.3476, lng: 32.5825 },
    { city: 'Dar es Salaam', region: 'east-africa', lat: -6.7924, lng: 39.2083 },
    { city: 'Kinshasa', region: 'central-africa', lat: -4.4419, lng: 15.2663 },
    { city: 'Lusaka', region: 'southern-africa', lat: -15.3875, lng: 28.3228 },
    { city: 'Johannesburg', region: 'southern-africa', lat: -26.2041, lng: 28.0473 },
  ]
  const philRegions = [
    { id: 'all', label: 'All Regions', mapFocus: 'Africa', center: [4, 18], zoom: 3 },
    { id: 'north-africa', label: 'North Africa', mapFocus: 'North Africa', center: [27, 25], zoom: 4 },
    { id: 'west-africa', label: 'West Africa', mapFocus: 'West Africa', center: [8, -2], zoom: 4 },
    { id: 'east-africa', label: 'East Africa', mapFocus: 'East Africa', center: [0, 37], zoom: 4 },
    { id: 'central-africa', label: 'Central Africa', mapFocus: 'Central Africa', center: [0, 17], zoom: 4 },
    { id: 'southern-africa', label: 'Southern Africa', mapFocus: 'Southern Africa', center: [-22, 28], zoom: 4 },
  ]
  const [activePhilRegion, setActivePhilRegion] = useState('all')
  const selectedPhilRegion = philRegions.find((region) => region.id === activePhilRegion) || philRegions[0]
  const visiblePhilPins = activePhilRegion === 'all'
    ? philImpactPins
    : philImpactPins.filter((pin) => pin.region === activePhilRegion)
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
          <div className="phil-map-layout">
            <aside className="phil-region-panel">
              <h3>Regions</h3>
              <div className="phil-region-list">
                {philRegions.map((region) => {
                  const count = region.id === 'all'
                    ? philImpactPins.length
                    : philImpactPins.filter((pin) => pin.region === region.id).length

                  return (
                    <button
                      key={region.id}
                      type="button"
                      className={`phil-region-item ${activePhilRegion === region.id ? 'active' : ''}`}
                      onClick={() => setActivePhilRegion(region.id)}
                    >
                      <span>{region.label}</span>
                      <em>{count}</em>
                    </button>
                  )
                })}
              </div>
              <div className="phil-region-selected">
                <h4>Selected</h4>
                <p>{selectedPhilRegion.label}</p>
                <span>{visiblePhilPins.length} pinned location{visiblePhilPins.length > 1 ? 's' : ''}</span>
              </div>
            </aside>

            <div className="phil-map-main">
              <div className="phil-map-stage" role="img" aria-label="Community impact locations map">
                <MapContainer
                  center={selectedPhilRegion.center}
                  zoom={selectedPhilRegion.zoom}
                  zoomControl={false}
                  className="phil-map-leaflet"
                >
                  <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="🗺️ Map View">
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="🛰️ Satellite View">
                      <TileLayer
                        attribution="Tiles &copy; Esri"
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="🌐 Hybrid View">
                      <LayerGroup>
                        <TileLayer
                          attribution="Tiles &copy; Esri"
                          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                        <TileLayer
                          attribution="Labels &copy; Esri"
                          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                        />
                      </LayerGroup>
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="⚪ Light Gray View">
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      />
                    </LayersControl.BaseLayer>
                  </LayersControl>
                  <ZoomControl position="topright" />
                  <PhilImpactMapViewport center={selectedPhilRegion.center} zoom={selectedPhilRegion.zoom} />
                  {visiblePhilPins.map((pin) => (
                    <Marker key={pin.city} position={[pin.lat, pin.lng]} icon={philImpactMarkerIcon}>
                      <Tooltip direction="top" offset={[0, -10]}>{pin.city}</Tooltip>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
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

const CareersPage = ({ onNavigate = () => {} }) => {
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
              <div className="careers-hero-actions">
                <button
                  type="button"
                  className="careers-cta"
                  onClick={() => onNavigate('/join-us')}
                >
                  Join Us
                </button>
              </div>
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

const JoinUsPage = ({ onNavigate = () => {} }) => {
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [joinUsPending, setJoinUsPending] = useState(false)
  const [isJoinUsSubmitting, setIsJoinUsSubmitting] = useState(false)
  const [joinUsSubmitError, setJoinUsSubmitError] = useState('')
  const countryRef = useRef(null)
  const ageRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const countries = [
    'Argentina',
    'Australia',
    'Bangladesh',
    'Brazil',
    'Canada',
    'Chile',
    'China',
    'Colombia',
    'Denmark',
    'Egypt',
    'France',
    'Germany',
    'Hong Kong',
    'India',
    'Indonesia',
    'Ireland',
    'Italy',
    'Japan',
    'Kenya',
    'Kuwait',
    'Malaysia',
    'Mexico',
    'Netherlands',
    'New Zealand',
    'Nigeria',
    'Norway',
    'Pakistan',
    'Peru',
    'Philippines',
    'Qatar',
    'Saudi Arabia',
    'Singapore',
    'South Africa',
    'South Korea',
    'Spain',
    'Sweden',
    'Taiwan',
    'Thailand',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Vietnam',
  ]

  const adjustAge = (delta) => {
    if (!ageRef.current) return
    const min = Number(ageRef.current.min || 0)
    const max = Number(ageRef.current.max || 120)
    const current = Number(ageRef.current.value || 0)
    let next = current + delta
    if (Number.isNaN(next)) next = min
    if (next < min) next = min
    if (next > max) next = max
    ageRef.current.value = String(next)
  }

  return (
    <main className="joinus-page">
      <section className="joinus-hero">
        <div className="joinus-bg" aria-hidden="true">
          <div className="joinus-liquid-wrap">
            <LiquidEther
              colors={['#29ff69', '#9effb6', '#d19f66']}
              mouseForce={14}
              cursorSize={110}
              isViscous
              viscous={24}
              iterationsViscous={18}
              iterationsPoisson={18}
              resolution={0.36}
              isBounce={false}
              autoDemo
              autoSpeed={0.38}
              autoIntensity={1.5}
              takeoverDuration={0.25}
              autoResumeDelay={3000}
              autoRampDuration={0.6}
            />
          </div>
        </div>
        <div className="container joinus-shell">
          <div className="joinus-header">
            <p className="joinus-kicker">Welcome to Lifewood</p>
            <h1>
              Join the world&apos;s leading provider of AI-powered <span>data</span> solutions.
            </h1>
            <p className="joinus-subtitle">
              This application is currently in beta. Please be advised that features and functionality may
              undergo updates during this refinement phase.
            </p>
            <div className="joinus-header-actions">
              <button
                type="button"
                className="joinus-readmore"
                onClick={() => onNavigate('/about')}
              >
                Read more about us
              </button>
              <button type="button" className="joinus-help" onClick={() => setIsHelpOpen(true)}>
                Need Help?
              </button>
            </div>
          </div>

          <form
            className="joinus-card"
            aria-label="Join our team application form"
            onSubmit={async (event) => {
              event.preventDefault()
              if (isJoinUsSubmitting) return
              setIsJoinUsSubmitting(true)
              setJoinUsSubmitError('')

              const form = event.currentTarget
              const formData = new FormData(form)
              const cvFile = formData.get('cv')

              const payload = {
                first_name: formData.get('firstName')?.toString().trim() || null,
                last_name: formData.get('lastName')?.toString().trim() || null,
                gender: formData.get('gender')?.toString() || null,
                age: formData.get('age') ? Number(formData.get('age')) : null,
                phone_country_code: formData.get('phoneCountry')?.toString() || null,
                phone_number: formData.get('phoneNumber')?.toString().trim() || null,
                email: formData.get('email')?.toString().trim() || null,
                position_applied: formData.get('positionApplied')?.toString() || null,
                country: selectedCountry || null,
                current_address: formData.get('currentAddress')?.toString().trim() || null,
                cv_filename: cvFile && typeof cvFile === 'object' ? cvFile.name : null,
                cv_size: cvFile && typeof cvFile === 'object' ? cvFile.size : null,
              }

              const { error } = await supabase.from('applications').insert(payload)
              if (error) {
                console.error('Supabase insert failed', error)
                setJoinUsSubmitError('Submission failed. Please try again.')
                setIsJoinUsSubmitting(false)
                return
              }

              setJoinUsPending(true)
              setIsJoinUsSubmitting(false)
              form.reset()
              setSelectedCountry('')
              setCountryOpen(false)
            }}
          >
            <div className="joinus-card-head">
              <h2>Join Our Team</h2>
              <p>Please fill out the form below to apply.</p>
            </div>

            <div className="joinus-grid">
              <label className="joinus-field">
                <span>First Name</span>
                <input type="text" name="firstName" placeholder="e.g. Michael" />
              </label>
              <label className="joinus-field">
                <span>Last Name</span>
                <input type="text" name="lastName" placeholder="e.g. Chen" />
              </label>

              <label className="joinus-field joinus-select-field">
                <span>Gender</span>
                <div className="joinus-select-wrap">
                  <select name="gender" defaultValue="">
                    <option value="" disabled>Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                  <span className="joinus-select-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
              </label>
              <label className="joinus-field joinus-age-field">
                <span>Age</span>
                <div className="joinus-stepper">
                  <input ref={ageRef} type="number" name="age" placeholder="e.g. 24" min="16" max="80" />
                  <div className="joinus-stepper-buttons" aria-hidden="true">
                    <button type="button" className="joinus-stepper-btn" onClick={() => adjustAge(1)}>
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                        <path d="M2 6L5 3L8 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button type="button" className="joinus-stepper-btn" onClick={() => adjustAge(-1)}>
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                        <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </label>

              <label className="joinus-field joinus-field-phone">
                <span>Phone Number</span>
                <div className="joinus-phone">
                  <select name="phoneCountry" aria-label="Country code">
                    <option>+63 (Philippines)</option>
                    <option>+1 (USA)</option>
                    <option>+44 (UK)</option>
                    <option>+61 (Australia)</option>
                  </select>
                  <input type="tel" name="phoneNumber" placeholder="912345678" />
                </div>
              </label>

              <label className="joinus-field">
                <span>Email Address</span>
                <input type="email" name="email" placeholder="michael@example.com" />
              </label>

              <label className="joinus-field joinus-select-field">
                <span>Position Applied</span>
                <div className="joinus-select-wrap">
                  <select name="positionApplied" defaultValue="">
                    <option value="" disabled>Select position to add</option>
                    <option>Admin Accounting</option>
                    <option>AI Video Creator/Editor</option>
                    <option>Casual Video Models (Video Data Collection)</option>
                    <option>Data Annotator (Iphone User)</option>
                    <option>Data Curation (Genealogy Project)</option>
                    <option>Data Scraper/Crawler (Int&apos;l Text)</option>
                    <option>Genealogy Project Team Leader</option>
                    <option>HR/Admin Assistant</option>
                    <option>Image Data Collector (Capturing Home Dishes and Menu)</option>
                    <option>Image Data Collector (Capturing Text - Rich Items)</option>
                    <option>Intern (Applicable to PH Only)</option>
                    <option>Marketing &amp; Sales Executive</option>
                    <option>Moderator &amp; Voice Participants (Voice Data Collection)</option>
                    <option>Operation Manager</option>
                    <option>Social Media Content Marketing</option>
                    <option>Text Data Collector (Gemini User)</option>
                    <option>Voice Recording Participants (FaceTime Audio Recording Session)</option>
                    <option>Voice Recording Participants (Short Sentences Recording)</option>
                    <option>All of the Above</option>
                  </select>
                  <span className="joinus-select-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
              </label>

              <div className="joinus-field joinus-address-row">
                <label className="joinus-field">
                  <span>Country</span>
                  <div
                    className={`joinus-custom-select ${countryOpen ? 'is-open' : ''}`}
                    ref={countryRef}
                  >
                    <button
                      type="button"
                      className="joinus-select-trigger"
                      onClick={() => setCountryOpen((prev) => !prev)}
                    >
                      <span>{selectedCountry || 'Select country'}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                    {countryOpen && (
                      <div className="joinus-select-list" role="listbox">
                        {countries.map((country) => (
                          <button
                            type="button"
                            key={country}
                            className={`joinus-select-option ${selectedCountry === country ? 'selected' : ''}`}
                            onMouseDown={(event) => {
                              event.preventDefault()
                              setSelectedCountry(country)
                              setCountryOpen(false)
                            }}
                            role="option"
                            aria-selected={selectedCountry === country}
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </label>

                <label className="joinus-field">
                  <span>Current Address</span>
                  <input type="text" name="currentAddress" placeholder="e.g. Quezon City, Metro Manila" />
                </label>
              </div>

              <label className="joinus-field joinus-field-full">
                <span>Upload CV (PDF)</span>
                <div className="joinus-upload">
                  <input type="file" name="cv" accept="application/pdf" />
                  <span>Click to upload or drag and drop</span>
                  <small>PDF only (max. 10MB)</small>
                </div>
              </label>
            </div>

            {joinUsSubmitError ? <p className="joinus-submit-error">{joinUsSubmitError}</p> : null}

            <button type="submit" className="joinus-submit" disabled={isJoinUsSubmitting}>
              {isJoinUsSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </section>

      {isHelpOpen && (
        <div className="joinus-modal-overlay" role="dialog" aria-modal="true">
          <div className="joinus-modal joinus-pending-modal">
            <button
              type="button"
              className="joinus-modal-close"
              aria-label="Close help dialog"
              onClick={() => setIsHelpOpen(false)}
            >
              ×
            </button>
            <h3>About Your Application</h3>

            <h4>Application Process</h4>
            <p>
              Thank you for your interest in joining our team! This application form is the first step in our
              hiring process.
            </p>

            <h4>What Happens Next?</h4>
            <ul>
              <li>Your application will be reviewed by our HR team</li>
              <li>Your CV will be evaluated based on our requirements</li>
              <li>You&apos;ll receive a confirmation email with your application details</li>
              <li>Our team will contact you if your profile matches our needs</li>
            </ul>

            <h4>Need More Help?</h4>
            <p>
              If you encounter any issues or have questions, please contact us at
              <span className="joinus-help-email"> hr@lifewood.com</span>
            </p>

            <button type="button" className="joinus-modal-cta" onClick={() => setIsHelpOpen(false)}>
              Got it, thanks!
            </button>
          </div>
          <button
            type="button"
            className="joinus-modal-backdrop"
            aria-hidden="true"
            onClick={() => setIsHelpOpen(false)}
          />
        </div>
      )}

      {joinUsPending && (
        <div className="joinus-modal-overlay" role="dialog" aria-modal="true">
          <div className="joinus-modal">
            <button
              type="button"
              className="joinus-modal-close"
              aria-label="Close pending dialog"
              onClick={() => setJoinUsPending(false)}
            >
              ×
            </button>
            <h3>Application Submitted</h3>
            <p>
              Your application needs approval before it can be processed. An admin will review it shortly.
              We&apos;ll notify you once it&apos;s approved.
            </p>
            <button type="button" className="joinus-modal-cta" onClick={() => setJoinUsPending(false)}>
              Got it
            </button>
          </div>
          <button
            type="button"
            className="joinus-modal-backdrop"
            aria-hidden="true"
            onClick={() => setJoinUsPending(false)}
          />
        </div>
      )}
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
          maxDpr={1.2}
          resolutionScale={0.78}
          targetFps={45}
          antialias={false}
          pauseWhenHidden
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
    pageContent = <CareersPage onNavigate={navigateTo} />
  } else if (currentPath === '/join-us') {
    pageContent = <JoinUsPage onNavigate={navigateTo} />
  } else if (currentPath === '/contact-us') {
    pageContent = <ContactUsPage />
  } else if (currentPath === '/internal-news') {
    pageContent = <InternalNewsPage />
  } else if (currentPath === '/get-started') {
    pageContent = <GetStartedPage authMode={authMode} onAuthModeChange={setAuthMode} onNavigate={navigateTo} />
  } else if (currentPath === '/sign-in') {
    pageContent = <GetStartedPage authMode="signin" onAuthModeChange={setAuthMode} onNavigate={navigateTo} />
  } else if (currentPath === INTERN_DASHBOARD_PATH) {
    pageContent = <DashboardPage onNavigate={navigateTo} />
  } else if (currentPath === ADMIN_DASHBOARD_PATH) {
    pageContent = <AdminDashboardPage onNavigate={navigateTo} />
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

  const isDashboardRoute = currentPath === INTERN_DASHBOARD_PATH || currentPath === ADMIN_DASHBOARD_PATH

  return (
    <div className="app">
      {!isDashboardRoute && (
        <Navigation currentPath={currentPath} onNavigate={navigateTo} onSetAuthMode={setAuthMode} />
      )}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentPath}
          className="route-transition"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {pageContent}
        </motion.div>
      </AnimatePresence>
      {!isDashboardRoute && <Footer onNavigate={navigateTo} />}
    </div>
  )
}

export default App
