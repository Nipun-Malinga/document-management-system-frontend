import { create } from 'zustand';

interface OnlineUsers {
  users: Map<string, number[]>;
  addValue: (key: string, value: number[]) => void;
}

const useDocumentOnlineUsers = create<OnlineUsers>((set) => ({
  users: new Map<string, number[]>(),
  addValue: (key, value) =>
    set((state) => {
      const map = state.users;
      map.set(key, value);
      return { users: map };
    }),
}));

export default useDocumentOnlineUsers;
