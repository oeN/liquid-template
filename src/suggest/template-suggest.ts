import {
  App,
  TFile,
  Editor,
  EditorPosition,
  EditorSuggest,
  EditorSuggestContext,
  EditorSuggestTriggerInfo,
  MarkdownView,
} from "obsidian";
import { Liquid } from "liquidjs";
import { format } from "date-fns";

import type PoweredTemplates from "../main";
import { getTFilesFromFolder } from "../utils";
import { initEngine } from "src/engine";

interface ITemplateCompletion {
  label: string;
  file?: TFile;
  inline?: string;
}

// TODO: create a class for the suggestion that implements the ITemplateCompletion and have some
// utility method to render the template
// TODO: generate a proper context and use the defined settings for the date and time format
export default class TemplateSuggest extends EditorSuggest<ITemplateCompletion> {
  plugin: PoweredTemplates;
  engine: Liquid;
  app: App;

  protected cmEditor: Editor;

  private startPos: CodeMirror.Position;
  private triggerPhrase: string;

  constructor(app: App, plugin: PoweredTemplates) {
    super(app);
    this.app = app;

    this.plugin = plugin;
    this.engine = initEngine(app, plugin);
    this.triggerPhrase = this.plugin.settings.autocompleteTrigger;
  }

  open(): void {
    super.open();
  }


  getSuggestions(context: EditorSuggestContext): ITemplateCompletion[] {
    const suggestions = this.getTemplateSuggestions(context.query);
    if (suggestions.length) {
      return suggestions;
    } else {
      return [{ label: context.query, inline: `{{${context.query}}}` }];
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
    const { workspace } = this.app;
    const activeView = workspace.getActiveViewOfType(MarkdownView);

    if (!activeView) return;

    const editor = activeView.editor;
    const head = this.startPos;
    const anchor = editor.getCursor();

    const rendered = await this.renderTemplateSuggestion(suggestion);
    editor.replaceRange(rendered.trim(), head, anchor);
    this.close()
  }

  async renderTemplateSuggestion(suggestion: ITemplateCompletion): Promise<string> {
    let templateString = suggestion.inline
    if (suggestion.file) templateString = await this.app.vault.read(suggestion.file!);
    if (!templateString) return '';

    return this.engine.parseAndRender(
      templateString,
      await this.generateContext()
    );
  }

  onTrigger(cursor: EditorPosition, editor: Editor, file: TFile): EditorSuggestTriggerInfo {
    const lineContents = editor.getLine(cursor.line);

    const match = lineContents
      .substring(0, cursor.ch)
      .match(new RegExp(`(?:^|\s|\W)(${this.triggerPhrase}[^${this.triggerPhrase}]*$)`));

    if (match === null) return null;

    const triggerInfo = this.getTriggerInfo(match, cursor);

    this.startPos = triggerInfo.start;
    this.cmEditor = editor;

    return triggerInfo;
  }

  protected getTriggerInfo(
    match: RegExpMatchArray,
    cursor: EditorPosition
  ): EditorSuggestTriggerInfo {
    return {
      start: this.getStartPos(match, cursor.line),
      end: cursor,
      query: match[1].substring(this.triggerPhrase.length),
    };
  }

  protected getStartPos(match: RegExpMatchArray, line: number): EditorPosition {
    return {
      line: line,
      ch: match.index + match[0].length - match[1].length,
    };
  }
}
