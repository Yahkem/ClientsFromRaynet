/**
 * Stav
 * */
export enum State {
  A_POTENTIAL = "Potenciální",
  B_ACTUAL = "Aktuální",
  C_DEFERRED = "Odložený",
  D_UNATTRACTIVE = "Nezajímavý",
}

/**
 * Vztah
 * */
export enum Role {
  A_SUBSCRIBER = "Odběratel",
  B_PARTNER = "Partner",
  C_SUPPLIER = "Dodavatel",
  D_RIVAL = "Konkurent",
  E_OWN = "Vlastní firma",
}

export function enumDisplayString(strValue: string, enumType: any): string {
  if (!strValue)
    return '';

  const roleObj: any = enumType;

  return roleObj[strValue];
}
