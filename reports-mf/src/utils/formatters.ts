export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return String(num);
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    completed: 'Completed',
    in_progress: 'In Progress',
    failed: 'Failed',
  };
  return labels[status] || status;
}
