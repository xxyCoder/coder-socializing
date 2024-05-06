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
}

export const enum MessageTag {
  'comment-follow' = 'comment-follow',
  'like-collect' = 'like-collect',
  'self-comment' = 'self-comment'
}