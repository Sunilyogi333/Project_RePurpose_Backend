import Category from '../../models/category.model';
import { ICategory } from '../../interfaces/category.interface';
import HttpException from '../../utils/HttpException';
import { Types } from 'mongoose';

export class CategoryService {
  /**
   * Find a category by its ID.
   */
  async findCategoryById(categoryId: string): Promise<ICategory | null> {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw HttpException.NotFound('Category not found');
    }
    return category;
  }

  /**
   * Create a new category.
   */
  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    const existingCategory = await Category.findOne({ name: categoryData.name });
    if (existingCategory) {
      throw HttpException.Conflict('Category with this name already exists');
    }

    const newCategory = new Category(categoryData);
    await newCategory.save();
    return newCategory;
  }

  /**
   * Update an existing category by its ID.
   */
  async updateCategory(
    categoryId: string,
    updateData: Partial<ICategory>
  ): Promise<ICategory | null> {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      throw HttpException.NotFound('Category not found');
    }

    return updatedCategory;
  }

  /**
   * Delete a category by its ID.
   */
  async deleteCategory(categoryId: string): Promise<void> {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      throw HttpException.NotFound('Category not found');
    }
  }

  /**
   * List all categories.
   */
  async listAllCategories(): Promise<ICategory[]> {
    return Category.find();
  }

  /**
   * Find categories by a specific field (e.g., parentCategory, type).
   */
  async findCategoriesByField(field: string, value: any): Promise<ICategory[]> {
    const query: Record<string, any> = {};
    query[field] = value;
    return Category.find(query);
  }

// Add a subcategory to a category.
async addSubcategory(categoryId: string, subcategoryId: string): Promise<ICategory | null> {
  const category = await this.findCategoryById(categoryId);
  if (!category) {
    throw HttpException.NotFound('Category not found');
  }

  // Convert string to ObjectId
  const subcategoryObjectId = new Types.ObjectId(subcategoryId);

  // Only add if it doesn't already exist
  if (!category.subcategories.includes(subcategoryObjectId)) {
    category.subcategories.push(subcategoryObjectId);
    await category.save();
  }

  return category;
}

// Remove a subcategory from a category.
async removeSubcategory(categoryId: string, subcategoryId: string): Promise<ICategory | null> {
  const category = await this.findCategoryById(categoryId);
  if (!category) {
    throw HttpException.NotFound('Category not found');
  }

  // Convert string to ObjectId
  const subcategoryObjectId = new Types.ObjectId(subcategoryId);

  // Filter out the subcategory
  category.subcategories = category.subcategories.filter(
    (id) => id.toString() !== subcategoryObjectId.toString()
  );
  await category.save();

  return category;
}

}
