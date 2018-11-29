# nodejs搭建blog系统

0. 项目创建
    1. express 项目生成器 
    2. 安装提示安装项目依赖，启动项目
    3. router 路由   views 模板   public  静态资源
    4. npm scripts  增加了脚本    supervisor  bin/www
    5. 进入数据库bin目录 C:\Program Files\MongoDB\Server\4.0\bin
    6. 数据库bin目录下cmd  启动数据库 mongod --dbpath c:\db 
1. 注册功能
    1. 安装数据库 npm i mongodb -S
    2. 注册页面路由编写
    3. 注册模板编写
    4. 注册接口编写(获取前端提交的数据,数据库（查询，插入）（ajax（location.href），form(req.redirect)）)
2. 登录功能
    1. 登录页面路由编写
    2. 登录模板编写
    3. 登录接口表写（数据库 查询）
3. 使用session会话记录登录状态
    1. 安装sesson模块   npm i express-session -S
    2. app.js中引入挂载session模块
    3. 登录接口路由中保存session
    4. 其他路由中可以使用session中保存的数据
    5. 把session存贮在MongoDB中  
    6. 安装 npm i connect-mongo@0.8.2 -S
    7. app.js中配置
4. 密码加密功能
    1. 使用nodejs内置模块 crypto 
    2. 注册路由时候密码加密
    3. 登录路由密码加密
   
5. 发表功能
    1.  模板编写
    2.  路由接口编写（标题，内容） 数据库（查询，插入，更新，删除）
6. 文章列表
    1. 用户文章列表 （模板，路由）

    2. 首页文章列表   和用户文章列表一样

    3. 文章列表进入详情 ，注意查询 id的 是个对象（ObjectID） 还是 个字符串
    4. 分页 (find limit  skip)
7. 文件上传, 图片上传（个人信息）
    1. 表单post
    2. npm i multer -S  
    3. 挂载
8.  ue 富文本编辑器 
    1.  npm 安装 ue
    2.  appjs中 在 mutil 中间件前面 挂载  ue中间件
    3.  public 放ue的静态资源
    4.  发表文章模板   发表的框  script    ，引入uejs文件，实例化ue对象
    5.  文章详情模板 把 详情显示   《%- %》
9.  文章浏览次数
    1.  文章详情路由 修改 findOneAndUpdate    {$inc:{pv:1}},{returnOriginal:false}
    2.  注意 修改之后返回的数据跟原来 不一样，需要修改渲染的数据
        ```
            res.render('article',{
                title:'文章详情',
                username:req.session.username,
                article:data.value,
                formatTime
            })
        ```
        
## todo

   评论 （发表评论，评论）

   
   
```
https://github.com/trending
http://www.bootcss.com/
https://juejin.im/

```





