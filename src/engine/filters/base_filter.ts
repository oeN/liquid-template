import { Liquid, FilterImplOptions } from 'liquidjs';

import LiquidTemplates from '../../main';

export interface BaseFilterProps {
  engine: Liquid,
  plugin: LiquidTemplates,
  filterName?: string;
}

export class BaseFilter {
  readonly plugin: LiquidTemplates;
  readonly engine: Liquid;
  readonly filterName: string;
  handler: FilterImplOptions;

  constructor({ plugin, engine, filterName }: BaseFilterProps) {
    this.plugin = plugin;
    this.engine = engine;
    this.filterName = filterName;
  }

  register(): void {
    this.engine.registerFilter(this.filterName, this.handler);
  }
}
