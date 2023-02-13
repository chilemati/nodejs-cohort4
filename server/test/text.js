const aUser = require('./module');
const os = require('os');
const fs = require('fs');



// console.log(aUser);


// let names = 'chile';
// console.log(names);
// let num = [1, 5, 7, 9];
// console.log('num is: ', num);
// console.log(num[2]);

// console.log(os.platform());
// console.log(os.hostname());
// console.log(os.homedir());
// console.log(os.homedir());
// console.log(__dirname);
// console.log(__filename);

// write a file
// fs.writeFile('./blog.txt', 'hello world', (err) => {
//     console.log(err);
//     console.log('file written')
// })

//read a file
// fs.readFile('./blog.txt', (err, data) => {
//     console.log(data.toString());
// })

// let readStream = fs.createReadStream('./blog.txt');
// readStream.on('data', (chunk) => {
//     console.log('****************** A NEW CHUNCK ******************');
//     // console.log(`A CHUNCK ${chunk}`); 
//     console.log(chunk);
// }) 
// console.log(`end of readStrem ${aUser.email}`)
//create folder
fs.mkdir('./blogs', () => {
    console.log(' folder created successfully');
});

// delete folder
// fs.rmdir('./blogs', (err) => {
//     if (err) {
//         console.log(err);  
//     }
//     console.log('folder deleted successfully');
    
// })