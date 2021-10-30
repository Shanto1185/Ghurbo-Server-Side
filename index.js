const express = require('express'); 6
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oedwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        // console.log('database connected');
        const database = client.db('ghurbo');
        const offerCollection = database.collection('offers');
        // const destinationCollection = database.collection('destination');

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = offerCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        })

        //GET THE DESTINATION  API 
        //  app.get("/destination", async (req, res) => {
        //     const cursor = destinationCollection.find({});
        //     const destination = await cursor.toArray();
        //     res.send(services);
        // });

        //Single Details
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const offers = await offerCollection.findOne(query)
            res.json(offers)
        })

        // POST THE API TO MONGO-DB
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post', service);
            const result = await offerCollection.insertOne(service)
            console.log(result);
            res.send(result);
        });
        // DELET API
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await offerCollection.deleteOne(query);
            console.log("deleting user id ", result);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('i am making a tourism website');
})

app.listen(port, () => {
    console.log('i am running my server in port no', port);
})

//user ghurbodb
// pass 0pqI3JaJ2FcYz6kS