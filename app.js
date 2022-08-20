// jshint esversion:8
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
const cool = require('cool-ascii-faces');

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.get('/cool', (req, res) => res.send(cool()));



main().catch(err => console.log(err));

async function main() {
    
    await mongoose.connect('mongodb+srv://keshav_vyas:keshav_vyas@cluster0.pcpksd6.mongodb.net/posts');
    // await mongoose.connect('mongodb://localhost:27017/posts');
    console.log("Database has started...");

    const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempus congue leo sit amet accumsan. Morbi hendrerit in nisi vitae varius. Sed varius velit eget rutrum finibus. Integer eu nibh dui. Suspendisse posuere lectus a leo elementum, mollis tristique odio semper. Maecenas quis elit nulla. Maecenas hendrerit orci ut congue maximus. Morbi quis nibh interdum, tincidunt quam ac, efficitur libero. In hac habitasse platea dictumst. Fusce sit amet elit accumsan tortor laoreet feugiat eget vitae lectus. Nullam maximus facilisis tellus et dignissim.";
    const aboutContent = "Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc justo erat, luctus eu interdum at, faucibus a elit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer hendrerit at orci id feugiat. Mauris congue aliquet nisi at cursus. Vivamus consequat a nulla aliquet mollis. Suspendisse at urna laoreet, lobortis nisi eget, auctor turpis. Sed eu ex posuere, suscipit elit ac, dignissim turpis. Donec pretium placerat urna eget scelerisque. Fusce feugiat sapien sit amet nulla iaculis vulputate. Duis efficitur erat egestas sem pulvinar ornare. Donec convallis, sapien non maximus vestibulum, quam diam lobortis arcu, luctus facilisis orci nulla at ipsum. Aliquam nunc ligula, scelerisque ac sapien sit amet, ultricies tristique lorem. Vestibulum a nulla egestas, porta purus nec, bibendum tortor. Fusce lobortis facilisis lectus quis dignissim.";
    const contactContent = "Nam mollis luctus mauris in scelerisque. Nam eu erat tellus. Sed accumsan eu urna nec viverra. Aliquam maximus velit in erat tempus commodo non consectetur quam. Aliquam fringilla diam neque, non aliquet arcu sollicitudin eget. Praesent molestie tortor non nisi ullamcorper sollicitudin ut non orci. Proin ultricies sollicitudin luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi quis euismod augue. Etiam vulputate ullamcorper elit in aliquet.";

    // var postArr = [];
    const postSchema = new mongoose.Schema({
        title: String,
        content: String
    });
    const Posts = mongoose.model('post', postSchema);


    app.get('/', function (req, res) {
        Posts.find({}, function (err, docs) {
            if (!err) {
                if (docs.length == 0) {
                    new Posts({
                        title: "home",
                        content: homeStartingContent
                    }).save();
                    res.redirect('/');
                } else {
                    console.log(docs);
                    res.render("home", {
                        content: homeStartingContent,
                        arr: docs
                    });
                }
            }
        });
    });

    app.get('/about', function (req, res) {
        res.render("about", {
            content: aboutContent
        });
    });

    app.get('/contact', function (req, res) {
        res.render("contact", {
            content: contactContent
        });
    });

    app.get('/compose', function (req, res) {
        res.render('compose');
    });

    app.get('/post/:title', function (req, res) {
        const postName = _.lowerCase(req.params.title);
        // postArr.forEach(function (posts) {
        //     if (_.lowerCase(posts.title) === postName) {
        //         res.render('post', {
        //             postTitle: posts.title,
        //             postContent: posts.content
        //         });
        //     }
        // });
        Posts.find({}, function (err, docs) {
            docs.forEach(function (posts) {
                if (_.lowerCase(posts.title) === postName) {
                    res.render('post', {
                        postTitle: posts.title,
                        postContent: posts.content
                    });
                }
            });
        });
    });

    app.post('/compose', function (req, res) {
        // const post = {
        //     title: req.body.postTitle,
        //     content: req.body.postContent
        // };
        // postArr.push(post);
        new Posts({
            title: req.body.postTitle,
            content: req.body.postContent
        }).save();
        res.redirect('/');
    });

    app.listen(port, function () {
        console.log("Server started on port "+port+"...");
    });
}




// "start" : "node app.js"
