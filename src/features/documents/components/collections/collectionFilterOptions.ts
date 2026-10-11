export interface FilterField {
  name: string;
  label: string;
  type?: 'text' | 'email';
  maxLength?: number;
  options?: readonly (readonly [string, string])[];
}

export const statusField: FilterField = {
  name: 'status', label: 'Status', options: [['PUBLIC', 'Public'], ['PRIVATE', 'Private']],
};
export const permissionField: FilterField = {
  name: 'permission', label: 'Permission', options: [['READ_ONLY', 'Read only'], ['READ_WRITE', 'Read and write']],
};
export const documentSorts = [['id,asc', 'Default order'], ['title,asc', 'Title A–Z'], ['updatedAt,desc', 'Recently updated']] as const;
export const branchSorts = [['id,asc', 'Default order'], ['branchName,asc', 'Name A–Z'], ['updatedAt,desc', 'Recently updated']] as const;
export const versionSorts = [['id,asc', 'Default order'], ['title,asc', 'Title A–Z'], ['createdAt,desc', 'Newest first']] as const;

