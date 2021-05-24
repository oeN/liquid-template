import { App, normalizePath, TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import { compact } from 'lodash';

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
