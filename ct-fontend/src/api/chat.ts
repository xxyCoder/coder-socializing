import instance from "./config";

export const addChatBar = instance.post('/chat/add_chat_bar')
export const getChatList = instance.get<{ chatList: Array<{ avatarSrc: string, username: string, content: string, userId: number, time: number, isFollower: boolean }> }>('/chat/chat_list')
export const getChatContent = instance.get<{ chatList: Array<{ content: string, data: number, id: number }> }>('/chat/chat_content')
