const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eabl5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const userCollection = client.db('coffeeDB').collection('user');

    // get or read method
    app.get('/coffee', async(req, res) =>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })

    // create or post method
    app.post('/coffee', async(req, res) =>{
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      console.log(result);
      res.send(result)
    })

    // Updated Method
    app.put('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedCoffee = req.body;

      const coffee = {
        $set: {
          name: updatedCoffee.name, 
          quantity: updatedCoffee.quantity, 
          supplier: updatedCoffee.supplier, 
          taste: updatedCoffee.taste, 
          category: updatedCoffee.category, 
          details: updatedCoffee.details, 
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result)
    })

    // Delete Method
    app.delete('/coffee/:id', async (req, res) =>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      console.log(result)
      res.send(result)
    })

    // User related APIS
    app.post('/user', async(req, res) =>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Coffee Making Server is running...')
})

app.listen(port, (req, res) =>{
    console.log(`Coffee Server is Running on Port ${port}`)
})

