export function parseValue(value: any): any {
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;

    // якщо строка число
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return Number(value);
    }

    return value;
  }

  // якщо масив → рекурсивно
  if (Array.isArray(value)) {
    return value.map((item) => parseValue(item));
  }

  // якщо об’єкт → рекурсивно
  if (value && typeof value === 'object') {
    const parsedObj: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      parsedObj[k] = parseValue(v);
    }
    return parsedObj;
  }

  return value;
}
