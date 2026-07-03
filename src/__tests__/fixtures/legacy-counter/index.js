import { defineComponent } from "marko-widgets";

import template from "./template.marko";

export default defineComponent({
  template,
  getInitialState() {
    return { count: 0 };
  },

  increment() {
    this.setState("count", this.state.count + 1);
  },
});
