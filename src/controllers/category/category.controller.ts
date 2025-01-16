import { Request, Response } from 'express';
import { CategoryService } from '../../services/category/category.service'
import { createResponse } from '../../utils/response';
import { StatusCodes } from '../../constants/statusCodes';
import HttpException from '../../utils/HttpException';
import { injectable } from 'tsyringe';

@injectable()
export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  /**
   * Get a category by ID.
   */
  async getCategoryById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const category = await this.categoryService.findCategoryById(id);
      res.status(StatusCodes.SUCCESS).json(createResponse(true, StatusCodes.SUCCESS, 'Category found', category));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new category.
   */
  async createCategory(req: Request, res: Response): Promise<void> {
    const categoryData = req.body;

    try {
      const newCategory = await this.categoryService.createCategory(categoryData);
      res.status(StatusCodes.CREATED).json(createResponse(true, StatusCodes.CREATED, 'Category created successfully', newCategory));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a category by ID.
   */
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedCategory = await this.categoryService.updateCategory(id, updateData);
      res.status(StatusCodes.SUCCESS).json(createResponse(true, StatusCodes.SUCCESS, 'Category updated successfully', updatedCategory));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a category by ID.
   */
  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await this.categoryService.deleteCategory(id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a list of all categories.
   */
  async listAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.listAllCategories();
      res.status(StatusCodes.SUCCESS).json(createResponse(true, StatusCodes.SUCCESS, 'Categories fetched successfully', categories));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find categories by a specific field.
   */
  async findCategoriesByField(req: Request, res: Response): Promise<void> {
    const { field, value } = req.query;

    if (!field || !value) {
      throw HttpException.BadRequest('Field and value are required');
    }

    try {
      const categories = await this.categoryService.findCategoriesByField(field as string, value);
      res.status(StatusCodes.SUCCESS).json(createResponse(true, StatusCodes.SUCCESS, 'Categories found', categories));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add a subcategory to a category.
   */
  async addSubcategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { subcategoryId } = req.body;

    try {
      const updatedCategory = await this.categoryService.addSubcategory(id, subcategoryId);
      res.status(StatusCodes.SUCCESS).json(createResponse(true, StatusCodes.SUCCESS, 'Subcategory added successfully', updatedCategory));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove a subcategory from a category.
   */
  async removeSubcategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { subcategoryId } = req.body;

    try {
      const updatedCategory = await this.categoryService.removeSubcategory(id, subcategoryId);
      res.status(StatusCodes.SUCCESS).json(createResponse(true, StatusCodes.SUCCESS, 'Subcategory removed successfully', updatedCategory));
    } catch (error) {
      throw error;
    }
  }
}
