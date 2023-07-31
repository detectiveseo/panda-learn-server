const { ObjectId } = require("mongodb");
const verifyJWT = require("./verifyJWT");

module.exports = getMethods = (app, userCollections, classesCollections, paymentCollections) => {

    app.get("/users/:email", async (req, res) => {
        const params = req.params.email;
        const query = { email: params };
        const result = await userCollections.findOne(query);
        res.send(result);
    })

    //get users by filtering
    app.get("/users/role/instructor", async (req, res) => {
        const query = { role: "instructor" };
        const result = await userCollections.find(query).toArray();
        res.send(result)
    })


    app.get("/users", verifyJWT, async (req, res) => {
        const useEmail = req.decoded.email;
        const findUser = { email: useEmail };
        const getAdmin = await userCollections.findOne(findUser);
        if (getAdmin?.role !== "admin") {
            res.status(401).send("unauthorize accesse")
        } else {
            const result = await userCollections.find().toArray();
            res.send(result)
        }
    })


    app.get("/instructor/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id), role: "instructor" };
        const result = await userCollections.find(query).toArray();
        res.send(result);
    })

    //get all classes
    app.get("/all-course", async (req, res) => {
        const result = await classesCollections.find().toArray();
        res.send(result);
    })

    //get single class 
    app.get("/course/", async (req, res) => {
        const id = req.query.id;
        const query = { _id: new ObjectId(id) };
        const result = await classesCollections.findOne(query);
        res.send(result);
    })

    //get enroled user
    app.get("/enroled/:id", verifyJWT, async (req, res) => {
        const exactCoursId = req.params.id;
        const query = { courseId: exactCoursId }
        const getPaidUser = await paymentCollections.findOne(query);
        if (getPaidUser) {
            const paidUserEmail = getPaidUser.email;
            const userEmail = req.decoded.email;
            if (paidUserEmail === userEmail) {
                res.send(true);
            }
            else {
                res.send(false);
            }
        }
        else {
            res.send(false);
        }
    })
}