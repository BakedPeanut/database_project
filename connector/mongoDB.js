const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/database_project', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("MongoDB connection error: ", err);
    }
};

module.exports = connectMongoDB;
