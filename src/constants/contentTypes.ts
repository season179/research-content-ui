export const CONTENT_TYPES = {
    TWEET: "tweet",
    BLOG: "blog",
    NEWSLETTER: "newsletter",
    LINKEDIN: "linkedin",
} as const;

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

// Type guard to check if a string is a valid ContentType
export const isContentType = (value: string): value is ContentType => {
    return Object.values(CONTENT_TYPES).includes(value as ContentType);
};
