import { subDays } from 'date-fns';

import { BaseFilter, BaseFilterProps } from './base_filter';

export default class DaysAgo extends BaseFilter {
  constructor(props: BaseFilterProps) {
    super({ ...props, filterName: 'days_ago' });
  }

  handler = (daysToSub: number): Date => subDays(Date.now(), daysToSub);
}
