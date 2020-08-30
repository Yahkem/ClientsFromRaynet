'use strict';

export function getColorForCategory(name: string, categories: { code01: string, code02: string }[]) {
  for (const c of categories) {
    if (c.code01 === name) {
      return c.code02;
    }
  }

  return null;
}

export function ratingDisplay(c: string) {
  const stars = c === 'A' ? '&#9733;&#9733;&#9733;' :
    c === 'B' ? '&#9733;&#9733;&#9734;' :
      c === 'C' ? '&#9733;&#9734;&#9734;' :
        '&#9734;&#9734;&#9734;';

  return stars;
};

/**
 * Helper for null display
 */
export const d = (x: any) => !!x ? x : '';

export const formatValueObj = (obj: { value: string }) => {
  if (obj === void 0 || obj === null || obj.value === null) {
    return d(null);
  }

  return d(obj.value);
};

export const formatYesNo = (val: string) =>
  (val === 'YES') ? 'Ano' :
    (val === 'NO') ? 'Ne' :
      d(null);

export const formatLatLng = (addr: { lat: number, lng: number}) =>
  !!addr.lat ?
    d(addr.lat) + ", " + d(addr.lng) :
    d(null);

/**
 * Helper for date display
 */
export const formatDate = (dt: string) => {
  if (!dt) {
    return d(null);
  }

  const date = new Date(dt)

  return date.toLocaleDateString('cs-CZ');
};
