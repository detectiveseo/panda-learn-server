module.exports = putMethods = (app, userCollections) => {
    app.put("/user-role", async (req, res) => {
        const email = req.query.email;
        const existData = req.body;
        const query = { email: email };
        const option = { upsert: true };
        const update = {
            $set: {
                email: email,
                name: existData.name,
                role: existData.role,
            }
        }
        console.log(existData)
        const result = await userCollections.updateOne(query, update, option)
        console.log(result);
        res.send(result);
    })
}