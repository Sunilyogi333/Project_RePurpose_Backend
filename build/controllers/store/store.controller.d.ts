import { Request, Response } from 'express';
export declare class StoreController {
    createStoreKYC(req: Request, res: Response): Promise<void>;
    getMyStoreKYC(req: Request, res: Response): Promise<void>;
    getPendingStores(req: Request, res: Response): Promise<void>;
    getStores(req: Request, res: Response): Promise<void>;
    approveStore(req: Request, res: Response): Promise<void>;
    rejectStore(req: Request, res: Response): Promise<void>;
    requestModificationStore(req: Request, res: Response): Promise<void>;
    updateStoreKYC(req: Request, res: Response): Promise<void>;
    getStore(req: Request, res: Response): Promise<void>;
}
