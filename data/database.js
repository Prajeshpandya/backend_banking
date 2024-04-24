import mongoose from "mongoose";

export const connDb = () => {

  mongoose
    .connect(process.env.DATABASE_LINK, { dbName: "Banking" })
    .then((c) => console.log(`DataBase Connected! ${c.connection.host}`))
    .catch((e) => console.log(e));
};
