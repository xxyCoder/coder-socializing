export interface pageType {
    page_num: number;
}

export interface FollwerType {
    id: number;
    viewer_id: number
}

export enum categories {
    note = 'note',
    like = 'like',
    new = 'new',
    learn = 'learn',
    game = 'game',
    help = 'help',
    food = 'food'
}

export interface NoteCardType {
    id: number;
    title: string;
    posterSrc: string;
    userId: number;
    username: string;
    avatarSrc: string;
    isVideo: boolean;
    isLike: boolean;
    likeCnt: number;
}