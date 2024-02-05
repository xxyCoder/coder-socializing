export interface NoteCardType {
    id: number;
    title: string;
    posterSrc: string;
    userId: number;
    username: string;
    avatarSrc: string;
    isVideo: boolean;
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