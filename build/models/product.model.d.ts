import mongoose from 'mongoose';
import { IProduct } from '../interfaces/product.interface';
declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct> & IProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Product;
