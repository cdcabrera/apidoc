/*
 * apidoc
 * https://apidocjs.com
 *
 * Authors:
 * Peter Rottmann <rottmann@inveris.de>
 * Nicolas CARPi @ Deltablot
 * Copyright (c) 2013 inveris OHG
 * Licensed under the MIT license.
 */
import { ca } from './ca.mjs';
import { cs } from './cs.mjs';
import { de } from './de.mjs';
import { es } from './es.mjs';
import { fr } from './fr.mjs';
import { it } from './it.mjs';
import { nl } from './nl.mjs';
import { pl } from './pl.mjs';
import { ptBr } from './pt_br.mjs';
import { ro } from './ro.mjs';
import { ru } from './ru.mjs';
import { tr } from './tr.mjs';
import { vi } from './vi.mjs';
import { zhCn } from './zh_cn.mjs';

/**
 * Language localization
 *
 * Keys are ISO 639-1 language codes or locale identifiers
 * (e.g., 'en', 'fr', 'zh_cn'). Values are the corresponding localization
 * objects.
 *
 * - `ca`: Localization for Catalan.
 * - `cn`: Localization for Simplified Chinese (alias to `zhCn`).
 * - `cs`: Localization for Czech.
 * - `de`: Localization for German.
 * - `es`: Localization for Spanish.
 * - `en`: Localization for English (default to an empty object as fallback).
 * - `fr`: Localization for French.
 * - `it`: Localization for Italian.
 * - `nl`: Localization for Dutch.
 * - `pl`: Localization for Polish.
 * - `pt`: Localization for Brazilian Portuguese (alias to `ptBr`).
 * - `pt_br`: Localization for Brazilian Portuguese (alias to `ptBr`).
 * - `ro`: Localization for Romanian.
 * - `ru`: Localization for Russian.
 * - `tr`: Localization for Turkish.
 * - `vi`: Localization for Vietnamese.
 * - `zh`: Localization for Simplified Chinese (alias to `zhCn`).
 * - `zh_cn`: Localization for Simplified Chinese (alias to `zhCn`).
 *
 * @type {{[key: string]: {
 *   "Allowed values:": string,
 *         "Compare all with predecessor": string,
 *         "compare changes to:": string,
 *         "compared to": string,
 *         "Default value:": string,
 *         Description: string,
 *         Field: string,
 *         General: string,
 *         "Generated with": string,
 *         Name: string,
 *         "No response values.": string,
 *         optional: string,
 *         Parameter: string,
 *         "Permission:": string,
 *         Response: string,
 *         Send: string,
 *         "Send a Sample Request": string,
 *         "show up to version:": string,
 *         "Size range:": string,
 *         "Toggle navigation": string,
 *         Type: string,
 *         url: string,
 *         Copy: string,
 *         "Press Ctrl+C to copy": string,
 *         "copied!": string
 * }}}
 */
const locales = {
  ca: ca,
  cn: zhCn,
  cs: cs,
  de: de,
  es: es,
  en: {},
  fr: fr,
  it: it,
  nl: nl,
  pl: pl,
  pt: ptBr,
  pt_br: ptBr,
  ro: ro,
  ru: ru,
  tr: tr,
  vi: vi,
  // for chinese, allow cn, zh and zh_cn
  zh: zhCn,
  zh_cn: zhCn
};

/**
 * A string representing the two-letter language code determined from the user's browser settings. For
 * example, "en", "fr", or "pl".
 *
 * The `lang` variable retrieves the browser's language preference using the `window.navigator.language` property
 * and defaults to 'en-GB' if no language setting is available. The language code is converted to lowercase
 * and truncated to the first two characters, providing a standardized format for identifying the browser's
 * primary language in ISO 639-1 format.
 *
 * @type {string}
 */
const lang = (window.navigator.language ?? 'en-GB').toLowerCase().substr(0, 2);

let locale = locales[lang] || locales.en;

/**
 * Translates given text based on current locale settings.
 *
 * @param {string} text - Text to be translated.
 * @returns {string} Translated text if a translation exists; otherwise, the original text.
 */
function __(text) {
  const index = locale[text];

  if (index === undefined) {
    return text;
  }

  return index;
}

/**
 * Set the application language to the specified language code.
 *
 * @param {string} language - Language code to set. Must be a valid key within the "locales" object.
 * @throws {Error} Throws an error if the provided language code is not valid.
 */
function setLanguage(language) {
  if (!Object.prototype.hasOwnProperty.call(locales, language)) {
    throw new Error(`Invalid value for language setting! Available values are ${Object.keys(locales).join(',')}`);
  }
  locale = locales[language];
}

export { __, lang, locale, setLanguage };
