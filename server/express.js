const express = require('express');
const app = express();
const ejs = require('ejs');
const upload = require('./ulties/multer');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const blog = require('./blogs');
const cloudinary = require('./ulties/cloudinary');
const blogModel = require('./blogModels/blogs');
const { findById } = require('./blogModels/blogs');
// set view engine
app.set('view engine', 'ejs');



// middleware
app.use(express.json()); // used to enable json send
app.use(express.urlencoded({extended: true})); // used to get data from req.body
app.use(express.static('public')); // make us to  apply css or scss files to pages



//routes
app.get('/', (req, res) => {
    // res.status(200);
    let allBlog = blogModel.find().sort({updatedAt: -1}).then((reply) => {
    res.render('home', {title: "Home", Blogs: reply});
    }).catch((err) => {
        console.log(err);
    })
});
app.get('/blog', (req, res) => {
    // res.status(200);
    res.redirect('/');
});
app.get('/about', (req, res) => {
    //  res.status(200);
    res.render('about', {title: "About"});
});
app.get('/create', (req, res) => {
    //  res.status(200);
    res.render('create', {title: 'Create-Blog'});
});

app.post('/create', upload.single('image'), async(req, res) => {
    console.log('post received!')
    // console.log(req.file.path);
    if (req.file) {
        let result = await cloudinary.uploader.upload(req.file.path, { folder: "SECONDBLOG" });
    // console.log(result);
     // extract img id and url form cloudinary response in result variable
    let blogImg_id = result.public_id;
    let blogImg_url = result.secure_url;
    // create an object that has all the content in your mongoose schema or model
    const toDb = {
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        blogImg_id: blogImg_id,
        blogImg_url: blogImg_url
    }
    // creating a blog model based on blog schema
    let dbBlog = new blogModel(toDb);
    // save dbBlog to mongodb
    dbBlog.save().then((reply) => {
        // console.log(reply);
        console.log('blog with image created successfully!');
        res.redirect('/');
    }).catch((err) => {
        // console.log(err);
        console.log('an error occured');
    })
    }
    else {
        let todb = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        }

        let dbBlog = new blogModel(todb);
        dbBlog.save().then((reply) => {
            console.log('Blog without image create successfully!');
            res.redirect('/');
        }).catch((err) => {
            console.log(err);
        })
    }
    //  res.json({body: req.body, file: req.file});
    // res.send(req.file);

    // res.send('Blog created Successfully!');
});

app.post('/showUpdate', (req, res) => {
    console.log('an  update req received');
    console.log(req.body.update);
    // get blog to update from db using id from req.body.update
    blogModel.findById(req.body.update).then((reply) => {
        // console.log(reply);
            res.render('update', { title: "Update Blog", blog: reply });

    }).catch((err) => {
        console.log(err);
    })


})
app.post('/delete', upload.single('image'), async(req, res) => {
    console.log('a  delete req received');
    // console.log(req.body.update);
    // get old blog from db
         let oldBlog = await blogModel.findById(req.body.update);
     

    // delete blog from db
    let remove = await blogModel.findByIdAndDelete(oldBlog._id).then((reply) => {
        if (!req.file) {
            console.log('blog without image deleted successfully!');
            res.redirect('/');
        }
    }).catch((err) => {
        console.log(err);
    });

    // delete img from cloudinary and redirect
    if (req.file) {
        let del = cloudinary.uploader.destroy(oldBlog.blogImg_id).then((reply) => {
        console.log('old blog deleted successfully!');
        res.redirect('/');
     })
    }
})
app.post('/update', upload.single('image'), async(req, res) => {
    console.log('a  req to update blog received');
    if (req.file) {
        // console.log('this req has a file');
        // get old blog from db using id
        let oldBlog = await blogModel.findById(req.body.update);
        
        // upload img to cloudinary
        let result = await cloudinary.uploader.upload(req.file.path, { folder: 'SECONDBLG' });

        // extract url and id
        let url = result.secure_url;
        let id = result.public_id;

        // add to meet the blog model
        let todb = {
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
            blogImg_id: id,
            blogImg_url: url
        }

        // upload to db
        let db = await blogModel.findByIdAndUpdate(req.body.update, todb, { new: true });

        // delete the old image from cloudinary and 
        let del = await cloudinary.uploader.destroy(oldBlog.blogImg_id).then((reply) => {
            console.log('old image deleted successfully!');
            res.redirect('/');
       })
    } else {
        // console.log('this req does not have a file');
        // get required item from req.body
        let todb = {
            title: req.body.title,
            author: req.body.author,
            content: req.body.content
        }
        // use todb to update mongo
        blogModel.findByIdAndUpdate(req.body.update, todb, { new: true }).then((reply) => {
            // console.log(reply);
            console.log('blog was update successfully!');
            res.redirect('/');
        }).catch((err) => {
            console.log(err);
        })
    }

    }) 
 

app.get('/:id', (req, res) => { 
    let id = req.params.id;
    blogModel.findById(id).then((reply) => {
    res.render('details', {title: 'Blog-Details', aBlog: reply});
    }).catch((err) => {
        // console.log(err);
    })
});

app.get((req, res) => {
     res.status(404);
    res.render('404', {title: "404"});
});


// functions 
const startServer = async () => {
    try {
        let waitDB = await db();
        // start listen for requests
        app.listen(process.env.PORT || 3555, () => {
            console.log('Listening to requests on port 3555');
        })
        
      } catch (err) {
        console.log(err);
        process.exit(1); 
      }
  }

const db = async () => {
    let connected = mongoose.connect(process.env.CONNECTDB);
    console.log('connection to mongoose DB was Successful!');
    return connected;
}
  
  /// calling functions

startServer();