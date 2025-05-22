'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

export default function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // 인증 상태 변경 이벤트 리스너
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">로딩 중...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {user ? (
        <div>
          <p className="mb-2">
            <span className="font-medium">이메일:</span> {user.email}
          </p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <a
            href="/auth/signin"
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
          >
            로그인
          </a>
          <a
            href="/auth/signup"
            className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
          >
            회원가입
          </a>
        </div>
      )}
    </div>
  );
}
