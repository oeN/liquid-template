import { Liquid, FilterImplOptions } from 'liquidjs';

import LiquidTemplates from '../../main';

export default class BaseFilter {
  readonly plugin: LiquidTemplates;
  readonly engine: Liquid;
  readonly filterName: string = 'base_filter';
  handler: FilterImplOptions;

  constructor(plugin: LiquidTemplates, engine: Liquid) {
    this.plugin = plugin;
    this.engine = engine;

    this.register();
  }

  register(): void {
    this.engine.registerFilter(this.filterName, this.handler);
  }
}
