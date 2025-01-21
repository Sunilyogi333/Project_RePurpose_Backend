declare class ChatService {
    sendMessage(productId: string, senderId: string, receiverId: string, message: string): Promise<any>;
    getMessagesForProduct(productId: string): Promise<any[]>;
}
declare const _default: ChatService;
export default _default;
