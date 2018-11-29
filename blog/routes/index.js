var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017'
var dbname = 'czblog';
var articleB  = 'article';
var userB = 'user';


function formatTime(date){
  var y = date.getFullYear();
  var m = date.getMonth();
  var d = date.getDate();
  var h = date.getHours();
  var mi = date.getMinutes();

  return y +'-'+ m +'-'+ d +' '+ h+':'+mi;

}


// 一页显示多少条数据
var pageSize = 20;


/* GET home page. */
router.get('/', function(req, res, next) {
  // 把index模板中的数据 渲染之后 给 浏览器
  // xss 跨站脚本攻击

  //数据库中把文章列表查出来，渲染到uses模板
  MongoClient.connect(url,(error,dbC) => {
    var db = dbC.db(dbname);
    db.collection(articleB).find({},{
      limit:20
    }).sort({time:-1}).toArray().then((data) => {
      // console.log(data);
      //怎么才能知道总共有多少页

      db.collection(articleB).count(function(err,count){
        count //总共多少条数据
        //得到页数
        var pages = Math.ceil(count/pageSize)

          db.collection('article').find({}).limit(3).sort({pv:-1}).toArray((error,hot) => {
            console.log(hot,1111111111);
            res.render('index', {
          title: '首页',
          username: req.session.username,
          data:data,
          hot:hot,
          formatTime:formatTime,
          pageNum:1,
          preUrl:'/page/',
          nextUrl:'/page/2',
          pages
      
        })
          })
        

        

      })

    }).catch(function(error){
      console.log(error);
    })
  })

});




router.get('/page/:num',(req,res) => {
  console.log(req.params.num);
  
  //要显示的页面
  var num = parseInt( req.params.num);

  MongoClient.connect(url,(error,dbC) => {
    var db = dbC.db(dbname);
    db.collection('article').find({},{
      skip:(num-1)*pageSize,
      limit:pageSize
    }).toArray((err,data) => {
      console.log(data.length)

      db.collection(articleB).count(function(err,count){
        var pages = Math.ceil(count/pageSize)

        db.collection('article').find({}).limit(3).sort({pv:-1}).toArray((error,hot) => {
          console.log(hot,1111111111);
          res.render('index', {
        title: '首页',
        username: req.session.username,
        data:data,
        hot:hot,
        formatTime:formatTime,
        pageNum:num,
        preUrl:'/page/'+(num-1),
        nextUrl:'/page/'+(num+1),
        pages
    
      })
        })

        
      })
     

    })
  })




})


module.exports = router;
