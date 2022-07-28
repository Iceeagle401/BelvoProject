var belvo = require('belvo').default;
//var favicon = require('serve-favicon');
const { Client } = require('pg');
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
var cuenta;
var accountid;
var balanceTotal=0.00;
var verifyUser=0;
var bankUser;
var bankpassword;
var fromDate="2022-01-01";
var toDate = new Date().toISOString().split('T')[0];
var toDay = new Date().toISOString().split('T')[0];
const connection ="postgres://oyvjmkjbiawlbl:2a3db4826060661761fba31fa38572ed0d498f853e1a74af46b011147bef0356@ec2-54-227-248-71.compute-1.amazonaws.com:5432/d56iea2ph52lkb"
var client = new belvo(
  '6317b737-dbdd-4aef-8e16-eac0b657408b',
  'aSKlmI8QdkhMcqy3IyWpz7WB8aj@@BA4Tf79QiZUpfkvPbBBZf0w7xMdiZiegFdt',
  'https://sandbox.belvo.com'
);
app.use(bodyParser.urlencoded({ extended: true })); 
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, '/static/public')));
//app.use(favicon(path.join(__dirname, '/static/public/favicon/android-icon-32x32.png')));

console.log(process.env.DATABASE_URL);




  
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

app.get('/register',function(req,res){
  res.sendFile(path.join(__dirname+'/views/register.html'));
  
  //__dirname : It will resolve to your project folder.
});

app.get('/login',function(req,res){
  res.sendFile(path.join(__dirname+'/views/login.html'));
  
  //__dirname : It will resolve to your project folder.
});

app.post('/logSession', async function(req, res) {
	const db = new Client({	
	  connectionString: connection,
		  ssl: {
			rejectUnauthorized: false
		  }
	});
	
	
	
	verifyUser=0;
	email=req.body.femail;
	password=req.body.fpassword;
	
	db.connect();
	db.query('SELECT id FROM users where mail = \'' + email + '\' and password1 = \'' + password+ '\';', (err, res) => {
	if (err) throw err;
		for (let row of res.rows) {
		  verifyUser=row.id;
		  console.log(verifyUser);
		}
	});

	await new Promise(resolve => setTimeout(resolve, 2000));
	
	console.log('Verifica el usuario');
	console.log(verifyUser);
  if(verifyUser == 0){
	  console.log('Usuario Incorrecto');
	   res.sendFile(path.join(__dirname+'/views/login.html'));
  }else{
  db.query('SELECT id FROM links where user_id = \'' + verifyUser + '\';', (err, res) => {
  if (err) throw err;
	  for (let row of res.rows) {
		  linkid=row.id;
		  console.log(verifyUser);
	  }
	});
	await new Promise(resolve => setTimeout(resolve, 2000));
 
	 res.render("HomePage",{title: 'Bienvenido!', email: email});
	
 }
	
	
	db.end();
});


