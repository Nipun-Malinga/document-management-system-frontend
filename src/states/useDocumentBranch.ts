import { create } from 'zustand';

interface BranchState {
  branchName: string;
  setBranchName: (branchName: string) => void;
  resetBranchName: () => void;
}

const useDocumentBranch = create<BranchState>((set) => ({
  branchName: 'main',
  setBranchName: (branchName) => set({ branchName: branchName }),
  resetBranchName: () => set({ branchName: 'main' }),
}));

export default useDocumentBranch;
