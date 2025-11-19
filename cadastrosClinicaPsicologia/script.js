document.addEventListener('DOMContentLoaded', function () {
    // Seleciona todos os botões de perfil
    const profileButtons = document.querySelectorAll('.profile-option');

    // Seleciona todos os formulários
    const forms = document.querySelectorAll('.form-section');

    // Adiciona evento de clique para cada botão de perfil
    profileButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove a classe 'active' de todos os botões
            profileButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-[#004A8F]', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            });

            // Adiciona a classe 'active' ao botão clicado
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            this.classList.add('active', 'bg-[#004A8F]', 'text-white');

            // Obtém o perfil selecionado
            const selectedProfile = this.getAttribute('data-profile');

            // Oculta todos os formulários
            forms.forEach(form => {
                form.classList.add('hidden');
            });

            // Mostra o formulário correspondente ao perfil selecionado
            document.getElementById(`${selectedProfile}-form`).classList.remove('hidden');
        });
    });

    // Validação do nome completo (apenas letras e espaços)
    function validarNome(nome) {
        const regex = /^[A-Za-zÀ-ÿ\s]+$/;
        return regex.test(nome);
    }

    // Validação do email (deve terminar com @unieuro.com.br)
    function validarEmail(email) {
        const regex = /^[^\s@]+@unieuro\.com\.br$/;
        return regex.test(email);
    }

    // Validação de confirmação de senha
    function validarConfirmacaoSenha(senha, confirmacao) {
        return senha === confirmacao && senha !== '';
    }

    // Validação de campos obrigatórios
    function validarFormulario(formId) {
        const form = document.getElementById(formId);
        const campos = form.querySelectorAll('input[required], select[required]');
        let valido = true;

        campos.forEach(campo => {
            const errorMsg = campo.nextElementSibling;

            if (campo.classList.contains('nome-completo')) {
                if (!campo.value.trim() || !validarNome(campo.value)) {
                    campo.classList.add('input-error');
                    errorMsg.style.display = 'block';
                    valido = false;
                } else {
                    campo.classList.remove('input-error');
                    errorMsg.style.display = 'none';
                }
            } else if (campo.classList.contains('email-input')) {
                if (!campo.value.trim() || !validarEmail(campo.value)) {
                    campo.classList.add('input-error');
                    errorMsg.style.display = 'block';
                    valido = false;
                } else {
                    campo.classList.remove('input-error');
                    errorMsg.style.display = 'none';
                }
            } else if (campo.classList.contains('confirmacao-senha')) {
                const senhaInput = form.querySelector('.senha-input');
                if (!campo.value.trim() || !validarConfirmacaoSenha(senhaInput.value, campo.value)) {
                    campo.classList.add('input-error');
                    errorMsg.style.display = 'block';
                    valido = false;
                } else {
                    campo.classList.remove('input-error');
                    errorMsg.style.display = 'none';
                }
            } else if (!campo.value.trim()) {
                campo.classList.add('input-error');
                errorMsg.style.display = 'block';
                valido = false;
            } else {
                campo.classList.remove('input-error');
                errorMsg.style.display = 'none';
            }
        });

        return valido;
    }

    // Event listener para validação em tempo real nos campos de nome
    document.querySelectorAll('.nome-completo').forEach(input => {
        input.addEventListener('input', function () {
            const errorMsg = this.nextElementSibling;
            if (!validarNome(this.value) && this.value.trim() !== '') {
                this.classList.add('input-error');
                errorMsg.style.display = 'block';
            } else {
                this.classList.remove('input-error');
                errorMsg.style.display = 'none';
            }
        });
    });

    // Event listener para validação em tempo real nos campos de email
    document.querySelectorAll('.email-input').forEach(input => {
        input.addEventListener('input', function () {
            const errorMsg = this.nextElementSibling;
            if (!validarEmail(this.value) && this.value.trim() !== '') {
                this.classList.add('input-error');
                errorMsg.style.display = 'block';
            } else {
                this.classList.remove('input-error');
                errorMsg.style.display = 'none';
            }
        });
    });

    // Event listener para validação em tempo real na confirmação de senha
    document.querySelectorAll('.confirmacao-senha').forEach(input => {
        input.addEventListener('input', function () {
            const form = this.closest('.form-section');
            const senhaInput = form.querySelector('.senha-input');
            const errorMsg = this.nextElementSibling;

            if (!validarConfirmacaoSenha(senhaInput.value, this.value) && this.value.trim() !== '') {
                this.classList.add('input-error');
                errorMsg.style.display = 'block';
            } else {
                this.classList.remove('input-error');
                errorMsg.style.display = 'none';
            }
        });
    });

    // Event listener para validação em tempo real na senha (para atualizar confirmação)
    document.querySelectorAll('.senha-input').forEach(input => {
        input.addEventListener('input', function () {
            const form = this.closest('.form-section');
            const confirmacaoInput = form.querySelector('.confirmacao-senha');
            if (confirmacaoInput && confirmacaoInput.value.trim() !== '') {
                const errorMsg = confirmacaoInput.nextElementSibling;
                if (!validarConfirmacaoSenha(this.value, confirmacaoInput.value)) {
                    confirmacaoInput.classList.add('input-error');
                    errorMsg.style.display = 'block';
                } else {
                    confirmacaoInput.classList.remove('input-error');
                    errorMsg.style.display = 'none';
                }
            }
        });
    });

    // Adiciona funcionalidade para o botão de cadastro
    const registerButton = document.getElementById('btn-cadastrar');
    registerButton.addEventListener('click', function () {
        const formAtivo = document.querySelector('.form-section:not(.hidden)');
        const formId = formAtivo.id;

        if (validarFormulario(formId)) {
            alert('Usuário cadastrado com sucesso!');
            // Aqui você pode adicionar a lógica para enviar os dados
        } else {
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
        }
    });
});