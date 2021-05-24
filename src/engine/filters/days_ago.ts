import { subDays } from 'date-fns';

import BaseFilter from './base_filter';

export default class DaysAgo extends BaseFilter {
  filterName = 'days_ago';

  handler = (daysToSub: number): Date => subDays(Date.now(), daysToSub);
}
