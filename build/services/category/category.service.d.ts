import { ICategory } from '../../interfaces/category.interface';
export declare class CategoryService {
    findCategoryById(categoryId: string): Promise<ICategory | null>;
    createCategory(categoryData: Partial<ICategory>): Promise<ICategory>;
    updateCategory(categoryId: string, updateData: Partial<ICategory>): Promise<ICategory | null>;
    deleteCategory(categoryId: string): Promise<void>;
    listAllCategories(): Promise<ICategory[]>;
    findCategoriesByField(field: string, value: any): Promise<ICategory[]>;
    addSubcategory(categoryId: string, subcategoryId: string): Promise<ICategory | null>;
    removeSubcategory(categoryId: string, subcategoryId: string): Promise<ICategory | null>;
}
