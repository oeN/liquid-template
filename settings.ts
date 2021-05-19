import { App, PluginSettingTab, Setting } from "obsidian";
import LiquidTemplates from "./main";

export interface LiquidTemplatesSettings {
  templatesFolder: string;
  excludeFolders: string;
  dateFormat: string;
  timeFormat: string;
  autocompleteTrigger: string;
}

export const DEFAULT_SETTINGS: LiquidTemplatesSettings = {
  templatesFolder: 'templates',
  excludeFolders: "",
  dateFormat: '%Y-%m-%d',
  timeFormat: '%H:%M',
  autocompleteTrigger: ';;'
};

export class LiquidTemplatesSettingsTab extends PluginSettingTab {
  plugin: LiquidTemplates;

  constructor(app: App, plugin: LiquidTemplates) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', {
      text: 'Liquid Templates',
    });

    new Setting(containerEl)
      .setName('Templates folder')
      .setDesc('Folder where to find your templates, it will be used also as root folder for the liquid tags, like the include ones')
      .addMomentFormat((text) =>
        text
          .setDefaultFormat(DEFAULT_SETTINGS.templatesFolder)
          .setValue(this.plugin.settings.templatesFolder)
          .onChange(async (value) => {
            this.plugin.settings.templatesFolder = value || DEFAULT_SETTINGS.templatesFolder;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Exclude folders')
      .setDesc('Name of the folders you want to exclude from the autosuggest menu, relative to the "Templates folder" above. Comma separated values. (useful if you have a "common" or "partial" folder where you store all the partial templates)')
      .addMomentFormat((text) =>
        text
          .setDefaultFormat(DEFAULT_SETTINGS.excludeFolders)
          .setValue(this.plugin.settings.excludeFolders)
          .onChange(async (value) => {
            this.plugin.settings.excludeFolders = value || DEFAULT_SETTINGS.excludeFolders;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Date format')
      .setDesc('Output format for render dates')
      .addMomentFormat((text) =>
        text
          .setDefaultFormat(DEFAULT_SETTINGS.dateFormat)
          .setValue(this.plugin.settings.dateFormat)
          .onChange(async (value) => {
            this.plugin.settings.dateFormat = value || DEFAULT_SETTINGS.dateFormat;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Time format')
      .setDesc('Output format for render time')
      .addMomentFormat((text) =>
        text
          .setDefaultFormat(DEFAULT_SETTINGS.timeFormat)
          .setValue(this.plugin.settings.timeFormat)
          .onChange(async (value) => {
            this.plugin.settings.timeFormat = value || DEFAULT_SETTINGS.timeFormat;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Autocomplete trigger')
      .setDesc('Character/s that trigger the autocomplete menu')
      .addMomentFormat((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.autocompleteTrigger)
          .setValue(this.plugin.settings.autocompleteTrigger || DEFAULT_SETTINGS.autocompleteTrigger)
          .onChange(async (value) => {
            this.plugin.settings.autocompleteTrigger = value.trim();
            await this.plugin.saveSettings();
          })
      );
  }
}
