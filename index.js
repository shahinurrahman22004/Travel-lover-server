const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 5000;
const cors = require('cors');

require('dotenv').config();

//middileware -----------
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uysgw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect();
        const database = client.db('travelLovers');
        const serviceCollection = database.collection('Services');


    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Runnig the site');
})
app.listen(port, () => {
    console.log('Server is Running At port', port);
})