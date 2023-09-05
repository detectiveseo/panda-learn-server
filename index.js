const express = require("express");
const cors = require("cors");
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const Stripe = require('stripe');
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);


const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3300;


 // genarete clint secrate for stripe 
 app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;
    const amount = price * 100;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ['card']
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send("Error creating payment intent");
    }

})


app.post("/jwt", async (req, res) => {
    const body = req.body;  
    const tokenKey = process.env.TOKEYN_KEY;
    const token = jwt.sign(body, tokenKey, { expiresIn: 60 * 60 });
    res.send(token);
  })
  

function verifyJWT(req, res, next){
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send("unautorization access")
    }
    const fromClintSideToken = authorization.split(" ")[1]
    jwt.verify(fromClintSideToken, process.env.TOKEYN_KEY, (err, decoded) => {
        if (err) {
            return res.status(402).send(err)
        }
        req.decoded = decoded;
        next();
    })}


const uri = `mongodb+srv://detectiveseo1:xy5fM44o21BUnTv1@cluster0.76wfrxb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



app.get("/", (req, res) => {
    res.send("server in runing")
})

    async function run() {
        try {
            // await client.connect();
            // await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");

            // database collections 
            const userCollections = client.db("USER").collection("users");
            const classesCollections = client.db("COURSE").collection("classes")
            const paymentCollections = client.db("PAYMENT").collection("paid");
            const paymentHistoryCollections = client.db("PAYMENT").collection("CoursePayment");
;

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

            // get all classes
            app.get("/all-course", async (req, res) => {
                const key = req.query.keys;
                let query = {};
                if (key) {
                    query = { name: { $regex: key, $options: "i" } }
                }
                const result = await classesCollections.find(query).toArray();
                res.send(result);
            })


            //get single class 
            app.get("/course/", async (req, res) => {
                const id = req.query.id;
                const query = { _id: new ObjectId(id) };
                const result = await classesCollections.findOne(query);
                res.send(result);
            })

            //get cartItems
            app.get("/cart-items", async(req, res) => {
                const items = req.query.items;
                let query = {};
                if(items){
                    const itemIds = items.map(itemId => new ObjectId(itemId));
                    query = {_id: { $in: itemIds }}
                    const result = await classesCollections.find(query).toArray();
                    res.send(result);
                }else{
                    res.send([])
                }
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

            // get my classes 
            app.get("/my-classes", verifyJWT, async (req, res) => {
                const email = req.decoded?.email;
                const paidCourse = await paymentCollections.find({ email: email }, { projection: { courseId: 1, _id: 0 } }).toArray();
                const courseIds = paidCourse.map(item => item.courseId);
                const query = { _id: { $in: courseIds.map(id => new ObjectId(id)) } }
                const result = await classesCollections.find(query).toArray();
                res.send(result);
            })

            // get payment history 
            app.get("/payment-history", verifyJWT, async (req, res) => {
                const email = req.decoded?.email;
                const paidCourse = await paymentCollections.find({ email: email }).toArray();
                res.send(paidCourse)
            })

            app.post("/add-new-course", async (req, res) => {
                const body = req.body;
                const result = await classesCollections.insertOne(body);
                res.send(result);
                console.log(result)
            })


            //stripe payment method
            app.post("/payments", async (req, res) => {
                const {amount} = req.body;
                const amountSent = amount * 100;
                try {
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: amountSent,
                        currency: "usd",
                        payment_method_types: ['card']
                    });
            
                    res.send({
                        clientSecret: paymentIntent.client_secret,
                    });
                } catch (error) {
                    console.error("Error creating payment intent:", error);
                    res.status(500).send("Error creating payment intent");
                }
            })

            app.post("/add-payment", async(req, res) => {
                const body = req.body;
                const result = await paymentHistoryCollections.insertOne(body);
                res.send(result);
            })

            app.put("/user-role", async (req, res) => {
                const email = req.query.email;
                const existData = req.body;
                const query = { email: email };
                const option = { upsert: true };
                const update = {
                    $set: {
                        image: existData.image,
                        email: email,
                        name: existData.name,
                        address: existData.address,
                        role: existData.role,
                    }
                }
                const result = await userCollections.updateOne(query, update, option)
                console.log(result);
                res.send(result);
            });

            app.patch("/role/:id", verifyJWT, async (req, res) => {
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
            app.patch("/course/:id", async (req, res) => {
                const { sitNumber } = req.body;
                const id = req.params.id;

                const query = { _id: new ObjectId(id) };
                const option = { upsert: true };
                const update = {
                    $set: {
                        sitNumber: parseInt(sitNumber) - 1,
                    }
                }
                const result = await classesCollections.updateOne(query, update, option);
                res.send(result);
            })

            app.delete("/user/remove/:id", async (req, res) => {
                const params = req.params.id;
                const query = { _id: new ObjectId(params) }
                const result = await userCollections.deleteOne(query);
                res.send(result);
            })


        } finally {
            //   await client.close();
        }
    }
    run().catch(console.dir);

    app.listen(`${port}`, () => {
        console.log(`this port in runing on this port ${port}`)
    })