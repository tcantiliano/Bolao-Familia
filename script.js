// ==========================================
// CONTROLE DO PLACAR: ALTERE APENAS AQUI!
// ==========================================
const GOLS_DO_BRASIL = 0;
const GOLS_DO_ADVERSARIO = 0;
// ==========================================

let apostasDoArquivo = [];

async function carregarDadosDoTxt() {
    try {
        // Altere para o nome do seu arquivo oficial na hospedagem se preferir (ex: bolao_copa.txt)
        const resposta = await fetch('bolao_copa.txt');
        if (!resposta.ok) throw new Error('Não foi possível ler o arquivo txt');
        
        const texto = await resposta.text();
        const linhas = texto.split('\n');
        
        apostasDoArquivo = [];

        linhas.forEach(linha => {
            linha = linha.trim();
            if (linha === "") return;

            // Divide a linha por vírgula
            const partes = linha.split(',');
            
            if (partes.length >= 2) {
                const nome = partes[0].trim().toUpperCase();
                const aposta1 = partes[1].trim();
                const aposta2 = partes[2] ? partes[2].trim() : '--';
                
                // Calcula a quantidade de apostas com base no preenchimento ou no número informado
                let qtd = 1;
                if (partes[3]) {
                    qtd = parseInt(partes[3].trim()) || 1;
                } else if (aposta2 !== '--' && aposta2 !== '') {
                    qtd = 2;
                }

                apostasDoArquivo.push({ nome, aposta1, aposta2, qtd });
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

    const realPlacar = `${GOLS_DO_BRASIL}x${GOLS_DO_ADVERSARIO}`;

    const corpoTabela = document.getElementById('corpoTabela');
    corpoTabela.innerHTML = "";

    apostasDoArquivo.forEach((aposta, index) => {
        const linha = document.createElement('tr');
        
        // Verifica se alguma das duas apostas bate com o placar atual (ignorando espaços)
        const limpouAp1 = aposta.aposta1.replace(/\s+/g, '');
        const limpouAp2 = aposta.aposta2.replace(/\s+/g, '');
        
        const acertouAp1 = (limpouAp1 === realPlacar);
        const acertouAp2 = (limpouAp2 === realPlacar && limpouAp2 !== '--');
        
        if (acertouAp1 || acertouAp2) {
            linha.className = "ganhador";
            linha.innerHTML = `
                <td>${index + 1}</td>
                <td>${aposta.nome}</td>
                <td class="${acertouAp1 ? 'palpite-certeiro' : ''}">${aposta.aposta1}</td>
                <td class="${acertouAp2 ? 'palpite-certeiro' : ''}">${aposta.aposta2}</td>
                <td>${aposta.qtd}</td>
                <td>🎉 ACERTOU!</td>
            `;
        } else {
            linha.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${aposta.nome}</strong></td>
                <td>${aposta.aposta1}</td>
                <td>${aposta.aposta2}</td>
                <td>${aposta.qtd}</td>
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
    const jaAssistiu = localStorage.getItem('bolaoJaAssistiuVideo');

    if (jaAssistiu === 'sim') {
        if (containerVideo) containerVideo.classList.add('video-oculto');
        if (video) video.pause();
    } else {
        if (containerVideo) containerVideo.classList.remove('video-oculto');
        
        if (video) {
            video.muted = true;
            video.play().catch(err => {
                console.log("Autoplay bloqueado. Aguardando clique em Entrar.");
            });

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
    localStorage.setItem('bolaoJaAssistiuVideo', 'sim');
}

setTimeout(gerenciarAberturaVideo, 100);