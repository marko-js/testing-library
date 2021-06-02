module.exports = require("marko-widgets").defineComponent({
  template: require("./template.marko"),
  getInitialState() {
    return { count: 0 };
  },

  increment() {
    this.setState("count", this.state.count + 1);
  },
});
