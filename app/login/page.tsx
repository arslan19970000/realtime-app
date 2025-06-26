'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        padding: '2rem',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          lineHeight: '2rem',
          fontWeight: '700',
          textAlign: 'center',
          color: '#111827'
        }}>Sign In</h2>
        
        {error && (
          <div style={{
            padding: '1rem',
            fontSize: '0.875rem',
            color: '#b91c1c',
            backgroundColor: '#fee2e2',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                outline: 'none',
                fontSize: '0.875rem'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                outline: 'none',
                fontSize: '0.875rem'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.5rem 1rem',
                border: '1px solid transparent',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#4f46e5',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#4b5563'
        }}>
          Don't have an account?{' '}
          <a href="/register" style={{
            fontWeight: '500',
            color: '#4f46e5'
          }}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}