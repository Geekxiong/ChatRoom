# ChatRoom
利用 websocket + node.js 实现的 聊天室



###设计思路

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



###chatServer

	聊天服务
###web

	前端网页部分
