import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { LayerGroup, LayersControl, MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet'
import { IconBrandLinkedin, IconBrandInstagram, IconBrandFacebook, IconBrandYoutube, IconBrandGoogle, IconBrandApple, IconBrandGithub, IconEye, IconEyeOff, IconLayoutDashboard, IconBook2, IconReport, IconChevronRight, IconLogout, IconMenu2, IconX, IconCamera, IconDeviceFloppy, IconSearch, IconBell, IconFilter, IconUsers, IconUserPlus, IconUserCheck, IconUserX, IconUserEdit, IconTrash, IconMessage, IconCopy } from '@tabler/icons-react'
import L from 'leaflet'
import LiquidEther from './LiquidEther'
import FlowingMenu from './FlowingMenu'
import CountUp from './CountUp'
import Plasma from './Plasma'
import OfferHoverCard from './OfferHoverCard'
import { supabase } from './supabaseClient'
import mercProfile from '../francis.jpeg'
import 'leaflet/dist/leaflet.css'
import './App.css'

const OFFER_PANEL_IMAGES = [
  'https://framerusercontent.com/images/1edPwLJhGXCUhlh38ixQSMOTFA.png?width=1024&height=1024',
  'https://framerusercontent.com/images/m7OC7BU1eSVf04CkU0jmNPRkf8.png?width=1024&height=1024',
  'https://framerusercontent.com/images/iI5MBUQ9ctQdcDHjCLNvD4j4kxc.png?width=1024&height=1024',
]
const COUNTRIES = [
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
const INTERN_DASHBOARD_PATH = '/dashboard'
const ADMIN_DASHBOARD_PATH = '/admin-dashboard'
const CAREERS_URL = 'http://localhost:5173/careers'
const INTERVIEW_LOCATION = 'Ground Floor i2 Building, Jose Del Mar Street Cebu IT Park, Asia Town, Salinas Drive Apas Lahug, Cebu City, 6000'
const formatAdminDate = (dateValue) => dateValue.toLocaleDateString('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})
const formatMessageTime = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase()
}

const getInitialsFromName = (value = '') => {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'NA'
  return parts.map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

const md5 = (input = '') => {
  const rotateLeft = (value, shift) => (value << shift) | (value >>> (32 - shift))
  const addUnsigned = (x, y) => {
    const x4 = x & 0x40000000
    const y4 = y & 0x40000000
    const x8 = x & 0x80000000
    const y8 = y & 0x80000000
    const result = (x & 0x3fffffff) + (y & 0x3fffffff)
    if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8
    if (x4 | y4) {
      return result & 0x40000000 ? result ^ 0xc0000000 ^ x8 ^ y8 : result ^ 0x40000000 ^ x8 ^ y8
    }
    return result ^ x8 ^ y8
  }
  const f = (x, y, z) => (x & y) | (~x & z)
  const g = (x, y, z) => (x & z) | (y & ~z)
  const h = (x, y, z) => x ^ y ^ z
  const i = (x, y, z) => y ^ (x | ~z)
  const ff = (a, b, c, d, x, s, ac) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, f(b, c, d)), addUnsigned(x, ac)), s), b)
  const gg = (a, b, c, d, x, s, ac) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, g(b, c, d)), addUnsigned(x, ac)), s), b)
  const hh = (a, b, c, d, x, s, ac) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, h(b, c, d)), addUnsigned(x, ac)), s), b)
  const ii = (a, b, c, d, x, s, ac) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, i(b, c, d)), addUnsigned(x, ac)), s), b)
  const convertToWordArray = (value) => {
    const wordArray = []
    for (let i = 0; i < value.length * 8; i += 8) {
      wordArray[i >> 5] |= (value.charCodeAt(i / 8) & 0xff) << (i % 32)
    }
    return wordArray
  }
  const wordToHex = (value) => {
    let hex = ''
    for (let i = 0; i <= 3; i += 1) {
      const byte = (value >>> (i * 8)) & 255
      hex += (`0${byte.toString(16)}`).slice(-2)
    }
    return hex
  }
  const utf8Encode = (value) => unescape(encodeURIComponent(value))
  const utf8Value = utf8Encode(input)
  const x = convertToWordArray(utf8Value)
  const len = utf8Value.length * 8
  x[len >> 5] |= 0x80 << (len % 32)
  x[(((len + 64) >>> 9) << 4) + 14] = len
  let a = 0x67452301
  let b = 0xefcdab89
  let c = 0x98badcfe
  let d = 0x10325476
  for (let k = 0; k < x.length; k += 16) {
    const aa = a
    const bb = b
    const cc = c
    const dd = d
    a = ff(a, b, c, d, x[k + 0], 7, 0xd76aa478)
    d = ff(d, a, b, c, x[k + 1], 12, 0xe8c7b756)
    c = ff(c, d, a, b, x[k + 2], 17, 0x242070db)
    b = ff(b, c, d, a, x[k + 3], 22, 0xc1bdceee)
    a = ff(a, b, c, d, x[k + 4], 7, 0xf57c0faf)
    d = ff(d, a, b, c, x[k + 5], 12, 0x4787c62a)
    c = ff(c, d, a, b, x[k + 6], 17, 0xa8304613)
    b = ff(b, c, d, a, x[k + 7], 22, 0xfd469501)
    a = ff(a, b, c, d, x[k + 8], 7, 0x698098d8)
    d = ff(d, a, b, c, x[k + 9], 12, 0x8b44f7af)
    c = ff(c, d, a, b, x[k + 10], 17, 0xffff5bb1)
    b = ff(b, c, d, a, x[k + 11], 22, 0x895cd7be)
    a = ff(a, b, c, d, x[k + 12], 7, 0x6b901122)
    d = ff(d, a, b, c, x[k + 13], 12, 0xfd987193)
    c = ff(c, d, a, b, x[k + 14], 17, 0xa679438e)
    b = ff(b, c, d, a, x[k + 15], 22, 0x49b40821)
    a = gg(a, b, c, d, x[k + 1], 5, 0xf61e2562)
    d = gg(d, a, b, c, x[k + 6], 9, 0xc040b340)
    c = gg(c, d, a, b, x[k + 11], 14, 0x265e5a51)
    b = gg(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa)
    a = gg(a, b, c, d, x[k + 5], 5, 0xd62f105d)
    d = gg(d, a, b, c, x[k + 10], 9, 0x02441453)
    c = gg(c, d, a, b, x[k + 15], 14, 0xd8a1e681)
    b = gg(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8)
    a = gg(a, b, c, d, x[k + 9], 5, 0x21e1cde6)
    d = gg(d, a, b, c, x[k + 14], 9, 0xc33707d6)
    c = gg(c, d, a, b, x[k + 3], 14, 0xf4d50d87)
    b = gg(b, c, d, a, x[k + 8], 20, 0x455a14ed)
    a = gg(a, b, c, d, x[k + 13], 5, 0xa9e3e905)
    d = gg(d, a, b, c, x[k + 2], 9, 0xfcefa3f8)
    c = gg(c, d, a, b, x[k + 7], 14, 0x676f02d9)
    b = gg(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a)
    a = hh(a, b, c, d, x[k + 5], 4, 0xfffa3942)
    d = hh(d, a, b, c, x[k + 8], 11, 0x8771f681)
    c = hh(c, d, a, b, x[k + 11], 16, 0x6d9d6122)
    b = hh(b, c, d, a, x[k + 14], 23, 0xfde5380c)
    a = hh(a, b, c, d, x[k + 1], 4, 0xa4beea44)
    d = hh(d, a, b, c, x[k + 4], 11, 0x4bdecfa9)
    c = hh(c, d, a, b, x[k + 7], 16, 0xf6bb4b60)
    b = hh(b, c, d, a, x[k + 10], 23, 0xbebfbc70)
    a = hh(a, b, c, d, x[k + 13], 4, 0x289b7ec6)
    d = hh(d, a, b, c, x[k + 0], 11, 0xeaa127fa)
    c = hh(c, d, a, b, x[k + 3], 16, 0xd4ef3085)
    b = hh(b, c, d, a, x[k + 6], 23, 0x04881d05)
    a = hh(a, b, c, d, x[k + 9], 4, 0xd9d4d039)
    d = hh(d, a, b, c, x[k + 12], 11, 0xe6db99e5)
    c = hh(c, d, a, b, x[k + 15], 16, 0x1fa27cf8)
    b = hh(b, c, d, a, x[k + 2], 23, 0xc4ac5665)
    a = ii(a, b, c, d, x[k + 0], 6, 0xf4292244)
    d = ii(d, a, b, c, x[k + 7], 10, 0x432aff97)
    c = ii(c, d, a, b, x[k + 14], 15, 0xab9423a7)
    b = ii(b, c, d, a, x[k + 5], 21, 0xfc93a039)
    a = ii(a, b, c, d, x[k + 12], 6, 0x655b59c3)
    d = ii(d, a, b, c, x[k + 3], 10, 0x8f0ccc92)
    c = ii(c, d, a, b, x[k + 10], 15, 0xffeff47d)
    b = ii(b, c, d, a, x[k + 1], 21, 0x85845dd1)
    a = ii(a, b, c, d, x[k + 8], 6, 0x6fa87e4f)
    d = ii(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0)
    c = ii(c, d, a, b, x[k + 6], 15, 0xa3014314)
    b = ii(b, c, d, a, x[k + 13], 21, 0x4e0811a1)
    a = ii(a, b, c, d, x[k + 4], 6, 0xf7537e82)
    d = ii(d, a, b, c, x[k + 11], 10, 0xbd3af235)
    c = ii(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb)
    b = ii(b, c, d, a, x[k + 9], 21, 0xeb86d391)
    a = addUnsigned(a, aa)
    b = addUnsigned(b, bb)
    c = addUnsigned(c, cc)
    d = addUnsigned(d, dd)
  }
  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
}

const getGravatarUrl = (email = '', size = 96) => {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) return ''
  const hash = md5(normalizedEmail)
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}

function deriveMessageCategory(thread) {
  if (thread.isArchived) return 'archive'
  if (thread.isStarred) return 'starred'
  if (!thread.isRead) return 'unread'
  return 'old'
}

function mapContactMessageToThread(row) {
  const isRead = row.is_read ?? false
  const isArchived = row.is_archived ?? false
  const isStarred = row.is_starred ?? false
  const body = row.message || ''
  const thread = {
    id: row.id,
    name: row.name || 'Client',
    email: row.email || '—',
    role: row.role || 'Client',
    preview: truncateMessage(body || row.subject || ''),
    time: formatMessageTime(row.created_at),
    unreadCount: isRead ? 0 : 1,
    avatar: getInitialsFromName(row.name || ''),
    avatarUrl: getGravatarUrl(row.email || '', 96),
    subject: row.subject || 'Website Message',
    body,
    isRead,
    isArchived,
    isStarred,
  }
  return { ...thread, category: deriveMessageCategory(thread) }
}

function normalizeDeletedMessageRow(row) {
  return {
    original_message_id: row.id,
    name: row.name || null,
    email: row.email || null,
    role: row.role || null,
    subject: row.subject || null,
    message: row.message || null,
    is_read: row.is_read ?? false,
    is_archived: row.is_archived ?? false,
    is_starred: row.is_starred ?? false,
    original_created_at: row.created_at || null,
    deleted_at: new Date().toISOString(),
    deleted_by: 'Admin',
  }
}

function mapMessageThreadToNotification(thread) {
  const title = thread.subject || 'Website Message'
  const preview = thread.preview || ''
  const name = thread.name || 'Client'
  return {
    id: `message-${thread.id}`,
    type: 'messages',
    section: thread.isArchived ? 'previous' : 'current',
    status: thread.isRead ? 'read' : 'new',
    title,
    description: preview ? `${name}: ${preview}` : name,
    time: thread.time || '—',
    read: thread.isRead ?? false,
    messageId: thread.id,
    messageCategory: thread.category,
  }
}

function mapContactMessageToNotification(row) {
  const thread = mapContactMessageToThread(row)
  return mapMessageThreadToNotification(thread)
}

function mapApprovalHistoryEntry(entry, manageUsers = []) {
  const fallbackUser = manageUsers.find((user) => user.email === entry.applicant_email)
  const decidedAtRaw = entry.decided_at || entry.created_at || null
  const decidedAt = decidedAtRaw ? new Date(decidedAtRaw) : null
  const createdAtRaw = entry.account_created_at
    || entry.user_created_at
    || fallbackUser?.createdAt
    || null
  const createdAt = createdAtRaw ? new Date(createdAtRaw) : null
  const yearSource = decidedAt || createdAt
  return {
    id: entry.id,
    applicationId: entry.application_id || null,
    name: entry.applicant_name || 'Applicant',
    email: entry.applicant_email || '—',
    role: entry.role || 'Applicant',
    decision: entry.decision || 'declined',
    archivedAt: entry.archived_at || null,
    accountCreated: createdAt ? formatAdminDate(createdAt) : '—',
    decisionDate: decidedAt ? formatAdminDate(decidedAt) : '—',
    year: yearSource ? String(yearSource.getFullYear()) : String(new Date().getFullYear()),
  }
}

function truncateMessage(value = '', limit = 56) {
  if (value.length <= limit) return value
  return `${value.slice(0, limit - 3).trimEnd()}...`
}

const normalizeApprovalAction = (decision = '') => {
  const normalizedDecision = decision.trim().toLowerCase()
  if (normalizedDecision === 'approve' || normalizedDecision === 'approved' || normalizedDecision === 'accepted') {
    return 'approve'
  }
  if (normalizedDecision === 'reject' || normalizedDecision === 'rejected' || normalizedDecision === 'decline' || normalizedDecision === 'declined') {
    return 'reject'
  }
  return normalizedDecision
}

const normalizeContactNumber = (value) => value.replace(/\D/g, '').slice(0, 11)

const getRoleOptionFromLabel = (role = '') => {
  const normalizedRole = role.trim().toLowerCase()
  if (!normalizedRole) return 'employee'
  return normalizedRole.includes('admin') ? 'admin' : 'employee'
}

