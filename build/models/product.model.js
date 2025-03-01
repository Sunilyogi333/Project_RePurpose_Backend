"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String] },
    partName: {
        type: String,
        enum: ['Interior', 'Exterior'],
    },
    ecoFriendly: {
        type: Boolean,
    },
    materialName: {
        type: String,
        enum: [
            'Elastane',
            'Viscose',
            'Acrylic',
            'Cotton',
            'Lyocell',
            'Polyamide',
            'Nylon',
            'Fiber',
            'Modal',
            'Camel',
            'Linen',
            'Wool',
            'Cupro',
        ],
    },
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true }],
    attributes: [{ name: { type: String }, value: { type: String } }],
    condition: { type: Number, min: 1, max: 5 },
    code: { type: String },
    seller: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    soldTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "Store" },
    soldPrice: { type: Number },
    status: {
        type: String,
        enum: ['AVAILABLE', 'ORDERED', 'SOLD', 'DONATED'],
        default: 'AVAILABLE',
    },
}, { timestamps: true });
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
//# sourceMappingURL=product.model.js.map