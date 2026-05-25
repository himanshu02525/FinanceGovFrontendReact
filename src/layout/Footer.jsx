import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.footer
      className="footer"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
    
      <div className="footer-tagline">
        <p>
          Transforming <span className="highlight-yellow">finance</span> with efficient, <span className="highlight-yellow">scalable</span>, and user-centric <span className="highlight-yellow">solutions</span>.
        </p>
        <p className="footer-tagline-secondary">
          Driven by data. Designed for impact.
        </p>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          <p>&copy; {currentYear} Ministry of Finance. All rights reserved.</p>
          <p className="footer-version">Government System v1.0.0</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
