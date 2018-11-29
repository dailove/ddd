var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017'
var dbname = 'czblog';
var articleB = 'article';
var userB = 'user';

function formatTime(date){
  var y = date.getFullYear();
  var m = date.getMonth();
  var d = date.getDate();
  var h = date.getHours();
  var mi = date.getMinutes();

  return y +'-'+ m +'-'+ d +' '+ h+':'+mi;

}

var pageSize = 20;
//管理员页面
router.get('/', function (req, res, next) {

//拿到数据库中信息渲染到admin模板中
MongoClient.connect(url,(error,dbC) => {
  var db = dbC.db(dbname);
  db.collection(articleB).find({},{
    limit:20
  }).sort({time:-1}).toArray().then((data) => {
    console.log(data);
    //怎么才能知道总共有多少页
    db.collection(articleB).count(function(err,count){
      count //总共多少条数据
      //得到页数
      var pages = Math.ceil(count/pageSize)
      res.render('admin', {
        title: '管理员',
        username: req.session.username,
        data:data,
        formatTime:formatTime,
        pageNum:1,
        pUrl:'/admin/page/',
        nUrl:'/admin/page/2',
        pages
    
      })

    })

  }).catch(function(error){
    console.log(error);
  })
})
});

// 登录页面
router.get('/login', function (req, res) {
  res.render('adminLogin', {
    title: "登录",
    username: req.session.username
  })
})

//登录接口
router.post('/api-login', (req, res) => {
    try {
      var username = req.body.un;
      //var md5 = crypto.createHash('md5');
      var password = req.body.pd;
      var user = {
        username,
        password
      };
      MongoClient.connect(url, (error, dbC) => {
        var db = dbC.db(dbname);
        db.collection('admin').find(user).toArray((error, data) => {
          if (data.length) {
            var userObj = data[0];
            req.session.username = username;
            req.session.userid = userObj._id;
            res.json({
              code: 1,
              msg: '登录成功'
            })
          } else {
            res.json({
              code: 0,
              msg: '用户名或密码错误'
            })
          }
        })
      })
    } catch (error) {
      res.json({
        code: 500,
        msg: error
      });
    }
  
  
  })

//分页
router.get('/page/:num',(req,res) => {
    console.log(req.params.num);
    
    //要显示的页面
    var num = parseInt( req.params.num);
  
    MongoClient.connect(url,(error,dbC) => {
      var db = dbC.db(dbname);
      db.collection('article').find({},{
        skip:(num-1)*pageSize,
        limit:pageSize
      }).sort({time:-1}).toArray((err,data) => {
        console.log(data.length)
  
        db.collection(articleB).count(function(err,count){
          var pages = Math.ceil(count/pageSize)
          res.render('admin', {
            title: '管理员',
            username: req.session.username,
            data:data,
            formatTime:formatTime,
            pageNum:num,
            pUrl:'/admin/page/'+(num-1),
            nUrl:'/admin/page/'+(num+1),
            pages
        
          })
        })
       
  
      })
    })
  
  })

//管理用户
router.get('/ctrUser',(req,res) => {
  MongoClient.connect(url,(error,dbC) => {
    var db = dbC.db(dbname);
    db.collection(userB).find({},{
      limit:20
    }).sort({time:-1}).toArray().then((data) => {
      console.log(data);
      //怎么才能知道总共有多少页
      db.collection(userB).count(function(err,count){
        // count //总共多少条数据
        // //得到页数
        // var pages = Math.ceil(count/pageSize)
        res.render('ctrUser', {
          title: '管理员',
          username: req.session.username,
          data:data,
          formatTime:formatTime,
          // pageNum:1,
          // pUrl:'/admin/page/',
          // nUrl:'/admin/page/2',
          // pages
      
        })
  
      })
  
    }).catch(function(error){
      console.log(error);
    })
  })
})

//删除文章
router.get('/del/:aid',(req,res) => {
  var aid = new ObjectID(req.params.aid)
  console.log(aid,555555);
  MongoClient.connect(url,(error,dbC) => {
    var db = dbC.db(dbname);
    db.collection(articleB).deleteOne({_id:aid},(error,data) => {
      if(error) throw error;
      res.redirect('/admin')
    })
  })
})

