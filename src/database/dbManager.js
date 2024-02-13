const mongoose = require('mongoose');

//const dbURI = 'mongodb+srv://admin:admin@cluster0.nfoffur.mongodb.net/?retryWrites=true&w=majority';
const dbURI = 'mongodb://localhost:27017';
mongoose.set("strictQuery", false);
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Base Connectée"))
	.catch((err) => console.log(err));

exports.mongo = mongoose;