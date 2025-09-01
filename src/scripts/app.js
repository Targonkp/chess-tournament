let widthElement;
let moveInterval = null; // cделано глобальным, чтобы можно было сбрасывать

//обновляю ширину для карусели с участниками
function updateWidthParticipant() {
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
    updateWidthParticipant();

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
        if (number) { // Защита от null
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

let widthStageElement;
let maxSteps;
let stepStages = 0;
let switchesStagesPrevious = document.querySelector('.switches-stages__element_previous');
let switchesStagesNext = document.querySelector('.switches-stages__element_next');
let containerStages = document.querySelector('.stages-list.mobile-version');

//обновляю ширину для карусели с участниками
function updateWidthStage() {
    let element = containerStages.querySelector('.stages-list__element');
    if (window.innerWidth > 480) {
        widthStageElement = element.offsetWidth + 20;
    } else {
        widthStageElement = element.offsetWidth;
    }
}

// функция обновления позиции карусели (без анимации)
function updatePosition() {
    containerStages.style.transition = 'none';
    containerStages.style.transform = `translateX(-${widthStageElement * stepStages}px)`;
    // Через таймаут возвращаем анимацию, чтобы не было прыжка при следующем клике
    setTimeout(() => {
        containerStages.style.transition = 'transform 0.5s ease';
    }, 50);
}

// функция обновления состояния кнопок
function updateButtons() {
    if (stepStages === 0) {
        switchesStagesPrevious.dataset.disabled = true;
    } else {
        switchesStagesPrevious.dataset.disabled = false;
    }

    if (stepStages >= maxSteps) {
        switchesStagesNext.dataset.disabled = true;
    } else {
        switchesStagesNext.dataset.disabled = false;
    }
}

//инифиализация карусели с этапами
function stagesCarousel(){
    if (!containerStages) return;

    updateWidthStage();
    //динамическое определение максимального количества шагов
    maxSteps = containerStages.querySelectorAll('.stages-list__element').length - 1;

    // Начальная позиция
    updatePosition();
    updateButtons();

    // Обработчик клика на кнопку "вперёд"
    switchesStagesNext.addEventListener('click', () => {
        if (stepStages < maxSteps){
            stepStages++;
            //функция для изменения активного dot's
            dotsElementActive();
            containerStages.style.transition = 'transform 0.5s ease';
            containerStages.style.transform = `translateX(-${widthStageElement*stepStages}px)`;
            updateButtons();
        }
    });

    // Обработчик клика на кнопку "назад"
    switchesStagesPrevious.addEventListener('click', () => {
        if (stepStages > 0){
            stepStages--;
            //функция для изменения активного dot's
            dotsElementActive();
            containerStages.style.transition = 'transform 0.5s ease';
            containerStages.style.transform = `translateX(-${widthStageElement*stepStages}px)`;
            updateButtons();
        }
    });
}


// Функция для обновления при ресайзе
function onResizeUpdate() {
    // Сохраняю текущее положение в пикселях до обновления ширины
    let oldWidth = widthStageElement;

    // Пересчитываю ширину
    updateWidthStage();

    // Обновляю maxSteps (если количество элементов изменилось)
    let newMaxSteps = containerStages.querySelectorAll('.stages-list__element').length - 1;
    if (newMaxSteps !== maxSteps) {
        maxSteps = newMaxSteps;
        // Если текущий шаг выходит за пределы — корректирую
        if (stepStages > maxSteps) {
            stepStages = maxSteps;
        }
    }

    // Пересчитываю текущее смещение: старое смещение в px, но теперь нужно перейти к новой ширине
    // Обновляю позицию по текущему stepStages, но с новой шириной
    updatePosition();
    updateButtons();
}

function dotsElementCreate(){
    let stagesElementsArray = document.querySelector('.stages-list.mobile-version').querySelectorAll('.stages-list__element');
    let container = document.querySelector('.dots-container');
    //очистка контейнера, если уже есть элементы
    container.innerHTML = '';

    //создание dot's для каждого элемента массива
    stagesElementsArray.forEach((element, index) => {
        let dot = document.createElement('div');
        dot.classList.add('dots-container__element');
        //добавляю активный класс первому элементу
        if (index === 0){
            dot.classList.add('active');
        }
        container.appendChild(dot);
    })
}

function dotsElementActive(){
    let dotsElementArray = document.querySelectorAll('.dots-container__element');
    dotsElementArray.forEach(
        (element, index) => {
            if (index === stepStages){
                element.classList.add('active');
            }
            else {
                element.classList.remove('active');
            }
        }
    )
}


document.addEventListener('DOMContentLoaded', () => {
    participantsCarousel();
    stagesCarousel();
    dotsElementCreate();
});

//Дебаунс для resize
let resizeTimer;
window.addEventListener("resize", (event) => {
    //Обновление актуальной ширины элемента
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateWidthParticipant();
        onResizeUpdate();
    }, 100);
});