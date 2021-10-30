const express = require('express');
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

        //GET API
        app.get('/service', async (req, res) => {
            const cursor = offerCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        })

        //Get api for single data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const offers = await offerCollection.findOne(query)
            res.json(offers)
        })
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