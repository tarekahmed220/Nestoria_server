import app from "./app.js";
import mongoose from "mongoose"; //{ MongoClient } from "mongodb";

// const uri ="mongodb+srv://mearnitihend:ouBOJce5skCEPMyF@cluster0.srsptgb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const uri =
  "mongodb+srv://furniture:UogsOX3kWZBupyL9@cluster0.cktsoqh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const dbConnect = () => {
  mongoose
    .connect(uri)
    .then(() => console.log("connected"))
    .catch((e) => console.log(e));
};
