var belvo = require('belvo').default;
const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const router = express.Router();
const bodyParser = require('body-parser');
const linkid= '8df72c9a-5c40-491b-91d3-fd47433ac49d';
var registro;
var nombre;
var apellido;
var client = new belvo(
  '6317b737-dbdd-4aef-8e16-eac0b657408b',
  'aSKlmI8QdkhMcqy3IyWpz7WB8aj@@BA4Tf79QiZUpfkvPbBBZf0w7xMdiZiegFdt',
  'https://sandbox.belvo.com'
);
app.use(bodyParser.urlencoded({ extended: true })); 
app.set("view engine", "pug");

client.connect()
  .then(function () {
   client.accounts.retrieve(linkid)
      .then(function (res) {
		  registro=res;
        console.log(registro);
      })
      .catch(function (error) {
        console.log(error);
      });
});



client.connect()
  .then(function () {
    client.accounts.list()
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
});
 // client.connect().then(function () {
    // console.log(options);
    // client.widgetToken
      // .create(options)
      // .then((response) => {
        // res.json(response);
      // })
      // .catch((error) => {
        // console.log(error);
      // });
  // });

  // app.get('/', (req, res) => {
  // res.send(registro)
// })
  
app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port ${PORT}`)
})
 console.log(__dirname);
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/login',function(req,res){
  res.sendFile(path.join(__dirname+'/views/login.html'));
  
  //__dirname : It will resolve to your project folder.
});

app.post('/HomeSession', (req, res) => {
  
  email=req.body.femail;
  password=req.body.fpassword;
  res.render("HomeSession",{title: 'Bienvenido!', email: email});
});

app.get('/Cuentas',function(req,res){
var allAccountsArray = registro;
var allAccounts = [];
 
    allAccountsArray.forEach(account =>{       
        var elem = new Object();
        elem["id"] = account.id;
        elem["institutionName"] = account.institution.name;
        elem["institutionType"]=account.institution.type;
        elem["name"]=account.name;
        elem["type"]=account.type;
        elem["category"]=account.category;

        allAccounts.push(elem);
        console.log(elem);
		
    });
	console.log(allAccounts);
    res.render('Cuentas',{accounts:allAccounts});
  }); 

  app.post('/accountDetails', (req, res) => {
  console.log(req.body.id);
  client.connect()
  .then(function () {
    client.accounts.detail(req.body.id)
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
});
  email=req.body.femail;
  password=req.body.fpassword;
  res.render("HomeSession",{title: 'Bienvenido!', email: email});
});

