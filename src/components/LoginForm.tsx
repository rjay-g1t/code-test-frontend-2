import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, PhotoIcon } from '@heroicons/react/24/outline';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log(
        `Attempting ${isSignUp ? 'signup' : 'login'} with email:`,
        email
      );

      if (isSignUp) {
        await signup(email, password);
        // If signup succeeds but no session (email confirmation required)
        console.log('Signup completed - check for confirmation email');
      } else {
        await login(email, password);
        console.log('Login completed successfully');
      }
    } catch (err: any) {
      console.error('Auth error:', err);

      // Provide more specific error messages
      let errorMessage = err.message || 'An error occurred';

      if (err.message?.includes('Invalid login credentials')) {
        errorMessage =
          'Invalid email or password. Please check your credentials and try again.';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage =
          'Please check your email and click the confirmation link before logging in.';
      } else if (err.message?.includes('confirmation')) {
        errorMessage =
          'Please check your email and click the confirmation link to complete signup.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <PhotoIcon
            style={{
              color: '#FF385C',
              width: '32px',
              height: '32px',
              margin: '0 auto 8px',
            }}
          />
          <h1>Gallery</h1>
        </div>

        <h2 className="auth-title">
          {isSignUp ? 'Welcome to Gallery' : 'Welcome back'}
        </h2>

        {!isSignUp && (
          <p className="auth-subtitle">Log in to your account to continue</p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div
              style={{
                background: '#FEF7F7',
                border: '1px solid #F1DADA',
                color: '#C13515',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: '400',
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className="form-input"
                placeholder={
                  isSignUp ? 'Create a password' : 'Enter your password'
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#717171',
                  padding: '4px',
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon style={{ width: '16px', height: '16px' }} />
                ) : (
                  <EyeIcon style={{ width: '16px', height: '16px' }} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-lg w-full"
            style={{ marginTop: '24px' }}
          >
            {isLoading ? (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div className="loading"></div>
                Processing...
              </div>
            ) : isSignUp ? (
              'Create account'
            ) : (
              'Continue'
            )}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-footer">
          <p className="auth-footer-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            type="button"
            className="auth-link"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};
