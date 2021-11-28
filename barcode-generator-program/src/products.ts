import { Schema, Document } from "mongoose";
import mongoose from "mongoose";


export interface IProduct extends Document {
    manufacture_id: mongoose.Types.ObjectId;
    code: number;
    name: string;
    type: string;
    color: string;
    price: number;
}

const ProductSchema: Schema = new Schema({
    manufacture_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Manufacture" },
    code:           { type: Number, required: true },
    name:           { type: String, required: true },
    type:           { type: String, required: true },
    color:          { type: String, required: true },
    price:          { type: Number, required: true }
});

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
