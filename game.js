const socket = io.connect("http://localhost:8181");

let primeiroJogador=false;
let salaID;

// criar um jogo
$(".criarBtn").click(function(){
    primeiroJogador=true;
    const nomeJogador=$("input[nome=p1nome").val();
    socket.emit('criarJogo',{nome:nomeJogador});
})

// novo jogo criado listenner
socket.on("novoJogo",(data)=>{
    $(".novaSala").hide();
    $(".entrarSala").hide();
    $("#message").html("Esperando outro jogador1, o id da sala é: "+data.salaID).show();
    salaID=data.salaID;
})

//entrar jogo criado emmiter
$(".entarBtn").click(function(){
    const nomeJogador=$("input[nome=p2nome").val();
    salaID=$("input[nome=salaID").val();
    socket.emit('entrarJogo',{
        name:nomeJogador,
        salaID:salaID
    });
})

//Jogador 2 entrou
socket.on("Jogador2entrou",(data)=>{
    transition(data);
  })

//Jogador 1 entrou
socket.on("Jogador1entrou",(data)=>{
    transition(data);
})

const transition=(data)=>{
    $(".novaSala").hide();
    $(".entrarSala").hide();
    $(".placar").show();
    $(".controles").show();
    $(".jogador1 .nome").html(data.p1nome);
    $(".jogador2 .nome").html(data.p2nome);
    $("#message").html(data.p2nome+" está aqui!").show();
}

//selecionar opcao
$(".controlar .botoes").click(function (){
    const escolha=$(this).html().trim();
    const choiceEvent=primeiroJogador?"escolha1":"escolha2";
    socket.emit(choiceEvent,{
        escolha: escolha,
        salaID:salaID
    });
})

//Resultado listenner
socket.on("resulado",(data)=>{
    if(data.ganhador=="empate"){
        $("#message").html("É um empate!");
    }else{
        updateDOM(primeiroJogador==data.ganhador?"jogador1":"jogador2");
    }
})

const atualizarDOM=(jogador)=>{
    const jogadorDOM=$("."+jogador+" span");
    const prevScore=parseInt(jogadorDOM.html().trim());
    jogadorDOM.html(prevScore+1);
    const ganhadorNome=$("."+jogador+" .nome").html().trim();
    $("#message").html(ganhadorNome+" marcou um ponto!");
}


