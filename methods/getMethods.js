const verifyJWT = require("./verifyJWT");

module.exports = getMethods = (app, userCollections) => {

    app.get("/users/:email", async (req, res) => {
        const params = req.params.email;
        const query = { email: params };
        const result = await userCollections.findOne(query);
        res.send(result);
    })

    //get users by filtering
    app.get("/users/role/:type", async (req, res) => {
        const params = req.params.type;
        const query = { role: params };
        const result = await userCollections.find(query).toArray();
        res.send(result)
    })

    
    app.get("/users", verifyJWT, async (req, res) => {
            const result = await userCollections.find().toArray();
            res.send(result)
    })
}