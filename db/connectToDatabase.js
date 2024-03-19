import mongoose from "mongoose";

const connectToDatabase = () => {
  mongoose
    .connect(process.env.MONGO_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("Connected to DataBase"))
    .catch((err) => {
      console.log(err + "Failed to Connect to DataBase");
    });
};

export default connectToDatabase;
