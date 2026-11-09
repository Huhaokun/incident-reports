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
    sort: document.getElementById("sort"),
    clearBtn: document.getElementById("clear-filters"),
    shown: document.getElementById("shown-count"),
    hint: document.getElementById("filter-hint"),
    empty: document.getElementById("empty"),
    kinds: Array.prototype.slice.call(document.querySelectorAll("#kind-filters [data-kind]"))
  };

  var state = { q: "", company: "", kind: "", sort: "date-desc" };

  function haystack(record) {
    return [
      record.company, record.title, record.kind, record.date,
      record.completeness || "", record.impact || "", record.root || "",
      record.text || ""
    ].join("\n").toLowerCase();
  }

  function matches(record) {
    if (state.company && record.company !== state.company) return false;
    if (state.kind && record.kind !== state.kind) return false;
    if (!state.q) return true;
    return haystack(record).indexOf(state.q.toLowerCase()) !== -1;
  }

  function compare(a, b) {
    if (state.sort === "date-desc" || state.sort === "date-asc") {
      if (a.date_unknown !== b.date_unknown) return a.date_unknown ? 1 : -1;
      if (a.date_sort !== b.date_sort) {
        var laterFirst = state.sort === "date-desc";
        return (a.date_sort < b.date_sort ? 1 : -1) * (laterFirst ? 1 : -1);
      }
      return a.company.localeCompare(b.company, "zh");
    }
    if (state.sort === "company") {
      var byCompany = a.company.localeCompare(b.company, "zh");
      if (byCompany) return byCompany;
      return a.date_sort < b.date_sort ? 1 : -1;
    }
    return a.title.localeCompare(b.title, "zh");
  }

  function render() {
    var visible = records.filter(matches).sort(compare);
    var visibleIds = {};
    visible.forEach(function (record) { visibleIds[record.id] = true; });

    var cards = {};
    Array.prototype.forEach.call(list.children, function (card) {
      cards[card.getAttribute("data-id")] = card;
    });

    visible.forEach(function (record) {
      var card = cards[record.id];
      if (!card) return;
      card.hidden = false;
      list.appendChild(card);
    });
    records.forEach(function (record) {
      if (visibleIds[record.id]) return;
      var card = cards[record.id];
      if (!card) return;
      card.hidden = true;
      list.appendChild(card);
    });

    if (els.shown) els.shown.textContent = String(visible.length);
    if (els.empty) els.empty.hidden = visible.length !== 0;

    var hints = [];
    if (state.q) hints.push("关键词「" + state.q + "」");
    if (state.company) hints.push("公司 " + state.company);
    if (state.kind) hints.push(state.kind);
    if (els.hint) els.hint.textContent = hints.length ? "· 当前筛选：" + hints.join(" / ") : "";
  }

  function setKind(kind) {
    state.kind = kind;
    els.kinds.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-kind") === kind ? "true" : "false");
    });
    render();
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
  if (els.company) {
    els.company.addEventListener("change", function () {
      state.company = els.company.value;
      render();
    });
  }
  if (els.sort) {
    els.sort.addEventListener("change", function () {
      state.sort = els.sort.value;
      render();
    });
  }
  els.kinds.forEach(function (button) {
    button.addEventListener("click", function () {
      setKind(button.getAttribute("data-kind") || "");
    });
  });
  if (els.clearBtn) {
    els.clearBtn.addEventListener("click", function () {
      state.q = "";
      state.company = "";
      state.kind = "";
      state.sort = "date-desc";
      if (els.q) els.q.value = "";
      if (els.company) els.company.value = "";
      if (els.sort) els.sort.value = "date-desc";
      setKind("");
    });
  }

  render();
})();
