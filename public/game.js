const socket = io.connect("http://localhost:4000");

let firstPlayer=false;
let roomID;

//Create Game Event Emitter
$(".createBtn").click(function(){
    firstPlayer=true;
    const playerName=$("input[name=p1name").val();
    socket.emit('createGame',{name:playerName});
})

//New Game Created Listener
socket.on("newGame",(data)=>{
    $(".newRoom").hide();
    $(".joinRoom").hide();
    $("#message").html("Esperando o jogador 2, o ID da sala é "+data.roomID).show();
    roomID=data.roomID;
})

//Join Game Event Emitter
$(".joinBtn").click(function(){
    const playerName=$("input[name=p2name").val();
    roomID=$("input[name=roomID").val();    
    socket.emit('joinGame',{
        name:playerName,
        roomID:roomID
    });
})

//Player 2 Joined
socket.on("player2Joined",(data)=>{
    transition(data)  ;
  })
  
//Player 1 Joined
socket.on("player1Joined",(data)=>{
    transition(data)  ;
})

//Select Choice
$(".controls button").click(function (){
    const choice=$(this).html().trim();
    const choiceEvent=firstPlayer?"choice1":"choice2";
    socket.emit(choiceEvent,{
        choice: choice,
        roomID:roomID
    });
})

//Result Event Listener
socket.on("result",(data)=>{
    if(data.winner=="draw"){
        $("#message").html("Empate!");
    }else{
        updateDOM(firstPlayer==data.winner?"player1":"player2");
    }
})

const updateDOM=(player)=>{
    const playerDOM=$("."+player+" span");
    const prevScore=parseInt(playerDOM.html().trim());
    playerDOM.html(prevScore+1);
    const winnerName=$("."+player+" .name").html().trim();
    $("#message").html(winnerName+" fez um ponto!");
}

const transition=(data)=>{
    $(".newRoom").hide();
    $(".joinRoom").hide();
    $(".leaderboard").show();
    $(".controls").show();
    $(".player1 .name").html(data.p1name);
    $(".player2 .name").html(data.p2name);
    $("#message").html(data.p2name+" chegou !").show();
}