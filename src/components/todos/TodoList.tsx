'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        return;
      }
      setUser(data.user);
    };

    fetchUser();
  }, []);

  // 할 일 목록 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setTodos(data || []);
      } catch (error: any) {
        console.error('할 일 목록을 가져오는 중 오류 발생:', error);
        setError('할 일 목록을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [user]);

  // 할 일 추가
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!newTodo.trim()) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('todos')
        .insert([
          { 
            title: newTodo.trim(),
            user_id: user.id
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // 새로운 할 일을 목록에 추가
      if (data) {
        setTodos([...data, ...todos]);
      }
      
      // 입력 필드 초기화
      setNewTodo('');
    } catch (error: any) {
      console.error('할 일을 추가하는 중 오류 발생:', error);
      setError('할 일을 추가하는 중 오류가 발생했습니다.');
    }
  };

  // 할 일 완료 상태 토글
  const toggleTodoStatus = async (id: string, completed: boolean) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // 로컬 상태 업데이트
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error: any) {
      console.error('할 일 상태를 변경하는 중 오류 발생:', error);
      setError('할 일 상태를 변경하는 중 오류가 발생했습니다.');
    }
  };

  // 할 일 삭제
  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // 로컬 상태 업데이트
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error: any) {
      console.error('할 일을 삭제하는 중 오류 발생:', error);
      setError('할 일을 삭제하는 중 오류가 발생했습니다.');
    }
  };

  if (!user) {
    return (
      <div className="bg-yellow-100 p-4 rounded-md text-yellow-800">
        할 일 목록을 보려면 로그인이 필요합니다.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">내 할 일 목록</h2>

      {/* 할 일 추가 폼 */}
      <form onSubmit={addTodo} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="새 할 일을 입력하세요"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            추가
          </button>
        </div>
      </form>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 p-3 rounded-md text-red-800 mb-4">
          {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading ? (
        <div className="text-center py-4">로딩 중...</div>
      ) : (
        <div>
          {/* 할 일 목록 */}
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">할 일이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodoStatus(todo.id, todo.completed)}
                      className="mr-3 h-5 w-5 text-blue-500"
                    />
                    <span
                      className={`${
                        todo.completed ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
