// ==========================================
// CONTROLE DO PLACAR: ALTERE APENAS AQUI!
// ==========================================
const GOLS_DO_BRASIL = 1;
const GOLS_DO_ADVERSARIO = 1;
// ==========================================

let apostasDoArquivo = [];

async function carregarDadosDoTxt() {
    try {
        const resposta = await fetch('bolao_copa.txt');
        if (!resposta.ok) throw new Error('Não foi possível ler o arquivo txt');
        
        const texto = await resposta.text();
        const linhas = texto.split('\n');
        
        apostasDoArquivo = [];

        linhas.forEach(linha => {
            linha = linha.trim();
            if (linha === "") return;

            const regex = /^(\d+)x(\d+)\s+(.+)$/i;
            const resultado = inline = linha.match(regex);

            if (resultado) {
                apostasDoArquivo.push({
                    golsBr: parseInt(resultado[1]),
                    golsAdv: parseInt(resultado[2]),
                    nome: resultado[3].toUpperCase()
                });
            }
        });

        document.getElementById('placarBrasil').innerText = GOLS_DO_BRASIL;
        document.getElementById('placarAdversario').innerText = GOLS_DO_ADVERSARIO;

        atualizarTabela();

    } catch (erro) {
        console.error("Erro ao carregar o bolão:", erro);
    }
}

// Inicializa a carga do arquivo ao abrir a página
carregarDadosDoTxt();

function atualizarTabela() {
    if (apostasDoArquivo.length === 0) return;

    const realBr = GOLS_DO_BRASIL;
    const realAdv = GOLS_DO_ADVERSARIO;

    const corpoTabela = document.getElementById('corpoTabela');
    corpoTabela.innerHTML = "";

    apostasDoArquivo.forEach((aposta, index) => {
        const linha = document.createElement('tr');
        const acertouPlacar = (aposta.golsBr === realBr && aposta.golsAdv === realAdv);
        
        if (acertouPlacar) {
            linha.className = "ganhador";
            linha.innerHTML = `
                <td>${index + 1}</td>
                <td>${aposta.nome}</td>
                <td>${aposta.golsBr} x ${aposta.golsAdv}</td>
                <td>🎉 ACERTOU!</td>
            `;
        } else {
            linha.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${aposta.nome}</strong></td>
                <td>${aposta.golsBr} x ${aposta.golsAdv}</td>
                <td class="nao-acertou">-</td>
            `;
        }
        corpoTabela.appendChild(linha);
    });
}

function copiarPix() {
    const inputChave = document.getElementById('chavePix');
    const botao = document.getElementById('btnCopiar');

    inputChave.select();
    inputChave.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(inputChave.value);

    botao.innerText = "Copiado! ✔";
    botao.classList.add("copiado");

    setTimeout(() => {
        botao.innerText = "Copiar Código";
        botao.classList.remove("copiado");
    }, 3000);
}

// ==========================================
// LÓGICA DE CONTROLE DO VÍDEO (RODA UMA SÓ VEZ)
// ==========================================
const video = document.getElementById('videoIntro');
const containerVideo = document.getElementById('videoIntroContainer');

function gerenciarAberturaVideo() {
    // Verifica se o parente já entrou no site antes
    const jaAssistiu = localStorage.getItem('bolaoJaAssistiuVideo');

    if (jaAssistiu === 'sim') {
        // Se já assistiu, mantém o vídeo oculto e não faz nada
        if (containerVideo) containerVideo.classList.add('video-oculto');
        if (video) video.pause();
    } else {
        // Se é a primeira vez, remove a classe que esconde e tenta rodar
        if (containerVideo) containerVideo.classList.remove('video-oculto');
        
        if (video) {
            video.muted = true;
            video.play().catch(err => {
                console.log("Autoplay bloqueado. Aguardando clique em Entrar.");
            });

            // Quando o vídeo terminar EM DEFINITIVO, chama a função de fechar
            video.addEventListener('ended', function() {
                fecharVideoIntro();
            });
        }
    }
}

function fecharVideoIntro() {
    if (video) {
        video.pause();
    }
    if (containerVideo) {
        containerVideo.classList.add('video-oculto');
    }
    // Salva no celular da pessoa que ela já viu o vídeo
    localStorage.setItem('bolaoJaAssistiuVideo', 'sim');
}

// Executa a verificação assim que a página termina de carregar os dados
// Adicione esta chamada logo após a função atualizarTabela() no seu fluxo principal
setTimeout(gerenciarAberturaVideo, 100);