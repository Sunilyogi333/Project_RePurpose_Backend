export declare class CreateCategoryDTO {
    name: string;
    parentCategory?: string;
    isActive?: boolean;
}
export declare class UpdateCategoryDTO {
    name?: string;
    parentCategory?: string;
    isActive?: boolean;
}
export declare class AddSubcategoryDTO {
    subcategoryId: string;
}
export declare class RemoveSubcategoryDTO {
    subcategoryId: string;
}
export declare class FindCategoriesByFieldDTO {
    field: string;
    value: string;
}
