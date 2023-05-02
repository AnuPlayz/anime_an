const mongoose = require("mongoose");
const express = require("express");

//Creating an express app
const app = express();
//MongoDB URI
const MongoURI = "mongodb+srv://Admin:tp86iUwqfldgcX2H@cluster0.3vmup.gcp.mongodb.net/?retryWrites=true&w=majority";

const cors = require('cors');
app.use(cors());

//Middleware for parsing json data from the request body
app.use(express.json());

//Creating a schema for the anime
const animeSchema = new mongoose.Schema({
  name: String,
  averageScore: String,
  episodes: Number,
  characters: {
    type: [
      {
        name: { default: "No Name", required: true, type: String },
        image: {
          default:
            "https://imgs.search.brave.com/KnBB5eWiA6O1ztN9x-A09Dz0h7wvMG-pU8O5lZ3tSc4/rs:fit:1200:1200:1/g:ce/aHR0cDovL3d3dy5w/dWJsaWNkb21haW5w/aWN0dXJlcy5uZXQv/cGljdHVyZXMvNDAw/MDAvdmVsa2Evd2hp/dGUtZHVjay1pbi1w/b25kLmpwZw",
          required: false,
          type: String,
        },
      },
    ],
    default: [],
  },
  coverImage: {
    default:
      "https://imgs.search.brave.com/KnBB5eWiA6O1ztN9x-A09Dz0h7wvMG-pU8O5lZ3tSc4/rs:fit:1200:1200:1/g:ce/aHR0cDovL3d3dy5w/dWJsaWNkb21haW5w/aWN0dXJlcy5uZXQv/cGljdHVyZXMvNDAw/MDAvdmVsa2Evd2hp/dGUtZHVjay1pbi1w/b25kLmpwZw",
    required: false,
    type: String,
  },
});

//Creating a model
const anime = mongoose.model("Anime", animeSchema);

//put da endpoints below
/**
API
GET /api/animes
-> Shows all anime document
-> Add filtering by anime name like add a query/parameter

GET /anime/animes/{id}
-> Shows the anime by the id

POST /api/animes
-> Create a anime document
-> Only authorized users can use this endpoint

POST /api/animes/{id}
-> Edit the anime
-> Only authorized users can use this endpoint 

 */

// The first parameter is the URL path, the second is the function that will run when the path is accessed.
app.get("/", async (req, res) => {
  res.send("<h1>coding with you mom 1212</h1>");
});
const authenticate = (req, res, next) => {
  const token = req.headers.authorization
  //true,use brain sometimes and not google
  if (token !== "urmom") {
    // If not authenticated, return an error response
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Call the next middleware function
  next();
};

module.exports = authenticate;
//u not even using the middleware here
//Making a get request to get all animes
app.get("/api/animes", async (req, res) => {
  //Check if db is connected
  if (!mongoose.connection.readyState === 1) {
    return res.status(500).send("Database not connected");
  }

  //Fetching all animes from the database
  const animes = await anime.find({});

  //Sending the animes as a response
  res.send(animes);
});

//Making a get requst to get a anime with its id
//Example URL: http://localhost:6969/api/animes/spyxfamily
//           portocol | host   |port|   path   |  ID ^^^^
app.get("/api/animes/:id/find", async (req, res) => {
  let { id } = req.params;

  //Check if db is connected
  if (!mongoose.connection.readyState === 1) {
    return res.status(500).send("Database not connected");
  }

  if (!mongoose.isValidObjectId(id))
    return res.send({
      message: "Sorry, Unable to find the anime with that id",
    });

  let anim = await anime.findOne({
    _id: id,
  });

  //Sending the anime as a response
  res.send(
    anim
      ? anim
      : {
        message: "Sorry, Unable to find the anime with that id",
      }
  );
});

app.delete('/api/animes/:id/delete', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    await anime.findByIdAndDelete(id);
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
//this wasnt the endpoint path that i asked u to make
//making a push request to add anime to database
app.post("/api/animes/:id/edit", authenticate, async (req, res) => {
  const { name, averageScore, episodes, coverImage, characters } = req.body;

  let ani = await anime.findOne({ name });
  if (ani) return res.send({ error: "Anime already exists" });

  try {
    ani = await anime.create({
      name,
      averageScore,
      episodes,
      coverImage,
      characters,
    });

    res.send({
      message: "Successfully edited anime",
      anime: ani,
    });
  } catch (e) {
    res.send({ error: e });
  }
});



//Connect to the database
mongoose.connect(MongoURI).then(() => {
  console.log("Connected to the database");
});

//Starting the server on port 3000
app.listen(3000, () => {
  console.log(`Server Started at http://localhost:${3000}`);
});
