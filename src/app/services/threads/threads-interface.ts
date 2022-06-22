export interface Threads{
    $key: string;
    title: string;
    subtitle: string;
    replies: string[];
    postedBy: string;
    postedDate: string;
    likes: number;
    dislikes: number;
    neutral: number;
    comments: number;
    threadImage: string;
}