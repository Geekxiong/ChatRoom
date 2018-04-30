//显示消息
//function showMessgae(data) {

//  var div = $("<div><div>");
//  var str = "";
//  if (data.msgType == "message") {
//    str = data.msgUser + "\t\t\t\t" + data.msgTime + "<br>" + data.msgContent;
//  } else {
//    str = "" + data.msgTime + "\t\t\t\t" + data.msgUser + " " + data.msgContent;
//    if (data.msgType == "info") {
//     div.css("color", "blue");
//    } else {
//      div.css("color", "red");
//    }
//  }
//  div.html(str);
//  $("#recv").append(div);
//  $("#recv").append($("<hr>"));
//  messageHints(data.msgContent);
//}

//解决 输出未转义造成的 xss 
function showMessgae(data) {

  var div = $("<div><div>");
  var span1 = $("<span><span>");
  var span2 = $("<span><span>");
  if (data.msgType == "message") {
    var str = data.msgUser + "\t\t" + data.msgTime;
	span1.text(str);
	div.append(span1);
	div.append("<br>");
  } else {
    var str = "" + data.msgTime + "\t\t" + data.msgUser;
	span1.text(str);
	div.append(span1);
	div.append(" ");
    if (data.msgType == "info") {
      div.css("color", "blue");
    } else {
      div.css("color", "red");
    }
  }
  span2.text(data.msgContent);
  
  div.append(span2);
  div.append("<hr>");
  $("#recv").append(div);
  messageHints(data.msgContent);
}

//显示历史聊天记录
function showChatRecord(list) {
  list.forEach(function(data) {
    showMessgae(data);
  });
}

//置底
function toBottom() {
  $('html,body').animate({
    scrollTop: $('#bottom').offset().top
  }, 500);
  return false;
}


//判断是否在浏览本页
var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
    'mozHidden' in document ? 'mozHidden' :
    null;
console.log(hiddenProperty);
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function(){
  if (!document[hiddenProperty]) {
    //正在浏览此页
    return true;
  }else{
    return false;
  }
}

function messageHints(str) {
  //console.log(onVisibilityChange());
  if (!onVisibilityChange()) {
    setTimeout(function() {
      NotificationHandler.showNotification(str);
    }, 500);
  }
}
