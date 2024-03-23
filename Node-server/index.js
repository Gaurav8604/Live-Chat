let express = require('express');
let app=express();
const port=8000;

var http=require('http').Server(app);
var io=require('socket.io')(http);

const path=require("path");
const mainfile=path.join(__dirname,'../')
app.use(express.static(mainfile));

app.get("/",function(req,res){
    res.sendFile(mainfile+"/index.html");
})

const activeusers={};

io.on('connection',(socket)=>{
    socket.on('new_user_joined',(username)=>{
        activeusers[socket.id]=username;
        socket.broadcast.emit("user_joined",username);

        socket.on('disconnect',()=>{
            socket.broadcast.emit("user_left",username);
        })
    })
    socket.on('send',(message)=>{
        socket.broadcast.emit('receive',{
            message:message,
            username:activeusers[socket.id],
        })
    })
})

http.listen(port,function(err){
    if(err) throw err;
    console.log('Server running at port '+port);
})
