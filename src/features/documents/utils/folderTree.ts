import type { Folder } from "@/features/documents/types/Folder";

export const folderPath = (
	folders: Folder[],
	folderId: string | null,
): Folder[] => {
	const byId = new Map(folders.map((folder) => [folder.id, folder]));
	const path: Folder[] = [];
	const seen = new Set<string>();
	let current = folderId ? byId.get(folderId) : undefined;
	while (current && !seen.has(current.id)) {
		seen.add(current.id);
		path.unshift(current);
		current = current.parentFolderId
			? byId.get(current.parentFolderId)
			: undefined;
	}
	return path;
};

export const descendantIds = (
	folders: Folder[],
	folderId: string,
): Set<string> => {
	const children = new Map<string, string[]>();
	for (const folder of folders) {
		if (folder.parentFolderId) {
			const siblings = children.get(folder.parentFolderId) ?? [];
			siblings.push(folder.id);
			children.set(folder.parentFolderId, siblings);
		}
	}
	const ids = new Set<string>();
	const pending = [folderId];
	while (pending.length) {
		const id = pending.pop();
		if (!id || ids.has(id)) continue;
		ids.add(id);
		pending.push(...(children.get(id) ?? []));
	}
	return ids;
};
