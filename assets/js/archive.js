(function () {
  var dataNode = document.getElementById("archive-index");
  var list = document.getElementById("report-list");
  if (!dataNode || !list) return;

  var records;
  try {
    records = JSON.parse(dataNode.textContent);
  } catch (err) {
    return;
  }
  var byId = {};
  records.forEach(function (record) { byId[record.id] = record; });

  var els = {
    q: document.getElementById("q"),
    company: document.getElementById("company"),
    root: document.getElementById("root-category"),
    triggerType: document.getElementById("trigger-type"),
    clearBtn: document.getElementById("clear-filters"),
    shown: document.getElementById("shown-count"),
    hint: document.getElementById("filter-hint"),
    empty: document.getElementById("empty"),
    kinds: Array.prototype.slice.call(document.querySelectorAll("#kind-filters [data-kind]")),
    companyChips: Array.prototype.slice.call(document.querySelectorAll("[data-company-chip]")),
    kindChips: Array.prototype.slice.call(document.querySelectorAll("[data-kind-chip]")),
    rootChips: Array.prototype.slice.call(document.querySelectorAll("[data-root-chip]")),
    triggerChips: Array.prototype.slice.call(document.querySelectorAll("[data-trigger-chip]")),
    sorts: Array.prototype.slice.call(document.querySelectorAll(".sort-btn"))
  };

  var state = {
    q: "",
    company: "",
    kind: "",
    root: "",
    triggerType: "",
    sort: "date",
    dir: "desc"
  };

  function haystack(record) {
    return [
      record.company, record.title, record.kind, record.date, record.duration,
      record.root_category, (record.root_categories || []).join(" "),
      record.trigger_type, (record.trigger_types || []).join(" "), record.trigger, record.scope,
      record.symptoms, record.detection, record.mitigation, record.direct,
      record.completeness || "", record.impact || "", record.root || "", record.text || ""
    ].join("\n").toLowerCase();
  }

  function matches(record) {
    if (state.company && record.company !== state.company) return false;
    if (state.kind && record.kind !== state.kind) return false;
    if (state.root && (record.root_categories || [record.root_category]).indexOf(state.root) === -1) return false;
    if (state.triggerType && (record.trigger_types || [record.trigger_type]).indexOf(state.triggerType) === -1) return false;
    if (!state.q) return true;
    return haystack(record).indexOf(state.q.toLowerCase()) !== -1;
  }

  function textOf(record, key) {
    if (key === "date") return record.date_sort || "";
    if (key === "title") return record.title || "";
    if (key === "company") return record.company || "";
    if (key === "kind") return record.kind || "";
    if (key === "duration") return record.duration || "";
    if (key === "trigger") return record.trigger_type || "";
    if (key === "root") return record.root_category || "";
    return "";
  }

  function compare(a, b) {
    if (state.sort === "date") {
      if (a.date_unknown !== b.date_unknown) return a.date_unknown ? 1 : -1;
      if (a.date_sort !== b.date_sort) {
        return (a.date_sort < b.date_sort ? -1 : 1) * (state.dir === "asc" ? 1 : -1);
      }
      return a.company.localeCompare(b.company, "zh");
    }
    var cmp = textOf(a, state.sort).localeCompare(textOf(b, state.sort), "zh");
    if (!cmp) cmp = a.title.localeCompare(b.title, "zh");
    return cmp * (state.dir === "asc" ? 1 : -1);
  }

  function syncPressed() {
    els.kinds.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-kind") === state.kind ? "true" : "false");
    });
    els.kindChips.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-kind-chip") === state.kind ? "true" : "false");
    });
    els.companyChips.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-company-chip") === state.company ? "true" : "false");
    });
    els.rootChips.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-root-chip") === state.root ? "true" : "false");
    });
    els.triggerChips.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-trigger-chip") === state.triggerType ? "true" : "false");
    });
    els.sorts.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-sort") === state.sort ? "true" : "false");
    });
  }

  function render() {
    var visible = records.filter(matches).sort(compare);
    var visibleIds = {};
    visible.forEach(function (record) { visibleIds[record.id] = true; });
    var rows = {};
    Array.prototype.forEach.call(list.children, function (row) {
      rows[row.getAttribute("data-id")] = row;
    });
    visible.forEach(function (record) {
      var row = rows[record.id];
      if (!row) return;
      row.hidden = false;
      list.appendChild(row);
    });
    records.forEach(function (record) {
      if (visibleIds[record.id]) return;
      var row = rows[record.id];
      if (!row) return;
      row.hidden = true;
      list.appendChild(row);
    });
    if (els.shown) els.shown.textContent = String(visible.length);
    if (els.empty) els.empty.hidden = visible.length !== 0;
    var hints = [];
    if (state.q) hints.push("关键词「" + state.q + "」");
    if (state.company) hints.push("公司 " + state.company);
    if (state.kind) hints.push(state.kind);
    if (state.root) hints.push("根因类别 " + state.root);
    if (state.triggerType) hints.push("导火索类型 " + state.triggerType);
    if (els.hint) els.hint.textContent = hints.length ? "· 当前筛选：" + hints.join(" / ") : "";
    syncPressed();
  }

  var timer = null;
  if (els.q) {
    els.q.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.q = els.q.value.trim();
        render();
      }, 120);
    });
  }
  if (els.company) els.company.addEventListener("change", function () { state.company = els.company.value; render(); });
  if (els.root) els.root.addEventListener("change", function () { state.root = els.root.value; render(); });
  if (els.triggerType) els.triggerType.addEventListener("change", function () { state.triggerType = els.triggerType.value; render(); });
  els.kinds.forEach(function (button) {
    button.addEventListener("click", function () {
      state.kind = button.getAttribute("data-kind") || "";
      render();
    });
  });
  els.kindChips.forEach(function (button) {
    button.addEventListener("click", function () {
      var kind = button.getAttribute("data-kind-chip") || "";
      state.kind = state.kind === kind ? "" : kind;
      render();
    });
  });
  els.companyChips.forEach(function (button) {
    button.addEventListener("click", function () {
      var company = button.getAttribute("data-company-chip") || "";
      state.company = state.company === company ? "" : company;
      if (els.company) els.company.value = state.company;
      render();
    });
  });
  els.rootChips.forEach(function (button) {
    button.addEventListener("click", function () {
      var root = button.getAttribute("data-root-chip") || "";
      state.root = state.root === root ? "" : root;
      if (els.root) els.root.value = state.root;
      render();
    });
  });
  els.triggerChips.forEach(function (button) {
    button.addEventListener("click", function () {
      var triggerType = button.getAttribute("data-trigger-chip") || "";
      state.triggerType = state.triggerType === triggerType ? "" : triggerType;
      if (els.triggerType) els.triggerType.value = state.triggerType;
      render();
    });
  });
  els.sorts.forEach(function (button) {
    button.addEventListener("click", function () {
      var key = button.getAttribute("data-sort");
      if (state.sort === key) state.dir = state.dir === "asc" ? "desc" : "asc";
      else {
        state.sort = key;
        state.dir = key === "date" ? "desc" : "asc";
      }
      render();
    });
  });
  if (els.clearBtn) {
    els.clearBtn.addEventListener("click", function () {
      state.q = "";
      state.company = "";
      state.kind = "";
      state.root = "";
      state.triggerType = "";
      state.sort = "date";
      state.dir = "desc";
      if (els.q) els.q.value = "";
      if (els.company) els.company.value = "";
      if (els.root) els.root.value = "";
      if (els.triggerType) els.triggerType.value = "";
      render();
    });
  }

  render();
})();
