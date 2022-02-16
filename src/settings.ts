import { App, PluginSettingTab, Setting } from "obsidian";
import LiquidTemplates from "./main";
import { format } from 'date-fns';

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
  dateFormat: 'yyyy-MM-dd',
  timeFormat: 'k:m',
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
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.templatesFolder)
          .setValue(this.plugin.settings.templatesFolder || DEFAULT_SETTINGS.templatesFolder)
          .onChange(async (value) => {
            this.plugin.settings.templatesFolder = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Exclude folders')
      .setDesc('Name of the folders you want to exclude from the autosuggest menu, relative to the "Templates folder" above. Comma separated values. (useful if you have a "common" or "partial" folder where you store all the partial templates)')
      .addText((text) =>
        text
          .setValue(this.plugin.settings.excludeFolders || DEFAULT_SETTINGS.excludeFolders)
          .onChange(async (value) => {
            this.plugin.settings.excludeFolders = value;
            await this.plugin.saveSettings();
          })
      );

    const dateFormatDesc = document.createDocumentFragment();
    dateFormatDesc.append(
      'Output format for render dates.',
      dateFormatDesc.createEl('br'),
      'For more syntax, refer to ',
      dateFormatDesc.createEl("a", {
				href: "https://date-fns.org/v2.21.3/docs/format",
				text: "format reference",
			}),
      dateFormatDesc.createEl('br'),
      'current format: ',
      dateFormatDesc.createEl('b', {
        cls: 'u-pop',
        text: format(new Date, this.plugin.settings.dateFormat)
      })
    );

    new Setting(containerEl)
      .setName('Date format')
      .setDesc(dateFormatDesc)
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.dateFormat)
          .setValue(this.plugin.settings.dateFormat || DEFAULT_SETTINGS.dateFormat)
          .onChange(async (value) => {
            this.plugin.settings.dateFormat = value;
            await this.plugin.saveSettings();
          })
      );


    const timeFormatDesc = document.createDocumentFragment();
    timeFormatDesc.append(
      'Output format for render time.',
      timeFormatDesc.createEl('br'),
      'For more syntax, refer to ',
      timeFormatDesc.createEl("a", {
				href: "https://date-fns.org/v2.21.3/docs/format",
				text: "format reference",
			}),
      timeFormatDesc.createEl('br'),
      'current format: ',
      timeFormatDesc.createEl('b', {
        cls: 'u-pop',
        text: format(new Date, this.plugin.settings.timeFormat)
      })
    );

    new Setting(containerEl)
      .setName('Time format')
      .setDesc(timeFormatDesc)
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.timeFormat)
          .setValue(this.plugin.settings.timeFormat || DEFAULT_SETTINGS.timeFormat)
          .onChange(async (value) => {
            this.plugin.settings.timeFormat = value;
            await this.plugin.saveSettings();
          })
      );

    const triggerDesc = document.createDocumentFragment();
    triggerDesc.append(
      'Character/s that trigger the autocomplete menu.',
      triggerDesc.createEl('br'),
      triggerDesc.createEl('b', {
        cls: 'u-pop',
        text: 'NOTE: if you change this setting you need to reload Obsidian in order to take action.'
      })
    );
    new Setting(containerEl)
      .setName('Autocomplete trigger')
      .setDesc(triggerDesc)
      .addText((text) =>
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
