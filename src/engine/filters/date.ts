import { addDays, format, subDays } from 'date-fns';

import { BaseFilter, BaseFilterProps } from './base_filter';

export default class DateFiler extends BaseFilter {
  originalFilter: Function;

  constructor(props: BaseFilterProps) {
    super({ ...props, filterName: 'date' });
    this.originalFilter = this.engine.filters.get('date');
  }

  handler = (givenValue: number | string, dateFormat?: string): string | number => {
    const dateToFormat = (typeof givenValue === 'number')
      ? givenValue
      : this.parseDate(givenValue)
    const formatToUse = dateFormat || this.plugin.settings.dateFormat;

    // TODO: improve or remove me: keep backwards compatibility with the current 0.1.5 version
    if (formatToUse.includes('%')) {
      // TODO: send a notification when using this function
      return this.originalFilter(givenValue, dateFormat);
    }

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
