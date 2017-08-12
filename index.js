const fs = require('fs');
const express = require('express');
const showdown = require('showdown');

const mdConverter = new showdown.Converter();
const app = express();

const port = 3000;

app.get('/', function(req, res) {
    res.send(`
        Hello world!!!
        <br>
        <pre>
            ${JSON.stringify(process.env, null, 2)}
        </pre>
    `);
});

app.get('/blog/:postId', function(req, res, next) {
    const { postId } = req.params;
    fs.readFile(`./blog/${postId}.md`, 'utf-8', (err, data) => {
        if (err) {
            next();
        } else {
            res.send(mdConverter.makeHtml(data));
        }
    });
});

app.use((req, res, next) => {
    res.send('404');
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});
