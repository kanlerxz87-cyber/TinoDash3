/*
  Render smoke test.
  The site has no build step and no bundler, so nothing else catches a wiring break:
  a renamed id in the markup, a control that never fires, or a render path that throws
  would only surface as an empty table in a browser. This harness stubs just enough DOM
  to run the real engine and the real model.js, then asserts that every table filled in
  with a sane number of rows and no "NaN" or "undefined" leaked into the markup.
*/
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const attr = (source, name) => {
  const match = source.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : undefined;
};

// Collect every element that carries an id, plus the values its markup declares.
function parseMarkup(html) {
  const elements = new Map();
  const pattern = /<(select|input|svg|tbody|strong|span|p)\b([^>]*)>/g;
  let match;
  while ((match = pattern.exec(html))) {
    const tag = match[1];
    const attrs = match[2];
    const id = attr(attrs, "id");
    if (!id) continue;
    let value = attr(attrs, "value") ?? "";
    let text = "";
    if (tag === "select") {
      const rest = html.slice(pattern.lastIndex);
      const block = rest.slice(0, rest.indexOf("</select>"));
      const selected = block.match(/<option value="([^"]*)"[^>]*selected/);
      const first = block.match(/<option value="([^"]*)"/);
      value = selected ? selected[1] : first ? first[1] : "";
    }
    if (["strong", "span", "p"].includes(tag)) {
      const rest = html.slice(pattern.lastIndex);
      text = rest.slice(0, rest.indexOf(`</${tag}>`));
    }
    elements.set(id, {
      id,
      tag,
      value,
      checked: /\schecked/.test(attrs),
      innerHTML: "",
      textContent: text,
      attributes: {},
      listeners: [],
      setAttribute(name, val) {
        this.attributes[name] = val;
      },
      addEventListener(type, handler) {
        this.listeners.push({ type, handler });
      },
      closest() {
        return null;
      }
    });
  }
  return elements;
}

function makeDocument(html) {
  const elements = parseMarkup(html);
  const document = {
    body: { dataset: { page: "test" } },
    elements,
    querySelector(selector) {
      if (selector.startsWith("#")) return elements.get(selector.slice(1)) || null;
      const engine = selector.match(/\[data-engine='([a-z]+)'\]/);
      if (engine) return html.includes(`data-engine="${engine[1]}"`) ? { dataset: {} } : null;
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
  return document;
}

function runPage(file, controlValues = {}) {
  const html = read(file);
  const document = makeDocument(html);
  for (const [id, value] of Object.entries(controlValues)) {
    const element = document.elements.get(id);
    assert.ok(element, `${file}: control #${id} is missing from the markup`);
    element.value = value;
    if (typeof value === "boolean") element.checked = value;
  }

  const sandbox = { document, Intl, Math, Number, Object, Array, String, console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(read("assets/engine.js"), sandbox, { filename: "engine.js" });
  assert.ok(sandbox.DDEngine, "engine must register DDEngine on the global object");
  vm.runInContext(read("assets/model.js"), sandbox, { filename: "model.js" });
  return document;
}

const rowCount = (html) => (html.match(/<tr/g) || []).length;

test("paths page: every modelled table fills and no placeholder text leaks", () => {
  const document = runPage("paths.html", {
    scenarioSelect: "crash1929",
    horizonSelect: "10",
    stageSelect: "30",
    taxSelect: "0.33",
    imputedRange: "2",
    vacancyRange: "8"
  });

  const expectations = {
    pathRows: 8,
    rangeRows: 4,
    flipRows: 8,
    stageRows: 12,
    robustRows: 8,
    s121Rows: 8
  };
  for (const [id, expected] of Object.entries(expectations)) {
    const element = document.elements.get(id);
    assert.ok(element, `#${id} must exist in paths.html`);
    assert.ok(element.innerHTML.length > 0, `#${id} must be rendered`);
    assert.equal(rowCount(element.innerHTML), expected, `#${id} row count`);
    assert.ok(!/NaN|undefined|null/.test(element.innerHTML), `#${id} must not contain NaN/undefined/null`);
  }

  const chart = document.elements.get("distributionChart");
  assert.equal(chart.attributes.viewBox, "0 0 940 330");
  assert.equal((chart.innerHTML.match(/<rect/g) || []).length, 8, "one bar per path");
  assert.match(chart.innerHTML, /crash1929|1929/, "chart title names the selected sequence");

  for (const id of ["horizonLabel", "scenarioNote", "valueMode", "stageLabel", "primaryStatus", "imputedValue", "vacancyValue", "rentValue", "saleValue"]) {
    const element = document.elements.get(id);
    assert.ok(element.textContent && element.textContent.trim().length > 0, `#${id} must be written`);
  }
  assert.match(document.elements.get("primaryStatus").textContent, /OFF/i, "exclusion starts off");
});

test("paths page: the section 121 toggle changes the screened status text", () => {
  const document = runPage("paths.html", { primaryToggle: true });
  assert.match(document.elements.get("primaryStatus").textContent, /screened ON/i);
});

test("process page: fee calculator and property-tax projection render", () => {
  const document = runPage("process.html", { feePrice: "2000000", feeCity: true });

  const fees = document.elements.get("feeOutput");
  assert.equal(rowCount(fees.innerHTML), 4, "four fee lines");
  const countyTax = "$" + Math.round((2000000 / 500) * 0.55).toLocaleString("en-US");
  assert.ok(fees.innerHTML.includes(countyTax), "county transfer tax on a 2,000,000 consideration");
  assert.match(fees.innerHTML, /\$6,600/, "city conveyance tax at the published rate");
  assert.ok(!/NaN|undefined/.test(fees.innerHTML), "no placeholder text in the fee table");
  assert.match(document.elements.get("feePriceValue").textContent, /\$2,000,000/);

  const tax = document.elements.get("propTaxRows");
  assert.equal(rowCount(tax.innerHTML), 7, "seven projection years");
  assert.ok(!/NaN|undefined/.test(tax.innerHTML), "no placeholder text in the property-tax table");
});

test("a page without an engine hook does not throw", () => {
  for (const file of ["glossary.html", "sources.html", "review.html", "brief.html", "404.html", "index.html", "questions.html", "assumptions.html"]) {
    const document = makeDocument(read(file));
    const sandbox = { document, Intl, Math, Number, Object, Array, String, console };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(read("assets/engine.js"), sandbox, { filename: "engine.js" });
    assert.doesNotThrow(
      () => vm.runInContext(read("assets/model.js"), sandbox, { filename: "model.js" }),
      `${file} must survive model.js`
    );
  }
});
