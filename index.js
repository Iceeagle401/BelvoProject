var belvo = require('belvo').default;
var favicon = require('serve-favicon');

const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const router = express.Router();
const bodyParser = require('body-parser');
var linkid= '8df72c9a-5c40-491b-91d3-fd47433ac49d';
var registro;
var transacciones;
var nombre;
var apellido;
var bank;
var balanceTotal=0.00;
var fromDate="2022-01-01";
var toDate = new Date().toISOString().split('T')[0];
var toDay = new Date().toISOString().split('T')[0];
var client = new belvo(
  '6317b737-dbdd-4aef-8e16-eac0b657408b',
  'aSKlmI8QdkhMcqy3IyWpz7WB8aj@@BA4Tf79QiZUpfkvPbBBZf0w7xMdiZiegFdt',
  'https://sandbox.belvo.com'
);
app.use(bodyParser.urlencoded({ extended: true })); 
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, '/static/public')));
app.use(favicon(path.join(__dirname, '/static/public/favicon/android-icon-32x32.png')));






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
  
app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${PORT}`)
  console.log(toDate);
  console.log(fromDate);
  
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
  bank=req.body.bank
  client.connect()
  .then(function () {
    client.links.register(bank, email, password)
      .then(function (res) {
		   console.log(res);
		  linkid=res.id;
       
		console.log(linkid);
      })
      .catch(function (error) {
        console.log(error);
      });
});
  res.render("HomeSession",{title: 'Bienvenido!', email: email});
});


app.get('/HomePage', (req, res) => {
  res.render("HomePage",{title: 'Bienvenido!', email: email});
});

app.get('/Cuentas',async function(req,res){
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


var allAccountsArray = registro;
var allAccounts = [];
 await new Promise(resolve => setTimeout(resolve, 5000));
    registro.forEach(account =>{       
        var elem = new Object();
        elem["id"] = account.id;
        elem["institutionName"] = account.institution.name;
        elem["institutionType"]=account.institution.type;
        elem["name"]=account.name;
        elem["type"]=account.type;
		elem["balance"]=account.balance.current;
        elem["category"]=account.category;
		balanceTotal=balanceTotal+account.balance.current;

        allAccounts.push(elem);
        // console.log(elem);
		
    });
	// console.log(allAccounts);
    res.render('Cuentas',{accounts:allAccounts, balanceTotal:balanceTotal});
  }); 
  
app.get('/Transacciones',async function(req,res){
	//console.log(req);
	if(req.body.fromDate != null)
	{fromDate=req.body.fromDate;
console.log('Entro uno');
	}
	if(req.body.toDate != null)
	{fromDate=req.body.toDate;
console.log('Entro dos');
	}
	client.connect()
  .then(function () {
    client.transactions.retrieve(linkid, fromDate, { 'dateTo': toDate })
      .then(function (res) {
		  transacciones=res;
        //console.log(transacciones);
      })
      .catch(function (error) {
        console.log(error);
      });
});
var allTransactionsArray = transacciones;
var allArrays = [];
 await new Promise(resolve => setTimeout(resolve, 15000));
    transacciones.forEach(transaction =>{       
        var elem = new Object();
        elem["id"] = transaction.id;
        elem["amount"] = transaction.amount;
        elem["reference"]=transaction.reference;
        elem["category"]=transaction.category;
        elem["merchant"]=transaction.merchant.name;
        elem["currency"]=transaction.currency;
		elem["createdAt"]=transaction.created_at;


        allArrays.push(elem);
        // console.log(elem);
		
    });
	// console.log(allArrays);
    res.render('Transacciones',{transactions:allArrays, fromDate:fromDate, toDate:toDate, today:toDay});
  }); 
  
 app.get('/Balances',async function(req,res){
client.connect()
  .then(function () {
    client.balances.retrieve(linkid, fromDate, { 'dateTo': toDate })
      .then(function (res) {
        //console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
});
// var allTransactionsArray = transacciones;
// var allArrays = [];
 // await new Promise(resolve => setTimeout(resolve, 15000));
    // transacciones.forEach(transaction =>{       
        // var elem = new Object();
        // elem["id"] = transaction.id;
        // elem["amount"] = transaction.amount;
        // elem["reference"]=transaction.reference;
        // elem["category"]=transaction.category;
        // elem["merchant"]=transaction.merchant.name;
        // elem["currency"]=transaction.currency;


        // allArrays.push(elem);
        // console.log(elem);
		
    // });
	// console.log(allArrays);
    // res.render('Transacciones',{transactions:allArrays});
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
  res.render("accountDetails",{title: 'Bienvenido!', email: email});
});