const getInitialAddMemberFormState = () => ({
  firstName: '',
  lastName: '',
  gender: '',
  age: '',
  phoneCountryCode: '+63',
  phoneNumber: '',
  email: '',
  positionApplied: '',
  country: '',
  currentAddress: '',
  cvFile: null,
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

const getRoleLabel = (value = '') => value.split('(')[0].trim()


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
      setIsMobileMenuOpen(false)
      setOpenMobileSection(null)
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
  const [signUpError, setSignUpError] = useState('')
  const [signUpSuccess, setSignUpSuccess] = useState('')
  const [signupForm, setSignupForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    contactNumber: '',
    role: 'intern',
  })

  const handleSignIn = (event) => {
    event.preventDefault()
    const identifier = signInIdentifier.trim()

    if (!identifier || !signInPassword) {
      setSignInError('Please enter your email and password.')
      return
    }

    if (!identifier.includes('@')) {
      setSignInError('Please use your email address to sign in.')
      return
    }

    supabase.auth.signInWithPassword({ email: identifier, password: signInPassword })
      .then(({ error }) => {
        if (error) {
          setSignInError(error.message)
          return
        }
        setSignInError('')
        onNavigate(ADMIN_DASHBOARD_PATH)
      })
  }

  const handleSignupFieldChange = (field, value) => {
    setSignupForm((prev) => {
      const nextForm = {
        ...prev,
        [field]: field === 'contactNumber' ? normalizeContactNumber(value) : value,
      }

      return nextForm
    })
  }

  const handleSupabaseSignup = async (event) => {
    event.preventDefault()
    setSignUpError('')
    setSignUpSuccess('')

    const displayName = signupForm.displayName.trim()
    const email = signupForm.email.trim()
    const password = signupForm.password
    const confirmPassword = signupForm.confirmPassword

    if (!displayName || !email || !password || !confirmPassword) {
      setSignUpError('Please complete all fields.')
      return
    }

    if (password !== confirmPassword) {
      setSignUpError('Passwords do not match.')
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          name: displayName,
        },
      },
    })

    if (error) {
      setSignUpError(error.message)
      return
    }

    setSignUpSuccess('Account created! Please check your email to confirm your account.')
    setSignupForm((prev) => ({
      ...prev,
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }))
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
                      <p>Set up your account credentials before continuing.</p>

                      <form className="get-started-form" onSubmit={handleSupabaseSignup}>
                        <input
                          type="text"
                          placeholder="Display Name"
                          aria-label="Display Name"
                          value={signupForm.displayName}
                          onChange={(event) => handleSignupFieldChange('displayName', event.target.value)}
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
                        {signUpError ? <p className="get-started-error">{signUpError}</p> : null}
                        {signUpSuccess ? <p className="get-started-success">{signUpSuccess}</p> : null}

                        <div className="get-started-form-actions">
                          <button type="submit" className="get-started-submit-btn">
                            Sign up
                          </button>
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
  const [isAddMemberSuccessOpen, setIsAddMemberSuccessOpen] = useState(false)
  const [selectedDashboardUser, setSelectedDashboardUser] = useState(null)
  const [selectedEvaluationItem, setSelectedEvaluationItem] = useState(null)
  const [editingMemberId, setEditingMemberId] = useState(null)
  const [openMemberActionMenuId, setOpenMemberActionMenuId] = useState(null)
  const [openApprovalHistoryActionMenuId, setOpenApprovalHistoryActionMenuId] = useState(null)
  const [notificationTab, setNotificationTab] = useState('view-all')
  const [isTableSearchOpen, setIsTableSearchOpen] = useState(false)
  const [isTableFilterOpen, setIsTableFilterOpen] = useState(false)
  const [isEvaluationSearchOpen, _setIsEvaluationSearchOpen] = useState(false)
  const [isApprovalSearchOpen, setIsApprovalSearchOpen] = useState(false)
  const [isApprovalFilterOpen, setIsApprovalFilterOpen] = useState(false)
  const [isApprovalHistorySearchOpen, setIsApprovalHistorySearchOpen] = useState(false)
  const [isApprovalHistoryFilterOpen, setIsApprovalHistoryFilterOpen] = useState(false)
  const [isEvaluationHistorySearchOpen, _setIsEvaluationHistorySearchOpen] = useState(false)
  const [_isEvaluationHistoryFilterOpen, setIsEvaluationHistoryFilterOpen] = useState(false)
  const [isAnalyticsSearchOpen, setIsAnalyticsSearchOpen] = useState(false)
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false)
  const [isAdminCountryOpen, setIsAdminCountryOpen] = useState(false)
  const [evaluationSearchQuery, _setEvaluationSearchQuery] = useState('')
  const [approvalSearchQuery, setApprovalSearchQuery] = useState('')
  const [approvalSortMode, setApprovalSortMode] = useState('all')
  const [approvalYearFilter, setApprovalYearFilter] = useState('all')
  const [approvalRoleFilter, setApprovalRoleFilter] = useState('all')
  const [approvalHistorySearchQuery, setApprovalHistorySearchQuery] = useState('')
  const [approvalHistorySortMode, setApprovalHistorySortMode] = useState('all')
  const [approvalHistoryYearFilter, setApprovalHistoryYearFilter] = useState('all')
  const [approvalHistoryDecisionFilter, setApprovalHistoryDecisionFilter] = useState('all')
  const [showApprovalHistoryArchive, setShowApprovalHistoryArchive] = useState(false)
  const [evaluationHistorySearchQuery, _setEvaluationHistorySearchQuery] = useState('')
  const [evaluationHistorySortMode, _setEvaluationHistorySortMode] = useState('all')
  const [evaluationHistoryYearFilter, _setEvaluationHistoryYearFilter] = useState('all')
  const [analyticsSearchQuery, setAnalyticsSearchQuery] = useState('')
  const [analyticsSortMode, setAnalyticsSortMode] = useState('all')
  const [manageSearchQuery, setManageSearchQuery] = useState('')
  const [manageSortMode, setManageSortMode] = useState('date')
  const [manageRoleFilter, setManageRoleFilter] = useState('all')
  const [isManageSearchOpen, setIsManageSearchOpen] = useState(false)
  const [isManageFilterOpen, setIsManageFilterOpen] = useState(false)
  const [selectedEvaluationDetailTask, setSelectedEvaluationDetailTask] = useState('')
  const [selectedEvaluationModalTask, setSelectedEvaluationModalTask] = useState('')
  const [approvalSubtab, setApprovalSubtab] = useState('pending')
  const [evaluationSubtab, _setEvaluationSubtab] = useState('queue')
  const [tableSortMode, setTableSortMode] = useState('date')
  const [tableRoleFilter, setTableRoleFilter] = useState('all')
  const [tableSearchQuery, setTableSearchQuery] = useState('')
  const [manageUsers, setManageUsers] = useState([])
  const [pendingApprovalAction, setPendingApprovalAction] = useState(null)
  const [pendingRemoveMember, setPendingRemoveMember] = useState(null)
  const [pendingApprovalHistoryDelete, setPendingApprovalHistoryDelete] = useState(null)
  const [approvalToast, setApprovalToast] = useState(null)
  const [memberDeleteToast, setMemberDeleteToast] = useState(null)
  const [authSession, setAuthSession] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [applications, setApplications] = useState([])
  const [applicationsError, setApplicationsError] = useState('')
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false)
  const [evaluationRecords, setEvaluationRecords] = useState({})
  const [evaluationForm, setEvaluationForm] = useState(() => getInitialEvaluationFormState())
  const [_evaluationFeedback, setEvaluationFeedback] = useState('')
  const [addMemberForm, setAddMemberForm] = useState(() => getInitialAddMemberFormState())
  const [addMemberError, setAddMemberError] = useState('')
  const [approvalHistory, setApprovalHistory] = useState([])
  const [archivedApprovalHistoryIds, setArchivedApprovalHistoryIds] = useState(() => new Set())
  const [archivedEvaluationHistoryIds, setArchivedEvaluationHistoryIds] = useState(() => new Set())
  const [notifications, setNotifications] = useState([])
  const adminUserMenuRef = useRef(null)
  const adminNotificationRef = useRef(null)
  const tableSearchInputRef = useRef(null)
  const evaluationSearchInputRef = useRef(null)
  const approvalSearchInputRef = useRef(null)
  const approvalHistorySearchInputRef = useRef(null)
  const evaluationHistorySearchInputRef = useRef(null)
  const analyticsSearchInputRef = useRef(null)
  const manageSearchInputRef = useRef(null)
  const tableFilterRef = useRef(null)
  const approvalFilterRef = useRef(null)
  const approvalHistoryFilterRef = useRef(null)
  const evaluationHistoryFilterRef = useRef(null)
  const analyticsFilterRef = useRef(null)
  const manageFilterRef = useRef(null)
  const adminCountryRef = useRef(null)

  const mapUserRowToManageUser = useCallback((user) => {
    const nameParts = (user.full_name || '').split(/\s+/).filter(Boolean)
    const firstInitial = nameParts[0]?.charAt(0) || ''
    const lastInitial = nameParts[nameParts.length - 1]?.charAt(0) || firstInitial
    const createdAt = user.created_at ? new Date(user.created_at) : null

    return {
      id: user.id,
      applicationId: user.application_id || null,
      initials: `${firstInitial}${lastInitial}`.toUpperCase() || 'NA',
      name: user.full_name || 'Applicant',
      email: user.email || '—',
      role: user.role || 'Applicant',
      access: user.role || 'Applicant',
      status: user.status || 'active',
      createdAt: user.created_at || null,
      joined: user.created_at ? user.created_at.slice(0, 10) : '—',
      contactNumber: user.phone_number || user.phone || '—',
      phoneCountryCode: user.phone_country_code || '',
      gender: user.gender || '—',
      age: user.age ?? '—',
      country: user.country || '—',
      currentAddress: user.current_address || '—',
      positionApplied: user.position_applied || '—',
      cvUrl: user.cv_url || '',
      cvFilename: user.cv_filename || '—',
      cvSize: user.cv_size ?? null,
      course: '—',
      internshipHours: '—',
      university: '—',
      activity: 'Active',
      onboarding: createdAt ? formatAdminDate(createdAt) : '—',
      verified: true,
      username: user.username || (user.email ? user.email.split('@')[0] : '—'),
    }
  }, [])

  const mapAdminRowToManageUser = useCallback((admin) => {
    const nameParts = (admin.full_name || admin.name || admin.email || 'Admin').split(/\s+/).filter(Boolean)
    const firstInitial = nameParts[0]?.charAt(0) || 'A'
    const lastInitial = nameParts[nameParts.length - 1]?.charAt(0) || firstInitial
    const createdAt = admin.created_at ? new Date(admin.created_at) : null
    const displayName = admin.full_name || admin.name || (admin.email ? admin.email.split('@')[0] : 'Admin')
    return {
      id: admin.id,
      applicationId: null,
      initials: `${firstInitial}${lastInitial}`.toUpperCase(),
      name: displayName,
      email: admin.email || '—',
      role: 'Admin',
      access: 'Admin',
      status: 'active',
      createdAt: admin.created_at || null,
      joined: createdAt ? createdAt.toISOString().slice(0, 10) : '—',
      contactNumber: '—',
      phoneCountryCode: '',
      gender: '—',
      age: '—',
      country: '—',
      currentAddress: '—',
      positionApplied: 'Admin',
      cvUrl: '',
      cvFilename: '—',
      cvSize: null,
      course: '—',
      internshipHours: '—',
      university: '—',
      activity: 'Active',
      onboarding: createdAt ? formatAdminDate(createdAt) : '—',
      verified: true,
      username: admin.email ? admin.email.split('@')[0] : 'admin',
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    if (!authSession) return []
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Failed to load users with deleted_at filter, retrying without it.', error)
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (fallbackError) {
        console.error('Failed to load users', fallbackError)
        return []
      }

      return (fallbackData || []).map(mapUserRowToManageUser)
    }

    const mapped = (data || []).map(mapUserRowToManageUser)
    return mapped
  }, [authSession, mapUserRowToManageUser])

  const fetchAdmins = useCallback(async () => {
    return []
  }, [authSession, mapAdminRowToManageUser])

  const refreshManageUsers = useCallback(async () => {
    if (!isAuthReady) return []
    if (!authSession) {
      setManageUsers([])
      return []
    }
    const [userRows, adminRows] = await Promise.all([fetchUsers(), fetchAdmins()])
    const sessionUser = authSession?.user
    const sessionAdminRow = sessionUser
      ? mapAdminRowToManageUser({
          id: sessionUser.id,
          email: sessionUser.email,
          full_name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name,
          created_at: sessionUser.created_at,
        })
      : null
    const combined = sessionAdminRow ? [...userRows, ...adminRows, sessionAdminRow] : [...userRows, ...adminRows]
    const seen = new Set()
    const deduped = combined.filter((entry) => {
      const key = entry.email || entry.id
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    setManageUsers(deduped)
    return deduped
  }, [authSession, fetchAdmins, fetchUsers, isAuthReady, mapAdminRowToManageUser])

  const backfillUserPhones = useCallback(async () => {
    if (!authSession) return
    if (hasBackfilledPhonesRef.current) return
    hasBackfilledPhonesRef.current = true
    const { data, error } = await supabase
      .from('users')
      .select('id, phone, phone_number')
      .is('phone', null)
      .not('phone_number', 'is', null)

    if (error) {
      console.error('Failed to load phones for backfill', error)
      return
    }

    const updates = (data || [])
      .filter((row) => row.phone_number)
      .map((row) => ({
        id: row.id,
        phone: row.phone_number,
      }))

    if (updates.length === 0) return

    const results = await Promise.all(updates.map((row) => supabase
      .from('users')
      .update({ phone: row.phone })
      .eq('id', row.id)))
    const updateError = results.find((result) => result.error)?.error
    if (updateError) {
      console.error('Failed to backfill user phones', updateError)
      return
    }
    await refreshManageUsers()
  }, [authSession, refreshManageUsers])

  const handleOpenUserDetail = async (user) => {
    if (!user) return
    const hasCoreDetails = user.gender && user.gender !== '—'
      && user.age && user.age !== '—'
      && user.country && user.country !== '—'
      && user.currentAddress && user.currentAddress !== '—'
      && user.positionApplied && user.positionApplied !== '—'
    const hasCv = Boolean(user.cvUrl)

    if (hasCoreDetails && hasCv) {
      setSelectedDashboardUser(user)
      return
    }

    const matchById = user.applicationId
    const { data, error } = await supabase
      .from('job_applications')
      .select('id, gender, age, country, current_address, position_applied, cv_url, cv_filename, cv_size, phone_number, phone_country_code')
      .eq(matchById ? 'id' : 'email', matchById ? user.applicationId : user.email)
      .is('deleted_at', null)
      .maybeSingle()

    if (error) {
      console.warn('Failed to load application details with deleted_at filter, retrying without it.', error)
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('job_applications')
        .select('id, gender, age, country, current_address, position_applied, cv_url, cv_filename, cv_size, phone_number, phone_country_code')
        .eq(matchById ? 'id' : 'email', matchById ? user.applicationId : user.email)
        .maybeSingle()
      if (fallbackError) {
        console.error('Failed to load application details', fallbackError)
        setSelectedDashboardUser(user)
        return
      }
      if (!fallbackData) {
        setSelectedDashboardUser(user)
        return
      }
      setSelectedDashboardUser({
        ...user,
        gender: fallbackData.gender || user.gender,
        age: fallbackData.age ?? user.age,
        country: fallbackData.country || user.country,
        currentAddress: fallbackData.current_address || user.currentAddress,
        positionApplied: fallbackData.position_applied || user.positionApplied,
        cvUrl: fallbackData.cv_url || user.cvUrl,
        cvFilename: fallbackData.cv_filename || user.cvFilename,
        cvSize: fallbackData.cv_size ?? user.cvSize,
      })
      return
    }

    if (!data) {
      setSelectedDashboardUser(user)
      return
    }

    setSelectedDashboardUser({
      ...user,
      gender: data.gender || user.gender || '—',
      age: data.age ?? user.age ?? '—',
      country: data.country || user.country || '—',
      currentAddress: data.current_address || user.currentAddress || '—',
      positionApplied: data.position_applied || user.positionApplied || '—',
      contactNumber: data.phone_number || user.contactNumber || '—',
      phoneCountryCode: data.phone_country_code || user.phoneCountryCode || '',
      cvUrl: data.cv_url || user.cvUrl || '',
      cvFilename: data.cv_filename || user.cvFilename || '—',
      cvSize: data.cv_size ?? user.cvSize ?? null,
    })
  }

  const _fetchCvForSelectedUser = async (user) => {
    if (!user) return { cvRef: '', cvFilename: 'cv.pdf' }
    if (user.cvUrl) {
      return {
        cvRef: user.cvUrl,
        cvFilename: user.cvFilename && user.cvFilename !== '—' ? user.cvFilename : 'cv.pdf',
      }
    }

    const matchById = user.applicationId
    if (!matchById && !user.email) {
      return { cvRef: '', cvFilename: 'cv.pdf' }
    }

    const { data, error } = await supabase
      .from('job_applications')
      .select('cv_url, cv_filename, cv_size')
      .eq(matchById ? 'id' : 'email', matchById ? user.applicationId : user.email)
      .maybeSingle()

    if (error || !data) {
      console.warn('Failed to fetch CV details', error)
      return { cvRef: '', cvFilename: 'cv.pdf' }
    }

    const updatedUser = {
      ...user,
      cvUrl: data.cv_url || '',
      cvFilename: data.cv_filename || user.cvFilename || '—',
      cvSize: data.cv_size ?? user.cvSize ?? null,
    }
    setSelectedDashboardUser(updatedUser)
    return {
      cvRef: updatedUser.cvUrl,
      cvFilename: updatedUser.cvFilename && updatedUser.cvFilename !== '—' ? updatedUser.cvFilename : 'cv.pdf',
    }
  }

  const handleViewCv = async () => {
    if (!selectedDashboardUser) return
    const { cvRef } = await _fetchCvForSelectedUser(selectedDashboardUser)
    if (!cvRef) {
      window.alert('No CV found for this applicant.')
      return
    }
    const storage = supabase.storage.from('job-applications-cv')
    const { data: signedData, error: signedError } = await storage.createSignedUrl(cvRef, 60 * 5)
    if (signedError || !signedData?.signedUrl) {
      const { data: publicData } = storage.getPublicUrl(cvRef)
      if (publicData?.publicUrl) {
        window.open(publicData.publicUrl, '_blank', 'noopener,noreferrer')
      }
      return
    }
    window.open(signedData.signedUrl, '_blank', 'noopener,noreferrer')
  }
  const PAGE_SIZE = 5
  const MANAGE_PAGE_SIZE = 3
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
  const [messageTab, setMessageTab] = useState('unread')
  const [messageSearchQuery, setMessageSearchQuery] = useState('')
  const [messageThreads, setMessageThreads] = useState([])
  const [overallMessagesCount, setOverallMessagesCount] = useState(0)
  const [isMessagesLoading, setIsMessagesLoading] = useState(false)
  const [messagesError, setMessagesError] = useState('')
  const normalizedSearch = tableSearchQuery.trim().toLowerCase()
  const hasTableSearchValue = normalizedSearch.length > 0
  const isTableSearchVisible = isTableSearchOpen || hasTableSearchValue
  const filteredUsers = manageUsers.filter((user) => {
    const matchesRole = tableRoleFilter === 'all' || getRoleOptionFromLabel(user.role) === tableRoleFilter
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
  const normalizedManageSearch = manageSearchQuery.trim().toLowerCase()
  const hasManageSearchValue = normalizedManageSearch.length > 0
  const isManageSearchVisible = isManageSearchOpen || hasManageSearchValue
  const getManageRoleOption = (role = '') => {
    const normalizedRole = role.trim().toLowerCase()
    if (!normalizedRole) return 'employee'
    return normalizedRole.includes('admin') ? 'admin' : 'employee'
  }
  const filteredManageUsers = manageUsers.filter((user) => {
    const matchesRole = manageRoleFilter === 'all' || getManageRoleOption(user.role) === manageRoleFilter
    const matchesSearch = !normalizedManageSearch || (
      user.name.toLowerCase().includes(normalizedManageSearch) ||
      user.email.toLowerCase().includes(normalizedManageSearch) ||
      user.role.toLowerCase().includes(normalizedManageSearch)
    )
    return matchesRole && matchesSearch
  })
  const sortedManageUsers = [...filteredManageUsers].sort((a, b) => {
    if (manageSortMode === 'az') {
      return a.name.localeCompare(b.name)
    }
    const dateA = a.createdAt || a.joined || 0
    const dateB = b.createdAt || b.joined || 0
    return new Date(dateB) - new Date(dateA)
  })
  const topScores = [98.5, 97.2, 95.8, 94.5, 92.1]
  const _topPerformers = manageUsers.slice(0, 5).map((user, index) => ({
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
  const manageTotalResults = sortedManageUsers.length
  const manageTotalPages = Math.max(1, Math.ceil(manageTotalResults / MANAGE_PAGE_SIZE))
  const manageActivePage = Math.min(manageCurrentPage, manageTotalPages)
  const manageStartIndex = manageTotalResults === 0 ? 0 : (manageActivePage - 1) * MANAGE_PAGE_SIZE
  const manageEndIndex = manageTotalResults === 0 ? 0 : Math.min(manageStartIndex + MANAGE_PAGE_SIZE, manageTotalResults)
  const visibleManagePages = getVisiblePageNumbers(manageActivePage, manageTotalPages)

  const manageMembers = sortedManageUsers.slice(manageStartIndex, manageEndIndex)
  const approvalQueue = applications.map((application) => {
    const firstName = application.first_name || ''
    const lastName = application.last_name || ''
    const name = `${firstName} ${lastName}`.trim() || 'Applicant'
    const initialsBase = `${firstName.charAt(0) || 'A'}${lastName.charAt(0) || ''}`.toUpperCase()
    const createdAt = application.created_at ? new Date(application.created_at) : null
    const phone = application.phone_number || ''
    const email = application.email || '—'
    const username = email && email !== '—' ? email.split('@')[0] : '—'

    return {
      id: application.id,
      name,
      email,
      firstName,
      lastName,
      gender: application.gender || '—',
      age: application.age ?? '—',
      phoneCountryCode: application.phone_country_code || '',
      initials: initialsBase || 'NA',
      requestedRole: application.position_applied || 'Applicant',
      requestedRoleLabel: getRoleLabel(application.position_applied || ''),
      contactNumber: phone || '—',
      positionApplied: application.position_applied || '—',
      country: application.country || '—',
      currentAddress: application.current_address || '—',
      cvFilename: application.cv_filename || '—',
      cvUrl: application.cv_url || '',
      cvSize: application.cv_size ?? null,
      status: 'inactive',
      onboarding: createdAt ? formatAdminDate(createdAt) : '—',
      username,
      activity: 'Pending approval',
      requestedAt: createdAt ? createdAt.toLocaleDateString() : 'Recently',
      joined: application.created_at || new Date().toISOString(),
    }
  })
  const normalizedApprovalSearch = approvalSearchQuery.trim().toLowerCase()
  const hasApprovalSearchValue = normalizedApprovalSearch.length > 0
  const isApprovalSearchVisible = isApprovalSearchOpen || hasApprovalSearchValue
  const filteredApprovalQueue = approvalQueue.filter((user) => (
    (approvalRoleFilter === 'all' || getRoleOptionFromLabel(user.requestedRoleLabel) === approvalRoleFilter) &&
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
  const isApprovalHistoryArchived = (entry) => Boolean(entry.archivedAt) || archivedApprovalHistoryIds.has(entry.id)
  const getApprovalHistoryKey = (entry, index) => (
    entry.id
    || entry.applicationId
    || (entry.email ? `${entry.email}-${entry.decisionDate || 'nodate'}` : `approval-${index}`)
  )
  const archivedApprovalHistoryEntries = approvalHistory.filter((entry) => isApprovalHistoryArchived(entry))
  const approvalHistorySourceEntries = showApprovalHistoryArchive
    ? archivedApprovalHistoryEntries
    : approvalHistory.filter((entry) => !isApprovalHistoryArchived(entry))
  const approvalHistoryYears = Array.from(new Set(approvalHistorySourceEntries.map((entry) => entry.year)))
    .sort((a, b) => Number(b) - Number(a))
  const normalizedDecisionFilter = approvalHistoryDecisionFilter.toLowerCase()
  const matchesDecisionFilter = (decision) => {
    if (normalizedDecisionFilter === 'all') return true
    const normalizedDecision = (decision || '').toLowerCase()
    if (normalizedDecisionFilter === 'approved') {
      return normalizedDecision === 'accepted' || normalizedDecision === 'approved'
    }
    if (normalizedDecisionFilter === 'rejected') {
      return normalizedDecision === 'declined' || normalizedDecision === 'rejected'
    }
    return normalizedDecision === normalizedDecisionFilter
  }
  const filteredApprovalHistory = approvalHistorySourceEntries.filter((entry) => {
    if (approvalHistoryYearFilter !== 'all' && entry.year !== approvalHistoryYearFilter) return false
    if (!matchesDecisionFilter(entry.decision)) return false
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
  const totalUsersCount = manageUsers.length
  const verifiedUsersCount = manageUsers.filter((user) => user.status === 'active').length
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
  const newSignupsCount = manageUsers.filter((user) => {
    if (!user.createdAt) return false
    return Date.now() - new Date(user.createdAt).getTime() <= thirtyDaysMs
  }).length
  const pendingApprovalCount = approvalQueue.length
  const isInternRequest = (label = '') => label.toLowerCase().includes('intern')
  const pendingInternApprovals = approvalQueue.filter((user) => (
    isInternRequest(user.requestedRoleLabel || user.requestedRole || '')
  )).length
  const pendingEmployeeApprovals = Math.max(pendingApprovalCount - pendingInternApprovals, 0)
  const internUsers = manageUsers.filter((user) => user.role === 'Intern')
  const internAnalyticsUsers = analyticsUsers.filter((user) => user.role === 'Intern')
  const completedEvaluationCount = Object.values(evaluationRecords).filter((entry) => entry.status === 'completed').length
  const inProgressEvaluationCount = Object.values(evaluationRecords).filter((entry) => entry.status === 'in-progress').length
  const averageInternProgress = internAnalyticsUsers.length > 0
    ? `${Math.round(internAnalyticsUsers.reduce((sum, user) => sum + user.averageScore, 0) / internAnalyticsUsers.length)}%`
    : '0%'
  const _evaluationSummary = [
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
  const _isEvaluationSearchVisible = isEvaluationSearchOpen || hasEvaluationSearchValue
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
  const _pagedEvaluationQueue = filteredEvaluationQueue.slice(evaluationStartIndex, evaluationEndIndex)
  const _visibleEvaluationPages = getVisiblePageNumbers(evaluationActivePage, evaluationTotalPages)
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
  const _isEvaluationHistorySearchVisible = isEvaluationHistorySearchOpen || hasEvaluationHistorySearchValue
  const visibleEvaluationHistoryEntries = evaluationHistoryEntries.filter((entry) => !archivedEvaluationHistoryIds.has(entry.id))
  const _evaluationHistoryYears = Array.from(new Set(visibleEvaluationHistoryEntries.map((entry) => entry.year))).sort((a, b) => b.localeCompare(a))
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
  const _pagedEvaluationHistory = sortedEvaluationHistory.slice(evaluationHistoryStartIndex, evaluationHistoryEndIndex)
  const _visibleEvaluationHistoryPages = getVisiblePageNumbers(evaluationHistoryActivePage, evaluationHistoryTotalPages)
  const _evaluationRubric = [
    { title: 'Task Accuracy', description: 'Measure intern output quality, instruction-following, and correction rate.' },
    { title: 'Attendance and Hours', description: 'Check internship hours submitted, schedule consistency, and required progress.' },
    { title: 'Coaching Notes', description: 'Record strengths, blockers, and next-step guidance for each intern review.' },
  ]

  const hydrateApprovalHistory = async () => {
    const [historyResult, archiveMetaResult] = await Promise.all([
      supabase
        .from('approval_history_with_dates')
        .select('*')
        .order('decided_at', { ascending: false }),
      supabase
        .from('approval_history')
        .select('id, application_id, applicant_email, archived_at'),
    ])

    if (historyResult.error) {
      console.error('Failed to load approval history', historyResult.error)
    }
    if (archiveMetaResult.error) {
      console.error('Failed to load approval archive metadata', archiveMetaResult.error)
    }

    const archiveMetaMap = new Map()
    ;(archiveMetaResult.data || []).forEach((entry) => {
      const key = entry.application_id || entry.applicant_email || entry.id
      if (!key) return
      archiveMetaMap.set(key, entry.archived_at || null)
    })

    const mappedHistoryRows = (historyResult.data || []).map((entry) => {
      const mapped = mapApprovalHistoryEntry(entry, manageUsers)
      const archiveKey = mapped.applicationId || mapped.email || mapped.id
      const archivedAt = archiveMetaMap.get(archiveKey)
      return archivedAt && !mapped.archivedAt ? { ...mapped, archivedAt } : mapped
    })
    const mappedApprovalHistory = mappedHistoryRows

    setApprovalHistory(mappedApprovalHistory)

    const archivedIdsFromView = mappedApprovalHistory
      .filter((entry) => entry.archivedAt)
      .map((entry) => entry.id)
    setArchivedApprovalHistoryIds(new Set(archivedIdsFromView))

    return { ok: !historyResult.error, data: mappedApprovalHistory }
  }

  useEffect(() => {
    let isMounted = true
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      setAuthSession(data.session || null)
      setIsAuthReady(true)
    }
    initAuth()
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session || null)
      setIsAuthReady(true)
    })
    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (adminActivePanel !== 'user-approval') return
    if (!isAuthReady) return
    if (!authSession) {
      setApplicationsError('Please sign in to load approvals.')
      setApplications([])
      return
    }
    let isMounted = true
    const loadApplications = async () => {
      setIsApplicationsLoading(true)
      setApplicationsError('')
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('status', 'pending')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (!isMounted) return
      if (error) {
        console.warn('Failed to load applications with deleted_at filter, retrying without it.', error)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('job_applications')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
        if (fallbackError) {
          console.error('Failed to load applications', fallbackError)
          setApplicationsError('Unable to load applications.')
          setApplications([])
        } else {
          setApplications(fallbackData || [])
        }
      } else {
        setApplications(data || [])
      }
      setIsApplicationsLoading(false)
    }

    loadApplications()
    hydrateApprovalHistory()
    return () => {
      isMounted = false
    }
  }, [adminActivePanel, authSession, isAuthReady, manageUsers])

  useEffect(() => {
    if (adminActivePanel !== 'messages') return
    if (!isAuthReady) return
    if (!authSession) {
      setMessagesError('Please sign in to load messages.')
      setMessageThreads([])
      return
    }
    let isMounted = true
    const loadMessages = async () => {
      setIsMessagesLoading(true)
      setMessagesError('')
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (!isMounted) return
      if (error) {
        console.warn('Failed to load messages with deleted_at filter, retrying without it.', error)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
        if (!isMounted) return
        if (fallbackError) {
          console.error('Failed to load messages', fallbackError)
          setMessagesError('Unable to load messages.')
          setMessageThreads([])
          setIsMessagesLoading(false)
          return
        }
        const filteredFallbackRows = (fallbackData || []).filter((row) => !row.deleted_at)
        const mappedFallback = filteredFallbackRows.map(mapContactMessageToThread)
        setMessageThreads(mappedFallback)
        setOverallMessagesCount(mappedFallback.length)
        if (mappedFallback.length > 0) {
          setSelectedMessageId((prev) => (mappedFallback.some((item) => item.id === prev) ? prev : mappedFallback[0].id))
        }
        setIsMessagesLoading(false)
        return
      }
      const mapped = (data || []).map(mapContactMessageToThread)
      setMessageThreads(mapped)
      setOverallMessagesCount(mapped.length)
      if (mapped.length > 0) {
        setSelectedMessageId((prev) => (mapped.some((item) => item.id === prev) ? prev : mapped[0].id))
      }
      setIsMessagesLoading(false)
    }
    loadMessages()
    const channel = supabase
      .channel('contact-messages-stream')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        () => {
          loadMessages()
        }
      )
      .subscribe()
    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [adminActivePanel, authSession, isAuthReady])

  useEffect(() => {
    if (adminActivePanel !== 'dashboard') return
    if (!isAuthReady || !authSession) return
    let isMounted = true
    const loadMessageCount = async () => {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .is('deleted_at', null)
      if (!isMounted) return
      if (error) {
        console.warn('Failed to load message count with deleted_at filter, retrying without it.', error)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('contact_messages')
          .select('id, deleted_at')
        if (!isMounted) return
        if (fallbackError) {
          console.error('Failed to load message count', fallbackError)
          return
        }
        setOverallMessagesCount((fallbackData || []).filter((row) => !row.deleted_at).length)
        return
      }
      setOverallMessagesCount(count ?? 0)
    }
    loadMessageCount()
    return () => {
      isMounted = false
    }
  }, [adminActivePanel, authSession, isAuthReady])

  useEffect(() => {
    if (!isAuthReady || !authSession) return
    let isMounted = true
    const loadMessageNotifications = async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(10)
      if (!isMounted) return
      if (error) {
        console.warn('Failed to load message notifications with deleted_at filter, retrying without it.', error)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        if (!isMounted) return
        if (fallbackError) {
          console.error('Failed to load message notifications', fallbackError)
          return
        }
        const filteredFallbackRows = (fallbackData || []).filter((row) => !row.deleted_at)
        const fallbackNotifications = filteredFallbackRows.map(mapContactMessageToNotification)
        setNotifications((prev) => mergeMessageNotifications(prev, fallbackNotifications))
        return
      }
      const messageNotifications = (data || []).map(mapContactMessageToNotification)
      setNotifications((prev) => mergeMessageNotifications(prev, messageNotifications))
    }

    loadMessageNotifications()

    const channel = supabase
      .channel('contact-messages-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        (payload) => {
          const notification = mapContactMessageToNotification(payload.new)
          setNotifications((prev) => {
            if (prev.some((item) => item.id === notification.id)) return prev
            return [notification, ...prev]
          })
          setOverallMessagesCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [authSession, isAuthReady])

  useEffect(() => {
    let isMounted = true
    const loadUsers = async () => {
      if (!isMounted) return
      await refreshManageUsers()
    }

    loadUsers()
    return () => {
      isMounted = false
    }
  }, [refreshManageUsers])

  useEffect(() => {
    if (adminActivePanel !== 'manage-users') return
    if (!isAuthReady || !authSession) return
    backfillUserPhones()
  }, [adminActivePanel, authSession, backfillUserPhones, isAuthReady])

  useEffect(() => {
    if (adminActivePanel === 'messages') {
      setMessageTab('unread')
    }
  }, [adminActivePanel])

  useEffect(() => {
    const channel = supabase
      .channel('job-applications-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'job_applications' },
        (payload) => {
          const application = payload.new
          if (application?.status && application.status !== 'pending') return

          const firstName = application?.first_name || ''
          const lastName = application?.last_name || ''
          const name = `${firstName} ${lastName}`.trim() || 'Applicant'
          const position = application?.position_applied || 'an open role'

          setNotifications((prev) => {
            if (prev.some((item) => item.id === `approval-${application.id}`)) {
              return prev
            }
            return [
              {
                id: `approval-${application.id}`,
                type: 'approval',
                section: 'current',
                status: 'new',
                title: 'New approval request',
                description: `${name} submitted an application for ${position}.`,
                time: 'Just now',
                read: false,
                email: application?.email || '',
                applicationId: application?.id || null,
                name,
                requestedRole: application?.position_applied || 'Applicant',
                positionApplied: application?.position_applied || 'Applicant',
                requestedAt: application?.created_at
                  ? new Date(application.created_at).toLocaleDateString()
                  : 'Recently',
              },
              ...prev,
            ]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
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
      if (manageFilterRef.current && !manageFilterRef.current.contains(event.target)) {
        setIsManageFilterOpen(false)
      }
      if (!event.target.closest('.admin-manage-row-actions')) {
        setOpenMemberActionMenuId(null)
      }
      if (!event.target.closest('.admin-approval-history-row-actions')) {
        setOpenApprovalHistoryActionMenuId(null)
      }
      if (!event.target.closest('.admin-message-row-actions')) {
        setOpenMessageActionId(null)
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
  }, [approvalHistorySearchQuery, approvalHistoryYearFilter, approvalHistorySortMode, approvalHistoryDecisionFilter])

  useEffect(() => {
    setAnalyticsCurrentPage(1)
  }, [analyticsSearchQuery, analyticsSortMode])

  useEffect(() => {
    setManageCurrentPage(1)
  }, [manageSearchQuery, manageRoleFilter, manageSortMode])

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
    if (isManageSearchOpen) {
      manageSearchInputRef.current?.focus()
    }
  }, [isManageSearchOpen])

  useEffect(() => {
    if (!isAdminCountryOpen) return undefined
    const handleClickOutside = (event) => {
      if (adminCountryRef.current && !adminCountryRef.current.contains(event.target)) {
        setIsAdminCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isAdminCountryOpen])

  useEffect(() => {
    if (!isAddMemberModalOpen && !selectedDashboardUser && !selectedEvaluationItem) return undefined
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [isAddMemberModalOpen, selectedDashboardUser, selectedEvaluationItem])

  useEffect(() => {
    if (!isAddMemberSuccessOpen) return undefined
    const timeout = setTimeout(() => {
      setIsAddMemberSuccessOpen(false)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [isAddMemberSuccessOpen])

  const handleAddMemberFieldChange = (field, value) => {
    setAddMemberForm((prev) => {
      const nextForm = {
        ...prev,
        [field]: field === 'phoneNumber' ? normalizeContactNumber(value) : value,
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
    setAddMemberError('')
    setIsAdminCountryOpen(false)
    setAddMemberForm(getInitialAddMemberFormState())
  }

  const handleOpenAddMemberModal = () => {
    setEditingMemberId(null)
    setOpenMemberActionMenuId(null)
    setAddMemberError('')
    setIsAdminCountryOpen(false)
    setAddMemberForm(getInitialAddMemberFormState())
    setIsAddMemberModalOpen(true)
  }

  const handleEditMember = async (member) => {
    const refreshed = await refreshManageUsers()
    const latestMember = refreshed.find((user) => user.id === member.id) || member
    const nameParts = (latestMember.name || '').split(/\s+/).filter(Boolean)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ')
    setEditingMemberId(latestMember.id)
    setOpenMemberActionMenuId(null)
    setAddMemberError('')
    setIsAdminCountryOpen(false)
    setAddMemberForm({
      firstName,
      lastName,
      gender: latestMember.gender && latestMember.gender !== '—' ? latestMember.gender : '',
      age: latestMember.age && latestMember.age !== '—' ? String(latestMember.age) : '',
      phoneCountryCode: latestMember.phoneCountryCode || '+63',
      phoneNumber: latestMember.contactNumber === '—' ? '' : latestMember.contactNumber,
      email: latestMember.email,
      positionApplied: latestMember.positionApplied === '—' ? '' : latestMember.positionApplied,
      country: latestMember.country === '—' ? '' : latestMember.country,
      currentAddress: latestMember.currentAddress === '—' ? '' : latestMember.currentAddress,
      cvFile: null,
    })
    setIsAddMemberModalOpen(true)
  }

  const handleDeleteMember = (memberId) => {
    setOpenMemberActionMenuId(null)
    setManageUsers((prev) => prev.filter((user) => user.id !== memberId))
    setManageCurrentPage((prev) => Math.max(1, prev))
  }

  const handleRequestRemoveMember = (member) => {
    setOpenMemberActionMenuId(null)
    setPendingRemoveMember(member)
  }

  const handleCancelRemoveMember = () => {
    setPendingRemoveMember(null)
  }

  const handleConfirmRemoveMember = async () => {
    if (!pendingRemoveMember) return
    const targetId = pendingRemoveMember.id
    const targetEmail = pendingRemoveMember.email
    const targetApplicationId = pendingRemoveMember.applicationId
    const deleteLabel = pendingRemoveMember.name || 'member'
    const deletedAt = new Date().toISOString()

    if (targetApplicationId) {
      const { data: applicationData, error: applicationError } = await supabase
        .from('job_applications')
        .update({ deleted_at: deletedAt })
        .eq('id', targetApplicationId)
        .select('id')
      if (applicationError || !applicationData?.length) {
        console.warn('Soft delete failed for application, falling back to hard delete.', applicationError)
        const { data: hardDeleteData, error: hardDeleteError } = await supabase
          .from('job_applications')
          .delete()
          .eq('id', targetApplicationId)
          .select('id')
        if (hardDeleteError || !hardDeleteData?.length) {
          console.error('Failed to delete application', hardDeleteError)
          setMemberDeleteToast({
            id: Date.now(),
            status: 'failed',
            message: hardDeleteError?.message || 'Unable to delete application.',
          })
          setTimeout(() => {
            setMemberDeleteToast((prev) => (prev && prev.status === 'failed' ? null : prev))
          }, 3000)
          setPendingRemoveMember(null)
          return
        }
      }
    } else if (targetEmail) {
      const { data: applicationData, error: applicationError } = await supabase
        .from('job_applications')
        .update({ deleted_at: deletedAt })
        .eq('email', targetEmail)
        .select('id')
      if (applicationError || !applicationData?.length) {
        console.warn('Soft delete failed for application by email, falling back to hard delete.', applicationError)
        const { data: hardDeleteData, error: hardDeleteError } = await supabase
          .from('job_applications')
          .delete()
          .eq('email', targetEmail)
          .select('id')
        if (hardDeleteError || !hardDeleteData?.length) {
          console.error('Failed to delete application by email', hardDeleteError)
          setMemberDeleteToast({
            id: Date.now(),
            status: 'failed',
            message: hardDeleteError?.message || 'Unable to delete application.',
          })
          setTimeout(() => {
            setMemberDeleteToast((prev) => (prev && prev.status === 'failed' ? null : prev))
          }, 3000)
          setPendingRemoveMember(null)
          return
        }
      }
    }

    const { data: deleteData, error } = await supabase
      .from('users')
      .update({ deleted_at: deletedAt })
      .eq('id', targetId)
      .select('id')

    if (error || !deleteData?.length) {
      console.error('Failed to delete member', error)
      setMemberDeleteToast({
        id: Date.now(),
        status: 'failed',
        message: error?.message || 'Unable to delete member.',
      })
      setTimeout(() => {
        setMemberDeleteToast((prev) => (prev && prev.status === 'failed' ? null : prev))
      }, 3000)
      setPendingRemoveMember(null)
      return
    }

    handleDeleteMember(targetId)
    if (targetEmail) {
      setManageUsers((prev) => prev.filter((user) => user.email !== targetEmail))
    }
    await refreshManageUsers()
    setMemberDeleteToast({
      id: Date.now(),
      status: 'deleted',
      memberId: targetId,
      message: `Deleted ${deleteLabel}.`,
    })
    setTimeout(() => {
      setMemberDeleteToast((prev) => (prev && prev.status === 'deleted' ? null : prev))
    }, 3000)
    setPendingRemoveMember(null)
  }

  const handleRestoreMember = async () => {
    if (!memberDeleteToast?.memberId) return
    const restoreId = memberDeleteToast.memberId
    setMemberDeleteToast((prev) => (prev ? { ...prev, status: 'restoring', message: 'Restoring member...' } : prev))
    const { error } = await supabase
      .from('users')
      .update({ deleted_at: null })
      .eq('id', restoreId)

    if (error) {
      console.error('Failed to restore member', error)
      setMemberDeleteToast({
        id: Date.now(),
        status: 'failed',
        message: error.message || 'Unable to restore member.',
      })
      setTimeout(() => {
        setMemberDeleteToast((prev) => (prev && prev.status === 'failed' ? null : prev))
      }, 3000)
      return
    }

    await refreshManageUsers()
    setMemberDeleteToast({
      id: Date.now(),
      status: 'restored',
      message: 'Member restored.',
    })
    setTimeout(() => {
      setMemberDeleteToast((prev) => (prev && prev.status === 'restored' ? null : prev))
    }, 3000)
  }

  const handleAddMemberSubmit = async (event) => {
    event.preventDefault()

    const trimmedFirstName = addMemberForm.firstName.trim()
    const trimmedLastName = addMemberForm.lastName.trim()
    const trimmedEmail = addMemberForm.email.trim().toLowerCase()
    const trimmedPhone = addMemberForm.phoneNumber.trim()
    const trimmedCountryCode = addMemberForm.phoneCountryCode.trim()
    const trimmedPosition = addMemberForm.positionApplied.trim()
    const trimmedCountry = addMemberForm.country.trim()
    const trimmedAddress = addMemberForm.currentAddress.trim()
    const numericAge = addMemberForm.age ? Number(addMemberForm.age) : null

    if (!trimmedFirstName || !trimmedLastName || !trimmedPhone) {
      setAddMemberError('First name, last name, and contact number are required.')
      return
    }

    if (!trimmedEmail) {
      setAddMemberError('Email is required.')
      return
    }

    if (manageUsers.some((user) => user.email.toLowerCase() === trimmedEmail && user.id !== editingMemberId)) {
      setAddMemberError('That email already exists in the user list.')
      return
    }

    const existingMember = editingMemberId
      ? manageUsers.find((user) => user.id === editingMemberId)
      : null
    let cvFilename = existingMember?.cvFilename && existingMember.cvFilename !== '—' ? existingMember.cvFilename : null
    let cvUrl = existingMember?.cvUrl || null
    let cvSize = existingMember?.cvSize ?? null

    if (addMemberForm.cvFile) {
      const safeName = addMemberForm.cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `applications/${Date.now()}-${safeName}`
      const { error: uploadError } = await supabase
        .storage
        .from('job-applications-cv')
        .upload(filePath, addMemberForm.cvFile, { upsert: true })

      if (uploadError) {
        console.error('CV upload failed', uploadError)
        setAddMemberError('CV upload failed. Please try again.')
        return
      }

      cvFilename = addMemberForm.cvFile.name
      cvSize = addMemberForm.cvFile.size
      cvUrl = filePath
    }

    const fullName = `${trimmedFirstName} ${trimmedLastName}`.trim()
    const roleLabel = trimmedPosition || 'Applicant'
    const applicationPayload = {
      first_name: trimmedFirstName || null,
      last_name: trimmedLastName || null,
      gender: addMemberForm.gender || null,
      age: Number.isFinite(numericAge) ? numericAge : null,
      phone_country_code: trimmedCountryCode || null,
      phone_number: trimmedPhone || null,
      email: trimmedEmail || null,
      position_applied: trimmedPosition || null,
      country: trimmedCountry || null,
      current_address: trimmedAddress || null,
      cv_filename: cvFilename,
      cv_size: cvSize,
      cv_url: cvUrl,
      status: 'accepted',
    }

    let applicationId = null
    
    if (existingMember?.applicationId) {
      applicationId = existingMember.applicationId
    } else if (trimmedEmail) {
      const { data: existingApplication } = await supabase
        .from('job_applications')
        .select('id')
        .eq('email', trimmedEmail)
        .maybeSingle()
      if (existingApplication?.id) {
        applicationId = existingApplication.id
      }
    }

    if (applicationId) {
      const { error: applicationError } = await supabase
        .from('job_applications')
        .update(applicationPayload)
        .eq('id', applicationId)
      if (applicationError) {
        console.error('Failed to update application', applicationError)
      }
    } else {
      const { data: applicationRow, error: applicationError } = await supabase
        .from('job_applications')
        .insert([applicationPayload])
        .select('id')
        .single()
      if (applicationError) {
        console.error('Failed to create application', applicationError)
      } else {
        applicationId = applicationRow?.id || null
      }
    }

    const { error } = await supabase
      .from('users')
      .upsert([{
        application_id: applicationId,
        full_name: fullName,
        email: trimmedEmail,
        role: roleLabel,
        status: 'active',
        phone: trimmedPhone || null,
        phone_number: trimmedPhone || null,
        phone_country_code: trimmedCountryCode || null,
        gender: addMemberForm.gender || null,
        age: Number.isFinite(numericAge) ? numericAge : null,
        country: trimmedCountry || null,
        current_address: trimmedAddress || null,
        position_applied: trimmedPosition || null,
        cv_filename: cvFilename,
        cv_size: cvSize,
        cv_url: cvUrl,
      }], { onConflict: 'email' })

    if (error) {
      console.error('Failed to save member', error)
      setAddMemberError('Unable to save member. Please try again.')
      return
    }

    await refreshManageUsers()
    setManageCurrentPage(1)
    handleCloseAddMemberModal()
    setIsAddMemberSuccessOpen(true)
  }

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const handleClearAllNotifications = () => {
    setNotifications([])
  }

  const mergeMessageNotifications = (prev, incoming) => {
    const incomingMap = new Map(incoming.map((item) => [item.id, item]))
    const next = prev.map((item) => {
      if (item.type !== 'messages') return item
      const updated = incomingMap.get(item.id)
      if (!updated) return item
      return {
        ...updated,
        read: item.read || updated.read,
        section: item.section === 'previous' ? 'previous' : updated.section,
      }
    })
    const existingIds = new Set(prev.map((item) => item.id))
    const newItems = incoming.filter((item) => !existingIds.has(item.id))
    return [...newItems, ...next]
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

  const _handleOpenEvaluation = (item) => {
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

  const _handleOpenEvaluationHistoryDetails = (entry) => {
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

  const handleArchiveApprovalHistory = async (entry) => {
    if (!entry) return
    if (!entry.id && !entry.applicationId && !entry.email) {
      console.warn('Archive skipped: missing identifiers for approval history entry.')
      return
    }
    const entryId = entry.id
    setArchivedApprovalHistoryIds((prev) => {
      const next = new Set(prev)
      next.add(entryId)
      return next
    })
    setApprovalHistory((prev) => prev.map((entry) => (
      entry.id === entryId ? { ...entry, archivedAt: new Date().toISOString() } : entry
    )))

    const archivedAt = new Date().toISOString()
    let historyData = null
    let historyError = null

    const { data, error } = await supabase
      .from('approval_history')
      .update({ archived_at: archivedAt })
      .eq('id', entryId)
      .select('id')
    historyData = data
    historyError = error

    if ((!historyData || historyData.length === 0) && (entry.applicationId || entry.email)) {
      const fallbackQuery = supabase
        .from('approval_history')
        .update({ archived_at: archivedAt })
      if (entry.applicationId) {
        fallbackQuery.eq('application_id', entry.applicationId)
      } else if (entry.email) {
        fallbackQuery.eq('applicant_email', entry.email)
      }
      const fallback = await fallbackQuery.select('id')
      historyData = fallback.data
      historyError = fallback.error
    }

    const hasHistoryMatch = Boolean(historyData && historyData.length > 0)

    if (historyError || !hasHistoryMatch) {
      console.error('Failed to archive approval history', historyError)
      setArchivedApprovalHistoryIds((prev) => {
        if (!prev.has(entryId)) return prev
        const next = new Set(prev)
        next.delete(entryId)
        return next
      })
      setApprovalHistory((prev) => prev.map((entry) => (
        entry.id === entryId ? { ...entry, archivedAt: null } : entry
      )))
      return
    }
    await hydrateApprovalHistory()
    setApprovalHistoryCurrentPage(1)
    setShowApprovalHistoryArchive(true)
  }

  const handleRestoreApprovalHistory = async (entry) => {
    if (!entry) return
    if (!entry.id && !entry.applicationId && !entry.email) {
      console.warn('Restore skipped: missing identifiers for approval history entry.')
      return
    }
    const entryId = entry.id
    setArchivedApprovalHistoryIds((prev) => {
      if (!prev.has(entryId)) return prev
      const next = new Set(prev)
      next.delete(entryId)
      return next
    })
    setApprovalHistory((prev) => prev.map((entry) => (
      entry.id === entryId ? { ...entry, archivedAt: null } : entry
    )))

    let historyData = null
    let historyError = null

    const { data, error } = await supabase
      .from('approval_history')
      .update({ archived_at: null })
      .eq('id', entryId)
      .select('id')
    historyData = data
    historyError = error

    if ((!historyData || historyData.length === 0) && (entry.applicationId || entry.email)) {
      const fallbackQuery = supabase
        .from('approval_history')
        .update({ archived_at: null })
      if (entry.applicationId) {
        fallbackQuery.eq('application_id', entry.applicationId)
      } else if (entry.email) {
        fallbackQuery.eq('applicant_email', entry.email)
      }
      const fallback = await fallbackQuery.select('id')
      historyData = fallback.data
      historyError = fallback.error
    }

    const hasHistoryMatch = Boolean(historyData && historyData.length > 0)

    if (historyError || !hasHistoryMatch) {
      console.error('Failed to restore approval history', historyError)
      setArchivedApprovalHistoryIds((prev) => {
        const next = new Set(prev)
        next.add(entryId)
        return next
      })
      setApprovalHistory((prev) => prev.map((entry) => (
        entry.id === entryId ? { ...entry, archivedAt: new Date().toISOString() } : entry
      )))
      return
    }
    await hydrateApprovalHistory()
    setApprovalHistoryCurrentPage(1)
    setShowApprovalHistoryArchive(false)
  }

  const handleDeleteApprovalHistory = async (entryId) => {
    const previousApprovalHistory = approvalHistory
    const previousArchivedIds = archivedApprovalHistoryIds

    setApprovalHistory((prev) => prev.filter((entry) => entry.id !== entryId))
    setArchivedApprovalHistoryIds((prev) => {
      if (!prev.has(entryId)) return prev
      const next = new Set(prev)
      next.delete(entryId)
      return next
    })

    const { error } = await supabase
      .from('approval_history')
      .delete()
      .eq('id', entryId)

    if (error) {
      console.error('Failed to delete approval history', error)
      setApprovalHistory(previousApprovalHistory)
      setArchivedApprovalHistoryIds(previousArchivedIds)
    }
  }

  const handleRequestApprovalHistoryDelete = (entry) => {
    if (!entry) return
    setPendingApprovalHistoryDelete(entry)
  }

  const handleCancelApprovalHistoryDelete = () => {
    setPendingApprovalHistoryDelete(null)
  }

  const handleConfirmApprovalHistoryDelete = () => {
    if (!pendingApprovalHistoryDelete) return
    handleDeleteApprovalHistory(pendingApprovalHistoryDelete.id)
    setPendingApprovalHistoryDelete(null)
  }

  const removeTaskFromRecordMap = (sourceMap, task) => {
    if (!sourceMap || typeof sourceMap !== 'object') return sourceMap
    const { [task]: _removedTask, ...remaining } = sourceMap
    return remaining
  }

  const _handleArchiveEvaluationHistory = (entryId) => {
    setArchivedEvaluationHistoryIds((prev) => {
      const next = new Set(prev)
      next.add(entryId)
      return next
    })
  }

  const _handleDeleteEvaluationHistory = (entry) => {
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

  const handleNotificationClick = (notification) => {
    const notificationId = typeof notification === 'string' ? notification : notification?.id
    if (!notificationId) return
    setNotifications((prev) => prev.map((item) => (
      item.id === notificationId ? { ...item, read: true } : item
    )))
    if (notification?.type === 'messages') {
      setAdminActivePanel('messages')
      setMessageTab(notification.messageCategory || 'unread')
      if (notification.messageId) {
        setSelectedMessageId(notification.messageId)
      }
    }
  }

  const _handleApprovalDecision = (event, notificationId, decision) => {
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

  const handleApprovalQueueAction = async (email, decision, applicationId, fallbackApplicant) => {
    const normalizedDecision = normalizeApprovalAction(decision)
    const normalizedEmail = (email || '').trim().toLowerCase()
    const matchedApplicant = approvalQueue.find((user) => user.email?.toLowerCase() === normalizedEmail || user.id === applicationId)
    const matchedUser = manageUsers.find((user) => user.email?.toLowerCase() === normalizedEmail)
    const historySource = matchedApplicant || matchedUser || fallbackApplicant
    const targetApplicationId = matchedApplicant?.id || applicationId
    const decisionTimestamp = new Date().toISOString()
    const decisionDate = new Date(decisionTimestamp)
    const persistedEmail = (historySource?.email || email || '').trim().toLowerCase()
    let approvedUserSyncError = null
    if (historySource) {
      const createdAtSource = historySource.joined || historySource.createdAt || null
      const createdAt = createdAtSource ? new Date(createdAtSource) : null
      setApprovalHistory((prev) => [
        {
          id: `history-pending-${targetApplicationId || historySource.email || Date.now()}`,
          applicationId: targetApplicationId || null,
          name: historySource.name,
          email: persistedEmail || historySource.email,
          role: historySource.requestedRole || historySource.role,
          decision: normalizedDecision === 'approve' ? 'accepted' : 'rejected',
          archivedAt: null,
          accountCreated: createdAt ? formatAdminDate(createdAt) : (historySource.onboarding || '—'),
          decisionDate: formatAdminDate(decisionDate),
          year: String(decisionDate.getFullYear()),
        },
        ...prev.filter((entry) => entry.applicationId !== targetApplicationId && entry.email !== historySource.email),
      ])
      setApprovalHistoryCurrentPage(1)
    }

    setApplications((prev) => prev.filter((application) => {
      if (matchedApplicant?.id) return application.id !== matchedApplicant.id
      if (applicationId) return application.id !== applicationId
      return application.email?.toLowerCase() !== normalizedEmail
    }))

    if (targetApplicationId) {
      const { error } = await supabase
        .from('job_applications')
        .update({
          status: normalizedDecision === 'approve' ? 'accepted' : 'rejected',
          decided_at: decisionTimestamp,
        })
        .eq('id', targetApplicationId)

      if (error) {
        console.error('Failed to update application status', error)
      }
    }

    if (historySource) {
      const historyPayload = {
        application_id: targetApplicationId || null,
        applicant_name: historySource.name,
        applicant_email: persistedEmail || historySource.email,
        role: historySource.requestedRole || historySource.role,
        decision: normalizedDecision === 'approve' ? 'accepted' : 'rejected',
        decided_at: decisionTimestamp,
        decided_by: 'Admin',
      }

      let historyError = null

      const { error: insertError } = await supabase
        .from('approval_history')
        .insert([historyPayload])

      historyError = insertError

      if (historyError && (targetApplicationId || historySource.email)) {
        let updateQuery = supabase
          .from('approval_history')
          .update(historyPayload)

        if (targetApplicationId) {
          updateQuery = updateQuery.eq('application_id', targetApplicationId)
        } else {
          updateQuery = updateQuery.eq('applicant_email', persistedEmail || historySource.email)
        }

        const { error: updateError } = await updateQuery
        historyError = updateError
      }

      if (historyError) {
        console.error('Failed to persist approval history', historyError)
      } else {
        await hydrateApprovalHistory()
      }
    }

    let didPersistApprovedUser = false
    if (normalizedDecision === 'approve' && historySource) {
      const roleValue = historySource.requestedRoleLabel
        || historySource.requestedRole
        || historySource.role
        || historySource.positionApplied
        || 'Applicant'
      const { error } = await supabase
        .from('users')
        .upsert([{
          application_id: targetApplicationId || null,
          full_name: historySource.name || 'Applicant',
          email: persistedEmail || historySource.email || normalizedEmail,
          role: roleValue,
          status: 'active',
          phone: historySource.contactNumber || null,
          phone_number: historySource.contactNumber || null,
          phone_country_code: historySource.phoneCountryCode || null,
          country: historySource.country || null,
          gender: historySource.gender || null,
          age: typeof historySource.age === 'number' ? historySource.age : null,
          current_address: historySource.currentAddress || null,
          position_applied: historySource.positionApplied || null,
          cv_filename: historySource.cvFilename || null,
          cv_size: historySource.cvSize ?? null,
          cv_url: historySource.cvUrl || null,
        }], { onConflict: 'email' })

      if (error) {
        console.error('Failed to insert approved user', error)
        approvedUserSyncError = error
      } else {
        didPersistApprovedUser = true
        await refreshManageUsers()
      }
    }

    if (normalizedDecision === 'reject') {
      await refreshManageUsers()
    }

    setManageUsers((prev) => {
      if (normalizedDecision === 'reject') {
        return prev.filter((user) => user.email?.toLowerCase() !== normalizedEmail)
      }

      const existing = prev.find((user) => user.email?.toLowerCase() === normalizedEmail)
      if (existing) {
        return prev.map((user) => (
          user.email?.toLowerCase() === normalizedEmail
            ? {
              ...user,
              status: 'active',
              verified: true,
              activity: 'Just now',
              access: user.requestedRole || user.role,
              role: user.requestedRole || user.role,
            }
            : user
        ))
      }

      if (!historySource) return prev
      if (!didPersistApprovedUser) return prev

      const nameParts = historySource.name?.split(/\s+/).filter(Boolean) || []
      const firstInitial = nameParts[0]?.charAt(0) || ''
      const lastInitial = nameParts[nameParts.length - 1]?.charAt(0) || firstInitial
      const roleLabel = historySource.requestedRoleLabel || historySource.requestedRole || historySource.role || 'Applicant'
      const joinedDate = new Date()

      const newMember = {
        id: `member-${Date.now()}`,
        initials: `${firstInitial}${lastInitial}`.toUpperCase(),
        name: historySource.name || 'Applicant',
        email: persistedEmail || historySource.email || normalizedEmail,
        role: roleLabel,
        access: roleLabel,
        status: 'active',
        joined: joinedDate.toISOString().slice(0, 10),
        contactNumber: historySource.contactNumber || '—',
        course: '—',
        internshipHours: '—',
        university: '—',
        activity: 'Just now',
        onboarding: historySource.requestedAt || formatAdminDate(joinedDate),
        verified: true,
        username: historySource.username || (historySource.email ? historySource.email.split('@')[0] : '—'),
      }

      return [newMember, ...prev]
    })

    return { approvedUserSyncError }
  }

  const handleRequestApprovalAction = (email, decision, applicationId, meta) => {
    const matchedUser = approvalQueue.find((user) => user.email === email || user.id === applicationId)
    const source = matchedUser || meta
    setPendingApprovalAction({
      email: source?.email || email || '',
      decision,
      applicationId: applicationId || matchedUser?.id || null,
      name: source?.name || 'Applicant',
      positionApplied: source?.positionApplied || source?.requestedRole || 'Applicant',
      requestedAt: source?.requestedAt || 'Recently',
      role: source?.requestedRole || source?.role || 'Applicant',
    })
  }

  const handleConfirmApprovalAction = async () => {
    if (!pendingApprovalAction) return
    const decisionLabel = pendingApprovalAction.decision === 'approve' ? 'accepted' : 'rejected'
    const approvalDate = new Date()
    const interviewDate = new Date(approvalDate)
    interviewDate.setDate(interviewDate.getDate() + 14)
    const formattedInterviewDate = interviewDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    const emailTarget = pendingApprovalAction.email && pendingApprovalAction.email !== '—'
      ? pendingApprovalAction.email
      : ''
    const actionResult = await handleApprovalQueueAction(
      pendingApprovalAction.email,
      pendingApprovalAction.decision,
      pendingApprovalAction.applicationId,
      {
        name: pendingApprovalAction.name,
        email: pendingApprovalAction.email,
        requestedRole: pendingApprovalAction.role,
      },
    )
    setPendingApprovalAction(null)
    setApprovalToast({
      id: Date.now(),
      decision: actionResult?.approvedUserSyncError ? 'failed' : decisionLabel,
      message: actionResult?.approvedUserSyncError
        ? actionResult.approvedUserSyncError.message || 'Application was updated, but the user could not be added to the dashboard list.'
        : `Application ${decisionLabel}.`,
    })
    if (emailTarget) {
      try {
        const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
        const approveTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_APPROVE
        const rejectTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_REJECT
        const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

        const emailTemplateId = decisionLabel === 'accepted' ? approveTemplateId : rejectTemplateId

        if (emailServiceId && emailTemplateId && emailPublicKey) {
          const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: emailServiceId,
              template_id: emailTemplateId,
              user_id: emailPublicKey,
              template_params: {
                to_name: pendingApprovalAction.name,
                to_email: emailTarget,
                decision: decisionLabel,
                position: pendingApprovalAction.positionApplied,
                applicant_email: pendingApprovalAction.email,
                submitted_date: pendingApprovalAction.requestedAt,
                interview_date: formattedInterviewDate,
                interview_location: INTERVIEW_LOCATION,
                careers_url: CAREERS_URL,
              },
            }),
          })
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`EmailJS error ${response.status}: ${errorText}`)
          }
        } else {
          console.warn('EmailJS config missing; skipping email send.')
        }
      } catch (error) {
        console.error('Failed to send EmailJS notification', error)
      }
    }
    setTimeout(() => {
      setApprovalToast((prev) => (prev && prev.decision === decisionLabel ? null : prev))
    }, 3000)
  }

  const handleCancelApprovalAction = () => {
    setPendingApprovalAction(null)
  }

  const adminPanelTitle = adminActivePanel === 'manage-users'
    ? 'Users'
    : adminActivePanel === 'analytics'
      ? 'Data Analytics'
    : adminActivePanel === 'messages'
      ? 'Messages'
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
  const [selectedMessageId, setSelectedMessageId] = useState('')
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [composeMode, setComposeMode] = useState('new')
  const [isMessageSearchOpen, setIsMessageSearchOpen] = useState(false)
  const [openMessageActionId, setOpenMessageActionId] = useState(null)
  const [pendingDeleteMessage, setPendingDeleteMessage] = useState(null)
  const [composeMessageId, setComposeMessageId] = useState(null)
  const [copiedEmail, setCopiedEmail] = useState('')
  const hasBackfilledPhonesRef = useRef(false)
  const [composeStatus, setComposeStatus] = useState({ type: '', message: '' })
  const [isComposeSubmitting, setIsComposeSubmitting] = useState(false)
  const [composeDraft, setComposeDraft] = useState({
    toName: '',
    toEmail: '',
    fromName: '',
    fromEmail: '',
    message: '',
  })
  const messageTabs = [
    { id: 'unread', label: 'Unread' },
    { id: 'old', label: 'Old' },
    { id: 'starred', label: 'Starred' },
    { id: 'archive', label: 'Archive' },
  ]
  const messageCounts = messageThreads.reduce((acc, thread) => {
    acc[thread.category] = (acc[thread.category] || 0) + 1
    return acc
  }, { unread: 0, old: 0, starred: 0, archive: 0 })
  const updateMessageThread = (id, updates) => {
    setMessageThreads((prev) => prev.map((thread) => {
      if (thread.id !== id) return thread
      const next = { ...thread, ...updates }
      return { ...next, category: deriveMessageCategory(next) }
    }))
  }
  const handleMessageUpdate = async (id, updates) => {
    const dbUpdates = {}
    if (Object.prototype.hasOwnProperty.call(updates, 'isRead')) dbUpdates.is_read = updates.isRead
    if (Object.prototype.hasOwnProperty.call(updates, 'isArchived')) dbUpdates.is_archived = updates.isArchived
    if (Object.prototype.hasOwnProperty.call(updates, 'isStarred')) dbUpdates.is_starred = updates.isStarred
    const { error } = await supabase
      .from('contact_messages')
      .update(dbUpdates)
      .eq('id', id)
    if (error) {
      console.error('Failed to update message', error)
      setMessagesError('Unable to update message.')
      return false
    }
    updateMessageThread(id, updates)
    setNotifications((prev) => prev.map((item) => {
      if (item.id !== `message-${id}`) return item
      const next = { ...item }
      const nextThread = {
        id,
        isRead: Object.prototype.hasOwnProperty.call(updates, 'isRead') ? updates.isRead : item.read,
        isArchived: Object.prototype.hasOwnProperty.call(updates, 'isArchived') ? updates.isArchived : item.section === 'previous',
        isStarred: Object.prototype.hasOwnProperty.call(updates, 'isStarred') ? updates.isStarred : item.messageCategory === 'starred',
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'isRead')) {
        next.read = updates.isRead
        next.status = updates.isRead ? 'read' : 'new'
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'isArchived')) {
        next.section = updates.isArchived ? 'previous' : 'current'
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'isRead') || Object.prototype.hasOwnProperty.call(updates, 'isArchived') || Object.prototype.hasOwnProperty.call(updates, 'isStarred')) {
        next.messageCategory = deriveMessageCategory(nextThread)
      }
      return next
    }))
    return true
  }
  const handleMessageDelete = async (id) => {
    const { data: messageRow, error: fetchError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (fetchError || !messageRow) {
      console.error('Failed to load message for delete', fetchError)
      setMessagesError('Unable to delete message.')
      return false
    }

    const archivePayload = normalizeDeletedMessageRow(messageRow)
    const { error: archiveError } = await supabase
      .from('deleted_contact_messages')
      .insert(archivePayload)
    if (archiveError) {
      console.error('Failed to archive deleted message', archiveError)
      setMessagesError('Unable to delete message.')
      return false
    }

    const { error } = await supabase
      .from('contact_messages')
      .update({ deleted_at: archivePayload.deleted_at })
      .eq('id', id)
    if (error) {
      console.error('Failed to soft delete message', error)
      setMessagesError('Unable to delete message.')
      return false
    }
    setMessageThreads((prev) => prev.filter((thread) => thread.id !== id))
    setNotifications((prev) => prev.filter((item) => item.id !== `message-${id}`))
    return true
  }
  const handleComposeSubmit = async () => {
    setComposeStatus({ type: '', message: '' })
    if (!composeDraft.toName.trim() || !composeDraft.toEmail.trim() || !composeDraft.message.trim()) {
      setComposeStatus({ type: 'error', message: 'Please complete the required fields.' })
      return
    }
    if (composeMode === 'reply' && !composeMessageId) {
      setComposeStatus({ type: 'error', message: 'Unable to send reply. Please reopen the message.' })
      return
    }
    setIsComposeSubmitting(true)
    const emailSubject = `Reply from Lifewood`
    const emailText = `Hi ${composeDraft.toName.trim()},\n\n${composeDraft.message.trim()}\n\n— Lifewood`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2d22;">
        <p>Hi ${composeDraft.toName.trim()},</p>
        <p>${composeDraft.message.trim().replace(/\n/g, '<br/>')}</p>
        <p style="margin-top: 24px;">— Lifewood</p>
      </div>
    `
    const { error: sendError } = await supabase.functions.invoke('send-reply', {
      body: {
        to: composeDraft.toEmail.trim(),
        to_name: composeDraft.toName.trim(),
        from_name: composeDraft.fromName.trim(),
        from_email: composeDraft.fromEmail.trim(),
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      },
    })
    if (sendError) {
      console.error('Failed to send reply email', sendError)
      setComposeStatus({ type: 'error', message: 'Unable to send reply email. Please try again.' })
      setIsComposeSubmitting(false)
      return
    }
    const payload = {
      contact_message_id: composeMessageId,
      to_name: composeDraft.toName.trim(),
      to_email: composeDraft.toEmail.trim(),
      from_name: composeDraft.fromName.trim() || null,
      from_email: composeDraft.fromEmail.trim() || null,
      message: composeDraft.message.trim(),
    }
    const { error } = await supabase
      .from('contact_message_replies')
      .insert(payload)
    if (error) {
      console.error('Failed to save reply', error)
      setComposeStatus({ type: 'error', message: 'Email sent but failed to save reply.' })
      setIsComposeSubmitting(false)
      return
    }
    setComposeStatus({ type: 'success', message: 'Reply sent successfully.' })
    setIsComposeSubmitting(false)
    setTimeout(() => {
      setIsComposeOpen(false)
      setComposeDraft({ toName: '', toEmail: '', fromName: '', fromEmail: '', message: '' })
      setComposeMessageId(null)
    }, 600)
  }
  const normalizedMessageSearch = messageSearchQuery.trim().toLowerCase()
  const hasMessageSearchValue = Boolean(normalizedMessageSearch)
  const isMessageSearchVisible = isMessageSearchOpen || hasMessageSearchValue
  const visibleMessageThreads = messageThreads.filter((thread) => {
    const matchesTab = thread.category === messageTab
    const matchesSearch = !normalizedMessageSearch || (
      thread.name.toLowerCase().includes(normalizedMessageSearch) ||
      thread.role.toLowerCase().includes(normalizedMessageSearch) ||
      thread.preview.toLowerCase().includes(normalizedMessageSearch)
    )
    return matchesTab && matchesSearch
  })
  const selectedMessageThread = visibleMessageThreads.find((thread) => thread.id === selectedMessageId) || visibleMessageThreads[0] || null
  const canViewSelectedCv = Boolean(
    selectedDashboardUser?.cvUrl || selectedDashboardUser?.applicationId || selectedDashboardUser?.email
  )
  const openComposeModal = ({ mode = 'new', draft = {}, messageId = null } = {}) => {
    setComposeMode(mode)
    setComposeMessageId(messageId)
    setComposeStatus({ type: '', message: '' })
    setComposeDraft({
      toName: '',
      toEmail: '',
      fromName: '',
      fromEmail: '',
      message: '',
      ...draft,
    })
    setIsComposeOpen(true)
  }
  return (
    <main className="dashboard-page admin-dashboard-page">
      <AnimatePresence>
        {pendingDeleteMessage ? (
          <motion.div
            className="admin-message-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPendingDeleteMessage(null)}
          >
            <motion.section
              className="admin-message-modal admin-message-confirm-modal"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-message-modal-close"
                aria-label="Close delete confirmation"
                onClick={() => setPendingDeleteMessage(null)}
              >
                <IconX size={18} />
              </button>
              <header className="admin-message-modal-header">
                <h3>Are you sure?</h3>
              </header>
              <div className="admin-message-modal-body">
                <p className="admin-message-modal-text">
                  This will permanently remove the message from your inbox.
                </p>
              </div>
              <div className="admin-message-modal-actions">
                <button
                  type="button"
                  className="admin-message-modal-reply outline"
                  onClick={() => setPendingDeleteMessage(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-message-modal-reply danger"
                  onClick={() => {
                    handleMessageDelete(pendingDeleteMessage.id)
                    setPendingDeleteMessage(null)
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
        {isComposeOpen ? (
          <motion.div
            className="admin-message-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsComposeOpen(false)}
          >
            <motion.section
              className="admin-message-modal"
              initial={{ opacity: 0, y: 16, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.7 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-message-modal-close"
                aria-label="Close message composer"
                onClick={() => setIsComposeOpen(false)}
              >
                <IconX size={18} />
              </button>
              <header className="admin-message-modal-header">
                <p className="admin-message-modal-kicker">Compose</p>
                <h3>{composeMode === 'reply' ? 'Reply to a message' : 'Write a new message'}</h3>
              </header>
              <form className="admin-message-compose-form">
                <label className="admin-message-compose-field">
                  <span>To</span>
                  <input
                    type="text"
                    value={composeDraft.toName}
                    onChange={(event) => setComposeDraft((prev) => ({ ...prev, toName: event.target.value }))}
                    placeholder="Recipient name"
                    readOnly={composeMode === 'reply'}
                  />
                </label>
                <label className="admin-message-compose-field">
                  <span>To Email</span>
                  <input
                    type="email"
                    value={composeDraft.toEmail}
                    onChange={(event) => setComposeDraft((prev) => ({ ...prev, toEmail: event.target.value }))}
                    placeholder="recipient@company.com"
                    readOnly={composeMode === 'reply'}
                  />
                </label>
                <label className="admin-message-compose-field">
                  <span>From</span>
                  <input
                    type="text"
                    value={composeDraft.fromName}
                    onChange={(event) => setComposeDraft((prev) => ({ ...prev, fromName: event.target.value }))}
                    placeholder="Your name"
                  />
                </label>
                <label className="admin-message-compose-field">
                  <span>From Email</span>
                  <input
                    type="email"
                    value={composeDraft.fromEmail}
                    onChange={(event) => setComposeDraft((prev) => ({ ...prev, fromEmail: event.target.value }))}
                    placeholder="you@company.com"
                  />
                </label>
                <label className="admin-message-compose-field">
                  <span>Message</span>
                  <textarea
                    rows={6}
                    value={composeDraft.message}
                    onChange={(event) => setComposeDraft((prev) => ({ ...prev, message: event.target.value }))}
                    placeholder="Write your reply"
                  />
                </label>
                {composeStatus.message ? (
                  <p className={`admin-message-compose-status ${composeStatus.type}`}>
                    {composeStatus.message}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="admin-message-modal-reply"
                  disabled={isComposeSubmitting}
                  onClick={handleComposeSubmit}
                >
                  {isComposeSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.section>
          </motion.div>
        ) : null}
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
              className="admin-member-modal admin-detail-modal"
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0 }}
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

	              <div className="admin-member-modal-head admin-detail-head">
	                <h2>{selectedDashboardUser.name}</h2>
	                <p>
	                  {selectedDashboardUser.detailType === 'evaluation'
	                    ? 'Task and submission details for this evaluation queue item.'
	                    : 'Complete account and onboarding details for the selected dashboard user.'}
	                </p>
	              </div>
                <div className="admin-detail-divider" aria-hidden="true" />

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
	                <div className="admin-detail-content">
	                  <div className="admin-detail-grid">
	                    <article>
	                      <small>Gender</small>
	                      <strong>{selectedDashboardUser.gender || '—'}</strong>
	                    </article>
	                    <article>
	                      <small>Age</small>
	                      <strong>{selectedDashboardUser.age || '—'}</strong>
	                    </article>
	                    <article>
	                      <small>Phone Number</small>
	                      <strong>{selectedDashboardUser.contactNumber || '—'}</strong>
	                    </article>
	                    <article>
	                      <small>Email Address</small>
	                      <strong>{selectedDashboardUser.email || '—'}</strong>
	                    </article>
	                    <article>
	                      <small>Position Applied</small>
	                      <strong>{selectedDashboardUser.positionApplied || '—'}</strong>
	                    </article>
	                    <article>
	                      <small>Country</small>
	                      <strong>{selectedDashboardUser.country || '—'}</strong>
	                    </article>
	                    <article>
	                      <small>Current Address</small>
	                      <strong>{selectedDashboardUser.currentAddress || '—'}</strong>
	                    </article>
	                    {selectedDashboardUser.accountCreated ? (
	                      <article>
	                        <small>Account Created</small>
	                        <strong>{selectedDashboardUser.accountCreated || '—'}</strong>
	                      </article>
	                    ) : null}
	                    {selectedDashboardUser.decisionDate ? (
	                      <article>
	                        <small>Decision Date</small>
	                        <strong>{selectedDashboardUser.decisionDate || '—'}</strong>
	                      </article>
	                    ) : null}
	                  </div>
	                  <div className="admin-detail-actions">
                      <button
                        type="button"
                        className="admin-detail-btn primary"
                        onClick={handleViewCv}
                        disabled={!canViewSelectedCv}
                      >
                        View CV
                      </button>
	                    <button
	                      type="button"
	                      className="admin-detail-btn ghost cancel"
	                      onClick={() => {
	                        setSelectedDashboardUser(null)
	                        setSelectedEvaluationDetailTask('')
	                      }}
	                    >
	                      Cancel
	                    </button>
	                  </div>
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
              initial={{ opacity: 0, y: 16, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.7 }}
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
        {pendingApprovalAction ? (
          <motion.div
            className="admin-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelApprovalAction}
          >
            <motion.section
              className="admin-confirm-modal"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-confirm-close"
                aria-label="Close confirmation"
                onClick={handleCancelApprovalAction}
              >
                <IconX size={18} />
              </button>
              <h3>
                {pendingApprovalAction.decision === 'approve'
                  ? 'Confirm Approval'
                  : 'Confirm Rejection'}
              </h3>
              <p>
                {pendingApprovalAction.decision === 'approve'
                  ? 'Are you sure you want to approve this application?'
                  : 'Are you sure you want to reject this application?'}
              </p>
              <div className="admin-confirm-actions">
                <button type="button" className="admin-confirm-btn ghost" onClick={handleCancelApprovalAction}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={`admin-confirm-btn ${pendingApprovalAction.decision === 'approve' ? 'primary' : 'danger'}`}
                  onClick={handleConfirmApprovalAction}
                >
                  {pendingApprovalAction.decision === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
        {pendingRemoveMember ? (
          <motion.div
            className="admin-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelRemoveMember}
          >
            <motion.section
              className="admin-confirm-modal"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-confirm-close"
                aria-label="Close confirmation"
                onClick={handleCancelRemoveMember}
              >
                <IconX size={18} />
              </button>
              <h3>Delete Member</h3>
              <p>
                Are you sure you want to delete {pendingRemoveMember.name || 'this member'}?
              </p>
              <div className="admin-confirm-actions">
                <button type="button" className="admin-confirm-btn ghost" onClick={handleCancelRemoveMember}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-confirm-btn danger"
                  onClick={handleConfirmRemoveMember}
                >
                  Delete
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
        {pendingApprovalHistoryDelete ? (
          <motion.div
            className="admin-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelApprovalHistoryDelete}
          >
            <motion.section
              className="admin-confirm-modal"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-confirm-close"
                aria-label="Close confirmation"
                onClick={handleCancelApprovalHistoryDelete}
              >
                <IconX size={18} />
              </button>
              <h3>Delete Approval History</h3>
              <p>
                Are you sure you want to delete {pendingApprovalHistoryDelete.name || 'this entry'}?
              </p>
              <div className="admin-confirm-actions">
                <button type="button" className="admin-confirm-btn ghost" onClick={handleCancelApprovalHistoryDelete}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-confirm-btn danger"
                  onClick={handleConfirmApprovalHistoryDelete}
                >
                  Delete
                </button>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
        {memberDeleteToast || approvalToast ? (
          <div className="admin-toast-stack">
            {memberDeleteToast ? (
              <motion.div
                key={`member-delete-toast-${memberDeleteToast.id}`}
                className={`admin-approval-toast ${memberDeleteToast.status}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <span className="admin-approval-toast-icon" aria-hidden="true">
                  {memberDeleteToast.status === 'restored' || memberDeleteToast.status === 'restoring'
                    ? <IconUserCheck size={16} />
                    : <IconTrash size={16} />}
                </span>
                <div>
                  <strong>
                    {memberDeleteToast.status === 'deleted'
                      ? 'Deleted'
                      : memberDeleteToast.status === 'restored'
                        ? 'Restored'
                        : memberDeleteToast.status === 'restoring'
                          ? 'Restoring'
                          : 'Delete failed'}
                  </strong>
                  <small>{memberDeleteToast.message}</small>
                </div>
                {memberDeleteToast.status === 'deleted' ? (
                  <button
                    type="button"
                    className="admin-approval-toast-action"
                    onClick={handleRestoreMember}
                  >
                    Undo
                  </button>
                ) : null}
                <button
                  type="button"
                  className="admin-approval-toast-close"
                  aria-label="Dismiss notification"
                  onClick={() => setMemberDeleteToast(null)}
                >
                  <IconX size={14} />
                </button>
              </motion.div>
            ) : null}
            {approvalToast ? (
              <motion.div
                key={`approval-toast-${approvalToast.id}`}
                className={`admin-approval-toast ${approvalToast.decision}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <span className="admin-approval-toast-icon" aria-hidden="true">
                  {approvalToast.decision === 'accepted' ? <IconUserCheck size={16} /> : <IconUserX size={16} />}
                </span>
                <div>
                  <strong>
                    {approvalToast.decision === 'accepted'
                      ? 'Accepted'
                      : approvalToast.decision === 'failed'
                        ? 'Action needed'
                        : 'Rejected'}
                  </strong>
                  <small>{approvalToast.message}</small>
                </div>
                <button
                  type="button"
                  className="admin-approval-toast-close"
                  aria-label="Dismiss notification"
                  onClick={() => setApprovalToast(null)}
                >
                  <IconX size={14} />
                </button>
              </motion.div>
            ) : null}
          </div>
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
              className="admin-member-modal admin-member-modal--redesign"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-member-modal-title"
              aria-describedby="admin-member-modal-desc"
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

              <div className="admin-member-modal-hero">
                <div className="admin-member-modal-icon" aria-hidden="true">
                  <IconUserPlus size={22} />
                </div>
                <div className="admin-member-modal-head">
                  <h2 id="admin-member-modal-title">{editingMemberId ? 'Edit Team Member' : 'Add Team Member'}</h2>
                  <p id="admin-member-modal-desc">
                    {editingMemberId
                      ? 'Update the selected team member using the Join Us fields.'
                      : 'Create a new team record using the Join Us fields.'}
                  </p>
                </div>
              </div>
              <div className="admin-member-modal-divider" aria-hidden="true" />
              <form className="admin-member-form" onSubmit={handleAddMemberSubmit}>
                <div className="admin-member-form-panel">
                  <div className="admin-member-form-panel-head">
                    <h3>Applicant Details</h3>
                    <p>Match the Join Us fields. Credentials are handled separately.</p>
                  </div>
                  <div className="admin-member-form-grid">
                    <label>
                      First Name
                      <input
                        type="text"
                        value={addMemberForm.firstName}
                        onChange={(event) => handleAddMemberFieldChange('firstName', event.target.value)}
                        placeholder="e.g. Michael"
                      />
                    </label>
                    <label>
                      Last Name
                      <input
                        type="text"
                        value={addMemberForm.lastName}
                        onChange={(event) => handleAddMemberFieldChange('lastName', event.target.value)}
                        placeholder="e.g. Chen"
                      />
                    </label>
                    <label>
                      Gender
                      <select
                        value={addMemberForm.gender}
                        onChange={(event) => handleAddMemberFieldChange('gender', event.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Prefer not to say</option>
                      </select>
                    </label>
                    <label>
                      Age
                      <input
                        type="number"
                        min="0"
                        value={addMemberForm.age}
                        onChange={(event) => handleAddMemberFieldChange('age', event.target.value)}
                        placeholder="23"
                      />
                    </label>
                    <label>
                      Phone Country
                      <select
                        value={addMemberForm.phoneCountryCode}
                        onChange={(event) => handleAddMemberFieldChange('phoneCountryCode', event.target.value)}
                      >
                        <option value="+63">+63</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+61">+61</option>
                        <option value="+65">+65</option>
                        <option value="+81">+81</option>
                      </select>
                    </label>
                    <label>
                      Phone Number
                      <input
                        type="tel"
                        value={addMemberForm.phoneNumber}
                        onChange={(event) => handleAddMemberFieldChange('phoneNumber', event.target.value)}
                        placeholder="0917 123 4567"
                        inputMode="numeric"
                        maxLength={11}
                      />
                    </label>
                    <label className="full">
                      Email
                      <input
                        type="email"
                        value={addMemberForm.email}
                        onChange={(event) => handleAddMemberFieldChange('email', event.target.value)}
                        placeholder="name@email.com"
                      />
                    </label>
                    <label className="full">
                      Position Applied
                      <select
                        value={addMemberForm.positionApplied}
                        onChange={(event) => handleAddMemberFieldChange('positionApplied', event.target.value)}
                      >
                        <option value="">Select position</option>
                        <option>Image Data Collector (Capturing Home Dishes and Menu)</option>
                        <option>Image Data Collector (Capturing Restaurant Menu)</option>
                        <option>Image Data Collector (Capturing Receipts)</option>
                        <option>Image Data Collector (Capturing Products on Shelves)</option>
                        <option>Image Data Collector (Capturing Government IDs)</option>
                        <option>Image Data Collector (Capturing Product Packaging)</option>
                        <option>Moderator &amp; Voice Participants (Voice Data Collection)</option>
                        <option>Operation Manager</option>
                        <option>Social Media Content Marketing</option>
                        <option>Text Data Collector (Gemini User)</option>
                        <option>Voice Recording Participants (FaceTime Audio Recording Session)</option>
                        <option>Voice Recording Participants (Short Sentences Recording)</option>
                        <option>All of the Above</option>
                      </select>
                    </label>
                    <label>
                      Country
                      <div
                        className={`admin-member-country-select ${isAdminCountryOpen ? 'is-open' : ''}`}
                        ref={adminCountryRef}
                      >
                        <button
                          type="button"
                          className="admin-member-country-trigger"
                          onClick={() => setIsAdminCountryOpen((prev) => !prev)}
                        >
                          <span>{addMemberForm.country || 'Select country'}</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </button>
                        {isAdminCountryOpen && (
                          <div className="admin-member-country-list" role="listbox">
                            {COUNTRIES.map((country) => (
                              <button
                                type="button"
                                key={country}
                                className={`admin-member-country-option ${addMemberForm.country === country ? 'selected' : ''}`}
                                onMouseDown={(event) => {
                                  event.preventDefault()
                                  handleAddMemberFieldChange('country', country)
                                  setIsAdminCountryOpen(false)
                                }}
                                role="option"
                                aria-selected={addMemberForm.country === country}
                              >
                                {country}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </label>
                    <label>
                      Current Address
                      <input
                        type="text"
                        value={addMemberForm.currentAddress}
                        onChange={(event) => handleAddMemberFieldChange('currentAddress', event.target.value)}
                        placeholder="e.g. Quezon City, Metro Manila"
                      />
                    </label>
                    <label className="full">
                      Upload CV (PDF)
                      <div className="admin-file-input">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(event) => handleAddMemberFieldChange('cvFile', event.target.files?.[0] || null)}
                        />
                        <span className="admin-file-action">Choose PDF</span>
                        <span className="admin-file-name">
                          {addMemberForm.cvFile ? addMemberForm.cvFile.name : 'No file selected'}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                {addMemberError ? <p className="admin-member-form-error">{addMemberError}</p> : null}
                <div className="admin-member-form-actions">
                  <button type="button" className="secondary" onClick={handleCloseAddMemberModal}>
                    Cancel
                  </button>
                  <button type="submit" className="primary">
                    <IconUserPlus size={16} />
                    {editingMemberId ? 'Save Changes' : 'Add Member'}
                  </button>
                </div>
              </form>
            </motion.section>
          </motion.div>
        ) : null}
        {isAddMemberSuccessOpen ? (
          <motion.div
            className="admin-success-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddMemberSuccessOpen(false)}
          >
            <motion.section
              className="admin-success-modal"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="admin-success-modal-close"
                aria-label="Close success modal"
                onClick={() => setIsAddMemberSuccessOpen(false)}
              >
                <IconX size={16} />
              </button>
              <div className="admin-success-modal-icon" aria-hidden="true">
                <IconUserCheck size={20} />
              </div>
              <div>
                <h3>Member Added</h3>
                <p>The team member has been created successfully.</p>
              </div>
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
              className={adminActivePanel === 'messages' ? 'active' : ''}
              onClick={() => setAdminActivePanel('messages')}
            >
              <IconMessage size={18} />
              <span className="admin-dashboard-nav-label">Messages</span>
            </button>
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
                              onClick={() => handleNotificationClick(item)}
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
                                      onClick={(event) => {
                                        event.stopPropagation()
                                        handleNotificationClick(item)
                                        handleRequestApprovalAction(item.email, 'approve', item.applicationId, item)
                                      }}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      className="admin-dashboard-notif-action decline"
                                      onClick={(event) => {
                                        event.stopPropagation()
                                        handleNotificationClick(item)
                                        handleRequestApprovalAction(item.email, 'decline', item.applicationId, item)
                                      }}
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
                    <div
                      className="admin-dashboard-search-trigger"
                      onMouseEnter={() => setIsManageSearchOpen(true)}
                      onMouseLeave={() => {
                        if (!hasManageSearchValue) setIsManageSearchOpen(false)
                      }}
                    >
                      <label className={`admin-dashboard-table-search ${isManageSearchVisible ? 'is-open' : ''}`}>
                        <IconSearch size={18} />
                        <input
                          ref={manageSearchInputRef}
                          type="text"
                          placeholder="Search users..."
                          aria-label="Search users"
                          value={manageSearchQuery}
                          onChange={(event) => setManageSearchQuery(event.target.value)}
                        />
                      </label>
                      <button
                        type="button"
                        className="admin-dashboard-icon-btn"
                        aria-label="Search users"
                        aria-pressed={isManageSearchVisible}
                        onClick={() => {
                          if (hasManageSearchValue) return
                          setIsManageSearchOpen((prev) => !prev)
                        }}
                      >
                        <IconSearch size={18} />
                      </button>
                    </div>
                    <div className="admin-dashboard-filter-wrap" ref={manageFilterRef}>
                      <button
                        type="button"
                        className="admin-dashboard-icon-btn"
                        aria-label="Filter users"
                        aria-expanded={isManageFilterOpen}
                        onClick={() => setIsManageFilterOpen((prev) => !prev)}
                      >
                        <IconFilter size={18} />
                      </button>
                      {isManageFilterOpen ? (
                        <div className="admin-dashboard-filter-menu" role="menu" aria-label="User filters">
                          <button
                            type="button"
                            role="menuitem"
                            className={manageSortMode === 'date' ? 'active' : ''}
                            onClick={() => {
                              setManageSortMode('date')
                              setIsManageFilterOpen(false)
                            }}
                          >
                            By Date
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className={manageSortMode === 'az' ? 'active' : ''}
                            onClick={() => {
                              setManageSortMode('az')
                              setIsManageFilterOpen(false)
                            }}
                          >
                            By A-Z
                          </button>
                          <div className={`admin-dashboard-filter-item has-submenu ${manageRoleFilter !== 'all' ? 'active' : ''}`}>
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
                                className={manageRoleFilter === 'all' ? 'active' : ''}
                                onClick={() => {
                                  setManageRoleFilter('all')
                                  setIsManageFilterOpen(false)
                                }}
                              >
                                All Roles
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={manageRoleFilter === 'admin' ? 'active' : ''}
                                onClick={() => {
                                  setManageRoleFilter('admin')
                                  setIsManageFilterOpen(false)
                                }}
                              >
                                Admin
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className={manageRoleFilter === 'employee' ? 'active' : ''}
                                onClick={() => {
                                  setManageRoleFilter('employee')
                                  setIsManageFilterOpen(false)
                                }}
                              >
                                Employee
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="admin-manage-table-grid admin-manage-table-columns">
                  <span>User Identity</span>
                  <span>Role</span>
                  <span>Gmail</span>
                  <span>Contact</span>
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
                        </div>
                      </div>
                      <p><em>{member.access}</em></p>
                      <p>{member.email}</p>
                      <p>{member.contactNumber}</p>
                      <p>{member.onboarding}</p>
                      <div className="admin-manage-row-actions">
                        <button
                          type="button"
                          className="admin-dashboard-row-action"
                          aria-label={`More actions for ${member.name}`}
                          aria-expanded={openMemberActionMenuId === member.id}
                          onClick={() => setOpenMemberActionMenuId((prev) => (prev === member.id ? null : member.id))}
                        >
                          <span className="admin-dashboard-row-dots" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </span>
                        </button>
                        {openMemberActionMenuId === member.id ? (
                          <div className="admin-dashboard-filter-menu admin-manage-row-menu" role="menu" aria-label={`Actions for ${member.name}`}>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                handleOpenUserDetail(member)
                                setOpenMemberActionMenuId(null)
                              }}
                            >
                              <IconEye size={16} />
                              View details
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => handleEditMember(member)}
                            >
                              <IconUserEdit size={16} />
                              Edit member
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className="danger"
                              onClick={() => handleRequestRemoveMember(member)}
                            >
                              <IconUserX size={16} />
                            Delete member
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
          ) : adminActivePanel === 'messages' ? (
            <>
              <section className="admin-client-message">
                <div className="admin-client-message-shell">
                  <section className="admin-message-stage-panel">
                    <div className="admin-message-stage-actions">
                      <div className="admin-message-tabs" role="tablist" aria-label="Message categories">
                        {messageTabs.map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={messageTab === tab.id}
                            className={`admin-message-tab ${messageTab === tab.id ? 'active' : ''}`}
                            onClick={() => {
                              setMessageTab(tab.id)
                              const firstThread = messageThreads.find((thread) => thread.category === tab.id)
                              if (firstThread) setSelectedMessageId(firstThread.id)
                            }}
                          >
                            <span>{tab.label}</span>
                            {messageCounts[tab.id] > 0 ? (
                              <span className="admin-message-tab-count">{messageCounts[tab.id]}</span>
                            ) : null}
                          </button>
                        ))}
                      </div>

                      <div className="admin-message-stage-links">
                        <div
                          className="admin-dashboard-search-trigger"
                          onMouseEnter={() => setIsMessageSearchOpen(true)}
                          onMouseLeave={() => {
                            if (!hasMessageSearchValue) setIsMessageSearchOpen(false)
                          }}
                        >
                          <label className={`admin-dashboard-table-search ${isMessageSearchVisible ? 'is-open' : ''}`}>
                            <IconSearch size={18} />
                            <input
                              type="text"
                              placeholder="Search for messages"
                              aria-label="Search messages"
                              value={messageSearchQuery}
                              onChange={(event) => setMessageSearchQuery(event.target.value)}
                            />
                          </label>
                          <button
                            type="button"
                            className="admin-dashboard-icon-btn"
                            aria-label="Search messages"
                            aria-pressed={isMessageSearchVisible}
                            onClick={() => {
                              if (hasMessageSearchValue) return
                              setIsMessageSearchOpen((prev) => !prev)
                            }}
                          >
                            <IconSearch size={18} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="admin-message-stage-link simple"
                          onClick={() => openComposeModal()}
                        >
                          + Write New
                        </button>
                      </div>
                    </div>

                    <div className="admin-message-content">
                      <div className="admin-message-thread-list minimal" aria-label="Message inbox">
                        {isMessagesLoading ? (
                          <div className="admin-client-message-empty">
                            Loading messages...
                          </div>
                        ) : messagesError ? (
                          <div className="admin-client-message-empty">
                            {messagesError}
                          </div>
                        ) : visibleMessageThreads.length > 0 ? visibleMessageThreads.map((thread, index) => (
                          <article
                            key={thread.id}
                            className={`admin-message-thread-card minimal ${selectedMessageThread?.id === thread.id || (!selectedMessageThread && index === 0) ? 'active' : ''} ${openMessageActionId === thread.id ? 'menu-open' : ''}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setSelectedMessageId(thread.id)
                              if (!thread.isRead) {
                                handleMessageUpdate(thread.id, { isRead: true })
                              }
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                setSelectedMessageId(thread.id)
                                if (!thread.isRead) {
                                  handleMessageUpdate(thread.id, { isRead: true })
                                }
                              }
                            }}
                          >
                            <div className="admin-message-thread-person">
                              <span className="admin-message-thread-avatar" aria-hidden="true">
                                {thread.avatarUrl ? (
                                  <img src={thread.avatarUrl} alt="" loading="lazy" />
                                ) : thread.avatar}
                              </span>
                              <div>
                                <strong>{thread.name}</strong>
                                <p>{thread.preview}</p>
                              </div>
                            </div>
                            <div className="admin-message-thread-meta">
                              <span>{thread.time}</span>
                              <div className="admin-message-row-actions">
                                <button
                                  type="button"
                                  className="admin-message-row-action-btn"
                                  aria-label={`Message actions for ${thread.name}`}
                                  aria-expanded={openMessageActionId === thread.id}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setOpenMessageActionId((prev) => (prev === thread.id ? null : thread.id))
                                  }}
                                >
                                  <span className="admin-dashboard-row-dots" aria-hidden="true">
                                    <span />
                                    <span />
                                    <span />
                                  </span>
                                </button>
                                {openMessageActionId === thread.id ? (
                                  <div
                                    className="admin-message-row-menu"
                                    role="menu"
                                    aria-label={`Actions for ${thread.name}`}
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={() => {
                                        handleMessageUpdate(thread.id, { isStarred: !thread.isStarred })
                                        setOpenMessageActionId(null)
                                      }}
                                    >
                                      {thread.isStarred ? 'Unpin' : 'Pin'}
                                    </button>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={() => {
                                        handleMessageUpdate(thread.id, { isRead: true })
                                        setOpenMessageActionId(null)
                                      }}
                                    >
                                      Mark as read
                                    </button>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={() => {
                                        handleMessageUpdate(thread.id, { isArchived: messageTab === 'archive' ? false : true })
                                        setOpenMessageActionId(null)
                                      }}
                                    >
                                      {messageTab === 'archive' ? 'Restore' : 'Archive'}
                                    </button>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      className="danger"
                                      onClick={() => {
                                        setPendingDeleteMessage({
                                          id: thread.id,
                                          name: thread.name,
                                          email: thread.email,
                                        })
                                        setOpenMessageActionId(null)
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        )) : (
                          <div className="admin-client-message-empty">
                            {messageTab === 'archive'
                              ? 'No archived messages yet.'
                              : 'No conversations matched your search.'}
                          </div>
                        )}
                      </div>

                      <aside className="admin-message-detail" aria-live="polite">
                        {selectedMessageThread ? (
                          <div className="admin-message-detail-card">
                            <header className="admin-message-detail-header">
                              <span className="admin-message-detail-avatar" aria-hidden="true">
                                {selectedMessageThread.avatarUrl ? (
                                  <img src={selectedMessageThread.avatarUrl} alt="" loading="lazy" />
                                ) : selectedMessageThread.avatar}
                              </span>
                              <div className="admin-message-detail-text">
                                <h3>{selectedMessageThread.name}</h3>
                                <div className="admin-message-detail-meta">
                                  <span className="admin-message-detail-email">
                                    {selectedMessageThread.email}
                                    <button
                                      type="button"
                                      className="admin-message-email-copy"
                                      aria-label="Copy email"
                                      title="Copy email"
                                      onClick={async () => {
                                        if (!selectedMessageThread.email || selectedMessageThread.email === '—') return
                                        try {
                                          await navigator.clipboard.writeText(selectedMessageThread.email)
                                          setCopiedEmail(selectedMessageThread.email)
                                          setTimeout(() => setCopiedEmail(''), 1400)
                                        } catch (error) {
                                          console.error('Failed to copy email', error)
                                        }
                                      }}
                                    >
                                      <IconCopy size={14} />
                                    </button>
                                    {copiedEmail === selectedMessageThread.email ? (
                                      <span className="admin-message-email-copied">Copied</span>
                                    ) : null}
                                  </span>
                                  <span>{selectedMessageThread.time}</span>
                                </div>
                              </div>
                            </header>
                            <div className="admin-message-detail-body">
                              <h4>{selectedMessageThread.subject}</h4>
                              <p className="admin-message-detail-text">{selectedMessageThread.body}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="admin-message-detail-empty">
                            Select a message to preview.
                          </div>
                        )}
                      </aside>
                    </div>

                  </section>
                </div>
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
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="admin-approval-table-grid admin-manage-table-columns">
                  <span>User Identity</span>
                  <span>Role</span>
                  <span>Gmail</span>
                  <span>Contact</span>
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
                        </div>
                      </div>
                      <p><em>{member.requestedRoleLabel || member.requestedRole}</em></p>
                      <p>{member.email}</p>
                      <p>{member.contactNumber}</p>
                      <p>{member.requestedAt}</p>
                      <div className="admin-approval-row-actions">
                        <button
                          type="button"
                          className="admin-approval-action detail"
                          onClick={() => setSelectedDashboardUser(member)}
                        >
                          View Full Detail
                        </button>
                        <button
                          type="button"
                          className="admin-approval-action approve"
                          onClick={() => handleRequestApprovalAction(member.email, 'approve')}
                          aria-label="Approve application"
                          title="Approve"
                        >
                          <IconUserCheck size={16} />
                        </button>
                        <button
                          type="button"
                          className="admin-approval-action decline"
                          onClick={() => handleRequestApprovalAction(member.email, 'decline')}
                          aria-label="Decline application"
                          title="Reject"
                        >
                          <IconUserX size={16} />
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
                    <h2>{showApprovalHistoryArchive ? 'Archived Approvals' : 'User Approval History'}</h2>
                    <p>{showApprovalHistoryArchive ? 'Stored approvals for later reference' : 'Recently accepted and declined requests'}</p>
                  </div>
                  <div className="admin-dashboard-table-tools">
                    <button
                      type="button"
                      className={`admin-dashboard-archive-toggle ${showApprovalHistoryArchive ? 'is-active' : ''}`}
                      onClick={() => {
                        setApprovalHistoryCurrentPage(1)
                        setShowApprovalHistoryArchive((prev) => !prev)
                      }}
                    >
                      {showApprovalHistoryArchive
                        ? 'Back to History'
                        : `View Archive${archivedApprovalHistoryEntries.length ? ` (${archivedApprovalHistoryEntries.length})` : ''}`}
                    </button>
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
                              setApprovalHistoryDecisionFilter('all')
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
                              setApprovalHistoryDecisionFilter('all')
                              setIsApprovalHistoryFilterOpen(false)
                            }}
                          >
                            By A-Z
                          </button>
                          <div className={`admin-dashboard-filter-item ${approvalHistoryYearFilter !== 'all' ? 'active' : ''}`}>
                            <button
                              type="button"
                              role="menuitem"
                              className="admin-dashboard-filter-parent"
                              aria-haspopup="menu"
                            >
                              By Year
                            </button>
                            <div className="admin-dashboard-filter-submenu" role="menu" aria-label="Filter approval history by year">
                              <button
                                type="button"
                                role="menuitem"
                                className={approvalHistoryYearFilter === 'all' ? 'active' : ''}
                                onClick={() => {
                                  setApprovalHistoryYearFilter('all')
                                  setIsApprovalHistoryFilterOpen(false)
                                }}
                              >
                                All Years
                              </button>
                              {approvalHistoryYears.map((year) => (
                                <button
                                  key={`approval-history-year-${year}`}
                                  type="button"
                                  role="menuitem"
                                  className={approvalHistoryYearFilter === year ? 'active' : ''}
                                  onClick={() => {
                                    setApprovalHistoryYearFilter(year)
                                    setIsApprovalHistoryFilterOpen(false)
                                  }}
                                >
                                  {year}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            role="menuitem"
                            className={approvalHistoryDecisionFilter === 'approved' ? 'active' : ''}
                            onClick={() => {
                              setApprovalHistoryDecisionFilter('approved')
                              setIsApprovalHistoryFilterOpen(false)
                            }}
                          >
                            Approved
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className={approvalHistoryDecisionFilter === 'rejected' ? 'active' : ''}
                            onClick={() => {
                              setApprovalHistoryDecisionFilter('rejected')
                              setIsApprovalHistoryFilterOpen(false)
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="admin-approval-history-columns" aria-label="Approval history columns">
                  <span>User</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Account Created</span>
                  <span>Decision Date</span>
                  <span>Actions</span>
                </div>

                <div className="admin-approval-history-list">
                  {pagedApprovalHistory.length > 0 ? pagedApprovalHistory.map((entry, index) => (
                    <article key={getApprovalHistoryKey(entry, index)} className="admin-approval-history-item">
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
                      <p>{entry.accountCreated}</p>
                      <p>{entry.decisionDate}</p>
                      <div className="admin-manage-row-actions admin-approval-history-row-actions">
                        <button
                          type="button"
                          className="admin-dashboard-row-action"
                          aria-label={`More actions for ${entry.name}`}
                          aria-expanded={openApprovalHistoryActionMenuId === entry.id}
                          onClick={() => setOpenApprovalHistoryActionMenuId((prev) => (prev === entry.id ? null : entry.id))}
                        >
                          <span className="admin-dashboard-row-dots" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </span>
                        </button>
                        {openApprovalHistoryActionMenuId === entry.id ? (
                          <div className="admin-dashboard-filter-menu admin-manage-row-menu" role="menu" aria-label={`Actions for ${entry.name}`}>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                handleOpenUserDetail({
                                  name: entry.name,
                                  email: entry.email,
                                  applicationId: entry.applicationId || null,
                                  accountCreated: entry.accountCreated || '—',
                                  decisionDate: entry.decisionDate || '—',
                                })
                                setOpenApprovalHistoryActionMenuId(null)
                              }}
                            >
                              <IconEye size={16} />
                              View details
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                if (showApprovalHistoryArchive) {
                                  handleRestoreApprovalHistory(entry)
                                } else {
                                  handleArchiveApprovalHistory(entry)
                                }
                                setOpenApprovalHistoryActionMenuId(null)
                              }}
                            >
                              <IconDeviceFloppy size={16} />
                              {showApprovalHistoryArchive ? 'Restore' : 'Archive'}
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className="danger"
                              onClick={() => {
                                handleRequestApprovalHistoryDelete(entry)
                                setOpenApprovalHistoryActionMenuId(null)
                              }}
                            >
                              <IconTrash size={16} />
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  )) : (
                    <div className="admin-dashboard-table-empty">
                      {normalizedApprovalHistorySearch || approvalHistoryYearFilter !== 'all' || approvalHistoryDecisionFilter !== 'all'
                        ? showApprovalHistoryArchive
                          ? 'No archived approvals matched your filters.'
                          : 'No approval history matched your filters.'
                        : showApprovalHistoryArchive
                          ? 'No archived approvals yet.'
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
                  <h3>{totalUsersCount.toLocaleString()}</h3>
                </article>

                <article className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUserPlus size={18} />
                    </span>
                    <b className="positive">+5.4%</b>
                  </div>
                  <p>New Signups</p>
                  <h3>{newSignupsCount.toLocaleString()}</h3>
                </article>

                <article className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconUserCheck size={18} />
                    </span>
                    <b className="positive">+8.2%</b>
                  </div>
                  <p>Verified Users</p>
                  <h3>{verifiedUsersCount.toLocaleString()}</h3>
                </article>

                <article className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-head">
                    <span className="admin-dashboard-stat-icon">
                      <IconMessage size={18} />
                    </span>
                    <b className="negative">-2.1%</b>
                  </div>
                  <p>Overall Messages</p>
                  <h3>{overallMessagesCount.toLocaleString()}</h3>
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
                                className={tableRoleFilter === 'employee' ? 'active' : ''}
                                onClick={() => {
                                  setTableRoleFilter('employee')
                                  setIsTableFilterOpen(false)
                                }}
                              >
                                Employee
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
                          onClick={() => handleOpenUserDetail(user)}
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

  return (
    <main className="data-service-page">
      <section className="data-service-hero">
        <div className="container">
          <div className="data-service-hero-shell">
            <div className="data-service-hero-bg" aria-hidden="true">
              <video
                className="data-service-hero-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/B-roll_of_Wikimedia_Foundation_servers_at_CyrusOne_in_Carrollton%2C_Texas_-_photographed_in_2015.webm/800px--B-roll_of_Wikimedia_Foundation_servers_at_CyrusOne_in_Carrollton%2C_Texas_-_photographed_in_2015.webm.jpg"
              >
                <source
                  src="https://upload.wikimedia.org/wikipedia/commons/transcoded/4/4e/B-roll_of_Wikimedia_Foundation_servers_at_CyrusOne_in_Carrollton%2C_Texas_-_photographed_in_2015.webm/B-roll_of_Wikimedia_Foundation_servers_at_CyrusOne_in_Carrollton%2C_Texas_-_photographed_in_2015.webm.360p.vp9.webm?download="
                  type="video/webm"
                />
              </video>
              <div className="data-service-hero-overlay" />
            </div>
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

  return (
    <main className="data-service-page">
      <section className="data-service-hero">
        <div className="container">
          <div className="data-service-hero-shell">
            <div className="data-service-hero-bg" aria-hidden="true">
              <video
                className="data-service-hero-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Infinitely_wide_neural_network.webm/800px--Infinitely_wide_neural_network.webm.jpg"
              >
                <source
                  src="https://upload.wikimedia.org/wikipedia/commons/transcoded/9/92/Infinitely_wide_neural_network.webm/Infinitely_wide_neural_network.webm.360p.vp9.webm?download="
                  type="video/webm"
                />
              </video>
              <div className="data-service-hero-overlay" />
            </div>
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

  return (
    <main className="data-service-page">
      <section className="data-service-hero">
        <div className="container">
          <div className="data-service-hero-shell">
            <div className="data-service-hero-bg" aria-hidden="true">
              <video
                className="data-service-hero-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Traffic_at_dusk_%28time_lapse%29.webm/800px--Traffic_at_dusk_%28time_lapse%29.webm.jpg"
              >
                <source
                  src="https://upload.wikimedia.org/wikipedia/commons/transcoded/2/28/Traffic_at_dusk_%28time_lapse%29.webm/Traffic_at_dusk_%28time_lapse%29.webm.360p.vp9.webm?download="
                  type="video/webm"
                />
              </video>
              <div className="data-service-hero-overlay" />
            </div>
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
    { city: 'Cebu', region: 'asia', lat: 10.3157, lng: 123.8854 },
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
                    <LayersControl.BaseLayer checked name="🌐 Hybrid View">
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
                    <LayersControl.BaseLayer name="🗺️ Map View">
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

  const ForceHybridBaseLayer = ({ hybridRef, mapRef, satelliteRef, lightRef }) => {
    const map = useMap()

    useEffect(() => {
      const applyHybrid = () => {
        const hybridLayer = hybridRef?.current
        if (hybridLayer && !map.hasLayer(hybridLayer)) {
          map.addLayer(hybridLayer)
        }

        const otherLayers = [mapRef?.current, satelliteRef?.current, lightRef?.current]
        otherLayers.forEach((layer) => {
          if (layer && map.hasLayer(layer)) {
            map.removeLayer(layer)
          }
        })
      }

      map.whenReady(applyHybrid)
      const timer = setTimeout(applyHybrid, 0)

      return () => clearTimeout(timer)
    }, [map, hybridRef, mapRef, satelliteRef, lightRef])

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

  const philHybridLayerRef = useRef(null)
  const philMapLayerRef = useRef(null)
  const philSatelliteLayerRef = useRef(null)
  const philLightLayerRef = useRef(null)

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
                    <LayersControl.BaseLayer name="🗺️ Map View">
                      <TileLayer
                        ref={philMapLayerRef}
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="🛰️ Satellite View">
                      <TileLayer
                        ref={philSatelliteLayerRef}
                        attribution="Tiles &copy; Esri"
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="🌐 Hybrid View">
                      <LayerGroup ref={philHybridLayerRef}>
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
                        ref={philLightLayerRef}
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      />
                    </LayersControl.BaseLayer>
                  </LayersControl>
                  <ZoomControl position="topright" />
                  <ForceHybridBaseLayer
                    hybridRef={philHybridLayerRef}
                    mapRef={philMapLayerRef}
                    satelliteRef={philSatelliteLayerRef}
                    lightRef={philLightLayerRef}
                  />
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
  const [joinUsCvName, setJoinUsCvName] = useState('')
  const cvInputRef = useRef(null)
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
              let cvUrl = null
              let cvFilename = null
              let cvSize = null

              if (cvFile && typeof cvFile === 'object' && cvFile.size > 0) {
                const safeName = cvFile.name.replace(/[^a-z0-9.\-_]/gi, '_')
                const filePath = `applications/${Date.now()}-${safeName}`
                const { error: uploadError } = await supabase
                  .storage
                  .from('job-applications-cv')
                  .upload(filePath, cvFile, { upsert: false })

                if (uploadError) {
                  console.error('Supabase upload failed', uploadError)
                  const details = uploadError.message || uploadError.error_description || 'Upload failed.'
                  setJoinUsSubmitError(`CV upload failed: ${details}`)
                  setIsJoinUsSubmitting(false)
                  return
                }

                cvFilename = cvFile.name
                cvSize = cvFile.size
                cvUrl = filePath
              }

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
                cv_filename: cvFilename,
                cv_size: cvSize,
                cv_url: cvUrl,
                status: 'pending',
              }

              const { error } = await supabase
                .from('job_applications')
                .insert([payload])

              if (error) {
                console.error('Supabase insert failed', error)
                const details = error.message || error.error_description || 'Submission failed.'
                setJoinUsSubmitError(`Submission failed: ${details}`)
                setIsJoinUsSubmitting(false)
                return
              }

              setJoinUsPending(true)
              setIsJoinUsSubmitting(false)
              form.reset()
              setJoinUsCvName('')
              if (cvInputRef.current) {
                cvInputRef.current.value = ''
              }
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
                        {COUNTRIES.map((country) => (
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
                  <input
                    type="file"
                    name="cv"
                    accept="application/pdf"
                    required
                    ref={cvInputRef}
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      setJoinUsCvName(file ? file.name : '')
                    }}
                  />
                  <span>{joinUsCvName ? 'File selected' : 'Click to upload or drag and drop'}</span>
                  <small className="joinus-upload-name">
                    {joinUsCvName ? joinUsCvName : 'No file selected'}
                  </small>
                  <small>PDF only (max. 10MB)</small>
                </div>
                {joinUsCvName ? (
                  <div className="joinus-cv-chip" aria-label="Selected CV">
                    <div className="joinus-cv-chip-icon" aria-hidden="true">PDF</div>
                    <div className="joinus-cv-chip-copy">
                      <strong title={joinUsCvName}>{joinUsCvName}</strong>
                      <small>PDF</small>
                    </div>
                    <button
                      type="button"
                      className="joinus-cv-chip-remove"
                      aria-label="Remove selected CV"
                      onClick={() => {
                        setJoinUsCvName('')
                        if (cvInputRef.current) {
                          cvInputRef.current.value = ''
                        }
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : null}
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
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactStatus, setContactStatus] = useState({ type: '', message: '' })
  const [isContactSubmitting, setIsContactSubmitting] = useState(false)
  const [showContactPopup, setShowContactPopup] = useState(false)
  const handleContactSubmit = async (event) => {
    event.preventDefault()
    setContactStatus({ type: '', message: '' })
    setShowContactPopup(false)
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactStatus({ type: 'error', message: 'Please complete all fields before sending.' })
      return
    }
    setIsContactSubmitting(true)
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        message: contactForm.message.trim(),
        is_read: false,
        is_archived: false,
        is_starred: false,
        deleted_at: null,
      })
    if (error) {
      console.error('Failed to submit contact message', error)
      setContactStatus({ type: 'error', message: 'Unable to send your message. Please try again.' })
    } else {
      setContactStatus({ type: 'success', message: 'Message sent. We will get back to you soon.' })
      setContactForm({ name: '', email: '', message: '' })
      setShowContactPopup(true)
      window.setTimeout(() => setShowContactPopup(false), 3500)
    }
    setIsContactSubmitting(false)
  }
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

            <form className="contact-form-card" aria-label="Send us a message" onSubmit={handleContactSubmit}>
              <h2>Send us a message</h2>

              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your full name"
                value={contactForm.name}
                onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
              />

              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="name@company.com"
                value={contactForm.email}
                onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
              />

              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                placeholder="How can we help you?"
                value={contactForm.message}
                onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))}
              />

              {contactStatus.message ? (
                <p className={`contact-form-status ${contactStatus.type}`}>
                  {contactStatus.message}
                </p>
              ) : null}

              <button type="submit" disabled={isContactSubmitting}>
                {isContactSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            {showContactPopup ? (
              <div
                className="contact-success-overlay"
                role="dialog"
                aria-live="polite"
                onClick={() => setShowContactPopup(false)}
              >
                <div className="contact-success-modal" onClick={(event) => event.stopPropagation()}>
                  <h3>Message Sent</h3>
                  <p>Thank you! We will get back to you soon.</p>
                </div>
              </div>
            ) : null}
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
