export interface Reply {
    $key: string,
    reply: string;
    repliedBy: string,
    repliedDate: string,
    likes: number,
    dislikes: number,
    threadID: string;
}