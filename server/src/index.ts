import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./db/connect";

dotenv.config();
const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL || "");
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
