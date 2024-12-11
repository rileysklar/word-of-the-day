import React, { useState } from 'react';
import { motion } from 'framer-motion';
import "../styles/global.css";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const handleDiscoBallClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <footer className="flex flex-row gap-1 items-center justify-start relative">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleDiscoBallClick();
        }}
        className="animate-bounce text-3xl p-0 opacity-40 relative"
        style={{ cursor: 'pointer' }}
      >
        🪩
      </a>

      {showModal && (
        <motion.div
          className="morphism fixed inset-0 flex flex-col items-center justify-center bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <motion.div
            className="relative text-slate-800 opacity-50 morphism bg-white p-6 font-mono"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 hover:text-gray-700"
              style={{ fontSize: '1.25rem', lineHeight: '1' }}
            >
              &times;
            </button>
            <p className="text-center text-slate-800 flex flex-row items-center">
              built by{" "}
              <a
                href="https://rileysklar.io"
                target="_blank"
                rel="noopener noreferrer"
                className="active:text-pink-700 text-blue-600 underline"
              >
                riley
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </footer>
  );
};

export default Footer;
