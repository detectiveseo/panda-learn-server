module.exports = postMethods = (app, classesCollections) => {
    app.post("/add-new-course", async (req, res) => {
        const body = req.body;
        console.log(body);
        const result = await classesCollections.insertOne(body);
        res.send(result);
        console.log(result)
    })
}