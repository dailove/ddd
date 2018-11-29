var urlSP = 'https://www.qiushibaike.com/hot/page/1/';
var superagent = require('superagent');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017'
var dbname = 'czblog';
var articleB = 'article';

//jquery
var cheerio = require('cheerio');

loadData();
var page = 1;
function loadData() {
    page++;
    superagent
        .get(urlSP)
        .end((req, res) => {
            //页面数据
            console.log(res.text)
            $ = cheerio.load(res.text);
            var arr = []
            $('.content').each((index, value) => {
                var content = $(value).text().trim();
                var title = content.slice(0, 10)
                var time = new Date();
                var userid = '5bf219351612de250c9ecd57';
                var username= '222'
                var obj = {
                    title,
                    content,
                    time,
                    userid,
                    username
                }

                arr.push(obj)

                console.log(title + '-----' + content);
            })
            //爬取的数据插入到数据库
            MongoClient.connect(url, (err, dbC) => {
                var db = dbC.db(dbname);
                db.collection(articleB).insertMany(arr, (err, data) => {
                    console.log('插入数据成功')
                    urlSP = 'https://www.qiushibaike.com/hot/page/' + page
                    console.log(urlSP);
                    setTimeout(() => {
                        loadData();
                    }, 3000);


                })
            })





        })
}