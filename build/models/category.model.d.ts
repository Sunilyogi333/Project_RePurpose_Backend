import mongoose from 'mongoose';
import { ICategory } from '../interfaces/category.interface';
declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory> & ICategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Category;
