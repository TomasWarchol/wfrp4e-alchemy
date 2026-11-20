/**
 * Edycja pliku JSON w miejscu: zmienia tylko wskazane wartości tekstowe i dopisuje brakujące klucze,
 * bez przeformatowania reszty pliku (pliki językowe mają ręczny układ).
 */

/** Parser zapamiętujący położenie wartości: ścieżka "A.B.C" → { start, end, type, depth, close }. */
export function locate(text) {
  const spans = new Map();
  let i = 0;
  const ws = () => { while (/\s/.test(text[i])) i++; };
  const str = () => {
    const start = i++;
    while (text[i] !== '"') i += text[i] === '\\' ? 2 : 1;
    i++;
    return { start, end: i, value: JSON.parse(text.slice(start, i)) };
  };
  const value = (path, depth) => {
    ws();
    const start = i;
    const c = text[i];
    if (c === '"') {
      const s = str();
      spans.set(path, { start, end: s.end, type: 'string', depth });
      return;
    }
    if (c === '{') {
      i++;
      ws();
      let last = start + 1;
      while (text[i] !== '}') {
        const key = str().value;
        ws(); i++; // :
        value(path ? `${path}.${key}` : key, depth + 1);
        last = i;
        ws();
        if (text[i] === ',') { i++; ws(); }
      }
      spans.set(path, { start, end: i + 1, type: 'object', depth, close: i, lastMemberEnd: last });
      i++;
      return;
    }
    if (c === '[') {
      i++;
      let n = 0;
      ws();
      while (text[i] !== ']') {
        value(`${path}[${n++}]`, depth + 1);
        ws();
        if (text[i] === ',') { i++; ws(); }
      }
      i++;
      spans.set(path, { start, end: i, type: 'array', depth });
      return;
    }
    while (i < text.length && !/[\s,}\]]/.test(text[i])) i++;
    spans.set(path, { start, end: i, type: 'literal', depth });
  };
  value('', 0);
  return spans;
}

const indentOf = (depth) => '  '.repeat(depth);

/** Obiekt z zagnieżdżonymi kluczami w stylu pliku (2 spacje). */
function block(obj, depth) {
  if (typeof obj !== 'object') return JSON.stringify(obj);
  const inner = Object.entries(obj)
    .map(([k, v]) => `${indentOf(depth + 1)}${JSON.stringify(k)}: ${block(v, depth + 1)}`)
    .join(',\n');
  return `{\n${inner}\n${indentOf(depth)}}`;
}

/**
 * Ustawia wartości tekstowe pod ścieżkami (np. "GOLD_ALCHEMY.Recipes.Foo.Name").
 * Brakujące klucze dopisuje na końcu najgłębszego istniejącego obiektu.
 * @param {string} text  zawartość pliku JSON
 * @param {Record<string, string>} values  ścieżka → nowy tekst
 */
export function setStrings(text, values) {
  for (const [path, value] of Object.entries(values)) {
    const spans = locate(text);
    const hit = spans.get(path);
    if (hit) {
      if (hit.type !== 'string') throw new Error(`${path}: not a text value`);
      text = text.slice(0, hit.start) + JSON.stringify(value) + text.slice(hit.end);
      continue;
    }
    const parts = path.split('.');
    let n = parts.length - 1;
    while (n > 0 && !spans.has(parts.slice(0, n).join('.'))) n--;
    const parentPath = parts.slice(0, n).join('.');
    const parent = spans.get(parentPath);
    if (!parent || parent.type !== 'object') throw new Error(`${path}: parent is not an object`);
    const nested = parts.slice(n + 1).reduceRight((acc, key) => ({ [key]: acc }), value);
    const member = `${indentOf(parent.depth + 1)}${JSON.stringify(parts[n])}: ${block(nested, parent.depth + 1)}`;
    const empty = parent.lastMemberEnd === parent.start + 1;
    const before = text.slice(0, parent.lastMemberEnd);
    text = `${before}${empty ? '' : ','}\n${member}\n${indentOf(parent.depth)}${text.slice(parent.close)}`;
  }
  return text;
}

/** Wartość tekstowa pod ścieżką albo undefined. */
export function getString(obj, path) {
  const value = path.split('.').reduce((acc, key) => acc?.[key], obj);
  return typeof value === 'string' ? value : undefined;
}
