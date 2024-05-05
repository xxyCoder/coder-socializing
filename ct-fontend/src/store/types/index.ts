export interface NoteInfo {
  commentId: number | null;
  replyCommentId: number | null;
  rootCommentId: number | null;
}

export interface ViewerInfo {
  userId: number;
  username: string;
  avatarSrc: string;
  isFollower: boolean
}

export interface ModNote {
  noteId: number;
  title: string;
  content: string;
  mediaList: string[];
  isVideo: boolean;
  tag: string;
}