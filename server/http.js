const http = require('http');

const server = http.createServer((req, res) => {
    // console.log('a request made');
    // console.log(req.url);
    // console.log(req.method);
    // routes
    if (req.url == '/') {
        res.write('home');
        res.end();
    }
    if (req.url == '/about') {
        res.write('about');
          res.end();
    }
    if (req.url == '/create') {
        res.write('create-blob');
          res.end();
    }
    // res.write('Sorry, Page not found');
    //   res.end();
});

server.listen('3555', 'localhost', () => {
    console.log('listening to request on port 3555');
})