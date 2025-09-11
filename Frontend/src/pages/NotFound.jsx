import React from 'react';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 'var(--spacing-lg)',
      textAlign: 'center',
      padding: 'var(--spacing-lg)'
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: 'var(--spacing-sm)'
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-lg)',
        maxWidth: '400px'
      }}>
        Sorry, we couldn't find the page you're looking for. 
        Let's get you back to splitting expenses!
      </p>
      <a 
        href="/" 
        className="btn btn-primary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          textDecoration: 'none'
        }}
      >
        <ArrowLeft className="icon" />
        <span>Back to Home</span>
      </a>
    </div>
  );
};

export default NotFound;