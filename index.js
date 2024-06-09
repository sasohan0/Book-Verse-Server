const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("initial success");
});
app.listen(port, () => {
  console.log("connected to", port);
});
//mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzny3yl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const itemsCollection = client.db("book-verse").collection("items");

    app.get("/tools", async (req, res) => {
      const query = {};
      const cursor = itemsCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    //addItem

    app.post("/inventory", async (req, res) => {
      const addedItem = req.body;
      const result = await itemsCollection.insertOne(addedItem);
      res.send(result);
    });

    //itemDetail

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await itemsCollection.findOne(query);
      res.send(item);
    });

    //updateQuantity

    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const newItem = req.body;

      const query = { _id: ObjectId(id) };
      updatedQuantity = { $set: { quantity: newItem.quantity } };
      const options = { upsert: true };
      const result = await itemsCollection.updateOne(
        query,
        updatedQuantity,
        options
      );
      res.send(result);
    });

    //deleteItem

    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });

    //userItems

    app.get("/userItems/:email", async (req, res) => {
      const email = req.params.email;

      const query = { user: email };

      const cursor = itemsCollection.find(query);
      const userItems = await cursor.toArray();
      res.send(userItems);
    });

    console.log("connected to mongoDB");
  } finally {
  }
}
run().catch(console.dir);
