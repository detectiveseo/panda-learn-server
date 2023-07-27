const { ObjectId } = require("mongodb");
const verifyJWT = require("./verifyJWT");
module.exports = patchMethods = (app, userCollections) => {
    // update user
    app.patch("/role/:id",verifyJWT, async (req, res) => {
        const role = req.body.role;
        const id = req.params.id;
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