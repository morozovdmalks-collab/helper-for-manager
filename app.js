(function () {
  "use strict";

  const tree = window.DECISION_TREE;
  if (!tree || !tree.nodes || !tree.startNode) {
    document.body.innerHTML = "<p style='font-family: sans-serif; padding: 24px'>Ошибка: файл data.js не загрузился.</p>";
    return;
  }

  const $ = (selector) => document.querySelector(selector);

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
    toast: $("#toast")
  };

  let tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  let currentNodeId = tree.startNode;
  let history = [];
  let toastTimer = null;

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
      document.body.classList.add("telegram-mode");
    } catch (error) {
      console.warn("Telegram WebApp init skipped", error);
    }
  }

  function bindEvents() {
    els.backButton.addEventListener("click", goBack);
    els.mobileBack.addEventListener("click", goBack);
    els.restartButton.addEventListener("click", restart);
    els.mobileRestart.addEventListener("click", restart);
    els.copyButton.addEventListener("click", copyResult);
    els.themeToggle.addEventListener("click", toggleTheme);
    els.telegramButton.addEventListener("click", sendToTelegram);
    window.addEventListener("keydown", handleHotkeys);
  }

  function handleHotkeys(event) {
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

    const hasEyebrow = Boolean(node.eyebrow);
    els.eyebrow.hidden = !hasEyebrow;
    els.eyebrow.textContent = node.eyebrow || "";

    els.questionTitle.textContent = node.question;

    const hasHint = Boolean(node.hint);
    els.questionHint.hidden = !hasHint;
    els.questionHint.textContent = node.hint || "";

    els.optionsGrid.innerHTML = "";
    els.optionsGrid.classList.toggle("compact", node.options.length >= 4);

    node.options.forEach((option, index) => {
      const button = document.createElement("button");
      const hasDescription = Boolean(option.description);
      button.className = `option-card${hasDescription ? "" : " no-description"}`;
      button.type = "button";
      button.style.animationDelay = `${index * 35}ms`;
      button.innerHTML = `
        <span class="option-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${iconMap[option.icon] || iconMap.dots}</svg></span>
        <span class="option-copy">
          <strong>${escapeHtml(option.label)}</strong>
          ${hasDescription ? `<span>${escapeHtml(option.description)}</span>` : ""}
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
  }

  function switchScreen(name) {
    const isResult = name === "result";
    els.questionScreen.classList.toggle("active", !isResult);
    els.resultScreen.classList.toggle("active", isResult);
    els.bottomActions.hidden = isResult;
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
    render();
  }

  function restart() {
    history = [];
    currentNodeId = tree.startNode;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateButtons(node) {
    const canBack = history.length > 0;
    els.backButton.disabled = !canBack;
    els.mobileBack.disabled = !canBack;
    els.nextHintButton.textContent = node.type === "result" ? "Готово" : "Выберите вариант →";
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
        title: truncate(node.question, 34),
        detail: ""
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

  function currentResultText() {
    const node = getNode();
    if (!node || node.type !== "result") return "";
    return node.title || node.code || "";
  }

  async function copyResult() {
    const text = currentResultText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Результат скопирован");
    } catch (error) {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("Результат скопирован");
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
