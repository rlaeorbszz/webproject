'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setMessage({
        text: '로그인 성공!',
        type: 'success',
      });
      
      // 로그인 성공 후 리다이렉트 또는 상태 업데이트
      window.location.href = '/';
    } catch (error: any) {
      setMessage({
        text: error.message || '로그인 중 오류가 발생했습니다.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
      
      <form onSubmit={handleSignIn}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? '처리 중...' : '로그인'}
        </button>
      </form>
      
      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button
          onClick={async () => {
            setLoading(true);
            try {
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
              });
              
              if (error) throw error;
              
              setMessage({
                text: '비밀번호 재설정 이메일이 발송되었습니다.',
                type: 'success',
              });
            } catch (error: any) {
              setMessage({
                text: error.message || '비밀번호 재설정 요청 중 오류가 발생했습니다.',
                type: 'error',
              });
            } finally {
              setLoading(false);
            }
          }}
          disabled={!email || loading}
          className="text-sm text-blue-600 hover:underline"
        >
          비밀번호를 잊으셨나요?
        </button>
      </div>
    </div>
  );
}
