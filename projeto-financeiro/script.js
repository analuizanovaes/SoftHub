//Executa o código JavaScript apenas quando a estrutura do documento (DOM) estiver totalmente carregada.
document.addEventListener("DOMContentLoaded", function () {

    // SELEÇÃO DE ELEMENTOS DO HTML

    // Campos de entrada do formulário
    const campoMensalidade = document.getElementById("valor-mensalidade");
    const campoDesconto = document.getElementById("desconto-unieuro");
    const toggleProuni = document.getElementById("toggle-prouni");

    // Botões de ação
    const botaoCalcular = document.getElementById("btn-calcular");
    const botaoLimpar = document.getElementById("btn-limpar");
    const botaoPdf = document.getElementById("btn-pdf");

    // Elementos de exibição de resultados
    const blocoResultadoProuni = document.getElementById("bloco-resultado-prouni");

    // Elementos onde os resultados são mostrados na tela
    const elMensalComDesconto = document.querySelector("#resultado-base .grid div:nth-child(1) .text-4xl");
    const elSemestreComDesconto = document.querySelector("#resultado-base .grid div:nth-child(2) .text-4xl");
    const elMensalSemDesconto = document.querySelector("#resultado-base .grid div:nth-child(3) .text-4xl");
    const elSemestreSemDesconto = document.querySelector("#resultado-base .grid div:nth-child(4) .text-4xl");
    const elProuniMensal = document.querySelector("#bloco-resultado-prouni .grid div:nth-child(1) .text-3xl");
    const elProuniSemestre = document.querySelector("#bloco-resultado-prouni .grid div:nth-child(2) .text-3xl");

    // FUNÇÕES AUXILIARES

    /*
     * Formata um valor numérico para o formato de moeda brasileira (R$)
     * @param {number} valor - Valor a ser formatado
     * @returns {string} Valor formatado como moeda brasileira
     */
    function formatarDinheiro(valor) {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    // FUNÇÃO PRINCIPAL DE CÁLCULO

    /*
     * Realiza todos os cálculos financeiros e atualiza a interface
     * - Calcula mensalidade com desconto
     * - Calcula valores semestrais
     * - Aplica desconto PROUNI se ativo
     * - Atualiza todos os elementos na tela
     */
function calcularEAtualizarTela() {
    // Obtém e converte os valores dos campos
    const mensalidadeBruta = parseFloat(
        campoMensalidade.value.replace(/\./g, '').replace(',', '.')
    ) || 0;

    const descontoUnieuro = parseFloat(campoDesconto.value) || 0;

    // VALIDAÇÃO: Verifica se o desconto foi preenchido
    if (!campoDesconto.value) {
        alert("❌ Por favor, insira corretamente todos os valores antes de continuar.");
        campoDesconto.focus();
        return;
    }

    // Validação do desconto Unieuro (deve estar entre 5% e 50%)
    if (descontoUnieuro < 5 || descontoUnieuro > 50) {
        alert("❌ O Desconto Unieuro deve ser um valor entre 5% e 50%.");
        campoDesconto.focus();
        return;
    }

    // CÁLCULOS PRINCIPAIS

    // Calcula mensalidade com desconto aplicado
    const mensalidadeComDesconto = mensalidadeBruta * (1 - descontoUnieuro / 100);

    // Calcula valores semestrais (6 meses)
    const semestreBruto = mensalidadeBruta * 6;
    const semestreComDesconto = mensalidadeComDesconto * 6;

    // ATUALIZAÇÃO DA INTERFACE - VALORES BASE

    // Atualiza os valores sem desconto
    elMensalSemDesconto.textContent = formatarDinheiro(mensalidadeBruta);
    elSemestreSemDesconto.textContent = formatarDinheiro(semestreBruto);

    // Atualiza os valores com desconto Unieuro
    elMensalComDesconto.textContent = formatarDinheiro(mensalidadeComDesconto);
    elSemestreComDesconto.textContent = formatarDinheiro(semestreComDesconto);

    // LÓGICA DO PROUNI

    if (toggleProuni.checked) {
        // Mostra o bloco de resultados do PROUNI
        blocoResultadoProuni.classList.remove('hidden');

        // Calcula valores com PROUNI (50% de desconto adicional)
        const mensalidadeProuni = mensalidadeComDesconto * 0.5;
        const semestreProuni = mensalidadeProuni * 6;

        // Atualiza os valores com PROUNI
        elProuniMensal.textContent = formatarDinheiro(mensalidadeProuni);
        elProuniSemestre.textContent = formatarDinheiro(semestreProuni);
    } else {
        // Esconde o bloco de resultados do PROUNI
        blocoResultadoProuni.classList.add('hidden');
    }
}

    // FUNÇÃO DE LIMPEZA

    /*
     * Limpa todos os campos e reseta a interface para o estado inicial
     * - Limpa campos de entrada
     * - Reseta todos os valores exibidos para R$ 0,00
     * - Desativa o toggle do PROUNI
     * - Esconde o bloco de resultados do PROUNI
     */
    function limparCampos() {
        // Limpa os campos de entrada
        campoMensalidade.value = "";
        campoDesconto.value = "";

        // Valor zero formatado para reutilização
        const valorZero = formatarDinheiro(0);

        // Reseta todos os elementos de resultado para R$ 0,00
        elMensalSemDesconto.textContent = valorZero;
        elSemestreSemDesconto.textContent = valorZero;
        elMensalComDesconto.textContent = valorZero;
        elSemestreComDesconto.textContent = valorZero;
        elProuniMensal.textContent = valorZero;
        elProuniSemestre.textContent = valorZero;

        // Reseta o toggle do PROUNI e esconde seu bloco de resultados
        toggleProuni.checked = false;
        blocoResultadoProuni.classList.add('hidden');
    }

    // FUNÇÃO DE GERAÇÃO DE PDF

    /**
     * Gera um relatório em PDF com os resultados da simulação
     * - Cria uma nova janela com o conteúdo formatado
     * - Inclui logo da instituição
     * - Mostra todos os valores calculados
     * - Permite impressão/salvamento como PDF
     */
    function gerarPdf() {
        // CAPTURA DOS VALORES CALCULADOS

        // Obtém os valores já calculados e formatados da interface
        const mensalComDesconto = elMensalComDesconto.textContent;
        const semestreComDesconto = elSemestreComDesconto.textContent;
        const mensalSemDesconto = elMensalSemDesconto.textContent;
        const semestreSemDesconto = elSemestreSemDesconto.textContent;

        // Validação para evitar PDF em branco
        if (mensalSemDesconto === formatarDinheiro(0)) {
            alert("❌ Por favor, preencha os valores e clique em 'Calcular' antes de gerar o PDF.");
            return;
        }

        // CONTEÚDO CONDICIONAL DO PROUNI

        let prouniContent = '';        // Conteúdo HTML do PROUNI
        let resultadoFinalContent = ''; // Conteúdo HTML do resultado final

        // Se o PROUNI estiver ativado, gera o conteúdo específico
        if (toggleProuni.checked) {
            const prouniMensal = elProuniMensal.textContent;
            const prouniSemestre = elProuniSemestre.textContent;

            // Conteúdo HTML para a seção do PROUNI
            prouniContent = `
                <div style="background: #faf8f5; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #8B7500; border: 1px solid #d0d0d0;">
                    <h4 style="color: #8B7500; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">DESCONTO PROUNI (50%)</h4>
                    <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #d0d0d0;">
                        <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 15px;">
                            <strong>Mensalidade com PROUNI:</strong>
                            <strong style="color: #8B7500; font-size: 18px;">${prouniMensal}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 15px;">
                            <strong>Semestre com PROUNI:</strong>
                            <strong style="color: #8B7500; font-size: 18px;">${prouniSemestre}</strong>
                        </div>
                    </div>
                </div>`;

            // Conteúdo HTML para o resultado final com PROUNI
            resultadoFinalContent = `
                <div class="bloco-resultado-final" style="background: #0D4B81; padding: 25px; margin: 25px 0; border-radius: 8px; color: white; border: 2px solid #0D4B81;">
                    <h3 style="margin: 0 0 20px 0; text-align: center; font-size: 18px; font-weight: bold;">RESULTADO FINAL - COM TODOS OS DESCONTOS</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                        <div style="text-align: center;">
                            <div style="font-size: 13px; opacity: 0.9;">MENSALIDADE</div>
                            <div style="font-size: 24px; font-weight: bold; margin: 8px 0;">${prouniMensal}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 13px; opacity: 0.9;">TOTAL DO SEMESTRE</div>
                            <div style="font-size: 24px; font-weight: bold; margin: 8px 0;">${prouniSemestre}</div>
                        </div>
                    </div>
                </div>`;
        }

        // CONSTRUÇÃO DO HTML DO PDF
        const htmlContent = `
        <html>
            <head>
                <title>Simulação Unieuro</title>
                <style>
                    /* Estilos específicos para impressão */
                    @media print {
                        .no-print { display: none !important; }
                        .bloco-resultado-final { 
                            background-color: #ffffff !important; 
                            border: 2px solid #000000 !important; 
                        }
                        .bloco-resultado-final * { 
                            color: #000000 !important; 
                        }
                    }
                </style>
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <!-- Cabeçalho com logo e informações da instituição -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="imagens/faviconunieuro.png" alt="Unieuro" style="height: 110px; width: 110px; margin-bottom: 2px;">
                    <h1 style="color: #0D4B81; margin:0;">SIMULAÇÃO FINANCEIRA</h1>
                    <p style="margin: 5px 0;">Centro Universitário Unieuro</p>
                </div>
                
                <!-- Seção: Valores Originais -->
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                    <h3 style="margin-top:0;">VALORES ORIGINAIS</h3>
                    <p><strong>Mensalidade Bruta:</strong> ${mensalSemDesconto}</p>
                    <p><strong>Semestre Bruto:</strong> ${semestreSemDesconto}</p>
                </div>
                
                <!-- Seção: Com Desconto Unieuro -->
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                    <h3 style="margin-top:0;">COM DESCONTO UNIEURO (${campoDesconto.value}%)</h3>
                    <p><strong>Mensalidade com Desconto:</strong> ${mensalComDesconto}</p>
                    <p><strong>Semestre com Desconto:</strong> ${semestreComDesconto}</p>
                </div>
                
                <!-- Seção do PROUNI (condicional) -->
                ${prouniContent}
                
                <!-- Resultado Final (condicional) -->
                ${resultadoFinalContent}
                
                <!-- Informações sobre FIES -->
                <div style="margin-top: 30px; padding: 15px; background: #f0f0f0; border-radius: 5px; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                    <p><strong>FIES:</strong> Não calculado automaticamente. Consulte a Central de Atendimento.</p>
                </div>

                <!-- Dúvidas -->
                <div style="margin-top: 30px; padding: 15px; background: #f0f0f0; border-radius: 5px; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
                    <p><strong>IMPORTANTE:</strong> Em caso de divergência ou dúvida nos valores e/ou percentuais, deverá procurar a Central de Atendimento de sua Unidade para auxílio.</p>
                </div>
                
                <!-- Botão de impressão (visível apenas na tela) -->
                <div class="no-print" style="text-align: center; margin-top: 20px;">
                    <button onclick="window.print()" style="padding: 10px 30px; background: #0D4B81; color: white; border: none; cursor: pointer; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Imprimir / Salvar em PDF
                    </button>
                </div>
            </body>
        </html>`;

        // CRIAÇÃO E ABERTURA DA JANELA DO PDF

        // Abre uma nova janela e insere o conteúdo HTML
        const janela = window.open('', '_blank');
        janela.document.write(htmlContent);
        janela.document.close();
    }

    // CONFIGURAÇÃO DOS EVENT LISTENERS

    // Evento: Botão Calcular
    botaoCalcular.addEventListener('click', function (event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário
        calcularEAtualizarTela();
    });

    // Evento: Botão Limpar
    botaoLimpar.addEventListener('click', function (event) {
        event.preventDefault();
        limparCampos();
    });

    // Evento: Toggle do PROUNI
    toggleProuni.addEventListener('change', function () {
        // Recalcula automaticamente se já houver valores preenchidos
        if (campoMensalidade.value) {
            calcularEAtualizarTela();
        }
    });

    // Evento: Botão Gerar PDF
    botaoPdf.addEventListener('click', function (event) {
        event.preventDefault();
        gerarPdf();
    });

    // FORMATAÇÃO AUTOMÁTICA DO CAMPO DE MENSALIDADE

    // Permite apenas números, vírgulas e pontos ao digitar
    campoMensalidade.addEventListener('input', function () {
        // Remove qualquer caractere que não seja número, vírgula ou ponto
        let valor = this.value.replace(/[^\d.,]/g, '');

        // Substitui múltiplos pontos ou vírgulas de forma adequada
        // Mantém apenas o último separador decimal
        const partes = valor.split(/[,\.]/);
        if (partes.length > 2) {
            const decimais = partes.pop(); // guarda a última parte
            valor = partes.join('') + ',' + decimais;
        }

        this.value = valor;
    });

    // Ao sair do campo (blur), formata o número como moeda brasileira
    campoMensalidade.addEventListener('blur', function () {
        let valor = this.value;

        if (!valor) return;

        // Converte para formato numérico entendendo , como decimal
        valor = valor.replace(/\./g, '').replace(',', '.'); // remove pontos de milhar e troca vírgula por ponto
        let numero = parseFloat(valor);

        if (isNaN(numero)) {
            this.value = '';
            return;
        }

        // Formata de volta para moeda BRL
        this.value = numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });

    // INICIALIZAÇÃO DO SISTEMA

    // Inicializa a interface com valores zerados
    limparCampos();
});