// src/app/page.tsx
'use client'; // Zustand hook을 사용하므로 클라이언트 컴포넌트로 지정해야 합니다.

import React from 'react';
import { useCounterStore } from './store/counterStore'; // 방금 만든 스토어를 가져옵니다.
import AuthStatus from '../components/auth/AuthStatus';
import TodoList from '../components/todos/TodoList';

export default function HomePage() {
  // useCounterStore 훅을 사용하여 상태(count)와 액션(increment)을 가져옵니다.
  const { count, increment, decrement } = useCounterStore();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <AuthStatus />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className='text-2xl font-bold text-center mb-6'>간단한 카운터</h1>
          <p className="text-center text-lg mb-4">현재 숫자: <span className="font-bold">{count}</span></p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={increment} 
              className='border border-green-600 p-2 px-4 rounded-3xl hover:bg-green-100 transition-colors'
            >
              증가
            </button>
            <button 
              onClick={decrement} 
              className='border border-red-600 p-2 px-4 rounded-3xl hover:bg-red-100 transition-colors'
            >
              감소
            </button>
          </div>
        </div>
        
        <div>
          <TodoList />
        </div>
      </div>
    </div>
  );
}