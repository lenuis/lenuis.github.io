(() => {
  "use strict";
  const bundle = window.DESKTOP_WORKSPACE_I18N;
  if (!bundle || !bundle.messages) return;
  const storageKey = "desktop-workspace-language";
  const localeNames = {
    auto: "Auto / 自动", "zh-Hans": "简体中文", "zh-Hant": "繁體中文", en: "English", ja: "日本語",
    ko: "한국어", es: "Español", pt: "Português", fr: "Français", de: "Deutsch", th: "ไทย",
    vi: "Tiếng Việt", id: "Bahasa Indonesia", ms: "Bahasa Melayu", fil: "Filipino", it: "Italiano",
    nl: "Nederlands", pl: "Polski", ru: "Русский", tr: "Türkçe", sv: "Svenska"
  };
  const languageLabels = {
    "zh-Hans": "语言", "zh-Hant": "語言", en: "Language", ja: "言語", ko: "언어", es: "Idioma",
    pt: "Idioma", fr: "Langue", de: "Sprache", th: "ภาษา", vi: "Ngôn ngữ", id: "Bahasa",
    ms: "Bahasa", fil: "Wika", it: "Lingua", nl: "Taal", pl: "Język", ru: "Язык", tr: "Dil", sv: "Språk"
  };
  const aliases = {
    zh: "zh-Hans", "zh-cn": "zh-Hans", "zh-sg": "zh-Hans", "zh-hans": "zh-Hans",
    "zh-tw": "zh-Hant", "zh-hk": "zh-Hant", "zh-mo": "zh-Hant", "zh-hant": "zh-Hant",
    tl: "fil", "fil-ph": "fil"
  };
  const supported = Object.keys(bundle.messages);
  const textNodes = [];
  const attributes = [];
  const skipSelector = "script,style,code,pre,[data-i18n-ignore]";
  const titleSource = document.title.trim();
  const description = document.querySelector('meta[name="description"]');
  const descriptionSource = description ? description.content.trim() : "";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    const source = node.nodeValue.trim().replace(/\s+/g, " ");
    if (source && parent && !parent.closest(skipSelector)) textNodes.push({
      node, source, prefix: node.nodeValue.match(/^\s*/)[0], suffix: node.nodeValue.match(/\s*$/)[0]
    });
  }
  document.querySelectorAll("[aria-label],[alt],[placeholder],[title]").forEach((element) => {
    if (element.closest(skipSelector)) return;
    ["aria-label", "alt", "placeholder", "title"].forEach((name) => {
      if (element.hasAttribute(name)) attributes.push({ element, name, source: element.getAttribute(name).trim().replace(/\s+/g, " ") });
    });
  });
  function normalizeLocale(value) {
    if (!value) return null;
    const normalized = value.replace(/_/g, "-").toLowerCase();
    if (aliases[normalized]) return aliases[normalized];
    const exact = supported.find((locale) => locale.toLowerCase() === normalized);
    if (exact) return exact;
    const base = normalized.split("-")[0];
    if (base === "tl") return "fil";
    if (base === "zh") return /(?:hant|tw|hk|mo)/.test(normalized) ? "zh-Hant" : "zh-Hans";
    return supported.includes(base) ? base : null;
  }
  function systemLocale() {
    const preferences = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (const preference of preferences) {
      const locale = normalizeLocale(preference);
      if (locale) return locale;
    }
    return "zh-Hans";
  }
  function requestedLocale() {
    const parameter = new URLSearchParams(location.search).get("lang");
    if (parameter === "auto") return { locale: systemLocale(), mode: "auto" };
    const query = normalizeLocale(parameter);
    if (query) return { locale: query, mode: query };
    let saved;
    try { saved = normalizeLocale(localStorage.getItem(storageKey)); } catch (_) { /* Storage can be disabled. */ }
    return saved ? { locale: saved, mode: saved } : { locale: systemLocale(), mode: "auto" };
  }
  function translate(source, locale) {
    return bundle.messages[locale]?.[source] || bundle.messages.en?.[source] || source;
  }
  function applyLocale(locale) {
    const safeLocale = normalizeLocale(locale) || "zh-Hans";
    document.documentElement.lang = safeLocale === "zh-Hans" ? "zh-CN" : safeLocale === "zh-Hant" ? "zh-TW" : safeLocale;
    document.documentElement.dir = "ltr";
    document.title = translate(titleSource, safeLocale);
    if (description) description.content = translate(descriptionSource, safeLocale);
    textNodes.forEach(({ node, source, prefix, suffix }) => {
      node.nodeValue = prefix + translate(source, safeLocale) + suffix;
    });
    attributes.forEach(({ element, name, source }) => element.setAttribute(name, translate(source, safeLocale)));
    const picker = document.querySelector(".language-picker select");
    if (picker) {
      picker.setAttribute("aria-label", languageLabels[safeLocale] || "Language");
      picker.title = languageLabels[safeLocale] || "Language";
      picker.querySelector('option[value="auto"]').textContent = translate("跟随浏览器", safeLocale);
    }
    window.dispatchEvent(new CustomEvent("desktop-workspace-language-change", { detail: { locale: safeLocale } }));
  }
  function keepLanguageInLinks(mode) {
    // Carry a choice across pages even when browser storage is unavailable.
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || !(/\/$|\.html$/.test(url.pathname))) return;
      url.searchParams.set("lang", mode);
      link.setAttribute("href", url.pathname + url.search + url.hash);
    });
  }
  function useMode(mode, save) {
    const locale = mode === "auto" ? systemLocale() : normalizeLocale(mode);
    if (!locale) return;
    if (save) {
      try {
        if (mode === "auto") localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, mode);
      } catch (_) { /* The URL still preserves the selection for this visit. */ }
      const url = new URL(location.href);
      url.searchParams.set("lang", mode);
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
    applyLocale(locale);
    keepLanguageInLinks(mode);
  }
  function makePicker(mode) {
    const label = document.createElement("label");
    label.className = "language-picker";
    label.dataset.i18nIgnore = "";
    const globe = document.createElement("span");
    globe.className = "language-picker-icon";
    globe.setAttribute("aria-hidden", "true");
    globe.innerHTML = '<svg viewBox="0 0 20 20" focusable="false"><circle cx="10" cy="10" r="7.5"></circle><path d="M2.8 10h14.4M10 2.5c2 2.1 3 4.6 3 7.5s-1 5.4-3 7.5c-2-2.1-3-4.6-3-7.5s1-5.4 3-7.5z"></path></svg>';
    const select = document.createElement("select");
    Object.entries(localeNames).forEach(([value, name]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = name;
      select.append(option);
    });
    select.value = mode;
    select.addEventListener("change", () => {
      useMode(select.value, true);
    });
    label.append(globe, select);
    const nav = document.querySelector(".nav");
    if (nav) nav.append(label);
    else {
      label.classList.add("language-picker-floating");
      document.body.prepend(label);
    }
  }
  const initial = requestedLocale();
  makePicker(initial.mode);
  useMode(initial.mode, false);
  window.addEventListener("popstate", () => {
    const selected = requestedLocale();
    document.querySelector(".language-picker select").value = selected.mode;
    useMode(selected.mode, false);
  });
  window.addEventListener("languagechange", () => {
    if (document.querySelector(".language-picker select").value === "auto") useMode("auto", false);
  });
})();
