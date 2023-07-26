const { ObjectId } = require("mongodb");
const verifyJWT = require("./verifyJWT");
module.exports = patchMethods = (app, userCollections) => {
    // update user
    app.patch("/role/:id", async (req, res) => {
        const role = req.body.role;
        const id = req.params.id;
        console.log("this is the body", role);
        console.log("this is the id from clint side", id);
        const query = { _id: new ObjectId(id) }
        const option = { upsert: true };
        const update = {
            $set: {
                role: role,
            }
        }
        const result = await userCollections.updateOne(query, update, option);
        res.send(result);
    })

} 