import { App } from 'obsidian';
import { Liquid } from 'liquidjs';

import LiquidTemplates from '../main';
import { getTFilesFromFolder } from 'src/utils';

import DateFilter from './filters/date';
import DaysAgo from './filters/days_ago';
import DaysAfter from './filters/days_after';

export function applyCustomFilters(engine: Liquid, plugin: LiquidTemplates) {
  [
    DateFilter,
    DaysAgo,
    DaysAfter
  ].forEach(filter => new filter({ plugin, engine }).register())
}

export function initEngine(app: App, plugin: LiquidTemplates): Liquid {
  const engine = new Liquid({
    fs: {
        readFileSync: (file) => {
          // TODO: implement me
          return "";
        },
        readFile: async (file) => {
          const [fileName, ...folder] = file.split('/').reverse()
          const folderToCheck = [plugin.settings.templatesFolder, ...folder.reverse()].join('/')
          // TODO: find a better way to do this
          const fileObj = getTFilesFromFolder(app, folderToCheck).find(f => f.basename === fileName);
          return app.vault.read(fileObj);
        },
        existsSync: () => {
          return true
        },
        exists: async () => {
          return true
        },
        resolve: (_root, file, _ext) => {
          return file
        }
    },
    extname: '.md',
    greedy: true,
  });
  applyCustomFilters(engine, plugin);
  return engine;
}
