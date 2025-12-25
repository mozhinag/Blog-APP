import mongoose from "mongoose"

export const  connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        return console.log(`mongodb connected${conn.connection.host}`.black.bgGreen.underline.bold)
    } catch (error) {

        console.log(`Error message ${error.message}`.red.bold);
        if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }

    }
}
