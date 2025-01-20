import { Request, Response } from 'express';
export declare class StoreController {
    createStore(req: Request, res: Response): Promise<void>;
    getStores(req: Request, res: Response): Promise<void>;
    approveStore(req: Request, res: Response): Promise<void>;
    rejectStore(req: Request, res: Response): Promise<void>;
    updateStore(req: Request, res: Response): Promise<void>;
    getStore(req: Request, res: Response): Promise<void>;
}
