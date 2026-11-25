import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AboutPage from './pages/About'
import ServicesPage from './pages/Services'
import ProjectsPage from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import ProcessPage from './pages/Process'
import ContactPage from './pages/Contact'
import CustomerReviewEdit from './pages/CustomerReviewEdit'
import LegalPage from './pages/LegalPage'
import NotFoundPage from './pages/NotFound'
import BusinessSolutionsPage from './pages/BusinessSolutions'
import BusinessServiceDetailPage from './pages/BusinessServiceDetail'
import QuotationPage from './pages/Quotation'
import TechieChatbot from './components/TechieChatbot'
import ReviewsPage from './pages/Reviews'
import SeoMetadata from './components/SeoMetadata'
import { buildTechieContext } from './data/chatbotContext'
import OpeningAnimation from './components/OpeningAnimation'
import PublicAnnouncementBanner from './components/PublicAnnouncementBanner'
import PublicOfferBanner from './components/PublicOfferBanner'
import PublishedPage from './pages/PublishedPage'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      window.dispatchEvent(new Event('tech-in-air:public-content-refresh'))
    }, 60_000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div className="public-site min-h-screen bg-[var(--bg)] text-[var(--foreground)] transition-colors duration-200">
      <OpeningAnimation />
      <SeoMetadata />
      <Navbar />
      <main className="pt-24 md:pt-28">
        <PublicAnnouncementBanner />
        <PublicOfferBanner />
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
              <Route path="/business-solutions" element={<BusinessSolutionsPage />} />
              <Route path="/business-solutions/quotation" element={<QuotationPage />} />
              <Route path="/business-solutions/:serviceSlug" element={<BusinessServiceDetailPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/privacy-policy" element={<LegalPage page="privacyPolicy" />} />
              <Route path="/terms-and-conditions" element={<LegalPage page="termsAndConditions" />} />
              <Route path="/review/edit" element={<CustomerReviewEdit />} />
              <Route path="/admin/*" element={<NotFoundPage />} />
              <Route path="*" element={<PublishedPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <TechieChatbot context={buildTechieContext} />
    </div>
  )
}
