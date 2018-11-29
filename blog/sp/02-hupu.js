var urlSP = 'https://bbs.hupu.com/selfie-2';
var https = require('https');

var html = ''
https.get(urlSP,(res,req) => {
    res.on('data',(data) => {
        html += data;
    })
    res.on('end',() => {
        console.log(html)
    })
})