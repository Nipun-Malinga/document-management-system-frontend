import { create } from 'zustand';

interface BranchState {
  branchName: string;
  setBranchName: (branchName: string) => void;
  resetBranchName: () => void;
}

const useBranch = create<BranchState>((set) => ({
  branchName: 'main',
  setBranchName: (branchName) => set({ branchName: branchName }),
  resetBranchName: () => set({ branchName: 'main' }),
}));

export default useBranch;
