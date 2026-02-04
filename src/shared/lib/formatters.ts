/**
 * Format a number as currency
 */
export function formatCurrency(
  value: number,
  currency: string = 'EUR',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format a date string
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Format a timeline range (e.g., "1-3 months")
 */
export function formatTimeline(minDays: number, maxDays: number): string {
  const minMonths = Math.ceil(minDays / 30);
  const maxMonths = Math.ceil(maxDays / 30);

  if (minDays < 30) {
    if (maxDays < 30) {
      return `${minDays}-${maxDays} days`;
    }
    return `${minDays} days - ${maxMonths} months`;
  }

  if (minMonths === maxMonths) {
    return `${minMonths} month${minMonths > 1 ? 's' : ''}`;
  }

  return `${minMonths}-${maxMonths} months`;
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a status string for display
 */
export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').split(' ').map(capitalize).join(' ');
}
