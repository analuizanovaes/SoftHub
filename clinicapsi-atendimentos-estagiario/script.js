// Menu mobile
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
    document.getElementById('sidebar-overlay').classList.remove('open');
});

// Botão Sair
document.getElementById('logout-button').addEventListener('click', function () {
    if (confirm('Tem certeza que deseja sair?')) {
        alert('Saindo do sistema...');
        // Aqui você pode adicionar a lógica real de logout
        // window.location.href = '/logout';
    }
});

// Calendário Dinâmico
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const dayNames = [
    "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
];

function updateCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const monthLength = lastDay.getDate();

    // Atualizar o título do mês
    document.getElementById('calendar-month').textContent =
        `${monthNames[currentMonth]} ${currentYear}`;

    // Gerar os dias do calendário
    let calendarHTML = '';
    let dayCount = 1;

    // Dias do mês anterior
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += `<div class="calendar-day text-center text-sm py-2 text-gray-400">${prevMonthLastDay - startingDayOfWeek + i + 1}</div>`;
    }

    // Dias do mês atual
    for (let day = 1; day <= monthLength; day++) {
        const isToday = currentYear === currentDate.getFullYear() &&
            currentMonth === currentDate.getMonth() &&
            day === currentDate.getDate();

        const dayClass = isToday ? 'calendar-day today text-center text-sm py-2' : 'calendar-day text-center text-sm py-2';

        calendarHTML += `<div class="${dayClass}" data-day="${day}" data-month="${currentMonth}" data-year="${currentYear}">${day}</div>`;
    }

    // Dias do próximo mês
    const totalCells = 42; // 6 semanas * 7 dias
    const remainingCells = totalCells - (startingDayOfWeek + monthLength);
    for (let i = 1; i <= remainingCells; i++) {
        calendarHTML += `<div class="calendar-day text-center text-sm py-2 text-gray-400">${i}</div>`;
    }

    document.getElementById('calendar-days').innerHTML = calendarHTML;

    // Adicionar eventos de clique aos dias
    document.querySelectorAll('.calendar-day:not(.text-gray-400)').forEach(day => {
        day.addEventListener('click', function () {
            // Remove a seleção anterior
            document.querySelectorAll('.calendar-day').forEach(d => {
                d.classList.remove('selected');
            });

            // Adiciona seleção ao dia clicado
            this.classList.add('selected');

            const selectedDay = this.getAttribute('data-day');
            const selectedMonth = this.getAttribute('data-month');
            const selectedYear = this.getAttribute('data-year');

            // Atualiza a data atual
            updateCurrentDate(parseInt(selectedDay), parseInt(selectedMonth), parseInt(selectedYear));
        });
    });
}

function updateCurrentDate(day, month, year) {
    const date = new Date(year, month, day);
    const formattedDate = `${dayNames[date.getDay()]} - ${day}. ${monthNames[month]}. ${year}`;
    document.getElementById('current-date').textContent = formattedDate;

    // Atualiza as datas dos próximos dias
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('tomorrow-date').textContent =
        `${dayNames[tomorrow.getDay()]}, ${tomorrow.getDate()} de ${monthNames[tomorrow.getMonth()]}`;

    const dayAfterTomorrow = new Date(date);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    document.getElementById('day-after-tomorrow-date').textContent =
        `${dayNames[dayAfterTomorrow.getDay()]}, ${dayAfterTomorrow.getDate()} de ${monthNames[dayAfterTomorrow.getMonth()]}`;
}

// Navegação do calendário
document.getElementById('prev-month').addEventListener('click', function () {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
});

document.getElementById('next-month').addEventListener('click', function () {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
});

// Inicializar o calendário
updateCalendar();
updateCurrentDate(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());

// Ações das consultas
document.querySelectorAll('.appointment-card .fa-edit').forEach(button => {
    button.closest('button').addEventListener('click', function () {
        const patientName = this.closest('.appointment-card').querySelector('h4').textContent;
        alert(`Editando consulta de ${patientName}`);
    });
});

document.querySelectorAll('.appointment-card .fa-check').forEach(button => {
    button.closest('button').addEventListener('click', function () {
        const patientName = this.closest('.appointment-card').querySelector('h4').textContent;
        alert(`Confirmando consulta de ${patientName}`);
    });
});

document.querySelectorAll('.appointment-card .fa-times').forEach(button => {
    button.closest('button').addEventListener('click', function () {
        const patientName = this.closest('.appointment-card').querySelector('h4').textContent;
        alert(`Cancelando consulta de ${patientName}`);
    });
});