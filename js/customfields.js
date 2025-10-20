(()=>{
  // Переименование полей
  const targetLabelsMap = new Map([
    ["Контактное лицо", "Стеллаж"],
    ["Группа", "Департамент"],
    ["Бюджет", "Проект"],
    ["Номер заказа", "Договор"],
    ["Номер иммобилизации", "Стоимость на продажу"]
  ]);

  // Скрытие полей
  const hideLabels = new Set([
    "Специалист, ответственный за оборудование",
    "Группа, ответственная за оборудование",
    "Телефон контактного лица",
    "Сеть",
    "Уникальный номер (UUID)",
    "Источник обновлений",
    "Дата заказа",
    "Дата доставки",
    "Дата последней инвентаризации",
    "Дата ввода в эксплуатацию",
    "Дата списания",
    "Форма доставки",
    "Критичность бизнеса",
    "СCO",
    "Стоимость",
    "Контролируемые расходы",
    "Ежемесячное СCO",
    "Гарантийная информация"
  ]);

  function normalize(text){
    return (text||"").trim().replace(/\s+/g, " ");
  }

  function findFieldContainer(labelEl){
    let el = labelEl;
    for(let i=0;i<6 && el;i++){
      el = el.parentElement;
      if(!el) break;
      if(el.classList && (el.classList.contains("form-group") || el.classList.contains("mb-3") || el.classList.contains("row"))){
        return el;
      }
    }
    return labelEl.closest("div");
  }

  // Проверка, что элемент безопасен для изменения
  function isSafeToModify(element) {
    if (!element) return false;
    
    // Не трогаем script, style, code элементы
    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    if (['script', 'style', 'code', 'pre', 'noscript', 'iframe'].includes(tagName)) {
      return false;
    }
    
    // Не трогаем элементы внутри script, style, code
    if (element.closest && element.closest('script, style, code, pre, noscript')) {
      return false;
    }
    
    // Не трогаем элементы с data-no-translate или contenteditable
    if (element.hasAttribute && (
      element.hasAttribute('data-no-translate') || 
      element.getAttribute('contenteditable') === 'true'
    )) {
      return false;
    }
    
    return true;
  }

  // Замена текста в текстовых узлах элемента
  function replaceInTextNodes(element, oldText, newText) {
    if (!element || !element.childNodes) return false;
    
    let modified = false;
    Array.from(element.childNodes).forEach(node => {
      if (node.nodeType === 3) { // Текстовый узел
        const text = normalize(node.textContent);
        if (text === oldText) {
          node.textContent = newText;
          modified = true;
        }
      }
    });
    
    return modified;
  }

  // Рекурсивная замена текста в элементе и его потомках
  function replaceTextRecursive(element) {
    if (!isSafeToModify(element)) return false;
    
    let modified = false;
    
    // Пробуем заменить в прямых текстовых узлах
    targetLabelsMap.forEach((newVal, oldVal) => {
      if (replaceInTextNodes(element, oldVal, newVal)) {
        modified = true;
      }
    });
    
    // Рекурсивно обрабатываем дочерние элементы (но не script/style)
    if (element.children) {
      Array.from(element.children).forEach(child => {
        if (isSafeToModify(child)) {
          if (replaceTextRecursive(child)) {
            modified = true;
          }
        }
      });
    }
    
    return modified;
  }

  function apply(){
    // 1. Обработка label элементов (основное переименование)
    document.querySelectorAll("label").forEach(label=>{
      if (!isSafeToModify(label)) return;
      
      const text = normalize(label.textContent);
      
      // Переименование полей
      if(targetLabelsMap.has(text)){
        const newText = targetLabelsMap.get(text);
        if(newText && normalize(label.textContent) !== newText){
          label.textContent = newText;
        }
      }
      
      // Скрытие полей
      if(hideLabels.has(text)){
        const container = findFieldContainer(label);
        if(container && container.style.display !== "none"){
          container.style.display = "none";
        }
      }
    });

    // 2. Обработка заголовков таблиц (th) - улучшенная версия
    document.querySelectorAll("th").forEach(th => {
      if (!isSafeToModify(th)) return;
      
      // Получаем текст заголовка (может содержать иконки сортировки и т.д.)
      const text = normalize(th.textContent);
      
      // Проверяем, нужно ли переименовать
      targetLabelsMap.forEach((newVal, oldVal) => {
        if (text === oldVal || text.includes(oldVal)) {
          // Ищем текстовые узлы и заменяем в них
          replaceTextRecursive(th);
        }
      });
      
      // Скрытие колонок
      if (hideLabels.has(text)) {
        th.style.display = "none";
        const index = Array.from(th.parentElement.children).indexOf(th);
        const table = th.closest('table');
        if (table) {
          table.querySelectorAll('tr').forEach(tr => {
            const td = tr.children[index];
            if (td) td.style.display = "none";
          });
        }
      }
    });

    // 3. Обработка span внутри th (часто используется для текста заголовка)
    document.querySelectorAll("th span, th a").forEach(el => {
      if (!isSafeToModify(el)) return;
      
      const text = normalize(el.textContent);
      if (targetLabelsMap.has(text)) {
        targetLabelsMap.forEach((newVal, oldVal) => {
          if (text === oldVal) {
            replaceInTextNodes(el, oldVal, newVal);
          }
        });
      }
    });

    // 4. Обработка option в select (выпадающие списки в фильтрах)
    document.querySelectorAll("select option, .select2-results__option").forEach(option => {
      if (!isSafeToModify(option)) return;
      
      const text = normalize(option.textContent);
      if (targetLabelsMap.has(text)) {
        targetLabelsMap.forEach((newVal, oldVal) => {
          if (text === oldVal) {
            option.textContent = newVal;
          }
        });
      }
    });

    // 5. Обработка элементов в фильтрах поиска
    document.querySelectorAll('[id*="criteria"] label, .search_page label').forEach(label => {
      if (!isSafeToModify(label)) return;
      
      const text = normalize(label.textContent);
      if (targetLabelsMap.has(text)) {
        label.textContent = targetLabelsMap.get(text);
      }
    });

    // 6. Обработка placeholder и title атрибутов
    document.querySelectorAll("[placeholder], [title]").forEach(el => {
      if (!isSafeToModify(el)) return;
      
      if (el.placeholder) {
        targetLabelsMap.forEach((newVal, oldVal) => {
          if (normalize(el.placeholder) === oldVal) {
            el.placeholder = newVal;
          }
        });
      }
      if (el.title && el.title.length < 100) { // только короткие title
        targetLabelsMap.forEach((newVal, oldVal) => {
          if (normalize(el.title) === oldVal) {
            el.title = newVal;
          }
        });
      }
    });

    // 7. Обработка Select2 rendered
    document.querySelectorAll('.select2-selection__rendered').forEach(el => {
      if (!isSafeToModify(el)) return;
      
      const text = normalize(el.textContent);
      if (targetLabelsMap.has(text)) {
        targetLabelsMap.forEach((newVal, oldVal) => {
          if (text === oldVal) {
            replaceInTextNodes(el, oldVal, newVal);
          }
        });
      }
    });
    
    // 8. Обработка ссылок сортировки в таблицах
    document.querySelectorAll("table th a[href*='sort']").forEach(link => {
      if (!isSafeToModify(link)) return;
      
      const text = normalize(link.textContent);
      if (targetLabelsMap.has(text)) {
        targetLabelsMap.forEach((newVal, oldVal) => {
          if (text === oldVal) {
            link.textContent = newVal;
          }
        });
      }
    });
  }

  let applyTimeout = null;
  function scheduleApply() {
    if (applyTimeout) clearTimeout(applyTimeout);
    applyTimeout = setTimeout(() => {
      apply();
      applyTimeout = null;
    }, 100);
  }

  function init(){
    // Первое применение
    apply();
    
    // Наблюдатель за изменениями DOM
    const obs = new MutationObserver((mutations) => {
      let shouldApply = false;
      
      for (const mutation of mutations) {
        // Применяем только при добавлении элементов
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldApply = true;
          break;
        }
      }
      
      if (shouldApply) {
        scheduleApply();
      }
    });
    
    obs.observe(document.body, {
      subtree: true,
      childList: true
    });

    // События GLPI
    window.addEventListener("glpi:form:loaded", apply, {passive:true});
    
    // Дополнительные применения для динамического контента
    setTimeout(apply, 500);
    setTimeout(apply, 1500);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
