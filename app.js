(function () {
  "use strict";

  const tree = window.DECISION_TREE;
  if (!tree || !tree.nodes || !tree.startNode) {
    document.body.innerHTML = "<p style='font-family: sans-serif; padding: 24px'>Ошибка: файл data.js не загрузился.</p>";
    return;
  }

  const $ = (selector) => document.querySelector(selector);
  const on = (element, event, handler) => {
    if (element) element.addEventListener(event, handler);
  };

  const els = {
    app: $("#app"),
    versionLabel: $("#versionLabel"),
    modeLabel: $("#modeLabel"),
    steps: $("#steps"),
    badge: $("#badge"),
    progressBar: $("#progressBar"),
    questionScreen: $("#questionScreen"),
    resultScreen: $("#resultScreen"),
    eyebrow: $("#eyebrow"),
    questionTitle: $("#questionTitle"),
    questionHint: $("#questionHint"),
    optionsGrid: $("#optionsGrid"),
    bottomActions: $("#bottomActions"),
    backButton: $("#backButton"),
    nextHintButton: $("#nextHintButton"),
    restartButton: $("#restartButton"),
    mobileBack: $("#mobileBack"),
    mobileRestart: $("#mobileRestart"),
    themeToggle: $("#themeToggle"),
    themeText: $("#themeText"),
    resultStatus: $("#resultStatus"),
    resultCard: $("#resultCard"),
    resultCode: $("#resultCode"),
    resultTitle: $("#resultTitle"),
    resultDescription: $("#resultDescription"),
    resultNote: $("#resultNote"),
    pathList: $("#pathList"),
    copyButton: $("#copyButton"),
    telegramButton: $("#telegramButton"),
    reportButton: $("#reportButton"),
    searchOpenButton: $("#searchOpenButton"),
    searchOpenButtonMobile: $("#searchOpenButtonMobile"),
    searchCloseButton: $("#searchCloseButton"),
    searchPanel: $("#searchPanel"),
    articleSearchInput: $("#articleSearchInput"),
    articleSearchResults: $("#articleSearchResults"),
    toast: $("#toast")
  };

  let tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  const REPORT_GROUP_URL = "https://t.me/+d69IL3kvxSEwYzgy";

  let currentNodeId = tree.startNode;
  let history = [];
  let toastTimer = null;
  let searchIndex = [];

  const iconMap = {
    user: "<path d='M20 21a8 8 0 0 0-16 0'></path><circle cx='12' cy='7' r='4'></circle>",
    supplier: "<path d='M3 7h18'></path><path d='M6 7v13h12V7'></path><path d='M9 11h6'></path><path d='M9 15h6'></path>",
    sales: "<path d='M4 19V5'></path><path d='M4 19h16'></path><path d='M8 15l3-3 3 2 5-7'></path>",
    automation: "<path d='M12 3v4'></path><path d='M12 17v4'></path><path d='M3 12h4'></path><path d='M17 12h4'></path><circle cx='12' cy='12' r='5'></circle>",
    box: "<path d='M21 8l-9-5-9 5 9 5 9-5z'></path><path d='M3 8v8l9 5 9-5V8'></path><path d='M12 13v8'></path>",
    service: "<path d='M14 7l3 3'></path><path d='M5 19l7-7'></path><path d='M13 5l6 6-8 8H5v-6z'></path>",
    client: "<circle cx='9' cy='8' r='4'></circle><path d='M17 11a4 4 0 1 0-3-6'></path><path d='M3 21a6 6 0 0 1 12 0'></path><path d='M16 19a5 5 0 0 1 5 2'></path>",
    team: "<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path><circle cx='9' cy='7' r='4'></circle><path d='M22 21v-2a4 4 0 0 0-3-3.87'></path><path d='M16 3.13a4 4 0 0 1 0 7.75'></path>",
    warehouse: "<path d='M3 21V8l9-5 9 5v13'></path><path d='M9 21v-8h6v8'></path><path d='M9 10h6'></path>",
    constructor: "<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-5.6 5.6a2.1 2.1 0 1 1-3-3l5.6-5.6a6 6 0 0 1 7.9-7.9z'></path>",
    office: "<path d='M3 21h18'></path><path d='M5 21V7l8-4v18'></path><path d='M19 21V11l-6-4'></path><path d='M8 9h2'></path><path d='M8 13h2'></path><path d='M8 17h2'></path>",
    truck: "<path d='M10 17h4V5H2v12h3'></path><path d='M14 17h1'></path><path d='M19 17h3v-6l-3-4h-5'></path><circle cx='7.5' cy='17.5' r='2.5'></circle><circle cx='17.5' cy='17.5' r='2.5'></circle>",
    people: "<path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path><circle cx='9' cy='7' r='4'></circle><path d='M23 21v-2a4 4 0 0 0-3-3.87'></path>",
    doc: "<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path><path d='M14 2v6h6'></path><path d='M8 13h8'></path><path d='M8 17h6'></path>",
    megaphone: "<path d='M3 11v3a2 2 0 0 0 2 2h3l7 4V5L8 9H5a2 2 0 0 0-2 2z'></path><path d='M19 8a5 5 0 0 1 0 8'></path>",
    dots: "<circle cx='5' cy='12' r='1.5'></circle><circle cx='12' cy='12' r='1.5'></circle><circle cx='19' cy='12' r='1.5'></circle>",
    inbound: "<path d='M12 3v12'></path><path d='M7 10l5 5 5-5'></path><path d='M5 21h14'></path>",
    outbound: "<path d='M12 21V9'></path><path d='M7 14l5-5 5 5'></path><path d='M5 3h14'></path>",
    plane: "<path d='M22 2L11 13'></path><path d='M22 2l-7 20-4-9-9-4 20-7z'></path>",
    location: "<path d='M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z'></path><circle cx='12' cy='10' r='3'></circle>",
    split: "<path d='M4 7h4a4 4 0 0 1 4 4v6'></path><path d='M12 17l-3-3'></path><path d='M12 17l3-3'></path><path d='M20 7h-4a4 4 0 0 0-4 4'></path>",
    building: "<path d='M3 21h18'></path><path d='M6 21V4h12v17'></path><path d='M9 8h1'></path><path d='M14 8h1'></path><path d='M9 12h1'></path><path d='M14 12h1'></path><path d='M9 16h1'></path><path d='M14 16h1'></path>",
    study: "<path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'></path><path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'></path>",
    spark: "<path d='M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z'></path><path d='M19 15l.9 3.1L23 19l-3.1.9L19 23l-.9-3.1L15 19l3.1-.9L19 15z'></path>",
    gift: "<path d='M20 12v10H4V12'></path><path d='M2 7h20v5H2z'></path><path d='M12 22V7'></path><path d='M12 7H7.5A2.5 2.5 0 1 1 10 4.5c0 1.5 2 2.5 2 2.5z'></path><path d='M12 7h4.5A2.5 2.5 0 1 0 14 4.5c0 1.5-2 2.5-2 2.5z'></path>",
    shield: "<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'></path>"
  };

  function init() {
    els.versionLabel.textContent = `Версия ${tree.version || "1.0"}`;
    loadTelegramScript();
    initTelegram();
    restoreTheme();
    buildSearchIndex();
    bindEvents();
    render();
  }


  function loadTelegramScript() {
    if (window.Telegram && window.Telegram.WebApp) {
      tg = window.Telegram.WebApp;
      initTelegram();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.onload = () => {
      tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
      initTelegram();
      updateButtons(getNode());
    };
    script.onerror = () => {
      // В обычном браузере Telegram API не нужен, поэтому ошибка загрузки безопасно игнорируется.
    };
    document.head.appendChild(script);
  }

  function initTelegram() {
    if (!tg) return;
    try {
      tg.ready();
      tg.expand();
      hideTelegramMainButton();
      if (typeof tg.onEvent === "function") {
        tg.onEvent("viewportChanged", hideTelegramMainButton);
        tg.onEvent("themeChanged", hideTelegramMainButton);
      }
      document.body.classList.add("telegram-mode");
    } catch (error) {
      console.warn("Telegram WebApp init skipped", error);
    }
  }

  function hideTelegramMainButton() {
    if (!tg || !tg.MainButton) return;
    try {
      const button = tg.MainButton;
      if (typeof button.hideProgress === "function") button.hideProgress();
      if (typeof button.disable === "function") button.disable();
      if (typeof button.setText === "function") button.setText(" ");
      if (typeof button.setParams === "function") {
        button.setParams({ is_visible: false, is_active: false, text: " " });
      }
      if (typeof button.hide === "function") button.hide();
      window.setTimeout(() => {
        try {
          if (typeof button.hide === "function") button.hide();
          if (typeof button.disable === "function") button.disable();
        } catch (error) {
          // Безопасно игнорируем: это только скрытие служебной кнопки Telegram.
        }
      }, 250);
    } catch (error) {
      console.warn("Telegram MainButton hide skipped", error);
    }
  }

  function bindEvents() {
    on(els.backButton, "click", goBack);
    on(els.mobileBack, "click", goBack);
    on(els.restartButton, "click", restart);
    on(els.mobileRestart, "click", restart);
    on(els.copyButton, "click", copyResult);
    on(els.themeToggle, "click", toggleTheme);
    on(els.telegramButton, "click", sendToTelegram);
    on(els.reportButton, "click", reportError);
    on(els.searchOpenButton, "click", openSearch);
    on(els.searchOpenButtonMobile, "click", openSearch);
    on(els.searchCloseButton, "click", closeSearch);
    on(els.articleSearchInput, "input", renderSearchResults);
    window.addEventListener("keydown", handleHotkeys);
  }

  function handleHotkeys(event) {
    if (event.key === "Escape" && !els.searchPanel.hidden) {
      closeSearch();
      return;
    }
    if (event.key === "Escape") goBack();
    if (event.key.toLowerCase() === "r" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      restart();
    }
  }

  function getNode(id = currentNodeId) {
    return tree.nodes[id];
  }

  function render() {
    const node = getNode();
    if (!node) {
      showToast("Не найден узел дерева решений");
      return;
    }

    renderSteps(node);
    renderProgress(node);

    if (node.type === "result") {
      renderResult(node);
    } else {
      renderQuestion(node);
    }

    updateButtons(node);
  }

  function renderQuestion(node) {
    switchScreen("question");
    els.eyebrow.textContent = node.eyebrow || "Вопрос";
    els.questionTitle.textContent = node.question;
    els.questionHint.textContent = node.hint || "Выберите наиболее подходящий вариант.";
    els.optionsGrid.innerHTML = "";
    els.optionsGrid.classList.toggle("compact", node.options.length >= 3);

    node.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "option-card";
      button.type = "button";
      button.style.animationDelay = `${index * 35}ms`;
      button.innerHTML = `
        <span class="option-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${iconMap[option.icon] || iconMap.dots}</svg></span>
        <span class="option-copy">
          <strong>${escapeHtml(option.label)}</strong>
          <span>${escapeHtml(option.description || "")}</span>
        </span>
        <span class="option-arrow" aria-hidden="true">→</span>
      `;
      button.addEventListener("click", () => chooseOption(option));
      els.optionsGrid.appendChild(button);
    });
  }

  function renderResult(node) {
    switchScreen("result");
    const isWarning = node.status === "warning";
    els.resultStatus.textContent = isWarning ? "Проверьте" : "Готово";
    els.resultStatus.classList.toggle("warning", isWarning);
    els.resultCard.classList.toggle("warning", isWarning);

    const hasCode = Boolean(node.code);
    const hasDescription = Boolean(node.description);
    const hasNote = Boolean(node.tone);

    els.resultCode.hidden = !hasCode;
    els.resultCode.textContent = node.code || "";
    els.resultTitle.textContent = node.title || node.code || "Результат";
    els.resultDescription.hidden = !hasDescription;
    els.resultDescription.textContent = node.description || "";
    els.resultNote.hidden = !hasNote;
    els.resultNote.textContent = node.tone || "";
    els.pathList.innerHTML = "";

    history.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${escapeHtml(item.question)}</strong>: ${escapeHtml(item.answer)}`;
      els.pathList.appendChild(li);
    });

    els.telegramButton.hidden = false;
    els.reportButton.hidden = false;
  }

  function switchScreen(name) {
    const isResult = name === "result";
    els.questionScreen.classList.toggle("active", !isResult);
    els.resultScreen.classList.toggle("active", isResult);
    els.bottomActions.hidden = isResult;
    if (!isResult) {
      els.reportButton.hidden = true;
      els.telegramButton.hidden = true;
    }
  }

  function chooseOption(option) {
    const node = getNode();
    history.push({
      nodeId: currentNodeId,
      question: node.question,
      answer: option.label,
      next: option.next
    });
    currentNodeId = option.next;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (history.length === 0) {
      showToast("Вы уже в начале");
      return;
    }
    const last = history.pop();
    currentNodeId = last.nodeId;
    closeSearch(false);
    render();
  }

  function restart() {
    history = [];
    currentNodeId = tree.startNode;
    closeSearch(false);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateButtons(node) {
    const canBack = history.length > 0;
    if (els.backButton) els.backButton.disabled = !canBack;
    if (els.mobileBack) els.mobileBack.disabled = !canBack;
  }

  function renderSteps(node) {
    els.steps.innerHTML = "";

    const items = [
      ...history.map((item, index) => ({
        status: "done",
        number: "✓",
        title: truncate(item.answer, 34),
        detail: truncate(item.question, 46)
      }))
    ];

    if (node.type === "result") {
      items.push({
        status: "current",
        number: "✓",
        title: "Результат",
        detail: node.title || node.code || "Готово"
      });
    } else {
      items.push({
        status: "current",
        number: history.length + 1,
        title: node.eyebrow || "Вопрос",
        detail: truncate(node.question, 46)
      });
    }

    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = `step-item ${item.status}`;
      div.innerHTML = `
        <span class="step-dot">${escapeHtml(String(item.number))}</span>
        <span class="step-body">
          <span class="step-title">${escapeHtml(item.title)}</span>
          <span class="step-detail">${escapeHtml(item.detail || "")}</span>
        </span>
      `;
      els.steps.appendChild(div);
    });
  }

  function renderProgress(node) {
    const depth = history.length + (node.type === "result" ? 1 : 0);
    const total = Math.max(depth + longestDistanceToResult(currentNodeId), 1);
    const percent = node.type === "result" ? 100 : Math.min(92, Math.round((depth / total) * 100));
    els.progressBar.style.width = `${percent}%`;
    els.badge.textContent = node.type === "result" ? "Результат" : `Вопрос ${history.length + 1} из ${Math.max(total, history.length + 1)}`;
  }

  function longestDistanceToResult(nodeId, visited = new Set()) {
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);
    const node = getNode(nodeId);
    if (!node || node.type === "result") return 0;
    const distances = node.options.map((option) => 1 + longestDistanceToResult(option.next, new Set(visited)));
    return Math.max(...distances, 1);
  }


  function buildSearchIndex() {
    searchIndex = Object.entries(tree.nodes)
      .filter(([, node]) => node.type === "result")
      .map(([id, node]) => {
        const paths = findPathsToNode(id).map((path) => path.map((item) => item.answer).join(" → "));
        const result = node.title || node.code || "Результат";
        return {
          id,
          result,
          code: node.code || "",
          title: node.title || "",
          text: [result, node.code, node.title, node.description, node.tone, ...paths].filter(Boolean).join(" ").toLowerCase(),
          paths
        };
      })
      .sort((a, b) => a.result.localeCompare(b.result, "ru"));
  }

  function findPathsToNode(targetId) {
    const paths = [];

    function walk(nodeId, path, visited) {
      if (visited.has(nodeId)) return;
      const node = tree.nodes[nodeId];
      if (!node) return;
      if (nodeId === targetId) {
        paths.push(path);
        return;
      }
      if (node.type === "result") return;
      visited.add(nodeId);
      node.options.forEach((option) => {
        walk(option.next, [...path, { question: node.question, answer: option.label, next: option.next }], new Set(visited));
      });
    }

    walk(tree.startNode, [], new Set());
    return paths;
  }

  function openSearch() {
    els.searchPanel.hidden = false;
    els.questionScreen.classList.remove("active");
    els.resultScreen.classList.remove("active");
    els.bottomActions.hidden = true;
    els.badge.textContent = "Поиск";
    els.progressBar.style.width = "100%";
    els.articleSearchInput.focus();
    renderSearchResults();
  }

  function closeSearch(shouldRender = true) {
    if (els.searchPanel.hidden) return;
    els.searchPanel.hidden = true;
    els.articleSearchInput.value = "";
    els.articleSearchResults.innerHTML = "";
    if (shouldRender) render();
  }

  function renderSearchResults() {
    const query = els.articleSearchInput.value.trim().toLowerCase();
    const results = (query
      ? searchIndex.filter((item) => item.text.includes(query))
      : searchIndex
    ).slice(0, 30);

    if (!results.length) {
      els.articleSearchResults.innerHTML = `<div class="empty-search">Ничего не найдено</div>`;
      return;
    }

    els.articleSearchResults.innerHTML = results.map((item) => {
      const path = item.paths[0] || [];
      const pathText = path.length ? path.map((step) => step.answer).join(" → ") : "Путь не найден";
      return `
        <button class="search-result-card" type="button" data-result-id="${escapeHtml(item.id)}">
          <strong>${escapeHtml(item.result)}</strong>
          <span>${escapeHtml(pathText)}</span>
        </button>
      `;
    }).join("");

    els.articleSearchResults.querySelectorAll(".search-result-card").forEach((button) => {
      button.addEventListener("click", () => openSearchResult(button.dataset.resultId));
    });
  }

  function openSearchResult(resultId) {
    const item = searchIndex.find((entry) => entry.id === resultId);
    if (!item) return;
    const path = item.paths[0] || [];
    history = path.map((step) => ({ ...step }));
    currentNodeId = resultId;
    closeSearch(false);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function currentResultText() {
    const node = getNode();
    if (!node || node.type !== "result") return "";
    return node.title || node.code || "";
  }

  async function copyResult() {
    const text = currentResultText();
    if (!text) return;
    await copyText(text);
  }

  function fallbackCopy(text, showSuccess = true) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    if (showSuccess) showToast("Текст скопирован");
  }

  function sendToTelegram() {
    const node = getNode();
    const result = currentResultText();
    if (!node || node.type !== "result" || !result) return;

    const shareText = `Результат: ${result}`;
    const pageUrl = window.location.href.split("#")[0];
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;

    try {
      if (tg && typeof tg.openTelegramLink === "function") {
        tg.openTelegramLink(telegramShareUrl);
      } else {
        window.open(telegramShareUrl, "_blank", "noopener,noreferrer");
      }
      showToast("Открываю Telegram");
    } catch (error) {
      window.location.href = telegramShareUrl;
    }
  }


  async function reportError() {
    const result = currentResultText();
    if (!result) return;

    const reportText = buildReportText(result);
    await copyText(reportText, false);

    try {
      if (tg && typeof tg.openTelegramLink === "function") {
        tg.openTelegramLink(REPORT_GROUP_URL);
      } else {
        window.open(REPORT_GROUP_URL, "_blank", "noopener,noreferrer");
      }
      showToast("Текст сообщения скопирован. Вставьте его в группу и добавьте комментарий.");
    } catch (error) {
      window.location.href = REPORT_GROUP_URL;
    }
  }

  function buildReportText(result) {
    const path = history.map((item) => `${item.question}: ${item.answer}`).join("\n");
    return [
      "Нашёл ошибку в памятке статей расхода.",
      "",
      `Результат: ${result}`,
      "",
      "Путь выбора:",
      path || "Не указан",
      "",
      "Комментарий:",
      ""
    ].join("\n");
  }

  async function copyText(text, showSuccess = true) {
    try {
      await navigator.clipboard.writeText(text);
      if (showSuccess) showToast("Текст скопирован");
      return true;
    } catch (error) {
      fallbackCopy(text, showSuccess);
      return false;
    }
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("show");
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  function restoreTheme() {
    const saved = localStorage.getItem("expense-helper-theme");
    const theme = saved || "light";
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeText(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("expense-helper-theme", next);
    updateThemeText(next);
  }

  function updateThemeText(theme) {
    els.themeText.textContent = theme === "dark" ? "Тёмная тема" : "Светлая тема";
  }

  function truncate(text, max) {
    if (!text || text.length <= max) return text || "";
    return `${text.slice(0, max - 1)}…`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  init();
})();
