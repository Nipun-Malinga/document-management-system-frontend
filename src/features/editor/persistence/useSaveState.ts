import { useSyncExternalStore } from 'react';
import type { SaveCoordinator, SaveState } from './SaveCoordinator';

const idle: SaveState = { revision: 0, savedRevision: 0, status: 'saved', error: '', locked: false, replacementPending: false };
const subscribe = () => () => {};
const snapshot = () => idle;
const useSaveState = (coordinator: SaveCoordinator | null) => useSyncExternalStore(coordinator?.subscribe ?? subscribe, coordinator?.getSnapshot ?? snapshot);
export default useSaveState;