app.post('/HomeSession', async function(req, res) {
  
  
  	const db = new Client({	
	  connectionString: connection,
	  ssl: {
		rejectUnauthorized: false
	  }
	});
	
	

  verifyUser=0;
  
  email=req.body.femail;
  password=req.body.fpassword;
  bank=req.body.bank;
  bankUser=req.body.bemail;
  bankPassword=req.body.bpassword;
  console.log(req.body.bank);
  console.log(req.body.bemail);
  console.log(req.body.bpassword);
  
  db.connect();
  
  db.query('SELECT id FROM users where mail = \'' + email + '\';', (err, res) => {
	  if (err) throw err;
	  for (let row of res.rows) {
		  verifyUser=row.id;
		  console.log(verifyUser);
	  }
	});
	await new Promise(resolve => setTimeout(resolve, 2000));
	console.log('Verifica el usuario');
	console.log(verifyUser);
	  if(verifyUser != 0){
		  db.end();
		  await new Promise(resolve => setTimeout(resolve, 1000));
		  console.log('El usuario ya existe');
		   res.sendFile(path.join(__dirname+'/views/login.html'));
	  }
  else{
	
	
  
  db.query('Insert into users (mail, password1) values ( \'' + email+ '\', \'' + password + '\' )', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
	  console.log(row);
	
  }
  
  }); 
await new Promise(resolve => setTimeout(resolve, 2000));  
  db.query('SELECT id FROM users where mail = \'' + email + '\';', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
	  verifyUser=row.id;
	  console.log(verifyUser);
  }
});
await new Promise(resolve => setTimeout(resolve, 2000));  
  
  client.connect()
  .then(function () {
    client.links.register(bank, bankUser, bankPassword)
      .then(function (res) {
		   console.log(res);
		  linkid=res.id;
       
		console.log(linkid);
      })
      .catch(function (error) {
        console.log(error);
      });
});
await new Promise(resolve => setTimeout(resolve, 5000));  

 console.log('Link id');
  console.log(linkid);
  db.query('Insert into links (user_id, id) values ( \'' + verifyUser+ '\', \'' + linkid + '\' )', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
	  console.log(row);
	
  }
  
  }); 
  await new Promise(resolve => setTimeout(resolve, 2000));  
  db.end();
  await new Promise(resolve => setTimeout(resolve, 2000));  
  res.render("HomeSession",{title: 'Bienvenido!', email: email});
	
  }
 // db.end();

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
  
app.post('/Transacciones',async function(req,res){
	console.log('hi');
	if(req.body.fromDate != null)
	{fromDate=req.body.fromDate;
console.log('Entro uno');
console.log(fromDate);
	}
	if(req.body.toDate != null)
	{toDate=req.body.toDate;
console.log('Entro dos');
console.log(toDate);
	}
	client.connect()
  .then(function () {
    client.transactions.retrieve(linkid, fromDate, { 'dateTo': toDate })
      .then(function (res) {
		  transacciones=res;
        console.log(transacciones);
      })
      .catch(function (error) {
        console.log(error);
      });
});
 await new Promise(resolve => setTimeout(resolve, 15000));
var allTransactionsArray = transacciones;
var allArrays = [];

    transacciones.forEach(transaction =>{       
        var elem = new Object();
        elem["id"] = transaction.id;
        elem["amount"] = transaction.amount;
        elem["reference"]=transaction.reference;
        elem["category"]=transaction.category;
        elem["merchant"]=transaction.merchant.name;
        elem["currency"]=transaction.currency;
		elem["createdAt"]=transaction.accounting_date;


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
  
  

 app.post('/accountDetails', async function (req, res)  {
	 
	  console.log('cueeeeeeeeeeeeeeeentaaaaaaaaaaaaaaaaas//////////////77')
  console.log(req.body.id)
   console.log('link//////////////77');
  console.log(linkid);
  accountid=req.body.id;
  console.log(accountid);

  client.connect()
  .then(function () {
	   console.log('algo');
    client.accounts.detail(req.body.id)
      .then(function (res) {
		   console.log('cueeeeeeeeeeeeeeeentaaaaaaaaaaaaaaaaas reeeeeeeees//////////////77');
  console.log(res);
		  cuenta=res;
       
      })
      .catch(function (error) {
        console.log(error);
      });
});
 await new Promise(resolve => setTimeout(resolve, 5000));
 console.log(cuenta.id);
 console.log(fromDate);
 console.log(toDate);
client.connect()
  .then(function () {
    client.transactions.retrieve(linkid, fromDate,{ 'dateTo': toDate, 'account': cuenta.id })
      .then(function (res) {
		   console.log(res);
		  transacciones=res;
       
      })
      .catch(function (error) {
		   console.log(req);
        console.log(error);
      });
});

var account=new Object();
	account["name"]=cuenta.name;

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
		elem["name"]=transaction.account.name;


        allArrays.push(elem);
        // console.log(elem);
		
    });
  email=req.body.femail;
  password=req.body.fpassword;
  res.render("accountDetails",{transactions:allArrays, account: account});
});

