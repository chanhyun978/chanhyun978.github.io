(function () {
  const rawSymbol = Symbol("paper.raw");

  const escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => escapeMap[char]);
  }

  function renderValue(value) {
    if (value === null || value === undefined || value === false) {
      return "";
    }

    if (Array.isArray(value)) {
      return value.map(renderValue).join("");
    }

    if (typeof value === "object" && value[rawSymbol]) {
      return value.value;
    }

    return escapeHtml(value);
  }

  function makeRaw(value) {
    return {
      [rawSymbol]: true,
      value: String(value),
      toString() {
        return this.value;
      },
    };
  }

  function html(strings, ...values) {
    const output = strings.reduce((result, part, index) => {
      const value = index < values.length ? renderValue(values[index]) : "";
      return result + part + value;
    }, "");

    return makeRaw(output);
  }

  function repeat(items, view) {
    return makeRaw(items.map((item, index) => renderValue(view(item, index))).join(""));
  }

  function mount(selector, view) {
    const node = document.querySelector(selector);

    if (!node) {
      throw new Error(`Mount point not found: ${selector}`);
    }

    node.innerHTML = renderValue(view());
  }

  window.PaperFramework = {
    html,
    mount,
    repeat,
  };
})();
