const personagem = document.getElementById("personagem");
const inimigo = document.getElementById("inimigo");
const cenario = document.getElementById("cenario");
const botaoReiniciar = document.getElementById("reiniciar");
const botaoIniciar = document.getElementById("iniciar");
const vidas = document.getElementById("vidas");
const moedas = document.getElementById("moedas");
const pontos = document.getElementById("pontos");
const tempo = document.getElementById("tempo");
const bloco = document.getElementById("bloco");
const estrelas = document.getElementById("estrelas");

const larguraCenario = cenario.offsetWidth;
const larguraPersonagem = personagem.offsetWidth;

let sentido = 1;
let sentidoAtual;
let posicao = 0;
let direcao = 0;
let velocidade = 10;

let jogoIniciado = false;

let vidasAtual = parseInt(localStorage.getItem("vidasAtual") || 5);
vidas.textContent = vidasAtual;
let moedasAtual = parseInt(localStorage.getItem("moedasAtual") || 0);
moedas.textContent = moedasAtual;
let pontosAtual = parseInt(localStorage.getItem("pontosAtual") || 0);
pontos.textContent = pontosAtual;
let tempoAtual = parseInt(localStorage.getItem("tempoAtual") || 300);
tempo.textContent = tempoAtual;
let estrelasAtual = parseInt(localStorage.getItem("estrelaAtual") || 0);
estrelas.textContent = estrelasAtual;

let checarColisaoComBloco;
let checarRelogio;
let checarColisaoComInimigo;

function teclaPressionada(event) {
    if (event.key === "ArrowRight") {
        direcao = 1;
        sentido = 1;
        personagem.style.backgroundImage = "url(../images/marioAndandoLadoDireito.gif)";
    } else if (event.key === "d") {
        sentido = 1;
        direcao = 1;
        personagem.style.backgroundImage = "url(../images/marioAndandoLadoDireito.gif)";
    } else if (event.key === "ArrowLeft") {
        sentido = -1;
        direcao = -1;
        personagem.style.backgroundImage = "url(/src/images/marioAndandoLadoEsquerdo.gif)";
    } else if (event.key === "a") {
        sentido = -1;
        direcao = -1;
        personagem.style.backgroundImage = "url(/src/images/marioAndandoLadoEsquerdo.gif)";
    } else if (event.code === "Space") {
        sentidoAtual = personagem.style.backgroundImage;
        if (sentido === 1) {
            personagem.classList.add("puloPersonagem");
            personagem.style.backgroundImage = "url(/src/images/marioPulandoDireita.png)"
        } else if (sentido === -1) {
            personagem.classList.add("puloPersonagem");
            personagem.style.backgroundImage = "url(/src/images/marioPulandoEsquerda.png)"
        }
        setTimeout(() => {
            personagem.classList.remove("puloPersonagem");
            personagem.style.backgroundImage = sentidoAtual;
        }, 750)
    }
}

function teclaSolta(event) {
    if (event.key === "ArrowRight") {
        direcao = 0;
        personagem.style.backgroundImage = "url(/src/images/marioParadoLadoDireito.png)";
    } else if (event.key === "d") {
        direcao = 0;
        personagem.style.backgroundImage = "url(/src/images/marioParadoLadoDireito.png)";
    }
    else if (event.key === "ArrowLeft") {
        direcao = 0;
        personagem.style.backgroundImage = "url(/src/images/marioParadoLadoEsquerdo.png)";
    } else if (event.key === "a") {
        direcao = 0;
        personagem.style.backgroundImage = "url(/src/images/marioParadoLadoEsquerdo.png)";
    }
}

function atualizaMovimentos() {
    posicao += direcao * velocidade;
    if (posicao < 0)
        posicao = 0;
    else if (posicao + larguraPersonagem > larguraCenario)
        posicao = larguraCenario - larguraPersonagem;
    personagem.style.left = posicao + "px"
}

function colisaoComBloco() {
    const checarPersonagem = personagem.getBoundingClientRect();
    const checarBloco = bloco.getBoundingClientRect();
    if (
        checarBloco.left < checarPersonagem.right &&
        checarBloco.right > checarPersonagem.left &&
        checarBloco.top < checarPersonagem.bottom &&
        checarBloco.bottom > checarPersonagem.top
    ) {
        clearInterval(checarColisaoComBloco);
        moedasAtual++;
        moedas.textContent = moedasAtual;
        localStorage.setItem("moedasAtual", moedasAtual);
        pontosAtual += +10;
        pontos.textContent = pontosAtual;
        localStorage.setItem("pontosAtual", pontosAtual)
        checarMoedas();
        checarPontos();
        setTimeout(() => {
            checarColisaoComBloco = setInterval(colisaoComBloco, 10);
        }, 500)
    }
}

