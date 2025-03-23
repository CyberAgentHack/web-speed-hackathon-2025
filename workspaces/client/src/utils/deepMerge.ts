export function deepMerge<T>(target: T, source: Partial<T>): T {
  if (typeof target !== 'object' || target == null) return target;

  const result = { ...target };

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const targetValue = (target as Record<string, unknown>)[key];
    const sourceValue = (source as Record<string, unknown>)[key];

    if (Array.isArray(sourceValue)) {
      // 配列はそのまま上書き
      (result as Record<string, unknown>)[key] = sourceValue;
    } else if (
      typeof sourceValue === 'object' &&
      sourceValue != null &&
      typeof targetValue === 'object' &&
      targetValue != null &&
      !Array.isArray(targetValue)
    ) {
      // オブジェクト同士なら再帰的にマージ
      (result as Record<string, unknown>)[key] = deepMerge(targetValue, sourceValue);
    } else {
      // プリミティブ値やその他は上書き
      (result as Record<string, unknown>)[key] = sourceValue;
    }
  }

  return result;
}
