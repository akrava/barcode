import { Schema, Document } from "mongoose";
import mongoose from "mongoose";


export interface IManufacture extends Document {
    country_id: mongoose.Types.ObjectId;
    country_code: number;
    code: number;
    name: string;
    description: string;
}

const ManufactureSchema: Schema = new Schema({
    country_id:   { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Country" },
    country_code: { type: Number, required: true },
    code:         { type: Number, required: true },
    name:         { type: String, required: true },
    description:  { type: String, required: false, default: "" }
});

const ManufactureModel = mongoose.model<IManufacture>("Manufacture", ManufactureSchema);

export default ManufactureModel;
