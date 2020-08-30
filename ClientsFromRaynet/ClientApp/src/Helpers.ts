export function getColorForCategory(name: string, categories: { code01: string, code02: string}[]) {
  for (const c of categories) {
    if (c.code01 === name) {
      return c.code02;
    }
  }

  return null;
}
