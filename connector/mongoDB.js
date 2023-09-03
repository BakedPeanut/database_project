const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });        
        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("MongoDB connection error: ", err);
    }
};

module.exports = connectMongoDB;
