import { createApp } from "vue";
import Loading from "./index.vue"

export type toastType = "warn" | "error" | "normal"

export function useLoading() {
    const div = document.createElement("div");
    const componentInstance = createApp(Loading);
    componentInstance.mount(div);
    document.body.appendChild(div);

    return () => {
        componentInstance.unmount();
        document.body.removeChild(div);
    }
}