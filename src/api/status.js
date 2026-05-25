export const disclosureStatusLabels = {
  SUBMITTED: 'Pending',
  VALIDATED: 'Approved',
  REJECTED: 'Rejected'
};
 
export const taxStatusLabels = {
  PENDING: 'Pending',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  OVERDUE_PAID: 'Overdue_Paid',
  REJECTED: 'Rejected',
  VERIFIED_INITIAL: 'Verified Initial',
  VERIFIED_FINAL: 'Verified Final' // For backward compatibility with any existing records
};
 
export const statusBadgeClass = (status) => {
  switch (status) {
    case 'VALIDATED':
    case 'PAID':
    case 'VERIFIED_INITIAL':
    case 'VERIFIED_FINAL':
      return 'success';
    case 'SUBMITTED':
    case 'PENDING':
      return 'warning';
    case 'REJECTED':
      return 'danger';
    case 'OVERDUE':
    case 'OVERDUE_PAID':
      return 'danger';
    default:
      return 'secondary';
  }
};
 
 