//importing mongoose
const mongoose = require('mongoose');
//importing fs
const fs = require("fs");
const { stringify } = require('querystring');
//defining mongo uri to connect
const MongoURI = "mongodb+srv://Admin:tp86iUwqfldgcX2H@cluster0.3vmup.gcp.mongodb.net/?retryWrites=true&w=majority"

//defining a mongoose schema that we will have for our documents
const animeSchema = new mongoose.Schema({
    name: String,
    averageScore: String,
    episodes: Number,
    characters: {
        type: [{
            name: { default: "No Name", required: true, type: String },
            image: { default: "https://imgs.search.brave.com/KnBB5eWiA6O1ztN9x-A09Dz0h7wvMG-pU8O5lZ3tSc4/rs:fit:1200:1200:1/g:ce/aHR0cDovL3d3dy5w/dWJsaWNkb21haW5w/aWN0dXJlcy5uZXQv/cGljdHVyZXMvNDAw/MDAvdmVsa2Evd2hp/dGUtZHVjay1pbi1w/b25kLmpwZw", required: false, type: String },
        }],
        default: []
    },
    coverImage: { default: "https://imgs.search.brave.com/KnBB5eWiA6O1ztN9x-A09Dz0h7wvMG-pU8O5lZ3tSc4/rs:fit:1200:1200:1/g:ce/aHR0cDovL3d3dy5w/dWJsaWNkb21haW5w/aWN0dXJlcy5uZXQv/cGljdHVyZXMvNDAw/MDAvdmVsa2Evd2hp/dGUtZHVjay1pbi1w/b25kLmpwZw", required: false, type: String },
});

//creating a mongoose model so that we can control a document
const anime = mongoose.model('Anime', animeSchema);

(async () => {
    console.log("Connecting to MongoDB")
    //connecting to mongodb
    await mongoose.connect(MongoURI)
    console.log("Connected to mongoDB")

    //Reading the file ./e.json
    fs.readFile("./e.json", async (err, data) => {
        //Here err is a Error object and data is a string

        //if a error comes we displaying as a error
        if (err) throw err;

        //creating a variable that is a object that actually converts the plain text into a object
        let parsedData = JSON.parse(data);

        //since that variable is a array we are looping it 
        for (let ani of parsedData) {
            //here ani is a element of anime { ... }
            console.log("Creating anime data for " + ani.title.english)

            let chars = ani.characters.nodes.map(a => {
                return {
                    name: a.name.full,
                    image: a.image.large
                }
            })

            console.log(chars)

            //Creating a new document in anime model
            await anime.create({
                averageScore: ani.averageScore,
                characters: chars,
                coverImage: ani.coverImage.large,
                episodes: ani.episodes,
                name: ani.title.english ? ani.title.english : ani.title.native
            })

            console.log("Successfully created anime data for " + ani.title.english)
        }
    })
})();