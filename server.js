const child_process = require('child_process');
var path = require('path');

var express = require('express');
const bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

const host = '0.0.0.0';
const port = 3000;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/ping', function (req, res) {
    try {
        var ip = req.body.ip;
        // Use WSL to run Linux commands on Windows
        child_process.exec(
            'wsl ping -c 1 127.0.0.' + ip,
            function (error, stdout, stderr) {
                if (error) {
                    console.log('error: ', error);
                    res.send(`<pre>Error: ${error.message}</pre>`);
                } else {
                    res.send(`<pre>${stdout}</pre>`);
                }
            });
    } catch (error) {
        console.log(error);
        res.send(`<pre>Server Error: ${error.message}</pre>`);
    }
});

app.listen(port, host, function () {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('CTF Challenge ready! Try command injection on the ping endpoint.');
    console.log('Using WSL for Linux commands: ls, cat, pwd, etc.');
})