import { createApp } from "vue";
import Toast from "./index.vue"

export type toastType = "warn" | "error" | "normal"

type Resolve = (value?: unknown) => void

const delayTime = 1500

const div = document.createElement("div");
div.style.cssText = `position: absolute; top: 0; width: 100vw; height: 50vh; display: flex; flex-direction: reverse-column; justify-content: center; align-items: flex-end; user-select: none; z-idnex: -1`
export function useToast(msg: string, type: toastType = "normal") {
  const componentInstance = createApp(Toast, {
    msg,
    type
  });
  componentInstance.mount(div);
  document.body.appendChild(div);
  div.style.setProperty('z-index', '1')

  let _resolve: Resolve | null = null
  setTimeout(() => {
    componentInstance.unmount();
    div.style.setProperty('z-index', '-1')
    _resolve && _resolve()
  }, delayTime);

  return new Promise(resolve => {
    _resolve = resolve
  })
}