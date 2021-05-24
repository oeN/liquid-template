import { Plugin } from "obsidian";

import { LiquidTemplatesSettings, DEFAULT_SETTINGS, LiquidTemplatesSettingsTab } from "./settings";
import TemplateSuggest from "./suggest/template-suggest";

export default class LiquidTemplates extends Plugin {
  private autosuggest: TemplateSuggest;
  public settings: LiquidTemplatesSettings;

  async onload(): Promise<void> {
    console.log('loading liquid templates plugin');
    await this.loadSettings();

    this.setupAutosuggest();

    this.addSettingTab(new LiquidTemplatesSettingsTab(this.app, this))
  }

  onunload(): void {
    console.log('unloading liquid templates plugin');
    // remove the autosuggest handler when unloading the plugin
    this.app.workspace.iterateCodeMirrors((cm: CodeMirror.Editor) => {
      cm.off("change", this.autosuggestHandler);
    })
  }

  setupAutosuggest(): void {
		this.autosuggest = new TemplateSuggest(this.app, this);

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			cm.on("change", this.autosuggestHandler);
		});
  }

  autosuggestHandler = (
    cmEditor: CodeMirror.Editor,
    changeObj: CodeMirror.EditorChange
  ): boolean => {
    return this.autosuggest?.update(cmEditor, changeObj);
  };

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({ ...DEFAULT_SETTINGS }, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    this.setupAutosuggest();
    await this.saveData(this.settings);
  }
}
