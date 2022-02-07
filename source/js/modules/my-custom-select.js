/* eslint-disable no-invalid-this */

// Кастомный селект. Начало

const initCustomSelect = () => {
  const initSelect = function () {
    let innerSelects = document.querySelectorAll('.custom-select__inner');
    let selectItemBody = document.querySelectorAll('.custom-select__body');


    innerSelects.forEach((item) => {
      item.addEventListener('click', selectToggle);
    });

    selectItemBody.forEach((sBody) => {
      let selectItem = sBody.querySelectorAll('.custom-select__label-item');
      sBody.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('custom-select__label-item')) {
          for (let i = 0; i < selectItem.length; i++) {
            selectItem[i].classList.remove('is-active');
          }
          target.classList.add('is-active');
        }
        selectItem.forEach(item, selectChoose);
      });
    });

    function selectToggle() {
      this.parentElement.classList.toggle('_active');
    }

    function selectChoose() {
      let text = this.innerText;
      let parent = this.closest('.custom-select');
      let currentText = parent.querySelector('.custom-select__current ');
      currentText.innerText = text;
      parent.classList.remove('_active');
      this.classList.add('is-active');
    }
  };

  initSelect();
};
// Кастомный селект. Конец
export { initCustomSelect };
