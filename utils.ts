export function sleep(s: number): Promise<void> {
    const ms = s * 1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}