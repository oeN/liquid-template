import { addDays } from 'date-fns';

import { BaseFilter, BaseFilterProps } from './base_filter';

export default class DaysAfter extends BaseFilter {
  constructor(props: BaseFilterProps) {
    super({ ...props, filterName: 'days_after' });
  }

  handler = (daysToAdd: number): Date => addDays(Date.now(), daysToAdd);
}
