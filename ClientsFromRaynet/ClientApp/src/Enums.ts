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

export function colorHexForState(s: State) {
  console.log('sss', s);
  let color = '#';

  switch (s) {
    case State.A_POTENTIAL:
      color += 'C29500';
      break;
    case State.B_ACTUAL:
      color += '60AE00';
      break;
    case State.C_DEFERRED:
      color += '737C90';
      break;
    case State.D_UNATTRACTIVE:
      color += 'F47559';
      break;
    default:
      color += '000';
      break;
  }

  return color;
}