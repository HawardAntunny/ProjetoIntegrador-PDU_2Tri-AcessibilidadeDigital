// =====================================================
// CONFIGURAÇÕES INICIAIS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    carregarPreferenciasAcessibilidade();
    prepararAnimacoes();
    criarBotaoTopo();

});


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

        salvarPreferenciasAcessibilidade();

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
// ESPAÇAMENTO ACESSÍVEL
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

    const conteudo = document.querySelector(
        "#conteudo-principal"
    );

    if (!conteudo) {
        return;
    }

    const texto = conteudo.innerText.trim();

    if (!texto) {
        return;
    }

    if (!("speechSynthesis" in window)) {

        alert(
            "Seu navegador não oferece suporte à leitura em voz alta."
        );

        return;

    }

    const leitura =
        new SpeechSynthesisUtterance(texto);

    leitura.lang = "pt-BR";

    leitura.rate = 0.9;

    leitura.pitch = 1;

    leitura.volume = 1;

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
// RESTAURAR ACESSIBILIDADE
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

    localStorage.removeItem(
        "acessibilidade"
    );

}


// =====================================================
// SALVAR PREFERÊNCIAS
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
// CARREGAR PREFERÊNCIAS
// =====================================================

function carregarPreferenciasAcessibilidade() {

    const dados = localStorage.getItem(
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

            document.documentElement.style.setProperty(
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
// ANIMAÇÕES DE ENTRADA
// =====================================================

function prepararAnimacoes() {

    const elementos = document.querySelectorAll(
        ".grade-conceitos article, " +
        ".card-atividade, " +
        ".galeria figure, " +
        ".grade-recursos div, " +
        ".informacoes-projeto div"
    );

    if (!elementos.length) {
        return;
    }

    const observador =
        new IntersectionObserver(

            entradas => {

                entradas.forEach(
                    entrada => {

                        if (
                            entrada.isIntersecting
                        ) {

                            entrada.target.classList.add(
                                "visivel"
                            );

                            observador.unobserve(
                                entrada.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.12
            }

        );

    elementos.forEach(
        elemento => {

            elemento.classList.add(
                "animar-card"
            );

            observador.observe(
                elemento
            );

        }
    );

}


// =====================================================
// BOTÃO VOLTAR AO TOPO
// =====================================================

function criarBotaoTopo() {

    if (
        document.querySelector(
            "#voltar-topo"
        )
    ) {
        return;
    }

    const botao =
        document.createElement(
            "button"
        );

    botao.id =
        "voltar-topo";

    botao.innerHTML =
        "↑";

    botao.title =
        "Voltar ao topo";

    botao.setAttribute(
        "aria-label",
        "Voltar ao topo"
    );

    document.body.appendChild(
        botao
    );

    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 400
            ) {

                botao.classList.add(
                    "mostrar"
                );

            } else {

                botao.classList.remove(
                    "mostrar"
                );

            }

        }
    );

    botao.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// =====================================================
// FECHAR LEITURA AO SAIR DA PÁGINA
// =====================================================

window.addEventListener(
    "beforeunload",
    () => {

        pararLeitura();

    }
);