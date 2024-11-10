import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your News, Delivered Fresh</h1>
          <p className="hero-subtext">
            Stay updated with the latest and most reliable news worldwide.
          </p>
          <button className="hero-btn" onClick={() => navigate("/login")}>
            Get Started Now
          </button>
          <div className="hero-tags">
            <span>Breaking News</span>
            <span>Global Coverage</span>
            <span>Trusted Sources</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-heading">Features</h2>
        <div className="feature-cards-container">
          <div className="feature-card">
            <h3 className="feature-title">Real-Time Updates</h3>
            <p className="feature-description">
              Get the latest news as it happens, anytime, anywhere.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Reliable Sources</h3>
            <p className="feature-description">
              Only the most trustworthy sources are curated for you.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Easy Access</h3>
            <p className="feature-description">
              Stay informed with just a few clicks, on any device.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section">
        <h2 className="section-heading">Why Choose Us?</h2>
        <div className="why-choose-cards-container">
          <div className="why-choose-card">
            <h3 className="why-choose-title">Trusted Sources</h3>
            <p className="why-choose-description">
              We source news from only the most reliable and respected
              publishers globally.
            </p>
          </div>
          <div className="why-choose-card">
            <h3 className="why-choose-title">Customizable Experience</h3>
            <p className="why-choose-description">
              Tailor your news feed to the topics that matter to you most.
            </p>
          </div>
          <div className="why-choose-card">
            <h3 className="why-choose-title">24/7 News Updates</h3>
            <p className="why-choose-description">
              Stay in the know with up-to-the-minute news updates from around
              the world.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2 className="section-heading">Pricing Plans</h2>
        <div className="pricing-cards-container">
          <div className="pricing-card">
            <h3 className="pricing-title">Free</h3>
            <p>Basic access with limited features</p>
            <button className="pricing-btn" onClick={() => navigate("/login")}>
              Start for Free
            </button>
          </div>
          <div className="pricing-card premium">
            <h3 className="pricing-title">Premium</h3>
            <p>Full access with advanced features</p>
            <button className="pricing-btn" onClick={() => navigate("/login")}>
              Get Premium
            </button>
          </div>
          <div className="pricing-card">
            <h3 className="pricing-title">Business</h3>
            <p>Best for teams and companies</p>
            <button className="pricing-btn" onClick={() => navigate("/login")}>
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-heading">What Our Users Say</h2>
        <div className="testimonials-cards-container">
          <div className="testimonial-card">
            <p>
              "This app keeps me informed with all the latest news. Highly
              recommend!"
            </p>
            <h4>- Sarah J.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "The customization options are great. I can follow topics that
              matter to me."
            </p>
            <h4>- Mark T.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "A reliable source for breaking news and updates around the
              clock."
            </p>
            <h4>- Emily W.</h4>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Don't Miss Out on Important News</h2>
        <p>
          Join thousands of users who rely on us for their daily news updates.
        </p>
        <button className="cta-btn" onClick={() => navigate("/login")}>
          Sign Up Now
        </button>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <p>&copy; 2024 Your News App. All rights reserved.</p>
        <p>Contact us at support@yournewsapp.com</p>
      </footer>
    </div>
  );
};

export default LandingPage;
