import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import "../components/GradientOutlineButton.css";
import "../components/FeatureCard.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);
  return (
    <div className="landing-page-container">
      {/* Animated background gradient */}
      <div className="animated-background">
        {/* Floating orbs */}
        <div className="floating-orb-1"></div>
        <div className="floating-orb-2"></div>
        <div className="floating-orb-3"></div>
      </div>
      <div className={`main-content ${show ? 'show' : 'hide'}`}>
        <h1 className="main-heading">
          <span className="generate-forms-text">
            <span className="generate-forms-gradient">
              <span className="generate-text">Generate </span><AutoTypingText />
            </span>
            {/* Removed hover underline and blur effect */}
          </span>
          <span className="instantly-text">
            <span className="instantly-gradient">
              Instantly
              <span className="instantly-glow"></span>
            </span>
            {/* Floating particles */}
            <span className="floating-particle-1"></span>
            <span className="floating-particle-2"></span>
            <span className="floating-particle-3"></span>
          </span>
        </h1>
        <p className={`description-text ${show ? 'show' : 'hide'}`}>
          Natural language to fully structured forms – fast, simple, powerful.
        </p>
        <div className="button-container">
          <GradientOutlineButton onClick={() => navigate('/chat')} />
        </div>
      </div>
      <div className={`features-grid ${show ? 'show' : 'hide'}`}>
          <div>
            <FeatureCard emoji="⚡" title="Speed" description="Lightning fast form generation" />
          </div>
          <div>
            <FeatureCard emoji="🎯" title="Accuracy" description="Smart field suggestions based on context" />
          </div>
          <div>
            <FeatureCard emoji="📤" title="Export" description="Export to Microsoft Forms and Google Docs" />
          </div>
      </div>
    </div>
  );
}

function AutoTypingText() {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const words = ['Forms', 'Presentations', 'Spreadsheets'];
  const currentWord = words[currentIndex];
  
  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100; // Faster when deleting
    const deleteSpeed = 50;
    const pauseTime = 2000; // Pause at full word
    
    const timer = setTimeout(() => {
      if (!isDeleting && currentText === currentWord) {
        // Pause at full word, then start deleting
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && currentText === '') {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % words.length);
      } else if (isDeleting) {
        // Deleting
        setCurrentText(currentWord.slice(0, currentText.length - 1));
      } else {
        // Typing
        setCurrentText(currentWord.slice(0, currentText.length + 1));
      }
    }, isDeleting ? deleteSpeed : typeSpeed);
    
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentIndex, currentWord, words.length]);
  
  return (
    <span className="auto-typing-text">
      {currentText}
      <span className="typing-cursor">|</span>
    </span>
  );
}

function GradientOutlineButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="gradient-outline-button"
    >
      {/* Glowing gradient shadow */}
      <span
        className="gradient-shadow"
        aria-hidden="true"
      ></span>
      {/* Button surface */}
      <span className="button-surface"></span>
      {/* Text */}
      <span className="button-text-container">
        <span className="button-text">Try Now</span>
        <span className="button-arrow">→</span>
      </span>
    </button>
  );
}

function FeatureCard({ emoji, title, description }) {
  return (
    <div className="feature-card">
      {/* Static border gradient (no hover) */}
      <div className="feature-card-border"></div>
      <div className="feature-card-content">
        <div className="feature-card-emoji" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>{emoji}</div>
        <h3 className="feature-card-title" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>{title}</h3>
        <p className="feature-card-description" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>{description}</p>
      </div>
    </div>
  );
}
