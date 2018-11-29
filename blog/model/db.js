// 数据库的配置信息
var url = 'mongodb://localhost:27017'
var dbname = 'czblog';
var articleTable  = 'article';
var userTable = 'user';
var commentTable = 'comment';
var adminTable = 'admin';

module.exports = {
    url,dbname,articleTable,userTable,commentTable,adminTable
};
