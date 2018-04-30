var WS = require("nodejs-websocket");
var UUID = require('node-uuid');
var SCHEDULE = require('node-schedule');

// 服务端口号
var PORT = 2334;

// 存储用户信息 userCookie,userName，
var userInfos = {};
var chatRecord = [];
//初始化 用户信息聊天记录
try {
  userInfos = readJSON("userList.json");
} catch (e) {
  console.log("读取用户信息失败");
  userInfos = {};
}
// 连接人数计数器
var clientCount = Object.keys(userInfos).length + 1000;

try {
  chatRecord = readJSON("chatrecrod.json");
}catch(e){
  console.log("读取聊天记录失败");
  chatRecord = [];
}

//定时将用户ttl 减一
var rule = new SCHEDULE.RecurrenceRule();
rule.second = [1];
var j = SCHEDULE.scheduleJob(rule, function() {
  for (var p in userInfos) {
    if (userInfos[p].ttl > 0) {
      userInfos[p].ttl--;
    }
  }
});

//十秒备份一次
rule.second = [1,11,21,31,41,51];
var k =  SCHEDULE.scheduleJob(rule, function() {
  try {
    writeJSON(userInfos, "userList.json");
  } catch (e) {
    console.log(e);
  }
  try {
    writeJSON(chatRecord, "chatrecrod.json");
  } catch (e) {
    console.log(e);
  }
});

var server = WS.createServer(function(conn) {
  console.log("New Connection !");
  var nickname = null;
  conn.on("text", function(req) {
    var request = JSON.parse(req);
    try {
      nickname = userInfos[request.msgUser].nickname;
    } catch (e) {
      nickname = null;
    }

    // 如果不存在，则表示未登录过，则设置初始信息
    if (!nickname) {
      clientCount++;
      nickname = "User_" + clientCount;
      var cookie = UUID.v4() + "#" + nickname;
      var info = {
        "nickname": nickname,
        "ttl": 0
      }
      request.msgUser = cookie;
      userInfos[cookie] = info;
      unicast(this, "init", "admin", cookie);
    }

    //ttl 为 0 表示新获取用户名，或者 30分钟未发言
    if (request.msgType == "init") {
      //第一次打开页面时 发送历史信息
      unicast(this, "chatRecord", "admin", chatRecord);

      if (userInfos[request.msgUser].ttl == 0) {
        broadcast("info", nickname, "comes in!");
      }

    } else {
      broadcast("message", nickname, request.msgContent);
    }

    //重新发言 恢复30分钟
    userInfos[request.msgUser].ttl = 30;
    console.log("Received " + nickname + " : " + req);
  });

  conn.on("close", function(code, reason) {
    console.log("Connection closed");
    //broadcast("info",nickname,"left");
  });

  conn.on("error", function(err) {
    console.log("system err !");
    //console.log(err);
  });

}).listen(PORT);

console.log("ChatRoom Service Started , Listening on port: " + PORT);


//广播
function broadcast(msgType, msgUser, msgContent) {
  var data = {
    "msgType": msgType,
    "msgUser": msgUser,
    "msgContent": msgContent,
    "msgTime": new Date().format("yyyy-MM-dd hh:mm:ss")
  };
  chatRecord.push(data);
  data = JSON.stringify(data);
  server.connections.forEach(function(connection) {
    connection.sendText(data);
  });
}

//单播
function unicast(conn, msgType, msgUser, msgContent) {
  var data = {
    "msgType": msgType,
    "msgUser": msgUser,
    "msgContent": msgContent,
    "msgTime": new Date().format("yyyy-MM-dd hh:mm:ss")
  };
  data = JSON.stringify(data);
  conn.send(data);
}

function readJSON(jsonFile) {
  var fs = require('fs');
  var result = JSON.parse(fs.readFileSync(jsonFile));
  return result;
}

function writeJSON(json, jsonFile) {
  var fs = require('fs');
  fs.writeFileSync(jsonFile, JSON.stringify(json));
}

Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
