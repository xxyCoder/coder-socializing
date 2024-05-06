import { Component, createApp } from "vue";
import router from "@/router";

export function createComponentAPI(component: Component, props = {}, tag = 'div') {
  const div = document.createElement(tag)
  const componentInstance = createApp(component, props);
  componentInstance.use(router).mount(div)
  document.body.appendChild(div)

  return { instance: componentInstance._instance, unmount() { componentInstance.unmount() } }
}