export interface CommentNotify {
    noteId: number;
    userId: number;
    username: string;
    avatarSrc: string | null;
    replyContent: string;
    title: string;
    content: string;
    isReply: boolean;
}
