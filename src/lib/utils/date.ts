export function getDaysLeft(returnDate: string, now: number): number {
  return Math.ceil((new Date(returnDate).getTime() - now) / 86_400_000);
}

/* export function getDaysLeft(dueDate: string, now: number): number {
  return Math.ceil((new Date(dueDate).getTime() - now) / 86_400_000);
} */
