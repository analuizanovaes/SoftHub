// Elementos DOM
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuButton = document.getElementById('menu-button');
const closeMenuBtn = document.getElementById('close-menu');
const viewRecordBtns = document.querySelectorAll('.view-record-btn');
const addRecordBtn = document.getElementById('add-record-btn');
const editProfileBtn = document.getElementById('edit-profile-btn');
const logoutButton = document.getElementById('logout-button');

// Elementos do menu para destacar o item ativo
const menuItems = document.querySelectorAll('nav a');

// Alternar menu mobile
function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Fechar menu mobile
function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// Destacar item do menu ativo
function setActiveMenuItem() {
    menuItems.forEach(item => {
        // Remove todas as classes ativas
        item.classList.remove('bg-blue-50', 'text-azul-uni', 'font-semibold', 'border-l-4', 'border-azul-uni');

        // Adiciona classes padrão
        item.classList.add('text-gray-600', 'hover:bg-blue-50', 'hover:text-azul-uni');

        // Remove borda esquerda dos não ativos
        item.classList.remove('border-l-4', 'border-azul-uni');
    });

    // Marca o item "Início" como ativo
    const inicioItem = document.querySelector('nav a:first-child');
    if (inicioItem) {
        inicioItem.classList.add('bg-blue-50', 'text-azul-uni', 'font-semibold', 'border-l-4', 'border-azul-uni');
        inicioItem.classList.remove('text-gray-600', 'hover:bg-blue-50', 'hover:text-azul-uni');
    }
}

// Adicionar eventos
menuButton.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// Fechar menu ao redimensionar para desktop
window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
        closeMenu();
    }
});

// Inicializar: destacar "Início" no menu
document.addEventListener('DOMContentLoaded', function () {
    setActiveMenuItem();
});