export = class {
  increment() {
    const node = (this as any).getEl("value");
    node.textContent = +node.textContent + 1;
  }
};
