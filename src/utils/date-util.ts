// ajoute un nombre de jours à une date sans compter les dimanches
export function addWorkingDays(date: any, days: any): any {
  date = new Date(date); // use a clone
  const DIMANCHE = 0;
  while (days > 0) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== DIMANCHE) {
      days--;
    }
  }
  return date;
}

/**
 * RegExp to test a string for a full ISO 8601 Date
 * Does not do any sort of date validation, only checks if the string is according to the ISO 8601 spec.
 *  YYYY-MM-DDThh:mm:ss
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see: https://www.w3.org/TR/NOTE-datetime
 */
export const REGEX_ISO_8601_FULL: RegExp = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:?\d\d)|Z)?$/i;

export function parseDateIso8601(value: any): any {
  value =	value.replace(/(\d\d)(\d\d)$/, '$1:$2'); // IE ne valide pas les dates sans ":" dans la timezone
  return new Date(value);
}
export function transformDate(value: any, format = 'DD/MM/YYYY', defaultValue = ''): string {
  if (value) {
    const date: any = value instanceof Date ? value : new Date(value);
    if (value === undefined || isNaN(date)) {
      return defaultValue;
    }
    return format
      .replace('HH', date.getHours().toString().replace(/^(\d)$/, '0$1'))
      .replace('H', date.getHours().toString())
      .replace('hh', ((date.getHours() % 12) || 12).toString().replace(/^(\d)$/, '0$1'))
      .replace('h', ((date.getHours() % 12) || 12).toString())
      .replace('mm', date.getMinutes().toString().replace(/^(\d)$/, '0$1'))
      .replace('m', date.getMinutes().toString())
      .replace('ss', date.getSeconds().toString().replace(/^(\d)$/, '0$1'))
      .replace('s', date.getSeconds().toString())

      .replace('YYYY', date.getFullYear().toString())
      .replace('YY', date.getFullYear().toString().substr(2, 2))
      .replace('MM', (date.getMonth() + 1).toString().replace(/^(\d)$/, '0$1'))
      .replace('M', (date.getMonth() + 1).toString())
      .replace('DD', date.getDate().toString().replace(/^(\d)$/, '0$1'))
      .replace('D', date.getDate().toString())

      .replace('JANVIER', MONTH_NAMES[ date.getMonth() ])
      .replace('JAN', MONTH_SHORT_NAMES[ date.getMonth() ])
      .replace('LUNDI', DAY_NAMES[ date.getDay() ])
      .replace('LUN', DAY_SHORT_NAMES[ date.getDay() ]);
  }
  return defaultValue;
}

export function getDebutDate(date: Date): Date {
  const debutDate = new Date(date);
  debutDate.setDate(1);
  debutDate.setHours(0, 0, 0, 1);
  return debutDate;
}

export function getFinDate(date: Date): Date {
  const debutDate  = new Date(date);
  debutDate.setMonth(debutDate.getMonth() + 1);
  debutDate.setDate(0);
  debutDate.setHours(23, 59, 59, 59);
  return debutDate;
}

export function startOfDay(date: any): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function dateToday(): Date {
  return startOfDay(Date.now());
}

export function addDays(date: any, nb: any): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + nb);
  return newDate;
}

export function getMonthCurrent(): string {
  return transformDate(new Date(), 'JANVIER YYYY');
}

export function getDateCurrent(date: Date): string {
  return transformDate(date, 'JANVIER YYYY');
}

export const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
  'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
const MONTH_SHORT_NAMES = [
  'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil',
  'Aout', 'Sept', 'Oct', 'Nov', 'Dec'
];
const DAY_NAMES = [
  'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
];
const DAY_SHORT_NAMES = [
  'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'
];


export function compareDays(d1: any, d2: any): any {
  d1 = startOfDay(d1);
  d2 = startOfDay(d2);
  return d1 - d2;
}

export function countHalfDays(d1: Date, d2: Date): any {
  return (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
}

export function dayDiff(d1: Date, d2: Date): any {
  const d3: number = d1.getTime() / 86400000;
  const d4: number   = d2.getTime() / 86400000;
  return (d4 - d3).toFixed(0);
}
export const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;


