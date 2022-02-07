import CustomSelect from './_custom-select';

const initCustomSelect = () => {
  const select01 = document.getElementById('select01');
  if (select01) {
    // eslint-disable-next-line no-unused-vars
    const customSelect = new CustomSelect(select01, {
      name: 'type', // значение атрибута name у кнопки
      targetValue: 'all', // значение по умолчанию
      options: [['all', 'Все'], ['completed', 'Выполненные'], ['active', 'В работе']], // опции
      onSelected(select, option) {
        // выбранное значение
        console.log(`Выбранное значение: ${select.value}`);
        // индекс выбранной опции
        console.log(`Индекс выбранной опции: ${select.selectedIndex}`);
        // выбранный текст опции
        const text = option ? option.textContent : '';
        console.log(`Выбранный текст опции: ${text}`);
        const toDoItems = document.querySelectorAll('.to-do__item');
        toDoItems.forEach((item) => {
          if (select.value === 'completed') {
            if (!item.classList.contains('checked')) {
              item.classList.add('visually-hidden');
            } else {
              item.classList.remove('visually-hidden');
            }
          }
          if (select.value === 'active') {
            if (item.classList.contains('checked')) {
              item.classList.add('visually-hidden');
            } else {
              item.classList.remove('visually-hidden');
            }
          }
          if (select.value === 'all') {
              item.classList.remove('visually-hidden');
          }
        });
      },
    });
  }

};
export {initCustomSelect};
