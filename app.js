// Mysql
var mysql  = require('mysql');
var user   = require('./model/user');
var bcrypt = require('bcrypt');

// Express
var bodyParser = require('body-parser');
var express = require('express');

// DTO
var respostas = require('./model/dto/respostas');

// Configuração Express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração Mysql
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'btc_yimobile'
});

// Cadastro de usuário
app.post('/cadastro', (req, res) => {
  user = req.body;
  if ( !user || !user.email || !user.senha ) res.send(respostas.falha);
  bcrypt.hash(user.senha, 10, (err, hash) => {
    var query = 'insert into user(email, senha) values (\''+user.email+'\',\''+ hash +' \')';
    connection.query(query, (err,results, fields) => {
      if (err) res.send(respostas.falha);
      console.log(hash);
      res.send(respostas.sucesso);
    })
  });
});

// Login do usuário
app.post('/login', (req, res) => {
  user = req.body;
  if ( !user || !user.email || !user.senha ) res.send(respostas.falha);
  var query = 'select * from user where email = \'' + user.email + '\'';
  connection.query(query, (err, results, fields) => {
    bcrypt.compare(user.senha, results[0].senha, function(err, compareResult) {
      if ( !compareResult ) {
        console.log(user.senha);
        console.log(results[0].senha);
        res.send(respostas.falha);
      }
      else res.send(respostas.sucesso);
    });
  })
})

connection.connect((err) => {
  if (err) throw err;
});

app.listen(3000, function () {
});
