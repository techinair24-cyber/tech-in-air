import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Star, MessageSquare, ShieldCheck, Camera } from 'lucide-react'
import ApprovedReviews from '../components/ApprovedReviews'
import CustomerReviews from '../components/CustomerReviews'

export default function ReviewsPage() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="reviews-premium">

      <header className="reviews-premium-hero">
        <div className="container">

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.45 }}
          >

            <p className="reviews-kicker">
              TECH IN AIR · CUSTOMER EXPERIENCES
            </p>

            <h1>Trusted by our customers.</h1>

            <p className="reviews-hero-description">
              Real projects. Real experiences.
              Discover feedback from customers who have
              worked with Tech In Air.
            </p>

            <a
              href="#write-review"
              className="primary-button reviews-write-button"
            >
              <MessageSquare size={18} />
              Write a Review
            </a>

          </motion.div>

        </div>
      </header>

      <ApprovedReviews
        title="What our customers say."
        variant="reviews"
      />

      <section
        id="write-review"
        className="reviews-submission"
      >
        <div className="container">

          <div className="reviews-submission-grid">

            <div className="reviews-submission-info">

              <p className="reviews-kicker">
                YOUR EXPERIENCE MATTERS
              </p>

              <h2>Share your story.</h2>

              <p className="reviews-submission-description">
                Your feedback helps us improve our services
                and helps future customers make informed
                decisions.
              </p>

              <div className="reviews-guidelines">

                <div>
                  <Star size={24} />
                  <div>
                    <h3>Rate your experience</h3>
                    <p>
                      Tell us how satisfied you were with
                      your project and our support.
                    </p>
                  </div>
                </div>

                <div>
                  <MessageSquare size={24} />
                  <div>
                    <h3>Share honest feedback</h3>
                    <p>
                      Describe your experience in your own words.
                    </p>
                  </div>
                </div>

                <div>
                  <Camera size={24} />
                  <div>
                    <h3>Add project photos</h3>
                    <p>
                      Include photos of your project if you wish.
                    </p>
                  </div>
                </div>

                <div>
                  <ShieldCheck size={24} />
                  <div>
                    <h3>Review moderation</h3>
                    <p>
                      Reviews are checked before being
                      published on our website.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            <div className="reviews-form-panel">
              <CustomerReviews />
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}