//删除用户
router.get('/delUser/:aid',(req,res) => {
  var aid = new ObjectID(req.params.aid)
  console.log(aid,44444);
  MongoClient.connect(url,(error,dbC) => {
    var db = dbC.db(dbname);
    db.collection(userB).deleteOne({_id:aid},(error,data) => {
      if(error) throw error;
      res.redirect('/admin/ctrUser')
    })
  })
})

//添加文章页面
router.get('/addArticle',(req,res) => {
  console.log(req.session.userid,11111);
  res.render('addArticle',{
    title:'发表文章',
    username:req.session.username
  })
})

//添加文章
router.post('/addArticle/add', (req, res) => {
  console.log(req.body);
  var article = {
    title: req.body.title,
    content: req.body.content,
    time: new Date(),
    username: req.session.username,
    userid: req.session.userid
  }
  console.log(article);

  MongoClient.connect(url, function (err, dbC) {
    var db = dbC.db(dbname);
    db.collection('article').insertOne(article, (error, data) => {
      if (error) throw error;
      res.json({
        code:1,
        msg:'发布成功'
      })
      
      
    })
  })

})

//查询文章
router.get('/update/:aid',(req,res) => {
  console.log(req)
  //获取文章的id
  console.log(req.params.aid);
  //根据文章的id去数据库中 文章的详情
  //注意 要查询id是 个对象还是 字符串
  var aid = new ObjectID(req.params.aid)

  MongoClient.connect(url,(err,dbC) => {
    var db = dbC.db(dbname);
    db.collection('article').find({_id:aid}).toArray((err,data) => {
       res.json({data})
       console.log(data,9999);
      //  var article = {
      //   title: req.body.title,
      //   content: req.body.content
      //  }
      // db.collection('article').updateOne({'id':'aid'},{$set:{'title':'article.title','content':'article.content'}},(err,result) => {
      //   if(err) throw error;
      //   res.redirect('/admin')
      // })
    })
    
  })

})

//修改文章
router.get('/api-update',(req,res) => {
  console.log(req.query.aid,555555555,req);
  var aid = new ObjectID(req.query.aid)
  var tit = req.query.ti;
  var content = req.query.con;
  MongoClient.connect(url,(error,dbC) => {
    var db = dbC.db(dbname);
    db.collection('article').update({'_id':aid},{$set:{'title':tit,'content':content}},(error,resoult) => {
      if (error) throw error;
      
      res.json({
        code:'1',
        msg:'修改成功'
      })
      
    })
  })
})

//统计每天文章发布量
router.get('/api/echart',(req,res) => {
  MongoClient.connect(url,function(err,dbC){
    var db = dbC.db(dbname);
    db.collection('article').aggregate([
      // 统计每天的发表文章的 文章数据
      // 将time 字段格式化为 年-月-日  的字符串 ，结果放在新属性yearMonthDay 中
      {
        $project:{
          yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$time" } }
        }
      }
      //根据 day属性去统计 相同日期的记录 出现的次数 的和
      // 返回的结果包含_id属性和num属性  ，id属性是yearMonthDay的值，num属性是相同yearMonthDay的记录和
      ,{$group:{_id:'$yearMonthDay',num:{$sum:1}}}
      // 根据_id，降序
      ,{$sort:{_id:-1}}

    ]).toArray(function(err,data){
      console.log(data);
      res.json(data)
    })
  })
})

//统计每天注册量
router.get('/api/zhuce',(req,res) => {
  MongoClient.connect(url,function(err,dbC){
    var db = dbC.db(dbname);
    db.collection('user').aggregate([
      // 统计每天的发表文章的 文章数据
      // 将time 字段格式化为 年-月-日  的字符串 ，结果放在新属性yearMonthDay 中
      {
        $project:{
          yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$time" } }
        }
      }
      //根据 day属性去统计 相同日期的记录 出现的次数 的和
      // 返回的结果包含_id属性和num属性  ，id属性是yearMonthDay的值，num属性是相同yearMonthDay的记录和
      ,{$group:{_id:'$yearMonthDay',num:{$sum:1}}}
      // 根据_id，降序
      ,{$sort:{_id:-1}}

    ]).toArray(function(err,data){
      console.log(data);
      res.json(data)
    })
  })
})

router.get('/echart',(req,res) => {
  res.render('echart',{
    title:'每日文章发布量',
    username:req.session.username
  })
})

//退出
router.get('/layout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    console.log('session  清除成功');
    //重定向
    res.redirect('/admin/login');
  })
})

module.exports = router;