// =====================================================
// CONFIGURAÇÕES INICIAIS
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {

    // Primeiro carrega os conteúdos externos dos trimestres
    await carregarTrimestres();

    // Depois ativa os demais recursos
    ativarMenuAutomatico();
    prepararAnimacaoCards();
    prepararBusca();
    prepararCurtidas();
    criarBotaoTopo();

});


// =====================================================
// CARREGAR CONTEÚDO DOS TRIMESTRES
// =====================================================

async function carregarTrimestres() {

    const trimestres = [
        {
            arquivo: "trimestre/tri1.html",
            destino: "conteudo-tri1"
        },
        {
            arquivo: "trimestre/tri2.html",
            destino: "conteudo-tri2"
        },
        {
            arquivo: "trimestre/tri3.html",
            destino: "conteudo-tri3"
        }
    ];

    for (const trimestre of trimestres) {

        try {

            const resposta = await fetch(trimestre.arquivo);

            if (!resposta.ok) {
                throw new Error(
                    `Não foi possível carregar ${trimestre.arquivo}`
                );
            }

            const html = await resposta.text();

            const destino = document.getElementById(
                trimestre.destino
            );

            if (destino) {
                destino.innerHTML = html;
            }

        } catch (erro) {

            console.error(erro);

            const destino = document.getElementById(
                trimestre.destino
            );

            if (destino) {

                destino.innerHTML = `
                    <p class="erro-carregamento">
                        Não foi possível carregar os projetos deste trimestre.
                    </p>
                `;

            }

        }

    }

}


// =====================================================
// MENU ATIVO CONFORME A ROLAGEM
// =====================================================

