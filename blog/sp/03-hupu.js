var urlSP = 'https://bbs.hupu.com/selfie-2';
var superagent = require('superagent');

//jquery
var cheerio = require('cheerio');

superagent
.get(urlSP)
.end((req,res) => {
    //页面数据
    console.log(res.text)
    $ = cheerio.load(res.text);
    var arr = [];
    $('.truetit').each((index,value) => {
        console.log($(value).text())
        var obj = {title:$(value).text(),content:$(value).html(),time:new Date()}
        arr.push(obj)
    })

    



})
