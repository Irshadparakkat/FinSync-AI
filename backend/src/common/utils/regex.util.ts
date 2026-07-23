/** Escapes user input before it is embedded in a RegExp (ReDoS/injection safety). */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
