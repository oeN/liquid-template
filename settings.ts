import { App, PluginSettingTab, Setting } from "obsidian";
import LiquidTemplates from "./main";

export interface LiquidTemplatesSettings {
  templatesFolder: string;
  dateFormat: string;
  timeFormat: string;
  autocompleteTrigger: string;
}

export const DEFAULT_SETTINGS: LiquidTemplatesSettings = {
  templatesFolder: 'templates',
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