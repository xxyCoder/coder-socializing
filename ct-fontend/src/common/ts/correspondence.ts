import { useNotityCountStore } from "@/store";
import { ip, port } from "@/api/config";

let eventSource
export function useEventSource(id: number) {
    // 建立单向连接
    eventSource = new EventSource(`${ip}:${port}/sse/${id}`)
    eventSource.onmessage = (event) => {
        const { type } = JSON.parse(event.data);
        console.log(event.data)
        if (type === 'notify') {
            const { addCount } = useNotityCountStore()
            addCount()
        }
    }
    eventSource.onerror = (error) => {
        console.error(`sse error: ${error}`)
    }
}