function ativarMenuAutomatico() {

    const secoes = document.querySelectorAll("section[id]");
    const linksMenu = document.querySelectorAll("nav a");

    function atualizarMenu() {

        let secaoAtual = "";

        secoes.forEach(secao => {

            const topo = secao.offsetTop - 180;
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

    }

    window.addEventListener("scroll", atualizarMenu);

    atualizarMenu();

}


// =====================================================
// ANIMAÇÃO DOS CARDS
// =====================================================

function prepararAnimacaoCards() {

    const cards = document.querySelectorAll("article");

    if (!cards.length) {
        return;
    }

    const observador = new IntersectionObserver(

        entradas => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("visivel");

                    observador.unobserve(
                        entrada.target
                    );

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

    const campoBusca = document.querySelector(
        "#buscar-projeto"
    );

    if (!campoBusca) {
        return;
    }

    campoBusca.addEventListener("input", () => {

        const termo = campoBusca.value
            .toLowerCase()
            .trim();

        const cards = document.querySelectorAll(
            "article.card-projeto, article[data-serie]"
        );

        cards.forEach(card => {

            const texto = card.innerText
                .toLowerCase();

            if (texto.includes(termo)) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

        verificarProjetosVisiveis();

    });

}


// =====================================================
// EXIBIR MENSAGEM QUANDO NÃO HOUVER PROJETOS
// =====================================================

function verificarProjetosVisiveis() {

    const cards = [
        ...document.querySelectorAll(
            "article.card-projeto, article[data-serie]"
        )
    ];

    if (!cards.length) {
        return;
    }

    const quantidadeVisivel = cards.filter(card => {

        return card.style.display !== "none";

    }).length;

    const mensagem = document.querySelector(
        "#nenhum-projeto"
    );

    if (!mensagem) {
        return;
    }

    mensagem.style.display =
        quantidadeVisivel === 0
            ? "block"
            : "none";

}


// =====================================================
// CURTIDAS DOS PROJETOS
// =====================================================

function prepararCurtidas() {

    const botoes = document.querySelectorAll(
        ".btn-curtir"
    );

    botoes.forEach(botao => {

        const idProjeto = botao.dataset.projeto;

        if (!idProjeto) {
            return;
        }

        const chaveCurtidas =
            "curtidas_" + idProjeto;

        const chaveUsuario =
            "curtiu_" + idProjeto;

        let curtidas =
            Number(
                localStorage.getItem(chaveCurtidas)
            ) || 0;

        const contador =
            botao.querySelector("span");

        if (contador) {
            contador.textContent = curtidas;
        }

        if (
            localStorage.getItem(chaveUsuario) === "sim"
        ) {
            botao.classList.add("curtido");
        }

        botao.addEventListener("click", () => {

            const jaCurtiu =
                localStorage.getItem(
                    chaveUsuario
                ) === "sim";

            if (jaCurtiu) {

                curtidas =
                    Math.max(0, curtidas - 1);

                localStorage.setItem(
                    chaveUsuario,
                    "nao"
                );

                botao.classList.remove(
                    "curtido"
                );

            } else {

                curtidas++;

                localStorage.setItem(
                    chaveUsuario,
                    "sim"
                );

                botao.classList.add(
                    "curtido"
                );

            }

            localStorage.setItem(
                chaveCurtidas,
                curtidas
            );

            if (contador) {
                contador.textContent = curtidas;
            }

        });

    });

}


// =====================================================
// BOTÃO VOLTAR AO TOPO
// =====================================================

function criarBotaoTopo() {

    // Evita criar duas vezes
    if (
        document.querySelector("#voltar-topo")
    ) {
        return;
    }

    const botao =
        document.createElement("button");

    botao.id = "voltar-topo";

    botao.innerHTML = "↑";

    botao.title =
        "Voltar ao topo";

    botao.setAttribute(
        "aria-label",
        "Voltar ao topo"
    );

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
// MOSTRAR / OCULTAR ATIVIDADES DO PROJETO
// =====================================================

function alternarAtividades(botao) {

    const card =
        botao.closest("article");

    if (!card) {
        return;
    }

    const lista =
        card.querySelector(
            ".lista-atividades"
        );

    if (!lista) {
        return;
    }

    lista.classList.toggle("aberta");

    if (
        lista.classList.contains("aberta")
    ) {

        botao.textContent =
            "Ocultar atividades";

    } else {

        botao.textContent =
            "Ver atividades";

    }

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

        document.documentElement
            .style
            .setProperty(
                "--tamanho-fonte",
                tamanhoFonteAtual + "px"
            );

        salvarPreferenciasAcessibilidade();

    }

}


// =====================================================
// DIMINUIR FONTE
// =====================================================

function diminuirFonte() {

    if (tamanhoFonteAtual > 14) {

        tamanhoFonteAtual -= 2;

        document.documentElement
            .style
            .setProperty(
                "--tamanho-fonte",
                tamanhoFonteAtual + "px"
            );

        salvarPreferenciasAcessibilidade();

    }

}


// =====================================================
// ALTO CONTRASTE
// =====================================================

function alternarContraste() {

    document.body.classList.toggle(
        "alto-contraste"
    );

    salvarPreferenciasAcessibilidade();

}


// =====================================================
// ESPAÇAMENTO
// =====================================================

function alternarEspacamento() {

    document.body.classList.toggle(
        "espacamento-acessivel"
    );

    salvarPreferenciasAcessibilidade();

}


// =====================================================
// MODO SEM CORES
// =====================================================

function alternarSemCores() {

    document.body.classList.toggle(
        "sem-cores"
    );

    salvarPreferenciasAcessibilidade();

}


// =====================================================
// LEITURA EM VOZ ALTA
// =====================================================

function lerPagina() {

    pararLeitura();

    const conteudo =
        document.querySelector(
            "#conteudo-principal"
        );

    if (!conteudo) {
        return;
    }

    const texto =
        conteudo.innerText;

    if (!texto.trim()) {
        return;
    }

    const leitura =
        new SpeechSynthesisUtterance(
            texto
        );

    leitura.lang = "pt-BR";

    leitura.rate = 0.9;

    leitura.pitch = 1;

    window.speechSynthesis.speak(
        leitura
    );

}


// =====================================================
// PARAR LEITURA
// =====================================================

function pararLeitura() {

    if ("speechSynthesis" in window) {

        window.speechSynthesis.cancel();

    }

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

    document.documentElement
        .style
        .setProperty(
            "--tamanho-fonte",
            "16px"
        );

    pararLeitura();

    localStorage.removeItem(
        "acessibilidade"
    );

}


// =====================================================
// SALVAR PREFERÊNCIAS DE ACESSIBILIDADE
// =====================================================

function salvarPreferenciasAcessibilidade() {

    const preferencias = {

        tamanhoFonte:
            tamanhoFonteAtual,

        altoContraste:
            document.body.classList.contains(
                "alto-contraste"
            ),

        espacamento:
            document.body.classList.contains(
                "espacamento-acessivel"
            ),

        semCores:
            document.body.classList.contains(
                "sem-cores"
            )

    };

    localStorage.setItem(
        "acessibilidade",
        JSON.stringify(preferencias)
    );

}


// =====================================================
// CARREGAR PREFERÊNCIAS DE ACESSIBILIDADE
// =====================================================

function carregarPreferenciasAcessibilidade() {

    const dados =
        localStorage.getItem(
            "acessibilidade"
        );

    if (!dados) {
        return;
    }

    try {

        const preferencias =
            JSON.parse(dados);

        if (
            preferencias.tamanhoFonte
        ) {

            tamanhoFonteAtual =
                preferencias.tamanhoFonte;

            document.documentElement
                .style
                .setProperty(
                    "--tamanho-fonte",
                    tamanhoFonteAtual + "px"
                );

        }

        if (
            preferencias.altoContraste
        ) {

            document.body.classList.add(
                "alto-contraste"
            );

        }

        if (
            preferencias.espacamento
        ) {

            document.body.classList.add(
                "espacamento-acessivel"
            );

        }

        if (
            preferencias.semCores
        ) {

            document.body.classList.add(
                "sem-cores"
            );

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar preferências de acessibilidade:",
            erro
        );

    }

}


// =====================================================
// CARREGAR ACESSIBILIDADE AO INICIAR
// =====================================================

carregarPreferenciasAcessibilidade();