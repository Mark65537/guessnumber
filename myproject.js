const http = require('http');
const url = require('url');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const gamecode = require('./gamecode');

const hostname = '127.0.0.1';
const port = 3000;

var countStep=0;
var str="Загадано 4х-значное число:";
var congstr='<div id="info">'
var congstrn=congstr.length
var strn=str.length;
var answer=""
var congratPage=""
var table=''

sqlite3.verbose();
	



fs.readFile("congratulation.html",'utf8', function (err, content) {
		if (!err) {
			congratPage=content
		}			
});

const server = http.createServer((request, response) => {
  const { pathname, query } = url.parse(request.url, true);
  if (pathname === '/') {
	  countStep=0;
	  mycontent='';
      fs.readFile("main.html", function (err, content) {
       if (!err) {
         response.write(content);
       } else {
        response.statusCode = 500;
        response.write('An error has ocurred');
       }
     });
	 
   
  }//конец home--------------------------------------------------------------- 
  else if(pathname === '/autorization'){
	fs.readFile("autorization.html",(err, content) => {
	   if (!err) {
        response.write(content);
      } else {
        response.statusCode = 500;
        response.write('An error has ocurred');
      }
	  response.end();
	});		
  }//конец autorization--------------------------------------------------------------- 
  else if(pathname === '/game'){
	  
     fs.readFile("game.html",'utf8', function (err, content) {
      if (!err) {

		  if (typeof query.radios !== "undefined" 		  
		      &&   (typeof query.startbtn !== "undefined")){ //проверка существования запроса сложности игры и продолжительности
				answer= gamecode.load(query.radios);
		        table=gamecode.namedTable(query.radios);
			  }
		  if (typeof query.answer!== "undefined") {//проверка запроса посланого решения
               countStep++;
			   result=gamecode.checkAnswer(answer,query.answer)

			 if(result=="youwin"){//угадал
				 content=congratPage.substr(0, congratPage.indexOf(congstr)+congstrn) 
					       + '<\p>' 					        
				           + "congratulations</p>" 
						   + "ваше колличество ходов: "+countStep 
				           + " Вы ответили: " + answer + "</p>"
                           + congratPage.substr(congratPage.indexOf(congstr)+congstrn);						   
					
				}else{//не угадал

				   content=content.substr(0, content.indexOf(str)+strn) 
					        + '<\p>'+countStep+":"+result 
					        + content.substr(content.indexOf(str)+strn);
				}					 
			}
			 
          
        console.log(answer)		  
        response.write(content);
      }
	  
	  else {
        response.statusCode = 500;
        response.write('An error has ocurred');
      }

      response.end();
    });//конец чтения файла
		  
  }//конец /game-------------------------------------------------------------
  else if(pathname === '/easytable'){ 
     let place=0
	 let content=`<html lang="ru-RU">
                  <head>
                  <meta charset="UTF-8">
                  <title>меню игры</title>
                  </head>
                  <table width="300" style="float: left;">
	              <caption>легкий</caption>
                  <tr><th>место</th><th>имя</th><th>количесво ходов</th><th>время</th></tr>
	              `
	 response.write(content);
	 table='easyrank'
	 // открыть базу данных
     let db = new sqlite3.Database('./ranktable.db',err => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
     });
	 

		  
	          //создаем таблицу в базе данных
              db.run("CREATE TABLE IF NOT EXISTS '"+table+"'("
                 +"'name' VARCHAR(25) NOT NULL,"
                 +"'countstep' INT(11),"
                 +"'time' VARCHAR(11))",
	              err =>{
		         if (err) {
			      console.log("CREATE TABLE")
                   return console.error(err.message);
                 }
		   
		       });    
	 
     db.each(`SELECT * FROM ${table} ORDER BY countstep`, (err, row) => {
      if (err) {
         console.error(err.message);
      }
	  
      mycontent=`<tr><td>${place++}</td><td>${row.name}</td><td>${row.countstep}
	           </td><td>${row.time}</td></tr>`;
	  response.write(mycontent);
      
     })//end db.each
	 
	
	 //db.finalize()
    // закрыть базу данных
	db.close((err) => {
      if (err) {
       return console.error(err.message);
      }
      console.log('Close the database connection.');
	  response.write("</table><a href='/'>вернутся в меню</a>");
	  response.end(); 
	})
  }//конец /easytable---------------------------------------------------------
  else if(pathname === '/normaltable'){ 
     let place=0
	 let content=`<html lang="ru-RU">
                  <head>
                  <meta charset="UTF-8">
                  <title>меню игры</title>
                  </head>
                  <table width="300" style="float: left;">
	              <caption>легкий</caption>
                  <tr><th>место</th><th>имя</th><th>количесво ходов</th><th>время</th></tr>
	              `
	 response.write(content);
	 table='normalrank'
	 // открыть базу данных
     let db = new sqlite3.Database('./ranktable.db',err => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
     });
	 

		  
	          //создаем таблицу в базе данных
              db.run("CREATE TABLE IF NOT EXISTS '"+table+"'("
                 +"'name' VARCHAR(25) NOT NULL,"
                 +"'countstep' INT(11),"
                 +"'time' VARCHAR(11))",
	              err =>{
		         if (err) {
			      console.log("CREATE TABLE")
                   return console.error(err.message);
                 }
		   
		       });    
	 
     db.each(`SELECT * FROM ${table} ORDER BY countstep`, (err, row) => {
      if (err) {
         console.error(err.message);
      }
	  
      mycontent=`<tr><td>${place++}</td><td>${row.name}</td><td>${row.countstep}
	           </td><td>${row.time}</td></tr>`;
	  response.write(mycontent);
      
     })//end db.each
	 
	
	 //db.finalize()
    // закрыть базу данных
	db.close((err) => {
      if (err) {
       return console.error(err.message);
      }
      console.log('Close the database connection.');
	  response.write("</table><a href='/'>вернутся в меню</a>");
	  response.end(); 
	})
  }//конец /normalrank---------------------------------------------------------
  else if(pathname === '/hardtable'){ 
     let place=0
	 let content=`<html lang="ru-RU">
                  <head>
                  <meta charset="UTF-8">
                  <title>меню игры</title>
                  </head>
                  <table width="300" style="float: left;">
	              <caption>легкий</caption>
                  <tr><th>место</th><th>имя</th><th>количесво ходов</th><th>время</th></tr>
	              `
	 response.write(content);
	 table='hardrank'
	 // открыть базу данных
     let db = new sqlite3.Database('./ranktable.db',err => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
     });
	 

		  
	          //создаем таблицу в базе данных
              db.run("CREATE TABLE IF NOT EXISTS '"+table+"'("
                 +"'name' VARCHAR(25) NOT NULL,"
                 +"'countstep' INT(11),"
                 +"'time' VARCHAR(11))",
	              err =>{
		         if (err) {
			      console.log("CREATE TABLE")
                   return console.error(err.message);
                 }
		   
		       });    
	 
     db.each(`SELECT * FROM ${table} ORDER BY countstep`, (err, row) => {
      if (err) {
         console.error(err.message);
      }
	  
      mycontent=`<tr><td>${place++}</td><td>${row.name}</td><td>${row.countstep}
	           </td><td>${row.time}</td></tr>`;
	  response.write(mycontent);
      
     })//end db.each
	 
	
	 //db.finalize()
    // закрыть базу данных
	db.close((err) => {
      if (err) {
       return console.error(err.message);
      }
      console.log('Close the database connection.');
	  response.write("</table><a href='/'>вернутся в меню</a>");
	  response.end(); 
	})
  }//конец /hardrank---------------------------------------------------------
  else if(pathname === '/veryhardtable'){ 
     let place=0
	 let content=`<html lang="ru-RU">
                  <head>
                  <meta charset="UTF-8">
                  <title>меню игры</title>
                  </head>
                  <table width="300" style="float: left;">
	              <caption>легкий</caption>
                  <tr><th>место</th><th>имя</th><th>количесво ходов</th><th>время</th></tr>
	              `
	 response.write(content);
	 table='veryhardrank'
	 // открыть базу данных
     let db = new sqlite3.Database('./ranktable.db',err => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
     });
	 

		  
	          //создаем таблицу в базе данных
              db.run("CREATE TABLE IF NOT EXISTS '"+table+"'("
                 +"'name' VARCHAR(25) NOT NULL,"
                 +"'countstep' INT(11),"
                 +"'time' VARCHAR(11))",
	              err =>{
		         if (err) {
			      console.log("CREATE TABLE")
                   return console.error(err.message);
                 }
		   
		       });    
	 
     db.each(`SELECT * FROM ${table} ORDER BY countstep`, (err, row) => {
      if (err) {
         console.error(err.message);
      }
	  
      mycontent=`<tr><td>${place++}</td><td>${row.name}</td><td>${row.countstep}
	           </td><td>${row.time}</td></tr>`;
	  response.write(mycontent);
      
     })//end db.each
	 
	
	 //db.finalize()
    // закрыть базу данных
	db.close((err) => {
      if (err) {
       return console.error(err.message);
      }
      console.log('Close the database connection.');
	  response.write("</table><a href='/'>вернутся в меню</a>");
	  response.end(); 
	})
  }//конец /veryhardrank---------------------------------------------------------
  else if(pathname === '/showrank'){ 
     let place=1
	 let content=`<html lang="ru-RU">
                  <head>
                  <meta charset="UTF-8">
                  <title>рекорды</title>
                  </head>
				  <a href='/'>вернутся в меню</a>
                  <table width="300" style="float: left;">
                  <tr><th>место</th><th>имя</th><th>количесво ходов</th><th>время</th></tr>
	              `	 
	 // открыть базу данных
     let db = new sqlite3.Database('./ranktable.db',err => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
     });
	 

	db.serialize(() => {  
	          //создаем таблицу в базе данных
              db.run("CREATE TABLE IF NOT EXISTS '"+table+"'("
                 +"'name' VARCHAR(25) NOT NULL,"
                 +"'countstep' INT(11),"
                 +"'time' VARCHAR(11))",
	              err =>{
		         if (err) {
			      console.log("CREATE TABLE")
                   return console.error(err.message);
                 }
		   
		       });
		    
		//if(){}
       // вставить одну калонку в "название своей таблицы" таблицу
       db.run(`INSERT INTO ${table}
                      VALUES('my',${countStep},"время")
					  `, function(err) {
               if (err) {
                 return console.log(err.message);
                }
		     response.write(content);
             console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    
	 
     db.each(`SELECT * FROM ${table} ORDER BY countstep`, (err, row) => {
      if (err) {
         console.error(err.message);
      }
	  
      mycontent=`<tr><td>${place++}</td><td>${row.name}</td><td>${row.countstep}
	           </td><td>${row.time}</td></tr>`;
	  response.write(mycontent);
      
     })//end db.each
	 
    })
	 //db.finalize()
    // закрыть базу данных
	db.close((err) => {
      if (err) {
       return console.error(err.message);
      }
      console.log('Close the database connection.');
	  response.write("</table>");
	  response.end(); 
	})
  }//конец /showrank---------------------------------------------------------
  else {
	 response.write("can't read html file");
     response.end(); 
  }
});
  //connection.end()//закрыть соединение базы данных

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});