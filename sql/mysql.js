let mysql = require('mysql');
let config = require('../config/commonConfig.js')

let pool  = mysql.createPool({
    host     : config.database.HOST,
    user     : config.database.USERNAME,
    password : config.database.PASSWORD,
    database : config.database.DATABASE
});

let query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                resolve( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    //释放连接至连接池
                    connection.release()
                })
            }
        })
    })
};

let users=
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     pass VARCHAR(40) NOT NULL,
     PRIMARY KEY ( id )
    );`;
let blog=
    `create table if not exists blog(
     id INT NOT NULL AUTO_INCREMENT,
     author VARCHAR(100) NOT NULL,
     title VARCHAR(40) NOT NULL,
     content  VARCHAR(40),
     description  VARCHAR(100),
     uid  VARCHAR(40) NOT NULL,
     label  VARCHAR(100) NOT NULL,
     createTime  VARCHAR(40) NOT NULL,
     comments  VARCHAR(40) NOT NULL DEFAULT '0',
     pv  VARCHAR(40) NOT NULL DEFAULT '0',
     PRIMARY KEY ( id )
    );`;

let comment=
    `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     commentator VARCHAR(100) NOT NULL,
     content VARCHAR(40) NOT NULL,
     postid VARCHAR(40) NOT NULL,
     PRIMARY KEY ( id )
    );`;

let createTable = function( sql ) {
    return query( sql, [] )
};

// 建表
createTable(users);
createTable(blog);
createTable(comment);

// 注册用户
let insertUser = function( value ) {
    let _sql = "insert into users(name,pass) values(?,?);"
    return query( _sql, value )
};
// 通过名字查找用户
let findUserByName = function (  name ) {
    let _sql = `
    SELECT * from users
      where name="${name}"
      `
    return query( _sql)
};
// 发表文章
let insertArticle = function(value){
    let _sql = "insert into blog(title,description,content,label,uid,author,createTime) values(?,?,?,?,?,?,?);";
    return query( _sql, value )
};
//查找所有文章，后期重构下sql语句
let getArticles = function(param){
    let _sql = '';
    if(param === undefined || param.length===0){
        _sql = "select * from blog";
    }else{
        if(param.length===1){
            let sql = "select * from blog where";
            for(let str of param){
                //给变量加引号的方法
                _sql = sql + " label like "+"\""+"\%"+str+"\%"+"\"";
            }
        }else{
            let sql = "select * from blog where label like "+"\""+"\%"+param[0]+"\%"+"\"";
            for(let i=1;i<param.length;i++){
                //给变量加引号的方法
                sql += "or label like "+"\""+"\%"+param[i]+"\%"+"\"";
            }
            _sql = sql
        }
    }
    return query( _sql )
};
//查找所有的标签
let getLabels = function(){
    let _sql = "select label from blog";
    return query( _sql )
};
//根据文章id查找
let getArticlesById = function ( id ) {
    let _sql = 'select * from blog where id='+id;
    return query( _sql)
};
module.exports={
    query,
    createTable,
    insertUser,
    findUserByName,
    insertArticle,
    getArticles,
    getLabels,
    getArticlesById
}

