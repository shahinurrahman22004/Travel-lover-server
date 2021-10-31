const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

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
        const blogsCollection = database.collection('blogs')

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;

            if(page){
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray();
            }
            res.send(products);
        });

        //Add BLogs API
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;

            if(page){
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray();
            }
            res.send(products);
        })

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