import { Request, Response } from 'express';
import { CategoryService } from '../../services/category/category.service';
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    getCategoryById(req: Request, res: Response): Promise<void>;
    createCategory(req: Request, res: Response): Promise<void>;
    updateCategory(req: Request, res: Response): Promise<void>;
    deleteCategory(req: Request, res: Response): Promise<void>;
    listAllCategories(req: Request, res: Response): Promise<void>;
    findCategoriesByField(req: Request, res: Response): Promise<void>;
    addSubcategory(req: Request, res: Response): Promise<void>;
    removeSubcategory(req: Request, res: Response): Promise<void>;
}
