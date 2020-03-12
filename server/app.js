var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config= require('../server/config/config');

var Pool=require('pg').Pool;
var pool= new Pool(config);


const{notFound , errorHandler}= require('./middlewares');



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//this is query function
function executeQuery(query,values){
    return new Promise((resolve, reject)=>{
        pool.connect()
            .then((client)=>{
                return client.query(query, values)
                .then((res) =>{
                    client.release()
                    resolve(res);

                })
                .catch((e)=>{
                    client.release()
                    console.log("error");
                    reject(e.stack)
                })

            });
    });
}

app.get('/',(req, res) => {
     executeQuery('SELECT location FROM point WHERE p_id=1 ')
    .then((data) => {
        
             res.json({
                
                data: data.rows,
        });
        
    });

});
//our routes goes here

app.use(notFound);
app.use(errorHandler);

module.exports = app;
