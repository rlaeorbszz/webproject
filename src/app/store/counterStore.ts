// src/store/counterStore.ts
import { create } from 'zustand';

// 스토어 상태 및 액션 타입 정의
interface CounterState {
  count: number; // 숫자 상태
  increment: () => void; // 숫자를 증가시키는 함수
  decrement: () => void; // 숫자를 감소시키는 함수
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 5, // 초기 숫자 값은 0
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count -1})) // 현재 count 값에 1을 더함
}));