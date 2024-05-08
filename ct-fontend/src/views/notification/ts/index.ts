import { Direction, MessageStatus } from "@/components/chat";

export interface IMessageBar {
  content: string;
  status: MessageStatus;
  dir: Direction;
  sendDate: number;
}

export interface IMessageList {
  userId: number;
  username: string;
  avatarSrc: string;
  content: string;
  time: number;
  isFollower: boolean;
  unreadCnt: number;
}