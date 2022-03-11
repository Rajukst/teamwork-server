const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yyhry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("Ms_Online");
    const Courses = database.collection("Courses");
    const CourseOrder = database.collection("CourseOrders");

    // creating add product service
    app.post("/add-course", async (req, res) => {
      const add = req.body;
      const course = await Courses.insertOne(add);
      console.log("getting a new Course", course);
      res.json(course);
      console.log(course);
    });
    app.get("/online-course", async (req, res) => {
      const cursor = Courses.find({});
      const getCourse = await cursor.toArray();
      res.send(getCourse);
      console.log(getCourse);
    });

    app.get("/place-order/:serviceId", async (req, res) => {
      const productId = req.params.serviceId;
      const query = { _id: ObjectId(productId) };
      const getProduct = await Courses.findOne(query);
      console.log("getting product", getProduct);
      res.send(getProduct);
    });

    app.post("/confirmOrder", async (req, res) => {
      const order = req.body;
      const confirmOrder = await CourseOrder.insertOne(order);
      res.json(confirmOrder);
    });
  } finally {
    // client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Team Mate!!! Done Project ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
