//消息通知
var NotificationHandler = {
  isNotificationSupported: 'Notification' in window,
  isPermissionGranted: function() {
    if(Notification.permission === 'granted'){
      return true;
    }else if(Notification.permission === 'denied'){
      return false;
    }else {
      NotificationHandler.requestPermission();
      return Notification.permission === 'granted';
    }
  },
  requestPermission: function() {
    if (!this.isNotificationSupported) {
      //console.log('当前浏览器不支持Notification API');
      return;
    }

    Notification.requestPermission(function(status) {
      //console.log('status: ' + status);
      var permission = Notification.permission;
      //console.log('permission: ' + permission);
    });
  },

  showNotification: function(str) {
    NotificationHandler.requestPermission();
    if (!this.isNotificationSupported) {
      //console.log('当前浏览器不支持Notification API');
      return;
    }
    if (!this.isPermissionGranted()) {
      //console.log('当前页面未被授权使用Notification通知');
      return;
    }

    var n = new Notification("您有一条新消息", {
      icon: '../img/1.jpg',
      body: str
    });

    n.onshow = function() {
      //console.log('显示通知信息');
      //5秒后自动关闭消息框
      setTimeout(function() {
        n.close();
      }, 3000);
    };
    n.onclick = function() {
      //alert('打开相关视图');
      //opening the view...
      window.focus();
      n.close();
    };
    n.onerror = function() {
      console.log('产生错误');
      //do something useful
    };
    n.onclose = function() {
      //console.log('关闭通知窗口');
      //do something useful
    };
  }
};

//不能由页面调用(onload)
document.addEventListener('load', function() {
  NotificationHandler.requestPermission();
});
