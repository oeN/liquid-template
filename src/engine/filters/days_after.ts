import { addDays } from 'date-fns';

import BaseFilter from './base_filter';

export default class DaysAfter extends BaseFilter {
  filterName = 'days_after';

  handler = (daysToSub: number): Date => addDays(Date.now(), daysToSub);
}
