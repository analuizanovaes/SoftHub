// Espera a página HTML carregar completamente antes de executar o código.
document.addEventListener("DOMContentLoaded", function() {

    // 1. SELECIONAR OS ELEMENTOS DO HTML
    const campoMensalidade = document.getElementById("valor-mensalidade");
    const campoDesconto = document.getElementById("desconto-unieuro");
    const toggleProuni = document.getElementById("toggle-prouni");

    // Botões
    const botaoCalcular = document.getElementById("btn-calcular");
    const botaoLimpar = document.getElementById("btn-limpar");
    const botaoPdf = document.getElementById("btn-pdf");

    // O bloco de resultado do PROUNI que vamos mostrar/esconder
    const blocoResultadoProuni = document.getElementById("bloco-resultado-prouni");

    // Parágrafos (<p>) onde vamos colocar os resultados
    const elMensalComDesconto = document.querySelector("#resultado-base .grid div:nth-child(1) .text-4xl");
    const elSemestreComDesconto = document.querySelector("#resultado-base .grid div:nth-child(2) .text-4xl");
    const elMensalSemDesconto = document.querySelector("#resultado-base .grid div:nth-child(3) .text-4xl");
    const elSemestreSemDesconto = document.querySelector("#resultado-base .grid div:nth-child(4) .text-4xl");
    const elProuniMensal = document.querySelector("#bloco-resultado-prouni .grid div:nth-child(1) .text-3xl");
    const elProuniSemestre = document.querySelector("#bloco-resultado-prouni .grid div:nth-child(2) .text-3xl");

    // 2. FUNÇÕES

    // Função para formatar um número como dinheiro (R$ 1.234,56)
    function formatarDinheiro(valor) {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    // Função para gerar o PDF
    function gerarPdf() {
        if (elMensalComDesconto.textContent === 'R$ 0,00') {
            alert("Por favor, clique em 'Calcular' primeiro para gerar os dados do relatório.");
            return; // Impede a geração do PDF se não houver dados
        }

        const conteudo = document.getElementById("conteudo-para-pdf");
        const options = {
            margin:       1,
            filename:     'simulacao_financeira_unieuro.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Chama a biblioteca para gerar e baixar o PDF
        html2pdf().set(options).from(conteudo).save();
    }

    // Função principal que calcula e atualiza a tela
    function calcularEAtualizarTela() {
        const mensalidadeBruta = parseFloat(campoMensalidade.value) || 0;
        const descontoUnieuro = parseFloat(campoDesconto.value) || 0;

        // VALIDAÇÕES
        if (mensalidadeBruta === 0 || descontoUnieuro === 0) {
            alert("Por favor, preencha os valores da mensalidade e do desconto para continuar.");
            return;
        }
        if (descontoUnieuro < 5 || descontoUnieuro > 50) {
            alert("O Desconto Unieuro deve ser um valor entre 5% e 50%.");
            return;
        }
        
        // CÁLCULOS
        const mensalidadeComDesconto = mensalidadeBruta * (1 - descontoUnieuro / 100);
        const semestreBruto = mensalidadeBruta * 6;
        const semestreComDesconto = mensalidadeComDesconto * 6;
        
        // ATUALIZAR TELA (Resultados Base)
        elMensalSemDesconto.textContent = formatarDinheiro(mensalidadeBruta);
        elSemestreSemDesconto.textContent = formatarDinheiro(semestreBruto);
        elMensalComDesconto.textContent = formatarDinheiro(mensalidadeComDesconto);
        elSemestreComDesconto.textContent = formatarDinheiro(semestreComDesconto);
        
        // ATUALIZAR TELA (Lógica do PROUNI)
        if (toggleProuni.checked) {
            blocoResultadoProuni.classList.remove('hidden');
            const mensalidadeProuni = mensalidadeComDesconto * 0.5; // 50% de desconto
            const semestreProuni = mensalidadeProuni * 6;
            elProuniMensal.textContent = formatarDinheiro(mensalidadeProuni);
            elProuniSemestre.textContent = formatarDinheiro(semestreProuni);
        } else {
            blocoResultadoProuni.classList.add('hidden');
        }
    }

    // Função para limpar tudo
    function limparCampos() {
        campoMensalidade.value = "";
        campoDesconto.value = "";
        
        const valorZero = formatarDinheiro(0);
        elMensalSemDesconto.textContent = valorZero;
        elSemestreSemDesconto.textContent = valorZero;
        elMensalComDesconto.textContent = valorZero;
        elSemestreComDesconto.textContent = valorZero;
        elProuniMensal.textContent = valorZero;
        elProuniSemestre.textContent = valorZero;

        toggleProuni.checked = false;
        blocoResultadoProuni.classList.add('hidden');
    }

    // 3. CONFIGURAR OS EVENTOS (CLIQUES)

    // Ação para o botão 'Calcular'
    botaoCalcular.addEventListener('click', function(event) {
        event.preventDefault(); // Impede que o formulário recarregue a página
        calcularEAtualizarTela();
    });

    // Ação para o botão 'Limpar'
    botaoLimpar.addEventListener('click', function(event) {
        event.preventDefault();
        limparCampos();
    });

    // Ação para o botão do PROUNI (quando muda de estado)
    toggleProuni.addEventListener('change', calcularEAtualizarTela);

    // Ação para o botão 'Gerar PDF'
    botaoPdf.addEventListener('click', function(event) {
        event.preventDefault();
        gerarPdf();
    });

    // Roda a função de limpar no início para garantir que a página comece zerada
    limparCampos();
});