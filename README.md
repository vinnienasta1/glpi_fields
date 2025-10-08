# Custom Fields (GLPI 10+)

Плагин изменяет отображение некоторых полей **во всём интерфейсе GLPI** - в карточках техники, таблицах, фильтрах поиска, выпадающих списках и других элементах.

## Функционал

### Переименование полей (применяется везде):
- **«Контактное лицо» → «Стеллаж»**
- **«Группа» → «Департамент»**
- **«Бюджет» → «Проект»**
- **«Номер заказа» → «Договор»**

### Скрытие полей:
- Специалист, ответственный за оборудование
- Группа, ответственная за оборудование
- Телефон контактного лица
- Сеть
- Уникальный номер (UUID)
- Источник обновлений
- Дата заказа
- Дата доставки
- Дата последней инвентаризации
- Дата ввода в эксплуатацию
- Дата списания
- Номер иммобилизации
- Форма доставки
- Критичность бизнеса
- СCO (стоимость + контролируемые расходы)
- Ежемесячное СCO
- Гарантийная информация

### Где применяются изменения:
- ✅ Карточки техники
- ✅ Фильтры и критерии поиска
- ✅ Заголовки таблиц
- ✅ Выпадающие списки (select)
- ✅ Подсказки (placeholder, title)
- ✅ Кнопки и ссылки
- ✅ Все текстовые элементы интерфейса

Все изменения выполняются на клиенте при активном плагине. При отключении плагина интерфейс возвращается к исходному виду автоматически.

## Требования
- GLPI 10.0.0+
- Веб-сервер с правами на каталог `glpi/plugins`

## Установка

### Через Git:
```bash
cd /var/www/glpi/plugins
git clone https://github.com/vinnienasta1/glpi_fields.git customfields
chown -R www-data:www-data customfields
```

### Через архив:
1. Скопируйте архив плагина `customfields-1.2.0.tar.gz` или `customfields-1.2.0.zip` в корень GLPI, напр.: `/var/www/glpi`.
2. Распакуйте в каталог плагинов:
   - tar.gz: `sudo tar -xzf customfields-1.2.0.tar.gz -C /var/www/glpi/plugins/`
   - zip: `sudo unzip customfields-1.2.0.zip -d /var/www/glpi/plugins/`
3. Выставьте владельца/права (Debian/Ubuntu):
   - `sudo chown -R www-data:www-data /var/www/glpi/plugins/customfields`
   - `sudo find /var/www/glpi/plugins/customfields -type f -exec chmod 0644 {} \;`
   - `sudo find /var/www/glpi/plugins/customfields -type d -exec chmod 0755 {} \;`

## Активация

### Через веб-интерфейс:
Настройка → Плагины → «Custom Fields» → Установить → Включить

### Через консоль (из корня GLPI):
```bash
php bin/console plugin:install customfields -u glpi -n
php bin/console plugin:activate customfields
```

## Обновление
1. Отключите плагин: `php bin/console plugin:deactivate customfields`
2. Обновите файлы: `cd /var/www/glpi/plugins/customfields && git pull`
3. Установите: `php bin/console plugin:install customfields --force -u glpi -n`
4. Включите: `php bin/console plugin:activate customfields`

## Удаление
1. Отключите плагин
2. Удалите каталог `/var/www/glpi/plugins/customfields`

## Настройка/доработки
Локализация и логика скрытия/переименования находятся в `plugins/customfields/js/customfields.js`.

## Технические детали
- Версия: 1.2.0
- Применяется на всех страницах GLPI
- Использует MutationObserver для отслеживания динамического контента
- Обрабатывает: labels, таблицы (th/td), фильтры поиска, выпадающие списки, placeholder, title и другие элементы

## Лицензия
MIT License

## GitHub
https://github.com/vinnienasta1/glpi_fields
