import { createApp } from "vue";
import Toast from "./index.vue"

export type toastType = "warn" | "error" | "normal"

type Resolve = (value?: unknown) => void

const delayTime = 1500

let timer: number | undefined
export function useToast(msg: string, type: toastType = "normal") {
    const div = document.createElement("div");
    const componentInstance = createApp(Toast, {
        msg,
        type
    });
    componentInstance.mount(div);
    document.body.appendChild(div);

    clearTimeout(timer);
    let _resolve: Resolve | null = null
    timer = setTimeout(() => {
        componentInstance.unmount();
        document.body.removeChild(div);
        timer = undefined
        _resolve && _resolve()
    }, delayTime);

    return new Promise(resolve => {
        _resolve = resolve
    })
}