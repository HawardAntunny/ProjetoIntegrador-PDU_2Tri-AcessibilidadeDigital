// =====================================================
// CONFIGURAÇÕES INICIAIS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    carregarPreferenciasAcessibilidade();

    carregarGaleriaEstudantes();
    carregarGaleriaCartazes();

    prepararAnimacoes();
    criarBotaoTopo();

});


// =====================================================
// CONFIGURAÇÃO DAS GALERIAS
// =====================================================

// ALTERE APENAS ESTES NÚMEROS
// QUANDO ADICIONAR NOVAS IMAGENS

const quantidadeFotosEstudantes = 10;
const quantidadeCartazes = 6;


// =====================================================
// GALERIA DOS ESTUDANTES
// =====================================================

function carregarGaleriaEstudantes() {

    const galeria = document.querySelector(
        "#galeria-estudantes-projeto"
    );

    if (!galeria) {
        return;
    }

    galeria.innerHTML = "";

    for (
        let i = 1;
        i <= quantidadeFotosEstudantes;
        i++
    ) {

        const figure =
            document.createElement("figure");

        const img =
            document.createElement("img");

        const legenda =
            document.createElement("figcaption");


        // TRANSFORMA 1 EM 01, 2 EM 02 ETC.
        const numero =
            String(i).padStart(2, "0");


        img.src =
            `img-estudantes/estudante-${numero}.jpeg`;

        img.alt =
            `Registro ${i} dos estudantes durante o projeto sobre acessibilidade e mobilidade`;

        img.loading = "lazy";


        legenda.textContent =
            `Registro ${i} das atividades do projeto`;


        // SE A IMAGEM NÃO EXISTIR,
        // O ELEMENTO É REMOVIDO

        img.addEventListener("error", () => {

            figure.remove();

        });


        figure.appendChild(img);

        figure.appendChild(legenda);

        galeria.appendChild(figure);

    }

}


// =====================================================
// GALERIA DOS CARTAZES
// =====================================================

function carregarGaleriaCartazes() {

    const galeria = document.querySelector(
        "#galeria-cartazes"
    );

    if (!galeria) {
        return;
    }

    galeria.innerHTML = "";

    for (
        let i = 1;
        i <= quantidadeCartazes;
        i++
    ) {

        const figure =
            document.createElement("figure");

        const img =
            document.createElement("img");

        const legenda =
            document.createElement("figcaption");


        const numero =
            String(i).padStart(2, "0");


        img.src =
            `img-cartazes/cartaz-${numero}.jpeg`;

        img.alt =
            `Cartaz ${i} produzido pelos estudantes sobre acessibilidade, mobilidade e tecnologia assistiva`;

        img.loading = "lazy";


        legenda.textContent =
            `Cartaz ${i} produzido pelos estudantes`;


        img.addEventListener("error", () => {

            figure.remove();

        });


        figure.appendChild(img);

        figure.appendChild(legenda);

        galeria.appendChild(figure);

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

    if (tamanhoFonteAtual < 28) {

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

    if (!("speechSynthesis" in window)) {

        alert(
            "Seu navegador não oferece suporte à leitura em voz alta."
        );

        return;

    }

    const conteudo =
        document.querySelector(
            "#conteudo-principal"
        );

    if (!conteudo) {
        return;
    }

    const texto =
        conteudo.innerText.trim();

    if (!texto) {
        return;
    }

    const leitura =
        new SpeechSynthesisUtterance(
            texto
        );

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


        // TAMANHO DA FONTE

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


        // ALTO CONTRASTE

        if (
            preferencias.altoContraste
        ) {

            document.body.classList.add(
                "alto-contraste"
            );

        }


        // ESPAÇAMENTO

        if (
            preferencias.espacamento
        ) {

            document.body.classList.add(
                "espacamento-acessivel"
            );

        }


        // SEM CORES

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
// ANIMAÇÕES
// =====================================================

function prepararAnimacoes() {

    const elementos =
        document.querySelectorAll(

            ".grade-conceitos article, " +
            ".galeria figure, " +
            ".galeria-cartazes figure, " +
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
                threshold: 0.10
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


    // MOSTRAR / OCULTAR

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


    // CLIQUE

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
// PARAR LEITURA AO SAIR DA PÁGINA
// =====================================================

window.addEventListener(
    "beforeunload",
    () => {

        pararLeitura();

    }
);