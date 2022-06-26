import "dotenv/config";
import app from "./app";
import { connectDB } from "./db/connect";

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL || "");
		if (process.env.NODE_ENV !== "production") {
			app.listen(port, () =>
				console.log(`Server is listening on port ${port}...`)
			);
		} else {
			app.listen(8080, "0.0.0.0");
		}
	} catch (error) {
		console.log(error);
	}
};

start();
