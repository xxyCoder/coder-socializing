export interface NoteCardType {
    id: number;
    title: string;
    poster: string;
    userId: number;
    username: string;
    avatarSrc: string;
}

export interface viewerInfoReq {
    username: string;
    avatarSrc: string;
    intro: string;
    isFollwer: boolean;
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