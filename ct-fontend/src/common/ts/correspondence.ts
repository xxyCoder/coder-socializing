import { ip, port } from "@/api/constant";
import { addNotifyCnt } from "./notify";

let eventSource
export function useEventSource(id: number) {
  // 建立单向连接
  eventSource = new EventSource(`${ip}:${port}/sse/${id}`)
  eventSource.onmessage = (event) => {
    const { type } = JSON.parse(event.data);
    addNotifyCnt(type)
  }
  eventSource.onerror = (error) => {
    console.error(`sse error: ${error}`)
  }
}