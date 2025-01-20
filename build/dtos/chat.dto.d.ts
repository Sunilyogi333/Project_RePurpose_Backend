export declare class SendMessageDTO {
    message: string;
    senderId: string;
    receiverId: string;
    productId?: string;
}
export declare class GetMessagesDTO {
    productId: string;
    senderId?: string;
    receiverId?: string;
}
