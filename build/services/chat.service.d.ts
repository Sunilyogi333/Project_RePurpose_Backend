declare class ChatService {
    sendMessage(senderId: string, receiverId: string, message: string): Promise<any>;
    getMessages(senderId: string, receiverId: string): Promise<any>;
    getAllChats(userId: string): Promise<any[]>;
}
declare const _default: ChatService;
export default _default;
