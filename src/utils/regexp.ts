export const PATTERN_COMMUNE = /^[0-9a-zA-Z-'’ ()]*$/;

export const PATTERN_CP_FR = /^[0-9]{5}$/;

export const PATTERN_EMAIL
  = /^(?![.-])([a-zA-Z0-9_%+.-](?!\.\.))*[a-zA-Z0-9_%+]@(?![.-])([a-zA-Z0-9.-](?!\.\.))*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

export const PATTERN_ADDRESSAGE_VOIE = /^[a-zA-Z0-9-'’() ]*$/;

export const PATTERN_ADDRESSAGE_LIEUDIT = /^[a-zA-Z0-9-'’() ]*$/;

export const PATTERN_NUMERO_CONSULTATION = /^[0-9]{13}[A-Z]{1}[A-Z0-9]{2}|[0-9]{13}[A-Z]{1}|[0-9]{13}$/;

export const PATTERN_NUMERO_CONSULTATION_TO_SEARCH = /^[0-9]{13}[A-Z]{1}[A-Z0-9]{0,2}|[0-9]{13}[A-Z]{0,1}|[0-9]{8,13}$/;

export const PATTERN_NUMERO_CONSULTATION_14 = /^([0-9]{13}[A-Za-z]{1})$/;

export const PATTERN_NUMERO_CONSULTATION_16 = /^[0-9]{13}[A-Z]{1}[A-Za-z0-9]{2}$/;

export const PATTERN_HOURS = /^[0-2]?[0-9](:[0-5][0-9])?$/;

/* 999,99, 777.45, 75 & co */
export const PATTERN_DECIMAL = /^[0-9]{0,3}([,.][0-9]{0,2})?$/;

/* 999,99, 777.45, 75 & co */
export const PATTERN_DISTANCE_ELECTRIQUE = /^[0-9]{0,3}([,.][0-9]{0,2})?$/;

export const REGEX_DDMMYYYY = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/[0-9]{4}$/;

export const REGEX_HHMM = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export function fixPatternAttr(regex: any): string {
  if (regex instanceof RegExp) {
    return regex.toString().slice(1, -1);
  }
  return regex;
}
