import mongoose from "mongoose";

const userCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.UserCategory ||
    mongoose.model("UserCategory", userCategorySchema);
