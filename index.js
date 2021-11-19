const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const odersCollection = database.collection('orders');

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let services;

            if(page){
                services = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                services = await cursor.toArray();
            }
            res.send(services);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        });

        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await odersCollection.insertOne(order);
            res.json(result);
        });

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            let cursor = '';
            if(email){
                const query = { email: email }
                cursor = odersCollection.find(query);
            }else{
                cursor = odersCollection.find({});
            }
            const orders = await cursor.toArray();
            res.json(orders);
        });

        app.put('/orders', async (req, res) => {
            const orderCan = req.query.can;
            const id = req.query.id;
            if (orderCan) {                
                const filter = { _id: ObjectId(id) };
                const updateDoc = { $set: { shipped: 'Canceled' } };
                const result = await odersCollection.updateOne(filter, updateDoc);
                res.json(result);
            }

        });

        app.get('/service/:serviceId', async (req, res) => {
            const serviceId = req.params.serviceId;
            const query = { _id: ObjectId(serviceId) };
            const service = await serviceCollection.findOne(query);
            res.json(service)
        });

        //Get Blogs API
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let blog;

            if(page){
                blog = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                blog = await cursor.toArray();
            }
            res.send(blog);
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