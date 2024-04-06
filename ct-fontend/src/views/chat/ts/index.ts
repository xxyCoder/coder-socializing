import { Direction, MessageStatus } from "@/components/chat";

export interface IMessageBar {
    content: string;
    status: MessageStatus;
    dir: Direction;
    sendDate: number;
}
