// ==========================================
// CONTROLE DO PLACAR: ALTERE APENAS AQUI!
// ==========================================
const GOLS_DO_BRASIL = 0;
const GOLS_DO_ADVERSARIO = 0;
// ==========================================

let apostasDoArquivo = [];

// Função que busca o arquivo .txt automaticamente
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
            const resultado = linha.match(regex);

            if (resultado) {
                apostasDoArquivo.push({
                    golsBr: parseInt(resultado[1]),
                    golsAdv: parseInt(resultado[2]),
                    nome: resultado[3].toUpperCase()
                });
            }
        });

        // Aplica o placar travado na tela do usuário
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

    // Utiliza as constantes seguras definidas no topo do script
    const realBr = GOLS_DO_BRASIL;
    const realAdv = GOLS_DO_ADVERSARIO;

    const corpoTabela = document.getElementById('corpoTabela');
    corpoTabela.innerHTML = "";

    apostasDoArquivo.forEach((aposta, index) => {
        const linha = document.createElement('tr');
        
        // Verifica se a aposta bate exatamente com o placar do jogo
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

// Função para copiar o código Pix automaticamente
function copiarPix() {
    const inputChave = document.getElementById('chavePix');
    const botao = document.getElementById('btnCopiar');

    inputChave.select();
    inputChave.setSelectionRange(0, 99999); // Para celulares
    navigator.clipboard.writeText(inputChave.value);

    botao.innerText = "Copiado! ✔";
    botao.classList.add("copiado");

    setTimeout(() => {
        botao.innerText = "Copiar Código";
        botao.classList.remove("copiado");
    }, 3000);
}