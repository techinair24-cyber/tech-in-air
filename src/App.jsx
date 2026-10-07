import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Home from './pages/Home'
import AboutPage from './pages/About'
import ServicesPage from './pages/Services'
import ProjectsPage from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import ProcessPage from './pages/Process'
import ContactPage from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminReviews from './pages/AdminReviews'
import { supabase } from './lib/supabase'

function AdminReviewsPlaceholder() {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    let isActive = true

    const verifyAdmin = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) throw error

        if (data.user?.app_metadata?.role === 'admin') {
          if (isActive) setIsAuthorized(true)
          return
        }

        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) throw signOutError
        if (isActive) {
          navigate('/admin/login', {
            replace: true,
            state: { message: 'You are not authorized to access the admin area.' },
          })
        }
      } catch (error) {
        console.error('Unable to verify admin access:', error)
        if (isActive) {
          navigate('/admin/login', {
            replace: true,
            state: { message: 'Unable to verify admin access. Please sign in again.' },
          })
        }
      }
    }

    verifyAdmin()
    return () => {
      isActive = false
    }
  }, [navigate])

  if (!isAuthorized) return null

  return <AdminReviews />
}

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--foreground)] transition-colors duration-200">
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'pt-24 md:pt-28'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/reviews" element={<AdminReviewsPlaceholder />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsApp />}
    </div>
  )
}
