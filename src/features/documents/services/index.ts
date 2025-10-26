export const getEditorURI = (
  documentId: string,
  branchId: string,
  shared: boolean
) => {
  return `/document/${documentId}/branch/${branchId}/edit${
    shared ? '/collaborative' : ''
  }`;
};
