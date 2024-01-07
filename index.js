const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.port || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://officeDatabase:iqd95cZaODipbVMn@cluster0.2sgpdc8.mongodb.net/?retryWrites=true&w=majority`;

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
        const airmenCollection = client.db("airmenDB").collection("airmen")
        const civilianCollection = client.db("civilianDB").collection("civilian")

        // end point for airmen database
        app.get("/airmen", async (req, res) => {
            const result = await airmenCollection.find().toArray()
            res.send(result)
        })


        app.post("/airmen", async (req, res) => {
            const airmenData = req.body;
            const result = await airmenCollection.insertOne(airmenData)
            console.log("data from db", airmenData)
            res.send(result)
        })


        app.get("/airmen/:id", async (req, res) => {
            const id = req.params.id;
            const cursor = { _id: new ObjectId(id) }
            const result = await airmenCollection.findOne(cursor);
            res.send(result)
        })

        app.put("/airmen/:id", async (req, res) => {
            const id = req.params.id;
            const loadedAirmen = req.body
            console.log(id, loadedAirmen)
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    indlSvcNo: loadedAirmen.indlSvcNo,
                    rank: loadedAirmen.rank,
                    fName: loadedAirmen.fName,
                    trade: loadedAirmen.trade,
                    section: loadedAirmen.section,
                    doe: loadedAirmen.doe,
                    dop: loadedAirmen.dop,
                    doj: loadedAirmen.doj,
                    mobile: loadedAirmen.mobile,
                    permAdds: loadedAirmen.permAdds,
                    presentAdds: loadedAirmen.presentAdds,
                    spouse: loadedAirmen.spouse,
                    noc: loadedAirmen.noc,
                    photo: loadedAirmen.photo,
                },
            };
            const result = await airmenCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        app.delete("/airmen/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await airmenCollection.deleteOne(query)
            res.send(result)
        })



        app.get("/civilian", async (req, res) => {
            const result = await airmenCollection.find().toArray()
            console.log(result)
            res.send(result)
        })





        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // // // Send a ping to confirm a successful connection
        // // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Your worker datasheet server is running ")
})

app.listen(port, (req, res) => {
    console.log(`Datasheet is running in port : ${port}`)
})