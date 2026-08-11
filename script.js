// =====================================================
// CONFIGURAÇÕES INICIAIS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    ativarMenuAutomatico();
    prepararAnimacaoCards();
    prepararBusca();
    prepararFiltros();
    prepararCurtidas();
    criarBotaoTopo();

});


// =====================================================
// MENU ATIVO CONFORME A ROLAGEM
// =====================================================

function ativarMenuAutomatico() {

    const secoes = document.querySelectorAll("section[id]");
    const linksMenu = document.querySelectorAll("nav a");

    window.addEventListener("scroll", () => {

        let secaoAtual = "";

        secoes.forEach(secao => {

            const topo = secao.offsetTop - 150;
            const altura = secao.offsetHeight;

            if (
                window.scrollY >= topo &&
                window.scrollY < topo + altura
            ) {
                secaoAtual = secao.getAttribute("id");
            }

        });

        linksMenu.forEach(link => {

            link.classList.remove("ativo");

            const destino = link.getAttribute("href");

            if (destino === "#" + secaoAtual) {
                link.classList.add("ativo");
            }

        });

    });

}


// =====================================================
// ANIMAÇÃO DOS CARDS AO APARECEREM NA TELA
// =====================================================

function prepararAnimacaoCards() {

    const cards = document.querySelectorAll("article");

    const observador = new IntersectionObserver(

        entradas => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");
                }

            });

        },

        {
            threshold: 0.15
        }

    );

    cards.forEach(card => {
        card.classList.add("animar-card");
        observador.observe(card);
    });

}


// =====================================================
// BUSCA DE PROJETOS
// =====================================================

