(()=>{
  // Переименование полей
  const targetLabelsMap = new Map([
    ["Контактное лицо", "Стеллаж"],
    ["Группа", "Департамент"],
    ["Бюджет", "Проект"],
    ["Номер заказа", "Договор"]
  ]);

  // Скрытие полей
  const hideLabels = new Set([
    // Оригинальные поля для скрытия
    "Специалист, ответственный за оборудование",
    "Группа, ответственная за оборудование",
    "Телефон контактного лица",
    "Сеть",
    "Уникальный номер (UUID)",
    "Источник обновлений",
    // Новые поля для скрытия
    "Дата заказа",
    "Дата доставки",
    "Дата последней инвентаризации",
    "Дата ввода в эксплуатацию",
    "Дата списания",
    "Номер иммобилизации",
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

  function apply(){
    const labels = document.querySelectorAll("label");
    labels.forEach(label=>{
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
  }

  function shouldRunOnThisPage(){
    const path = location.pathname || "";
    return /\/front\/(computer|monitor|networkequipment|phone|peripheral|printer|rack|software)\.form\.php$/i.test(path) ||
           /\/front\/.*item\.form\.php$/i.test(path) ||
           document.body.matches('[data-glpi-page="item-form"]');
  }

  function init(){
    if(!shouldRunOnThisPage()){ return; }
    apply();
    const obs = new MutationObserver(()=>apply());
    obs.observe(document.documentElement,{subtree:true,childList:true});
    window.addEventListener("glpi:form:loaded", apply, {passive:true});
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
