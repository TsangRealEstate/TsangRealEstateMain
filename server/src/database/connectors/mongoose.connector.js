const mongoose = require("mongoose");
const url = require("url");

class MongoDBConnector {
    constructor() {
        if (!process.env.MONGODB_URI) {
            throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
        }
    }

    async connectMongoDB(mongoURI, options = {}) {
        const connectionOptions = {
            autoIndex: true,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 60000,
            family: 4,
            dbName: "test",
            ...options,
        };

        const mongoDBURI = mongoURI;
        const mongoHost = new url.URL(mongoDBURI).host;

        mongoose.set("strictQuery", true);

        try {
            const connection = await mongoose.connect(mongoDBURI, connectionOptions);
            console.log(`\x1b[32mConnected to MongoDB at ${mongoHost}\x1b[0m`);
            return connection;
        } catch (err) {
            console.error(`\x1b[31mError connecting to MongoDB => ${err}\x1b[0m`);
            throw err;
        }
    }

    async initializeMongoDB() {
        try {
            this.mongooseClient = await this.connectMongoDB(
                process.env.MONGODB_URI,
                {}
            );
        } catch (error) {
            console.error("Error MongoDB Connection");
            throw error;
        }
    }

    getInstance() {
        return this.mongooseClient;
    }
}

const mongoDBInstance = new MongoDBConnector();
module.exports = mongoDBInstance;
