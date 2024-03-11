export interface Notify {
    id: number;
    userId: number;
    username: string;
    avatarSrc: string;
    noteId?: number;
    title?: string;
    commentId?: number;
    replyCommentId?: number;
    content?: string;
    replyContent?: string;
    time: number;
    status: number;
    tinyType: number;
    type: string;
}
