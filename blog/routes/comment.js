// 评论功能
// var express = require('express');
// var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var router = require('express').Router();

var comment = require('../model/comment')
//发表评论接口

// 控制器   
//  mvc
// m（模型 数据库）
// v（视图 前端页面。模板） 
//  c（控制器 路由）

// // /comment
router.get('/',(req,res) => {
    //控制器 中  获取前端请求的数据， 交给 模型 插入数据库
    //content,aid,userid
    var content = req.query.content
    var aid = new ObjectID(req.query.aid)
    var userid = new ObjectID(req.query.userid)
    var obj = {content,aid,userid}
    console.log(obj)

    comment.comment(obj,() => {
        res.json({code:1,msg:'评论成功'})
    })

   
})



// 前后端 联调 

// //comment/list
// // 评论列表接口
router.get('/list',(req,res) => {
    try {
        var aid = new ObjectID(req.query.aid);
    comment.getCommentList(aid,(data) => {
        res.json({code:1,data})
    })
    } catch (error) {
        console.log(error)
    }
    
})

module.exports =  router;