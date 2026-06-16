import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo-icon">⚡</div>
          <div>
            <div className="footer-logo-name">LC Revision Planner</div>
          </div>
        </div>

        {/* Author Info */}
        <div className="footer-info">
          <div className="footer-name">Bhoomi Agarwal</div>
          <div className="footer-email">bhoomiagrawal175@gmail.com</div>
        </div>

        {/* CTA Button */}
        <a
          id="digital-heroes-btn"
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-cta-btn"
          aria-label="Visit Digital Heroes Co website"
        >
          🦸 Built for Digital Heroes
        </a>
      </div>

      <div className="footer-copy">
        © {new Date().getFullYear()} Bhoomi Agrawal · LeetCode Revision Planner
      </div>
    </footer>
  );
}
