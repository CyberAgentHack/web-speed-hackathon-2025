/**
 * 2つのオブジェクトをディープマージする関数
 * @param target マージ先のオブジェクト
 * @param source マージ元のオブジェクト
 * @returns マージされた新しいオブジェクト
 */
export function merge<T extends object, S extends object>(target: T, source?: S): T & S {
  // sourceがnullまたはundefinedの場合、targetをそのまま返す
  if (source == null) {
    return target as T & S;
  }

  // マージ先のオブジェクトを複製
  const output = { ...target } as Record<string, any>;

  // マージ元のオブジェクトのプロパティを走査
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key as keyof S];
      const targetValue = target[key as unknown as keyof T];

      // 両方のプロパティが配列の場合
      if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        output[key] = [...targetValue, ...sourceValue];
      }
      // 両方のプロパティがオブジェクトで、配列でない場合（nullでない）
      else if (
        isObject(sourceValue) &&
        isObject(targetValue) &&
        !Array.isArray(sourceValue) &&
        !Array.isArray(targetValue)
      ) {
        output[key] = merge(targetValue, sourceValue);
      }
      // それ以外の場合、sourceの値で上書き
      else {
        output[key] = sourceValue;
      }
    }
  }

  return output as T & S;
}

/**
 * 値がオブジェクトかどうかをチェックする関数
 * @param item チェックする値
 * @returns オブジェクトであればtrue、そうでなければfalse
 */
function isObject(item: unknown): item is object {
  return item !== null && typeof item === 'object';
}