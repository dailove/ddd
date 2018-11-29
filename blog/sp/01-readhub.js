var urlSP = 'https://api.readhub.cn/topic?lastCursor=&pageSize=20'
var https = require('https');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017'
var dbname = 'czblog';
var articleB = 'article';

function loadData() {
    //后端发起http请求
    https.get(urlSP, (res, req) => {
        var html = '';
        res.on('data', (data) => {
            console.log(data);
            html += data;
        })
        res.on('end', () => {
            console.log('请求结束');
            var obj = JSON.parse(html);
            console.log(obj.data);
            var arr = obj.data.map((value) => {
                return {
                    title: value.title,
                    content: value.summary,
                    time: new Date(value.publishDate)
                }
            })
            console.log(arr);
            //爬取的数据插入到数据库
            MongoClient.connect(url, (err, dbC) => {
                var db = dbC.db(dbname);
                db.collection(articleB).insertMany(arr, (err, data) => {
                    console.log('插入数据成功')
                    var lastOrder = obj.data[obj.data.length-1].order
                    urlSP = 'https://api.readhub.cn/topic?lastCursor='+lastOrder+'&pageSize=20'
                    console.log(urlSP);
                    setTimeout(() => {
                        loadData();
                    }, 3000);
                    

                })
            })

        })
    })
}

loadData();