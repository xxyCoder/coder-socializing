export const SEC = 1000

export const MIN = 60 * SEC

export const HOUR = 60 * MIN

export const DAY = 24 * HOUR

export const list = ['推荐', '新闻', '求助', '日常', '穿搭']

export const listMap: Record<string, string> = { '推荐': 'recommand', '新闻': 'new', '求助': 'help', '日常': 'daily', '穿搭': 'outfits' };

export const enum MessageTag {
  'comment-follow' = 'comment-follow',
  'like-collect' = 'like-collect',
  'self-comment' = 'self-comment',
  chat = 'chat'
}