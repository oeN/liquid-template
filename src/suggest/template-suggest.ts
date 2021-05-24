import { App, TFile } from "obsidian";
import { Liquid } from "liquidjs";
import { format } from "date-fns";

import CodeMirrorSuggest from "./codemirror-suggest";
import type PoweredTemplates from "../main";
import { getTFilesFromFolder } from "../utils";
import { initEngine } from "src/engine";

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
    this.engine = initEngine(app, plugin);
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
