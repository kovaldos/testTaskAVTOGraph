/* eslint-disable valid-jsdoc */
// Скрипт для ToDo-списка - начало -

const initToDo = () => {
  const toDoText = document.querySelector('.to-do__input');
  const addTaskBtn = document.querySelector('.to-do__add-btn');
  const toDoWrapper = document.querySelector('.to-do__items');
  const dbUrl = 'https://jsonplaceholder.typicode.com/todos';

  /**
		* Создаём переменную для хранения объектов-экземпляров задач ToDo-списка
		* Если в localStorage пусто, то массив будет пустым иначе наполняем его
		* объектами из localStorage
		*/
  let localToDoTaskItems = null;
  if (!localStorage.taskItems) {
    localToDoTaskItems = [];
  } else {
    localToDoTaskItems = JSON.parse(localStorage.getItem('taskItems'));
  }

  /**
		* Берем данные из БД. Здесь используется тестовая API https://jsonplaceholder.typicode.com/
		* @return объект промиса
		*/
  function getAllTodos() {
    return new Promise((resolve) => {
      fetch(new Request(dbUrl))
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            resolve(data);
          });
    });
  }

  /**
	 * Функция отрисовывает разметку айтемов из БД, используя темплейт.
	 * А также навешивает слушатель клика и обработчик на кнопку удаления
	 */
  const fillHTMLRemoteTaskItems = () => {
    // Работаем с данными из промиса
    getAllTodos().then((allRemoteTodos) => {
      const remoteTodoItems = allRemoteTodos.slice(0, 5); // берем не более 5 айтемов с БД
      remoteTodoItems.forEach((item, index) => {
        item.completed = false;
        toDoWrapper.innerHTML += createTemplate(item, index);
        toDoWrapper.addEventListener('click', (e) => {
          const parentEl = e.target.closest('.to-do__item');
          const inputLabelValue = parentEl.querySelector('.custom-checkbox__span').innerText;
          if (e.target === parentEl.querySelector('.to-do__btn-close') && item.title === inputLabelValue) {
            parentEl.style.display = 'none';
          }
          if (e.target === parentEl.querySelector('.custom-checkbox__span')) {
            parentEl.classList.toggle('checked');
          }
        });
      });
    });
  };


  /**
		* Функция-конструктор для создания объектов-экземпляров задач ToDo-списка
		* @param {*} taskItemText принимает текст задачи
		*/
  function Task(taskItemText) {
    this.taskItemText = taskItemText;
    this.completed = false;
  }


  /**
		* Функция для создания html-разметки (темплейта) задачи ToDo-списка
		* @param {*} taskItem принимает текст задачи
		* @param {*} index и её индекс в массиве объектов-задач
		* @return возвращает разметку экземпляра задачи
		*/
  const createTemplate = (taskItem, index) => {
    const ToDoItemTemplate = `
		<li class="to-do__item ${taskItem.completed ? 'checked' : ''}">
			<div class="to-do__custom-checkbox custom-checkbox">
				<label class="custom-checkbox__label">
					<input class="custom-checkbox__input" id="item_${index + 1}" type="checkbox" ${taskItem.completed ? 'checked' : ''} name="to-do-check" value="value-01">
					<span class="custom-checkbox__span">${taskItem.taskItemText ? taskItem.taskItemText : taskItem.title}</span>
				</label>
			</div>
			<button class="btn to-do__btn-close" type="button">
				<svg width="10" height="10" aria-hidden="true">
					<use xlink:href="#icon-close-bold"></use>
				</svg>
			</button>
		</li>
		`;
    return ToDoItemTemplate;
  };

  /**
	  * Функция заполняет родительский контейнер списка дел html-элементами,
	  * созданными из объектов-задач списка дел
	  */
  const fillHtmlTaskItems = () => {
    fillHTMLRemoteTaskItems();
    toDoWrapper.innerHTML = '';
    if (localToDoTaskItems.length > 0) {
      localToDoTaskItems.forEach((item, index) => {
        toDoWrapper.innerHTML += createTemplate(item, index);
      });
    }
  };
  fillHtmlTaskItems();

  /**
	  * Функция очищает поле ввода после добавления задачи
	  */
  const clearToDoTextInput = () => {
    setTimeout(() => {
      toDoText.value = '';
    }, 300);
  };

  /**
		* Функция обновления локального хранилища
		*/
  const updateLocalStorage = () => {
    localStorage.setItem('taskItems', JSON.stringify(localToDoTaskItems));
  };

  /**
	  * Функция для обновления локального хранилища и отрисовки списка дел
	  */
  const renderTaskItems = () => {
    updateLocalStorage();
    fillHtmlTaskItems();
  };

  // Навешиваем слушатель события клика по кнопке добавления задачи ToDo-списка
  addTaskBtn.addEventListener('click', () => {
    localToDoTaskItems.push(new Task(toDoText.value));
    renderTaskItems();
    clearToDoTextInput();
  });

  // Навешиваем слушатель события клавиши Enter на инпут для добавления задачи ToDo-списка
  toDoText.addEventListener('keydown', (e) => {
    const targetKey = e.key;
    if (targetKey === 'Enter') {
      localToDoTaskItems.push(new Task(toDoText.value));
      renderTaskItems();
      clearToDoTextInput();
    }
  });

  // Делегируем слушателя и обработчики на родительский элемент, чтобы иметь возможность взаимодействовать с задачами
  toDoWrapper.addEventListener('click', (e) => {
    const parentEl = e.target.closest('.to-do__item');
    const inputLabelValue = parentEl.querySelector('.custom-checkbox__span').innerText;
    localToDoTaskItems.forEach((taskItem) => {
      if (taskItem.taskItemText === inputLabelValue) {
        if (e.target === parentEl.querySelector('.custom-checkbox__span')) {
          taskItem.completed = !taskItem.completed;
          renderTaskItems();
        } if (e.target === parentEl.querySelector('.to-do__btn-close')) {
          const index = localToDoTaskItems.indexOf(taskItem);
          localToDoTaskItems.splice(index, 1);
          fillHtmlTaskItems();
        }
      }
    });
  });


};

export {initToDo};
// Скрипт для ToDo-списка - конец -
