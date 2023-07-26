module.exports = jwt = (app) => {
    const jwt = require('jsonwebtoken');

    app.post("/jwt", async (req, res) => {
        const body = req.body;
        const tokenKey = process.env.TOKEYN_KEY;
        const token = jwt.sign(body, tokenKey, { expiresIn: 60 * 60 });
        res.send(token);
    })

}