export const CONTENT_TYPES = {
    TWEET: 'tweet',
    BLOG: 'blog',
    NEWSLETTER: 'newsletter',
    LINKEDIN: 'linkedin',
} as const;

export type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];
