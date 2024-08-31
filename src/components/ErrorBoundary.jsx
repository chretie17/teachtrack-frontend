import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          backgroundColor: '#f0f4f8', 
          fontFamily: 'Arial, sans-serif'
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CryingRobot />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ color: '#00447b', marginTop: '2rem' }}
          >
            Oops! Something went wrong.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{ color: '#333', maxWidth: '400px', textAlign: 'center' }}
          >
            We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: '2rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#00447b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </motion.button>
        </div>
      );
    }

    return this.props.children;
  }
}

const CryingRobot = () => (
  <svg width="200" height="200" viewBox="0 0 200 200">
    <motion.circle
      cx="100"
      cy="100"
      r="90"
      fill="#00447b"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.circle
      cx="70"
      cy="80"
      r="15"
      fill="white"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    />
    <motion.circle
      cx="130"
      cy="80"
      r="15"
      fill="white"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    />
    <motion.path
      d="M 60 130 Q 100 160 140 130"
      stroke="white"
      strokeWidth="5"
      fill="transparent"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    />
    <motion.line
      x1="65"
      y1="70"
      x2="75"
      y2="60"
      stroke="white"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.6, duration: 0.3 }}
    />
    <motion.line
      x1="125"
      y1="70"
      x2="135"
      y2="60"
      stroke="white"
      strokeWidth="3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.6, duration: 0.3 }}
    />
    <motion.circle
      cx="70"
      cy="85"
      r="3"
      fill="#00447b"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.9, duration: 0.2 }}
    />
    <motion.circle
      cx="130"
      cy="85"
      r="3"
      fill="#00447b"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.9, duration: 0.2 }}
    />
    <motion.line
      x1="60"
      y1="110"
      x2="50"
      y2="150"
      stroke="#87CEEB"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.line
      x1="140"
      y1="110"
      x2="150"
      y2="150"
      stroke="#87CEEB"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.2, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    />
  </svg>
);

export default ErrorBoundary;