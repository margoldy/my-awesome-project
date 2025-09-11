
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

const phone = document.getElementById('phone');

phone?.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g,'').slice(0,11); // до 11 цифр
    const d = digits.replace(/^8/, '7'); // нормализуем 8 → 7
    const parts = [];
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1,4));
    if (d.length >= 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4,7));
    if (d.length >= 8) parts.push('-' + d.slice(7,9));
    if (d.length >= 10) parts.push('-' + d.slice(9,11));
    phone.value = parts.join('');
});
phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');

openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal(); 
    // модальный режим + затемнение
    dlg.querySelector('input,select,textarea,button')?.focus();
});

closeBtn.addEventListener('click', () => dlg.close('cancel'));

    //валидация; при успехе закрываем окно
form?.addEventListener('submit', (e) => {
    //Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // Проверка даты
    const dateInput = form.elements.date;
    if (dateInput.value) {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Сбрасываем время для сравнения только дат
        
        if (selectedDate > today) {
            dateInput.setCustomValidity('Вы ещё не родились?? Введите корректную дату');
        }
    }

    //Проверка встроенных ограничений  
    if (!form.checkValidity()) {
        e.preventDefault();

        //Пример: таргетированное сообщение
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например, name@example.com');
        }

        //Показать браузерные подсказки
        form.reportValidity(); 

        //A11y: подсветка проблемных полей
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
        });
        return;
    }
    //Успешная «отправка» (без сервера)
    e.preventDefault();

    //Если форма внутри <dialog>, закрываем окно:
    document.getElementById('contactDialog')?.close('success');
    form.reset();
}); 

dlg.addEventListener('close', () => { lastActive?.focus(); });
// Esc по умолчанию вызывает событие 'cancel' и закрывает <dialog>