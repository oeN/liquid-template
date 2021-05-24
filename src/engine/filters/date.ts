import { addDays, format, subDays } from 'date-fns';

import BaseFilter from './base_filter';

export default class DateFiler extends BaseFilter {
  filterName = 'date';

  handler = (givenValue: number | string, dateFormat?: string): string | number => {
    const dateToFormat = (typeof givenValue === 'number')
      ? givenValue
      : this.parseDate(givenValue)
    const formatToUse = dateFormat || this.plugin.settings.dateFormat;

    try {
      return format(dateToFormat, formatToUse)
    } catch (e) {
      if (!(e instanceof RangeError)) throw e;
    }

    return givenValue;
  }

  parseDate = (stringToParse: string): Date => {
    if(['now', 'today'].includes(stringToParse)) return new Date;
    if(stringToParse === 'yesterday') return subDays(Date.now(), 1);
    if(stringToParse === 'tomorrow') return addDays(Date.now(), 1);
    // try to parse the given string
    return new Date(Date.parse(stringToParse));
  }
}
