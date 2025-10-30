        // Controle do menu mobile
        document.getElementById('menu-button').addEventListener('click', function () {
            document.getElementById('sidebar').classList.add('open');
            document.getElementById('sidebar-overlay').classList.add('open');
        });

        document.getElementById('close-menu').addEventListener('click', function () {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebar-overlay').classList.remove('open');
        });

        document.getElementById('sidebar-overlay').addEventListener('click', function () {
            document.getElementById('sidebar').classList.remove('open');
            this.classList.remove('open');
        });

        // Contador de documentos preenchidos
        let documentosPreenchidos = 0;
        const totalDocumentos = 7;

        // Função para verificar se um documento tem arquivo
        function verificarDocumentoPreenchido(tableBodyId) {
            const tableBody = document.getElementById(tableBodyId);
            return tableBody.children.length > 0;
        }

        // Função para atualizar contador
        function atualizarContador() {
            const documentos = [
                'frequencia-body', 'inscricao-body', 'tcle-body',
                'evolucao-body', 'anamnese-body', 'ocorrencia-body', 'laudos-body'
            ];

            documentosPreenchidos = documentos.filter(id => verificarDocumentoPreenchido(id)).length;

            document.getElementById('documentos-preenchidos').textContent = documentosPreenchidos;

            // Atualizar barra de progresso
            const progresso = (documentosPreenchidos / totalDocumentos) * 100;
            document.getElementById('progress-bar').style.width = `${progresso}%`;
        }

        // Configurar os event listeners para TODOS os inputs de arquivo (exceto inscrição)
        const fileInputs = [
            { id: 'frequencia-file', tableId: 'frequencia-body', type: 'Ficha de Frequência' },
            { id: 'tcle-file', tableId: 'tcle-body', type: 'TCLE' },
            { id: 'evolucao-file', tableId: 'evolucao-body', type: 'Folha de Evolução' },
            { id: 'anamnese-file', tableId: 'anamnese-body', type: 'Anamnese' },
            { id: 'ocorrencia-file', tableId: 'ocorrencia-body', type: 'Histórico de Ocorrência' },
            { id: 'laudos-file', tableId: 'laudos-body', type: 'Laudos Médicos' }
        ];

        fileInputs.forEach(input => {
            document.getElementById(input.id).addEventListener('change', function (e) {
                handleFileUpload(e, input.tableId, input.type);
                atualizarContador();
            });
        });

        // Função para lidar com o upload de arquivos
        function handleFileUpload(event, tableBodyId, documentType) {
            const file = event.target.files[0];
            if (!file) return;

            const tableBody = document.getElementById(tableBodyId);

            // Criar nova linha na tabela
            const newRow = document.createElement('tr');
            const fileName = file.name;
            const fileDate = new Date().toLocaleDateString('pt-BR');

            newRow.innerHTML = `
                <td class="col-nome"><strong>${fileName}</strong></td>
                <td class="col-data">${fileDate}</td>
                <td class="col-acoes">
                    <button class="btn-visualizar" onclick="visualizarArquivo('${fileName}')">
                        Visualizar
                    </button>
                    <button class="btn-remover" onclick="removerArquivo(this, '${tableBodyId}')">
                        Remover
                    </button>
                </td>
            `;

            // Adicionar a nova linha à tabela
            tableBody.appendChild(newRow);

            // Limpar o input para permitir upload do mesmo arquivo novamente
            event.target.value = '';
        }

        // Função para visualizar arquivo
        function visualizarArquivo(fileName) {
            alert(`Visualizando arquivo: ${fileName}\n\nEm uma implementação real, este arquivo seria aberto em uma nova aba ou visualizador.`);
        }

        // Função para remover arquivo
        function removerArquivo(button, tableBodyId) {
            const row = button.closest('tr');
            row.remove();
            atualizarContador();
        }

        // Função para sair
        function sair() {
            if (confirm('Tem certeza que deseja sair do sistema?')) {
                alert('Saindo do sistema...');
                // Aqui você pode adicionar a lógica para redirecionar para a página de login
                // window.location.href = 'login.html';
            }
        }

        // Botão salvar
        document.getElementById('btn-salvar').addEventListener('click', function () {
            alert('Alterações salvas com sucesso!');
            // Aqui você pode adicionar a lógica para salvar os dados
        });

        // Botão cancelar
        document.getElementById('btn-cancelar').addEventListener('click', function () {
            if (confirm('Tem certeza que deseja cancelar as alterações?')) {
                const documentos = [
                    'frequencia-body', 'tcle-body',
                    'evolucao-body', 'anamnese-body', 'ocorrencia-body', 'laudos-body'
                ];

                documentos.forEach(id => {
                    const tableBody = document.getElementById(id);
                    tableBody.innerHTML = '';
                });

                atualizarContador();
                alert('Todas as alterações foram canceladas!');
            }
        });

        // Inicializar contador
        atualizarContador();