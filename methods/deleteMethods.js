module.exports = deleteMethods = (app, userCollections) => {
    const { ObjectId } = require('mongodb');

    app.delete("/user/remove/:id", async (req, res) => {
        const params = req.params.id;
        const query = { _id: new ObjectId(params) }
        const result = await userCollections.deleteOne(query);
        console.log(result);
        res.send(result);
    })
}