import { App, TFile } from "obsidian";
import { Liquid } from "liquidjs";
import type PoweredTemplates from "../main";
import CodeMirrorSuggest from "./codemirror-suggest";
import { getTFilesFromFolder, customizeEngine } from "../utils";
import { format } from "date-fns";

interface ITemplateCompletion {
  label: string;
  file?: TFile;
}

// TODO: create a class for the suggestion that implements the ITemplateCompletion and have some
// utility method to render the template
// TODO: generate a proper context and use the defined settings for the date and time format
export default class TemplateSuggest extends CodeMirrorSuggest<ITemplateCompletion> {
  plugin: PoweredTemplates;
  engine: Liquid;

  constructor(app: App, plugin: PoweredTemplates) {
    super(app, plugin.settings.autocompleteTrigger);

    this.plugin = plugin;
    // TODO: move me in a separate class
    this.engine = customizeEngine(new Liquid({
      fs: {
          readFileSync: (file) => {
            // TODO: implement me
            return "";
          },
          readFile: async (file) => {
            const [fileName, ...folder] = file.split('/').reverse()
            const { templatesFolder } = this.plugin.settings;
            const folderToCheck = [templatesFolder, ...folder.reverse()].join('/')
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
    }));
  }

  open(): void {
    super.open();
  }


  getSuggestions(inputStr: string): ITemplateCompletion[] {
    // handle no matches
    const suggestions = this.getTemplateSuggestions(inputStr);
    if (suggestions.length) {
      return suggestions;
    } else {
      return [{ label: inputStr }];
    }
  }

  getTemplateSuggestions(inputStr: string): ITemplateCompletion[] {
    // find the list of files
    // TODO: filter before returning all the files
    const {
      templatesFolder,
      excludeFolders
    } = this.plugin.settings;
    const templates = getTFilesFromFolder(this.app, templatesFolder, excludeFolders.split(','));
    return templates
      .map(file => ({ label: file.basename, file: file }))
      .filter((items) => items.label.toLowerCase().startsWith(inputStr));
  }

  renderSuggestion(suggestion: ITemplateCompletion, el: HTMLElement): void {
    el.setText(suggestion.label);
  }

  async generateContext() {
    const {
      dateFormat,
      timeFormat
    } = this.plugin.settings;

    return {
      // TODO: improve me
      date: format(Date.now(), dateFormat),
      time: format(Date.now(), timeFormat),
      title: await this.app.workspace.getActiveFile().basename,
      default_date_format: dateFormat,
      default_time_format: timeFormat
    }
  }

  async selectSuggestion(
    suggestion: ITemplateCompletion,
    _event: KeyboardEvent | MouseEvent
  ): Promise<void> {
    const head = this.getStartPos();
    const anchor = this.cmEditor.getCursor();
    console.log('--- context', await this.generateContext());

    if (suggestion.file) {
      const templateString = await this.app.vault.read(suggestion.file)

      const rendered = await this.engine.parseAndRender(
        templateString,
        await this.generateContext()
      );
      this.cmEditor.replaceRange(rendered.trim(), head, anchor);
    }
    this.close()
  }
}
