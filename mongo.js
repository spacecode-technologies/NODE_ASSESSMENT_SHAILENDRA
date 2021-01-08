const mongoose = require("mongoose");

require("dotenv").config();
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGOURI, {useCreateIndex: true, useNewUrlParser: true})
.then(() => console.log('db connection successful.'))
.catch(e => console.log(e));

