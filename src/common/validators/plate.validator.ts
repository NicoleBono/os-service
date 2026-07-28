export function normalizePlate(plate: string): string {
  return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function isValidPlate(plate: string): boolean {
  const normalized = normalizePlate(plate);
  return /^[A-Z]{3}\d{4}$/.test(normalized) || /^[A-Z]{3}\d[A-Z]\d{2}$/.test(normalized);
}
