const express = require("express");
//const cors = require("cors");

const connectDB = require("./db.js");
const uri =
  "mongodb+srv://aledamb:Jhf7tygg1tYjXKhJ@clustertechwebselfiepro.1x9uk.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTechWebSelfieProject";


const app = express()  
const port = 3000;
/*
app.use(cors());
app.use(express.json());
*/

/*
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    await client.connect();
    const userData = await client
      .db()
      .collection("ProfileData")
      .findOne({ username: username, password: password });
    if (userData) {
      res.json({ success: true, userData });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await client.close();
  }
});
*/

connectDB()

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
