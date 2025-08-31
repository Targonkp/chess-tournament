let widthElement;
let moveInterval = null; // ✅ Сделано глобальным, чтобы можно было сбрасывать

//обновляю ширину
function updateWidth() {
    if (window.innerWidth > 480) {
        widthElement = document.querySelector('.participants-list__element').offsetWidth + 20;
    } else {
        widthElement = document.querySelector('.participants-list__element').offsetWidth;
    }
}

//функция карусели с участниками
function participantsCarousel(){
    let participantsContainer = document.querySelector('.participants-list');
    let participantsArray = document.querySelectorAll('.participants-list__element');
    let participantActive = document.querySelector('.active-element');
    let participantTotal = document.querySelector('.total-element');

    // Очищаем старый интервал, если он был
    if (moveInterval) {
        clearInterval(moveInterval);
    }

    //получаю актуальную ширину
    updateWidth();

    //отображаю общее количество элементов
    participantTotal.innerHTML = participantsArray.length;

    //нахожу активный элемент
    const activeElement = function (){
        let foundElement = null;
        participantsArray.forEach(element => {
            if (element.classList.contains('active-element')) {
                foundElement = element;
            }
        });
        return foundElement;
    };

    //вывожу номер активного элемента на страницу
    function setNumberActiveElement(number){
        if (number) { // ✅ Защита от null
            let dataNumber = number.getAttribute('data-number');
            participantActive.innerHTML = dataNumber;
        }
    }

    setNumberActiveElement(activeElement());

    // Функция для сброса и перезапуска интервала
    function resetInterval() {
        if (moveInterval) {
            clearInterval(moveInterval);
        }
        moveInterval = setInterval(moveElement, 5000);
    }

    //функция, перемещающая общий контейнер (автоматическая прокрутка вперёд)
    function moveElement(){
        // Включаю плавную анимацию
        participantsContainer.style.transition = 'transform 0.5s ease';
        participantsContainer.style.transform = `translateX(-${widthElement}px)`;

        // Через небольшую задержку (после анимации) — переставляю и сбрасываю
        setTimeout(() => {
            const currentActiveElement = activeElement();
            if (!currentActiveElement) return;

            // Убираю активный класс
            currentActiveElement.classList.remove('active-element');

            // Добавляю активный класс следующему (если есть)
            const nextActive = currentActiveElement.nextElementSibling;
            if (nextActive) {
                nextActive.classList.add('active-element');
            }

            // Обновляю номер на странице
            setNumberActiveElement(activeElement());

            // Отключаю анимацию — чтобы сброс был мгновенным
            participantsContainer.style.transition = 'none';

            // Перемещаю первый элемент в конец
            const firstElement = participantsContainer.firstElementChild;
            participantsContainer.appendChild(firstElement);

            // Мгновенно сбрасываю transform в 0
            participantsContainer.style.transform = 'translateX(0)';

            // Через микрозадержку возвращаю transition
            setTimeout(() => {
                participantsContainer.style.transition = 'transform 0.5s ease';
            }, 50);

        }, 500);
    }

    // Функция для перехода к следующему слайду
    function nextSlide() {
        const currentActiveElement = activeElement();
        if (!currentActiveElement) return;

        participantsContainer.style.transition = 'transform 0.5s ease';
        participantsContainer.style.transform = `translateX(-${widthElement}px)`;

        setTimeout(() => {
            currentActiveElement.classList.remove('active-element');

            const nextActive = currentActiveElement.nextElementSibling;
            if (nextActive) {
                nextActive.classList.add('active-element');
            }

            setNumberActiveElement(activeElement());

            participantsContainer.style.transition = 'none';
            const firstElement = participantsContainer.firstElementChild;
            participantsContainer.appendChild(firstElement);
            participantsContainer.style.transform = 'translateX(0)';

            setTimeout(() => {
                participantsContainer.style.transition = 'transform 0.5s ease';
            }, 50);

            // Сбрасываем таймер
            resetInterval();
        }, 500);
    }

    // Функция для перехода к предыдущему слайду
    function prevSlide() {
        const currentActiveElement = activeElement();
        if (!currentActiveElement) return;

        const lastElement = participantsContainer.lastElementChild;

        // Отключаем анимацию и вставляем последний элемент в начало
        participantsContainer.style.transition = 'none';
        participantsContainer.insertBefore(lastElement, participantsContainer.firstElementChild);
        participantsContainer.style.transform = `translateX(-${widthElement}px)`; // сдвигаем сразу

        // Включаем анимацию и делаем плавный откат
        setTimeout(() => {
            participantsContainer.style.transition = 'transform 0.5s ease';
            participantsContainer.style.transform = 'translateX(0)';
        }, 50);

        // Обновляем активный элемент
        setTimeout(() => {
            currentActiveElement.classList.remove('active-element');
            lastElement.classList.add('active-element');
            setNumberActiveElement(activeElement());

            // Сбрасываем таймер
            resetInterval();
        }, 550);
    }

    // Обработчики на кнопки
    const nextButton = document.querySelector('.switch__element_next');
    const prevButton = document.querySelector('.switch__element_previous');

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
        });
    }

    // Запуск автоматической прокрутки
    moveInterval = setInterval(moveElement, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    participantsCarousel();
});

//Дебаунс для resize
let resizeTimer;
window.addEventListener("resize", (event) => {
    //Обновление актуальной ширины элемента
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateWidth();
    }, 100);
});