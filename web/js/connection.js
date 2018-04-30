//新建 websocket
var websocket = new WebSocket("ws://192.168.1.104:2334/");

// websocket 打开时执行
websocket.onopen = function() {
  //console.log('WebSocket open');
  init();
}

// 关闭时执行
websocket.onclose = function() {
  //console.log("WebSocket close");
}

// 接收消息时执行
websocket.onmessage = function(response) {
  //console.log(response);
  recvMsg(response);
}

// 打开链接时，初始化用户信息
function init() {
  // 读取cookie 给服务器端 判断是否已经登录过
  var chatRoomID = getCookie("chatRoomID");
  sendMsg("init", chatRoomID, null);
}

//获取cookie
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

//设置cookie
function setCookie(name, value, exdays) {
  if (exdays == undefined || exdays == null) {
    exdays = 365 ;
  }
  if (typeof(exdays) != 'number') {
    exdays = 365; //默认365天
  }
  var exp = new Date();
  exp.setTime(exp.getTime() + (exdays * 24 * 60 * 60 * 1000));
  //path=/表示全站有效，而不是当前页
  document.cookie = name + "=" + value + ";path=/;expires=" + exp.toUTCString();
}

//向服务器发送信息，消息类型，用户，消息内容
function sendMsg(msgType, msgUser, msgContent) {
  var data = {
    "msgType": msgType,
    "msgUser": msgUser,
    "msgContent": msgContent
  };
  websocket.send(JSON.stringify(data));
}

//接收服务器端相应
function recvMsg(response) {
  data = JSON.parse(response.data);

  //服务器端消息 --- 初始化用户
  if (data.msgType == "init") {
    setCookie("chatRoomID", data.msgContent, 365);
    var chatRoomID = getCookie("chatRoomID");
    var t = chatRoomID.split("#");
    $("#userName").text(t[1]);
  } else if (data.msgType == "chatRecord") {
    //console.log("初始化聊天记录");
    showChatRecord(data.msgContent);
  }else {
    showMessgae(data);
  }
  setTimeout("toBottom()",200);
}

//发送消息
$("#sendBtn").click(function(){
  var txt = $("#sendText").val().trim();
  if (txt.length <= 0) {
    return;
  }
  var chatRoomID = getCookie("chatRoomID");
  sendMsg("message", chatRoomID, txt);
  $("#sendText").val("");
});
