import mongoose from "mongoose";
const mongoUrl = process.env.DB_URl || "mongodb://localhost:27017/payment";

export const connectDatabase = () => {
  if (!mongoUrl) {
    return console.log("Mongo URI not provided!");
  }
  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("Connected to MongoDB!!!!!");
    })
    .catch((error) => {
      console.error("Connection error", error);
    });
};
