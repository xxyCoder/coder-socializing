export interface UserInfo {
    userId: number;
    username: string;
    avatarSrc?: string;
    isFollower?: boolean
}

export type NoteCardType = {
    id: number;
    title: string;
    posterSrc: string;
    isVideo: boolean;
    isLike: boolean;
    likeCnt: number;
} & UserInfo

export type NoteInfo = {
    mediaList: string;
    content: string;
    atUserIds: number[];
    isFollower: boolean;
    updateDate: string;
    createDate: string;
    isLike: boolean;
    likeCnt: number;
    isCollect: boolean;
    collectCnt: number;
    tag: string;
} & Exclude<NoteCardType, 'posterSrc' | keyof UserInfo>

export type NoteDetail = {
    user: UserInfo;
    note: NoteInfo
}

export interface viewerInfoReq {
    username: string;
    avatarSrc: string;
    intro: string;
    isFollower: boolean;
    notes: NoteCardType[]
}

export interface CustomComponent {
    component: HTMLInputElement | HTMLTextAreaElement
}

export interface CustomInputComponent {
    component: HTMLInputElement,
    show: () => void;
    hide: () => void;
}

export interface IntercationItemType {
    avatarSrc: string;
    username: string;
    userId: number;
    posterSrc: string;
    noteId: number;
}

export interface Comment {
    id: number;
    content: string;
    atUsers: string;
    targetCommentId: null | number;
    rootCommentId: null | number;
    replies: number;
    createdAt: string;
    user: UserInfo;
    replyUsername: string;
    replyCnt?: number;
}

export interface ReplyInfo {
    targetCommentId: number | null;
    username: string;
    comment: string;
    rootCommentId: number | null;
    replyUserId: number | null;
}
