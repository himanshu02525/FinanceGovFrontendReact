export const getUserId = () => {
  const stored = localStorage.getItem('userId');
  return stored ? Number(stored) : null;
};

export const getEntityId = () => {
  const stored = localStorage.getItem('entityId') || localStorage.getItem('activeEntityId');
  return stored ? Number(stored) : null;
};

export const getMissingIdsMessage = () => {
  return 'Please wait for the document verification to be completed, than only you will be able to proceed with the application process.';
};
