const socket=io();
const form =document.getElementById('sendcont');
const messageInput =document.getElementById('send_msg');
const messageContainer =document.getElementById('messagebox');
let audio=new Audio("/resources/audio/notify.mp3");

const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.appendChild(messageElement);
    if(position=='left') audio.play();
};

form.addEventListener('submit',(evnt)=>{
    evnt.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value="";
})

const username=prompt('Enter your username');
socket.emit("new_user_joined",username);

socket.on("user_joined",(username)=>{
    append(`${username} joined the party :)`,'center');
})

socket.on('receive',(data)=>{
    append(`${data.username} : ${data.message}`,'left')
})

socket.on("user_left",(username)=>{
    append(`${username} left the party :(`,'center');
})