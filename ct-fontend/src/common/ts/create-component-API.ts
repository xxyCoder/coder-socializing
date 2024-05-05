import { Component, createApp } from "vue";
import router from "@/router";

export function createComponentAPI(component: Component, props = {}, tag = 'div', id = 'toast') {
  const div = document.getElementById(id) ?? document.createElement(tag)
  div.id = id
  const componentInstance = createApp(component, props);
  componentInstance.use(router).mount(div)
  document.body.appendChild(div)

  return componentInstance._instance
}