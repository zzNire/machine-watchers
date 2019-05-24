
var express = require('express')
var app = express(); 
var http = require('http').Server(app);

var io = require('socket.io')(http); //socket.io

var net = require('net');
//var url = "211.67.21.100:29999"
//tcp 连接

//监听客户端 3000端口
http.listen(3000, function () {
    console.log('listening on *:3000');
});

app.get('/',(require,response)=>{
    response.sendFile(__dirname + '/public/index.html');
})
app.use('/',express.static('public'));

// 建立TCP连接 获取机器数据
var HOST = '192.168.43.250';
var PORT = 29999;
var result;

var client = new net.Socket();
client.connect(PORT, HOST,()=>{
    console.log('connect successed');
});

client.on('data',data =>{
   // console.log(data);
    console.log(data.toString('ascii'));
    var result = data.toString('ascii').split(',');
    result = result.map(v=>parseFloat(v));
    console.log(result);
    io.emit('data',result);
})



client.on('close', function() {
    console.log('Connection closed');
});

/*
setInterval(()=>{
    io.emit('data',Math.random());
},1000);
*/