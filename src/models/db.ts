import mongoose from "mongoose";

let db = mongoose.createConnection(process.env.MAIN_DB_URI || "", {});

db.once("open", () => console.info("DB connected"));
db.on("error", (error) => console.error(error));
db.on("close", () => console.error("DB disconnected"));
db.on("reconnected", () => console.error("DB recennected"));

export { db };
