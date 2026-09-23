/**
 * Format number as Indian Rupee (INR) currency
 * e.g., 2500000 -> ₹25,00,000
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded).toString();

  let lastThree = absVal.substring(absVal.length - 3);
  const otherNumbers = absVal.substring(0, absVal.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Format date string into human friendly format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Relative time formatter for activity timelines
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    if (diffSeconds < 172800) return 'Yesterday';
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Export table data to CSV file download
 */
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const processRow = (row: (string | number)[]) => {
    return row
      .map(val => {
        const text = String(val ?? '').replace(/"/g, '""');
        return `"${text}"`;
      })
      .join(',');
  };

  const csvContent = [headers.join(','), ...rows.map(processRow)].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
