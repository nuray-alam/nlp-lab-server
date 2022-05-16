const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//connecting to the database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yqsx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {


    try {
        await client.connect();
        const database = client.db("nlp_lab_db");
        const peoplesCollection = database.collection("peoples");


        // GET API for all Peoples

        app.get('/peoples', async (req, res) => {

            const cursor = peoplesCollection.find({});
            const peoples = await cursor.toArray();
            res.json(peoples)
        })



        //POST API for add new People
        app.post('/addPeople', async (req, res) => {
            const newPeople = req.body;
            const result = await peoplesCollection.insertOne(newPeople);
            res.send(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello from nlp lab database');
})

app.listen(port, () => {
    console.log(`listening at ${port}`);
});