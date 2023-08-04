const { ObjectId } = require("mongodb");
const verifyJWT = require("./verifyJWT");
module.exports = patchMethods = (app, userCollections, classesCollections) => {
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

    // update sit number of a class 
    app.patch("/course/:id", async(req, res) => {
        const {sitNumber} = req.body;
        const id = req.params.id;

        const query = {_id: new ObjectId(id)};
        const option = {upsert: true};
        const update = {
            $set: {
                sitNumber: parseInt(sitNumber) - 1,
            }
        }
        const result = await classesCollections.updateOne(query, update, option);
        console.log(result);
        res.send(result);
    })
} 