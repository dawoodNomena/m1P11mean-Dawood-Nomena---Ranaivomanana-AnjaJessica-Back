const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://admin:admin@cluster0.nfoffur.mongodb.net/?retryWrites=true&w=majority';
mongoose.set("strictQuery", false);
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Base Connectée"))
	.catch((err) => console.log(err));

exports.mongo = mongoose;