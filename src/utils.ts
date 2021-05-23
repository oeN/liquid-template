import { App, normalizePath, TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import { compact } from 'lodash';
import { Liquid } from "liquidjs";
import { format, parse, subDays } from 'date-fns';

const ALLOWED_EXTENSIONS = ['md']

export function getTFilesFromFolder(app: App, folderName: string, subfoldersToExclude?: string[]): Array<TFile> {
  folderName = normalizePath(folderName);
  let folder = app.vault.getAbstractFileByPath(folderName);
  if (!folder) throw new Error(`${folderName} folder doesn't exist`);
  if (!(folder instanceof TFolder)) throw new Error(`${folderName} is a file, not a folder`);

  const foldersToExclude = subfoldersToExclude && compact(subfoldersToExclude).length > 0
    ? subfoldersToExclude.map(subfolder => [folderName,subfolder].join('/'))
    : [];

  let files: Array<TFile> = [];
  Vault.recurseChildren(folder, (file: TAbstractFile) => {
    if (foldersToExclude.some(toExclude => file.path.startsWith(toExclude))) return;
    if (!(file instanceof TFile)) return;
    if (!ALLOWED_EXTENSIONS.includes(file.extension)) return;

    files.push(file);
  });

  files.sort((a, b) => {
    return a.basename.localeCompare(b.basename);
  });

  return files;
}

function parseDate(stringToParse: string): Date {
  // TODO: find a way to support i18n
  if(['now', 'today'].includes(stringToParse)) return new Date;
  if(stringToParse === 'yesterday') return subDays(Date.now(), 1);
  // try to parse the given string
  return new Date(Date.parse(stringToParse));
}

export function customizeEngine(engine: Liquid, ): Liquid {
  engine.registerFilter('date', (valueToParse, dateFormat) => {
    const dateToFormat = (typeof valueToParse === 'number')
      ? valueToParse
      : parseDate(valueToParse)
    try {
      return format(dateToFormat, dateFormat)
    } catch (e) {
      if (e instanceof RangeError) return valueToParse;
    }
  });

  engine.registerFilter('days_ago', (daysToSub) => {
    return subDays(Date.now(), daysToSub);
  })

  return engine;
}
