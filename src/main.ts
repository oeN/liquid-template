import { get, isEmpty } from "lodash";
import { Plugin } from "obsidian";

import { LiquidTemplatesSettings, DEFAULT_SETTINGS, LiquidTemplatesSettingsTab } from "./settings";
import TemplateSuggest from "./suggest/template-suggest";

export default class LiquidTemplates extends Plugin {
  public settings: LiquidTemplatesSettings;

  async onload(): Promise<void> {
    console.log('loading liquid templates plugin');
    await this.loadSettings();

    this.addSettingTab(new LiquidTemplatesSettingsTab(this.app, this));

    this.registerEditorSuggest(new TemplateSuggest(this.app, this));
  }

  onunload(): void {
    console.log('unloading liquid templates plugin');
  }


  async loadSettings(): Promise<void> {
    this.settings = this.settingsWithDefault(await this.loadData());
  }

  async saveSettings(): Promise<void> {
    // the templates folder can change
    // this.setupAutosuggest();
    await this.saveData(this.settings);
  }

  settingsWithDefault(savedSettings: LiquidTemplatesSettings): LiquidTemplatesSettings {
    // TODO: improve me
    return {
      templatesFolder: this.getSettingOrDefault(savedSettings, 'templatesFolder'),
      excludeFolders: this.getSettingOrDefault(savedSettings, 'excludeFolders'),
      dateFormat: this.getSettingOrDefault(savedSettings, 'dateFormat'),
      timeFormat: this.getSettingOrDefault(savedSettings, 'timeFormat'),
      autocompleteTrigger: this.getSettingOrDefault(savedSettings, 'autocompleteTrigger'),
    }
  }

  getSettingOrDefault(savedSettings: LiquidTemplatesSettings, settingKey: string, defaultValue?: any): any {
    let currentValue = get(savedSettings, settingKey)
    if (!isEmpty(currentValue)) return currentValue;
    return get(DEFAULT_SETTINGS, settingKey, defaultValue);
  }
}
