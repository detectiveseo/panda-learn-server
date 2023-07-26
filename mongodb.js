const deleteMethods = require('./methods/deleteMethods');
const getMethods = require('./methods/getMethods');
const patchMethods = require('./methods/patchMethods');
const putMethods = require('./methods/putMethods');

module.exports = mongodb = (app) => {
    const { MongoClient, ServerApiVersion } = require('mongodb');
    require('dotenv').config()
    const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.76wfrxb.mongodb.net/?retryWrites=true&w=majority`;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    async function run() {
        try {
            await client.connect();
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");

            // database collections 
            const userCollections = client.db("USER").collection("users");
            getMethods(app, userCollections);
            putMethods(app, userCollections);
            patchMethods(app, userCollections);
            deleteMethods(app, userCollections);


        } finally {
            //   await client.close();
        }
    }
    run().catch(console.dir);

}