function prepararBusca() {

    const campoBusca = document.querySelector("#buscar-projeto");

    if (!campoBusca) {
        return;
    }

    campoBusca.addEventListener("input", () => {

        const termo = campoBusca.value
            .toLowerCase()
            .trim();

        const cards = document.querySelectorAll("article");

        cards.forEach(card => {

            const texto = card.innerText.toLowerCase();

            if (texto.includes(termo)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

}


// =====================================================
// FILTRO POR TURMA E TRIMESTRE
// =====================================================

function prepararFiltros() {

    const filtroTurma = document.querySelector("#filtro-turma");
    const filtroTrimestre = document.querySelector("#filtro-trimestre");

    if (!filtroTurma && !filtroTrimestre) {
        return;
    }

    const aplicarFiltros = () => {

        const turmaSelecionada =
            filtroTurma ? filtroTurma.value : "todos";

        const trimestreSelecionado =
            filtroTrimestre ? filtroTrimestre.value : "todos";

        const cards = document.querySelectorAll("article[data-turma]");

        cards.forEach(card => {

            const turmaCard = card.dataset.turma;
            const trimestreCard = card.dataset.trimestre;

            const turmaOk =
                turmaSelecionada === "todos" ||
                turmaCard === turmaSelecionada;

            const trimestreOk =
                trimestreSelecionado === "todos" ||
                trimestreCard === trimestreSelecionado;

            if (turmaOk && trimestreOk) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    };

    if (filtroTurma) {
        filtroTurma.addEventListener("change", aplicarFiltros);
    }

    if (filtroTrimestre) {
        filtroTrimestre.addEventListener("change", aplicarFiltros);
    }

}


// =====================================================
// CURTIDAS DOS PROJETOS
// =====================================================

function prepararCurtidas() {

    const botoes = document.querySelectorAll(".btn-curtir");

    botoes.forEach(botao => {

        const idProjeto = botao.dataset.projeto;

        if (!idProjeto) {
            return;
        }

        const chave = "curtidas_" + idProjeto;
        const chaveUsuario = "curtiu_" + idProjeto;

        let curtidas =
            Number(localStorage.getItem(chave)) || 0;

        const contador = botao.querySelector("span");

        if (contador) {
            contador.textContent = curtidas;
        }

        if (localStorage.getItem(chaveUsuario) === "sim") {
            botao.classList.add("curtido");
        }

        botao.addEventListener("click", () => {

            const jaCurtiu =
                localStorage.getItem(chaveUsuario) === "sim";

            if (jaCurtiu) {

                curtidas = Math.max(0, curtidas - 1);

                localStorage.setItem(
                    chaveUsuario,
                    "nao"
                );

                botao.classList.remove("curtido");

            } else {

                curtidas++;

                localStorage.setItem(
                    chaveUsuario,
                    "sim"
                );

                botao.classList.add("curtido");

            }

            localStorage.setItem(
                chave,
                curtidas
            );

            contador.textContent = curtidas;

        });

    });

}


// =====================================================
// BOTÃO VOLTAR AO TOPO
// =====================================================

function criarBotaoTopo() {

    const botao = document.createElement("button");

    botao.id = "voltar-topo";
    botao.innerHTML = "↑";
    botao.title = "Voltar ao topo";

    document.body.appendChild(botao);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            botao.classList.add("mostrar");
        } else {
            botao.classList.remove("mostrar");
        }

    });

    botao.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


// =====================================================
// BOTÃO PARA MOSTRAR/OCULTAR ATIVIDADES DO PROJETO
// =====================================================

function alternarAtividades(botao) {

    const card = botao.closest("article");

    const lista = card.querySelector(".lista-atividades");

    if (!lista) {
        return;
    }

    lista.classList.toggle("aberta");

    if (lista.classList.contains("aberta")) {

        botao.textContent =
            "Ocultar atividades";

    } else {

        botao.textContent =
            "Ver atividades";

    }

}


// =====================================================
// EXIBIR MENSAGEM QUANDO NÃO HOUVER PROJETOS
// =====================================================

function verificarProjetosVisiveis() {

    const cards = [...document.querySelectorAll("article[data-turma]")];

    const quantidadeVisivel = cards.filter(card => {
        return card.style.display !== "none";
    }).length;

    const mensagem =
        document.querySelector("#nenhum-projeto");

    if (!mensagem) {
        return;
    }

    mensagem.style.display =
        quantidadeVisivel === 0
            ? "block"
            : "none";

}



// =====================================================
// RECURSOS DE ACESSIBILIDADE
// =====================================================

let tamanhoFonteAtual = 16;


// =====================================================
// AUMENTAR FONTE
// =====================================================

function aumentarFonte() {

    if (tamanhoFonteAtual < 26) {

        tamanhoFonteAtual += 2;

        document.documentElement.style.setProperty(
            "--tamanho-fonte",
            tamanhoFonteAtual + "px"
        );

    }

}


// =====================================================
// DIMINUIR FONTE
// =====================================================

function diminuirFonte() {

    if (tamanhoFonteAtual > 14) {

        tamanhoFonteAtual -= 2;

        document.documentElement.style.setProperty(
            "--tamanho-fonte",
            tamanhoFonteAtual + "px"
        );

    }

}


// =====================================================
// ALTO CONTRASTE
// =====================================================

function alternarContraste() {

    document.body.classList.toggle("alto-contraste");

}


// =====================================================
// ESPAÇAMENTO
// =====================================================

function alternarEspacamento() {

    document.body.classList.toggle("espacamento-acessivel");

}


// =====================================================
// MODO SEM CORES
// =====================================================

function alternarSemCores() {

    document.body.classList.toggle("sem-cores");

}


// =====================================================
// LEITURA EM VOZ ALTA
// =====================================================

function lerPagina() {

    pararLeitura();

    const conteudo = document.querySelector("#conteudo-principal");

    if (!conteudo) {
        return;
    }

    const texto = conteudo.innerText;

    const leitura = new SpeechSynthesisUtterance(texto);

    leitura.lang = "pt-BR";
    leitura.rate = 0.9;
    leitura.pitch = 1;

    window.speechSynthesis.speak(leitura);

}


// =====================================================
// PARAR LEITURA
// =====================================================

function pararLeitura() {

    window.speechSynthesis.cancel();

}


// =====================================================
// RESTAURAR CONFIGURAÇÕES
// =====================================================

function restaurarAcessibilidade() {

    document.body.classList.remove(
        "alto-contraste",
        "espacamento-acessivel",
        "sem-cores"
    );

    tamanhoFonteAtual = 16;

    document.documentElement.style.setProperty(
        "--tamanho-fonte",
        "16px"
    );

    pararLeitura();

}

