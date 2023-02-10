import mongoose from "mongoose";

export default () => {
  const connect = () => {
    mongoose
      .connect("mongodb://localhost:27017/chattyapp-backend")
      .then(() => {
        console.log("Successfully connected to database.");
      })
      .catch((e) => {
        console.log("Error connecting to database ", e);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};
