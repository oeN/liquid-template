import { App, normalizePath, TAbstractFile, TFile, TFolder, Vault } from "obsidian";

export function getTFilesFromFolder(app: App, folderName: string): Array<TFile> {
  folderName = normalizePath(folderName);
  let folder = app.vault.getAbstractFileByPath(folderName);
  if (!folder) throw new Error(`${folderName} folder doesn't exist`);
  if (!(folder instanceof TFolder)) throw new Error(`${folderName} is a file, not a folder`);

  let files: Array<TFile> = [];
  Vault.recurseChildren(folder, (file: TAbstractFile) => {
    if (file instanceof TFile) {
      files.push(file);
    }
  });

  files.sort((a, b) => {
    return a.basename.localeCompare(b.basename);
  });

  return files;
}
