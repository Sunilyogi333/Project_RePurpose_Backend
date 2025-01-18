declare class CloudinaryService {
    uploadImage(localFilePath: string): Promise<any | null>;
    deleteImage(imageUrl: string): Promise<boolean>;
    private extractPublicIdFromUrl;
}
declare const _default: CloudinaryService;
export default _default;
