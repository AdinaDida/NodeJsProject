const express = require('express');
const app = express();
const handleJson = require('./handleJson');
const handleCsv = require('./handleCsv');
const handleToken = require('./handleToken');

app.use(express.json());


app.post('/token', (req, res) =>{
    handleToken.handleInformation(req, res);
});


app.post('/api/doctor', handleToken.authenticateToken, (req, res) => {
    if(req.header('Content-Type') === 'application/json'){
        handleJson.handleInformation(req, res);
    }else{
        handleCsv.handleInformation(req, res);
    }
});


app.listen(9999, () => console.log("Listening on port 9999..."));