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
  collect = 'collect',
  comment = 'comment',
  new = 'new',
  recommand = 'recommand',
  daily = 'daily',
  help = 'help',
  outfits = 'outfits',
  all = 'all'
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

export interface CommentInfo {
  id: number;
  content: string;
  atUsers: string;
  targetCommentId: number | null;
  createdAt: string;
  replyCnt?: number;
  replyUsername?: string;
  user: {
    id: number;
    username: string;
    avatarSrc: string;
  },
  childs: CommentInfo[]
}

export interface Notify {
  id: number;
  userId: number;
  username: string;
  avatarSrc: string | null;
  noteId?: number | null;
  title?: string;
  rootCommentId: number | null;
  commentId?: number | null;
  replyCommentId?: number | null;
  content?: string;
  replyContent?: string;
  time: Number;
  status: number;
  type: number;
  isDel: boolean;
}
