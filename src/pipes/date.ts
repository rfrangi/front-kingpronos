import {Pipe, PipeTransform} from '@angular/core';

const MONTH_NAMES = [
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

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: any, format = 'DD/MM/YYYY', defaultValue = ''): string {
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
}
