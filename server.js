const express = require('express');
const App = express();
const https = require('https')

//api key = d18638c345b87da4ad61fc34cd4b2ce1-us6
// id = 77c9610503


App.use(express.urlencoded({ extended: true }));

App.use(express.static("public"));

App.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

App.post('/', (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us6.api.mailchimp.com/3.0/lists/77c9610503";
    const options = {
        method: "POST",
        auth: "magesh:d18638c345b87da4ad61fc34cd4b2ce1-us6"
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

App.post('/failure', (req, res) => {
    res.redirect('/')
})


App.listen(process.env.PORT || 3000, () => {
    console.log('server listening')
})