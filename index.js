const express = require('express');
const axios = require('axios');
const app = express();

// serve up production assets
app.use(express.static('client/build'));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle evaluate calls
// Using example from docs only seems to work with Oauth?
// https://api.readme.dev/docs/authentication
// Multiple auth tokens were supplied for this endpoint but only a single token is needed.
app.post('/evaluate1', (req, res) => {
    console.log(req.headers)
    console.log(req.body)

    const sdk = require('api')('@alloy-public/v1.0#44e15kliusv4xg');
    sdk.auth('token','secret');
    sdk.postEvaluations()
    .then(({ data }) => console.log(data))
    .catch(err => console.error(err));
    res.json({'success': true})
});


app.post('/evaluate', (req, res) => {
    console.log(req.headers)
    console.log(req.body)

    let auth = btoa('token:secret')
    let url = "https://sandbox.alloy.co/v1/evaluations";
    let data = JSON.stringify(req.body);
    console.log(data)
    let headers = { 
        'content-type': 'application/json',
        'Authorization': 'Basic ' + auth
    };

    axios.post(url, data, {headers: headers
    }).then(function(response) {
            console.log("Success path")
            console.log(response.data)
            res.json(response.data["summary"])
    }).catch(function (error) {
        console.log("Error path")
        if (error.response) {
            console.log('Response:' + error.response.status + ' - ' + error.response.data)
        } else if (error.request) {
            console.log(error.request)
        } else {
            console.log(error.message)
        }
        res.json({'success': false})
    });
});

// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
const path = require('path');
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// if not in production use the port 5000
const PORT = process.env.PORT || 5000;
console.log('server started on port:',PORT);
app.listen(PORT);