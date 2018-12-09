# ChatRoom
利用 websocket + node.js 实现的 聊天室



### 设计思路

- 关于通讯

  > 基本思路：利用websocket 实现实时通讯。
  >
  > 存在的问题：每一次websocket 都是一个新的 websocket 并无状态，且websocket 与http不同，没有 cookie。
  >
  > 解决思路：借鉴http请求的cookie，每一次请求时自行带上自定义的cookie，若没有该cookie 则新生成一个。
  >
  > 现状：聊天室无需注册，用户信息全靠cookie保存，cookie生命周期为一年，所以基本上。


- 关于信息记录

  > 基本思路：JSON对象作为信息载体在服务器与客户端传输，且使用JSON存储用户信息与聊天记录。
  >
  > 存在的问题：当服务器重启时，信息全部丢失
  >
  > 解决思路：定时将内存的东西存入本地 .json 文件中
  >
  > 现状：服务启动时，将会利用 userList.json 和 chatrecord.json 恢复信息，且定时将内存中的文件存入本地备份




### chatServer

```js
wsServer_chat.js ---- 服务 

// nodejs-websocket 插件实现 websocket 服务
var WS = require("nodejs-websocket");
// 利用UUID充当 cookie
var UUID = require('node-uuid');
// 任务调度
var SCHEDULE = require('node-schedule');
// 服务端口号
var PORT = 2334;
// 存储用户信息 userCookie,userName，
var userInfos = {};
// 存储聊天记录 msgType,msgUser,msgContent,msgTime
var chatRecord = [];

//初始化 用户信息 聊天记录
userInfos = readJSON("userList.json");

// 连接人数计数器 从 10001开始
var clientCount = Object.keys(userInfos).length + 1000;

// 初始化 聊天记录
chatRecord = readJSON("chatrecrod.json");


var rule = new SCHEDULE.RecurrenceRule();
// 用户ttl 一分钟减一，为0时表示已下线
rule.second = [1];
var j = SCHEDULE.scheduleJob(rule, function() {});

// 十秒备份一次
rule.second = [1,11,21,31,41,51];
var k =  SCHEDULE.scheduleJob(rule, function() {});

// 新建 websocket server
var server = WS.createServer(function(conn) {
  
  // 当接收到信息时
  conn.on("text", function(req) {});
  // 当链接关闭时，处理
  conn.on("close", function(code, reason) {});
  // 当发送错误时
  conn.on("error", function(err) {});

}).listen(PORT);

//广播，向所有socket发送信息
function broadcast(msgType, msgUser, msgContent)；

//单播，向当前socket 发送信息
function unicast(conn, msgType, msgUser, msgContent)；

//从文件读取json对象
function readJSON(jsonFile)；

//json对象写入文件
function writeJSON(json, jsonFile)；

// 给Date 类新增方法，方便格式化时间
Date.prototype.format = function(fmt)；


```



### web

	前端网页部分

tt