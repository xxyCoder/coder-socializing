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
