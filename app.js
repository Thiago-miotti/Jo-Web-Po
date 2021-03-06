const app=require('express');
const socket=require('socket.io');
const randomstring=require('randomstring');

const express=app();

express.use(app.static('public'));

const PORT = process.env.PORT || 4000;

const server=express.listen(PORT,()=>{
    console.log("Servidor Ok!");
})

const io=socket(server);

//ALL player info
let players={};
//GAME VARIABLES
let choice1="",choice2="";

io.on("connection",(socket)=>{
    console.log("Conectado");

    //Create Game Listener
    socket.on("createGame",(data)=>{
        const roomID=randomstring.generate({length: 4});       
        socket.join(roomID);        
        players[roomID]=data.name;
        socket.emit("newGame",{roomID:roomID});
    })

    //Join Game Listener
    socket.on("joinGame",(data)=>{        
        socket.join(data.roomID);
        socket.to(data.roomID).emit("player2Joined",{p2name: data.name,p1name:players[data.roomID]});
        socket.emit("player1Joined",{p2name:players[data.roomID],p1name:data.name});
    })

    //Listener to Player 1's Choice
    socket.on("choice1", (data)=> {
        choice1 = data.choice;
        console.log(choice1, choice2);
        if (choice2 != "") {
            result(data.roomID);
        }
    });
    //Listener to Player 2's Choice
    socket.on("choice2", (data)=> {
        choice2 = data.choice;
        console.log(choice1, choice2);
        if (choice1 != "") {
            result(data.roomID);
        }
    });
})

//Function to calculate winner
const getWinner=(p, c)=>  {
    if (p === c) {
        return "draw";
    } else if (p === "Rock") {
        if (c === "Paper") {
            return false;
        } else {
            return true;
        }
    } else if (p === "Paper") {
        if (c === "Scissor") {
            return false;
        } else {
            return true;
        }
    } else if (p === "Scissor") {
        if (c === "Rock") {
            return false;
        } else {
            return true;
        }
    }
}
//Function to do executed after gettin both choices
const result=(roomID)=> {
    var winner = getWinner(choice1, choice2);
    io.sockets.to(roomID).emit("result", {
        winner: winner
    });
    choice1 = "";
    choice2 = "";
}