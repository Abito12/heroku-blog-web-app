var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
const crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

// Database Credentials
var config = {
    user : 'abito12',
    database: 'abito12',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'randomsecretvalue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));


//Creating DB Pool
var pool = new Pool(config);

app.get('/', function (req, res) {
     if(req.session && req.session.auth && req.session.auth.userId){
        res.sendFile(path.join(__dirname, 'ui', 'articles.html'));
   } else{
     res.sendFile(path.join(__dirname, 'ui', 'index.html'));
   }
});


//Articles Section
app.get('/articles', function (req, res) {
       if(req.session && req.session.auth && req.session.auth.userId){
        res.sendFile(path.join(__dirname, 'ui', 'articles.html'));
   } else{
     res.sendFile(path.join(__dirname, 'ui', 'index.html'));
   }
});

app.get('/sub.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'sub.js'));
});
app.get('/articles.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'articles.css'));
});

app.get('/about', function (req, res) {
       if(req.session && req.session.auth && req.session.auth.userId){
        res.sendFile(path.join(__dirname, 'ui', 'about.html'));
   } else{
     res.sendFile(path.join(__dirname, 'ui', 'index.html'));
   }
});

app.get('/ui/about.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'about.css'));
});

//Login Functionality
function hash(input, salt){
    var hashed = crypto.pbkdf2Sync(input  , salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req, res){
    var hashedString = hash(req.params.input,'this-is-some-random-string');
    res.send(hashedString); 
});


app.post('/create-user', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function(err, result){
            if(err){
                res.status(500).send(err.toString());
            } else {
                res.send('User Created!' + username);
            }
    });
});

app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result){
            if(err){
                res.status(500).send(err.toString());
            } else if(result.rows.length === 0){
                res.send(403).send('Username/Password is invalid');
            }else{
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password, salt);
                if(hashedPassword === dbString){
                    //Set the session
                    
                    req.session.auth = {userId: result.rows[0].id};
                    
                    res.send('Credentials Correct');
                } else {
                    res.send(403).send('Invalid Login');
                }
            }
    });
});


app.get('/logout', function(req, res){
    delete req.session.auth;
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


//Articles Main Page

app.get('/allArticles', function (req, res) {
    
    pool.query("SELECT * FROM article", function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else if(result.rows.length === 0){
            res.status(404).send('Article not found');
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
      
});


app.get('/articles/articlePage.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'articlepage.css'));
});


app.get('/articles/articlePage.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'articlePage.js'));
});

app.get('/articles/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});


app.get('/articles/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});



function createArticleTemplate(data){
    var title = data.title;
    var content = data.content;
    var articleTemplate = `
<html>
<head>
  <title>Article</title>
  <link rel="stylesheet" type="text/css" href="articlePage.css">
  <script src="articlePage.js">
  </script>
</head>
<body>

<div id="container">
<div class="blog">
    <div class="title-box">
      <h3>
      ${title}
      </h3>
      <hr/>
      <div class="intro">
        ${content}
      </div>
    </div>  
    <div class="info">
      <span>article content</span>
  </div>
  <div class="footer">
    <div class="icon-holder">
      <span>
    <i class="fa fa-comment-o"></i>
      <span>12</span>
      <space>12</space>
      <i class="fa fa-calendar"></i>
      <span>03.12.2015</span>
      </span>
    </div>
  </div>
  
 <div class="color-overlay"></div>
</div>

<div id="comment-box">
<div class="detailBox">
    <div class="titleBox">
      <label>Comment Box</label>
        <button type="button" class="close" aria-hidden="true">&times;</button>
    </div>
    <div class="commentBox">
        
        <p class="taskDescription">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    </div>
    <div class="actionBox">
        <ul class="commentList">
            <li>
                <div class="commentText">
                    <p class=""></p> <span class="date sub-text">on March 5th, 2014</span>
                </div>
            </li>
        </ul>
        <form class="form-inline" role="form">
            <div class="form-group">
                <input class="form-control" type="text" placeholder="Your comments" />
            </div>
            <div class="form-group">
                <button class="btn btn-default">Add</button>
            </div>
        </form>
    </div>
</div>
</div>
<div class = "ghost">
  <a class = "ghost-button" href = "http://abito12.imad.hasura-app.io/articles">Home</a>  
</div>
</div>

</body>
</html>`;

return articleTemplate;
}

app.get('/articles/:articleID', function(req, res){
    
    pool.query("SELECT id, title, content FROM article WHERE id = " + req.params.articleID, function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else if(result.rows.length === 0){
            res.status(404).send('Article Not Found');
        } else{
            var articleData = result.rows[0];
            if(req.session && req.session.auth && req.session.auth.userId){
                res.send(createArticleTemplate(articleData));
            }else{
                  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
            }
            }
    });
});


//Comments Section
var comments = [];
app.get('/submit', function(req, res){
    var comment = req.query.comment;
    comments.push(comment);
    // Json encoding
    res.send(JSON.stringify(comments));
});





app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/Lato-Light.ttf', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Lato-Light.ttf'));
});

app.get('/ui/code-in-the-flow.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'code-in-the-flow.png'));
});


//Count Button
var counter = 0;
app.get('/counter', function (req, res) {
    counter += 1;
  res.send(counter.toString());
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/sub.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'sub.js'));
});




var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
