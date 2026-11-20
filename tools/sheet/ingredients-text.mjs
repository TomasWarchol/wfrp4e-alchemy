/**
 * Edycja scripts/data/ingredients.js w miejscu: plik ma komentarze sekcji i ręczny układ,
 * więc zmieniamy tylko linie właściwości zmienionych składników i dopisujemy nowe na końcu tablicy.
 */

const ORDER = ['key', 'name', 'category', 'sourceModule', 'img', 'description', 'price', 'encumbrance', 'availability'];

/** Literał JS w stylu pliku. */
export function literal(value) {
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (value && typeof value === 'object') {
    return `{ ${Object.entries(value).map(([k, v]) => `${k}: ${literal(v)}`).join(', ')} }`;
  }
  return String(value);
}

/** Granice obiektu składnika o danym kluczu: [początek "{", koniec po "}"]. */
function findBlock(text, key) {
  const at = text.indexOf(`key: ${literal(key)},`);
  if (at < 0) return null;
  const start = text.lastIndexOf('{', at);
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) return [start, i + 1];
  }
  return null;
}

/**
 * Ustawia właściwości składnika. `undefined` usuwa właściwość (np. sourceModule dla treści własnej).
 * @param {string} text
 * @param {string} key
 * @param {Record<string, unknown>} props
 */
export function setIngredientProps(text, key, props) {
  const span = findBlock(text, key);
  if (!span) throw new Error(`Ingredient ${key} not found in ingredients.js`);
  let body = text.slice(span[0], span[1]);
  const indent = body.match(/\n(\s*)key:/)[1];
  for (const [prop, value] of Object.entries(props)) {
    const line = new RegExp(`\\n${indent}${prop}: .*`);
    if (value === undefined) {
      body = body.replace(line, '');
      continue;
    }
    if (line.test(body)) {
      body = body.replace(line, (old) => `\n${indent}${prop}: ${literal(value)}${old.trimEnd().endsWith(',') ? ',' : ''}`);
      continue;
    }
    // Brak właściwości: wstaw za poprzednią w kolejności pliku
    const previous = ORDER.slice(0, ORDER.indexOf(prop)).reverse().find((p) => new RegExp(`\\n${indent}${p}: `).test(body));
    const after = new RegExp(`\\n${indent}${previous}: .*`);
    body = body.replace(after, (old) => {
      const withComma = old.trimEnd().endsWith(',') ? old : `${old},`;
      const isLast = !old.trimEnd().endsWith(',');
      return `${withComma}\n${indent}${prop}: ${literal(value)}${isLast ? '' : ','}`;
    });
  }
  return text.slice(0, span[0]) + body + text.slice(span[1]);
}

/** Dopisuje nowy składnik na końcu tablicy ALCHEMY_INGREDIENTS. */
export function appendIngredient(text, ingredient) {
  const arrayStart = text.indexOf('export const ALCHEMY_INGREDIENTS = [');
  const end = text.indexOf('\n];', arrayStart);
  const entries = ORDER.filter((p) => ingredient[p] !== undefined)
    .map((p) => `    ${p}: ${literal(ingredient[p])}`)
    .join(',\n');
  return `${text.slice(0, end)},\n  {\n${entries}\n  }${text.slice(end)}`;
}
