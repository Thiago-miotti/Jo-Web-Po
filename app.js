const app = require('express');
const socket = require('socket.io');
const randomstring = require('randomstring');

const express = app();

const server=express.listen(4000,()=>{
    console.log("servidor inicializado no http://localhost:4000");
})

express.use(app.static('public'));

const io=socket(server);

let jogadores={};

let escolha1="",escolha2="";
    
    
    io.on("conexao", (socket)=>{
        console.log("conexão estabilizada")

    socket.on("criarJogo", (data)=>{
        const salaID=ramdomstring.generate({length:4});
        socket.join(salaID);
        jogadores[salaID] = data.name;
        socket.emit("novoJogo",{salaID:salaID});
    })
})


//entrar jogo criado listenner

socket.on("entrarJogo",(data)=>{
    socket.join(data.salaID);
    socket.to(data.salaID).emit("Jogador2entrou",{p2nome: data.nome,p1nome:jogadores[data.salaID]});
    socket.emit("Jogador1entrou",{p2nome:jogadores[data.salaID],p1nome:data.nome});
})


//jogador 1 escolha
socket.on("escolha1", (data)=> {
    escolha1 = data.escolha;
    console.log(escolha1, escolha2);
    if (escolha2 != "") {
        result(data.salaID);
    }
});

//jogador 2 escolha
socket.on("escolha2", (data)=> {
    escolha2 = data.escolha;
    console.log(escolha1, escolha2);
    if (escolha1 != "") {
        result(data.salaID);
    }
});

//funcao para ser executada ao fim das 2 escolhas
const result=(salaID)=> {
    var ganhador = getWinner(escolha1, escolha2);
    io.sockets.to(salaID).emit("resultado", {
        ganhador: ganhador
    });
    escolha1 = "";
    escolha2 = "";
}

//Funcao para calcular um vencedor
const getWinner=(p, c)=>  {
    if (p === c) {
        return "empate";
    } else if (p === "Pedra") {
        if (c === "Papel") {
            return false;
        } else {
            return true;
        }
    } else if (p === "Papel") {
        if (c === "Tesoura") {
            return false;
        } else {
            return true;
        }
    } else if (p === "Tesoura") {
        if (c === "Pedra") {
            return false;
        } else {
            return true;
        }
    }
}