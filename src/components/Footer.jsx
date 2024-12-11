import React, { useState } from 'react';
import { motion } from 'framer-motion';
import "../styles/global.css";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleDiscoBallClick = () => {
    setIsVisible(true);
    // Slide back out after 2 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  return (
    <footer className="flex flex-row gap-1 items-center justify-start relative">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleDiscoBallClick();
        }}
        className="animate-bounce text-3xl p-0 opacity-40 relative z-10"
        style={{ cursor: 'pointer' }}
      >
        🪩
      </a>
      <motion.p
        className="absolute font-mono top-0 left-10 text-xs text-slate-600"
        initial={{ x: -10, opacity: 0 }}
        animate={isVisible ? { x: 6, opacity: .7 } : { x: -5, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        built by riley
      </motion.p>
    </footer>
  );
};

export default Footer;