function checarMoedas() {
    if (moedasAtual === 20) {
        moedasAtual = 0;
        moedas.textContent = moedasAtual;
        vidasAtual++;
        vidas.textContent = vidasAtual;
    }
}

function checarPontos() {
    if (pontosAtual === 500) {
        tempoAtual += 60;
        tempo.textContent = tempoAtual
    } else if (pontosAtual === 1000) {
        pontosAtual = 0;
        pontos.textContent = pontosAtual;
        tempoAtual += 60;
        tempo.textContent = tempoAtual;
        estrelasAtual++;
        localStorage.setItem("estrelasAtual", estrelasAtual);
        estrelas.textContent = estrelasAtual;
    }
}

function timer() {
    tempoAtual--;
    tempo.textContent = tempoAtual;
    localStorage.setItem("tempoAtual", tempoAtual);
    if (tempoAtual === 60) {
        alert("CORRA O TEMPO ESTA ACABANDO!!!");
    } else if (tempoAtual === 0) {
        gameOver();
    }
}

function removerTeclas() {
    document.removeEventListener("keydown", teclaPressionada);
    document.removeEventListener("keyup", teclaSolta);
}

function colisaoComInimigo() {
    const checarPersonagem = personagem.getBoundingClientRect();
    const checarInimigo = inimigo.getBoundingClientRect();
    if (
        checarInimigo.left < checarPersonagem.right &&
        checarInimigo.right > checarPersonagem.left &&
        checarInimigo.top < checarPersonagem.bottom &&
        checarInimigo.bottom > checarPersonagem.top
    ) {
        clearInterval(checarColisaoComInimigo);
        vidasAtual--;
        vidas.textContent = vidasAtual;
        localStorage.setItem("vidasAtual", vidasAtual);
        gameOver();
        setTimeout(() => {
            checarJogo();
        }, 1000)
    }
}

function gameOver() {
    removerTeclas();
    clearInterval(checarRelogio);
    personagem.style.backgroundImage = "url(../images/marioMorto.gif)";
    inimigo.style.display = "none";
    direcao = 0;
}

function checarJogo() {
    if (vidasAtual >= 1) {
        location.reload();
    } else {
        botaoReiniciar.style.display = "block";
    }
}

botaoReiniciar.addEventListener("click", function () {
    vidasAtual = 5;
    vidas.textContent = vidasAtual;
    localStorage.setItem("vidasAtual", vidasAtual);
    tempoAtual = 300;
    tempo.textContent = tempoAtual;
    localStorage.setItem("tempoAtual", tempoAtual);
    moedasAtual = 0;
    moedas.textContent = moedasAtual;
    localStorage.setItem("moedasAtual", moedasAtual);
    pontosAtual = 0;
    pontos.textContent = pontosAtual;
    localStorage.setItem("pontosAtual", pontosAtual)
    location.reload();
})

botaoIniciar.addEventListener("click", function () {
    document.addEventListener("keydown", teclaPressionada);
    document.addEventListener("keyup", teclaSolta);
    setInterval(atualizaMovimentos, 30);
    checarRelogio = setInterval(timer, 1000);
    checarColisaoComBloco = setInterval(colisaoComBloco, 10);
    checarColisaoComInimigo = setInterval(colisaoComInimigo, 10)
    inimigo.classList.add("animarInimigo");
    botaoIniciar.style.display = "none";
    jogoIniciado = true;
})



document.addEventListener("keydown", function () {
    if (event.key === "Enter" && jogoIniciado === false) {
        document.addEventListener("keydown", teclaPressionada);
        document.addEventListener("keyup", teclaSolta);
        setInterval(atualizaMovimentos, 30);
        checarColisaoComBloco = setInterval(colisaoComBloco, 10);
        checarRelogio = setInterval(timer, 1000);
        checarColisaoComInimigo = setInterval(colisaoComInimigo, 10)
        inimigo.classList.add("animarInimigo");
        botaoIniciar.style.display = "none";
        jogoIniciado = true;
    } else if (event.key === "Enter" && jogoIniciado === true) {
        alert("jogo ja iniciado");
    }
})