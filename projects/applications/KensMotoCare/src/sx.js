// Converts the design file's inline CSS strings into React style objects,
// so markup can be ported verbatim from the .dc.html source.
const cache = new Map();

export function sx(str) {
  let obj = cache.get(str);
  if (obj) return obj;
  obj = {};
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val) continue;
    if (prop.startsWith('--')) {
      obj[prop] = val;
    } else {
      // -webkit-foo -> WebkitFoo, foo-bar -> fooBar
      obj[prop.replace(/-(\w)/g, (_, c) => c.toUpperCase())] = val;
    }
  }
  cache.set(str, obj);
  return obj;
}
