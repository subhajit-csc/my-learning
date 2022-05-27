const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()) // this uses default values
app.use(express.static(process.cwd()+"/dist/"));

const routes = require('./routes/routes.js')(app, fs);

const server = app.listen(3001, () => {
    console.log('listening on port %s...', server.address().port);
});
