const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const showdown = require('showdown');

const mdConverter = new showdown.Converter();
const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pg = require('pg');

const conString = process.env.DATABASE_URL;

app.post('/users', function(req, res, next) {
    const { user } = req.body;

    pg.connect(conString, function(err, client, done) {
        if (err) {
            // pass the error to the express error handler
            return next(err);
        }
        client.query(
            'INSERT INTO users (name, age) VALUES ($1, $2);',
            [user.name, user.age],
            function(err, result) {
                done(); //this done callback signals the pg driver that the connection can be closed or returned to the connection pool

                if (err) {
                    // pass the error to the express error handler
                    return next(err);
                }

                res.send(200);
            }
        );
    });
});

app.get('/users', function(req, res, next) {
    pg.connect(conString, function(err, client, done) {
        if (err) {
            // pass the error to the express error handler
            return next(err);
        }
        client.query('SELECT name, age FROM users;', [], function(err, result) {
            done();

            if (err) {
                // pass the error to the express error handler
                return next(err);
            }

            res.json(result.rows);
        });
    });
});

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

app.use((err, req, res, next) => {
    console.log(err, '500 error');
    res.send('500 error');
});

app.listen(port, function() {
    console.log(`App listening on port ${port}!`);
});
