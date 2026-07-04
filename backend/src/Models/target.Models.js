import mongoose, { Model, mongo } from "mongoose";

const targetSchema = new mongoose.Schema({});

const Target = new mongoose.Model("Target", targetSchema);
export default Target;
