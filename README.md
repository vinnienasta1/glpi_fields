# Custom Fields (GLPI 10+)

Плагин изменяет отображение некоторых полей на карточках техники в GLPI:
- «Контактное лицо» → «Стеллаж»
- «Группа» → «Департамент»
- Скрывает поля: «Специалист, ответственный за оборудование», «Группа, ответственная за оборудование», «Телефон контактного лица», «Сеть», «Уникальный номер (UUID)», «Источник обновлений»

Все изменения выполняются на клиенте при активном плагине. При отключении плагина интерфейс возвращается к исходному виду автоматически.

## Требования
- GLPI 10.0.0+
- Веб‑сервер с правами на каталог `glpi/plugins`

## Установка (через архив)
1. Скопируйте архив плагина `customfields-1.0.0.tar.gz` или `customfields-1.0.0.zip` в корень GLPI, напр.: `/var/www/glpi`.
2. Распакуйте в каталог плагинов:
   - tar.gz: `sudo tar -xzf customfields-1.0.0.tar.gz -C /var/www/glpi/plugins/`
   - zip: `sudo unzip customfields-1.0.0.zip -d /var/www/glpi/plugins/`
3. Выставьте владельца/права (Debian/Ubuntu):
   - `sudo chown -R www-data:www-data /var/www/glpi/plugins/customfields`
   - `sudo find /var/www/glpi/plugins/customfields -type f -exec chmod 0644 {} \;`
   - `sudo find /var/www/glpi/plugins/customfields -type d -exec chmod 0755 {} \;`

## Активация
- Веб‑интерфейс: Настройка → Плагины → «Custom Fields» → Установить → Включить.
- Консоль (из корня GLPI):
  - `sudo -u www-data php bin/console glpi:plugin:install customfields --no-interaction`
  - `sudo -u www-data php bin/console glpi:plugin:enable customfields --no-interaction`

## Обновление
1. Отключите плагин (или `glpi:plugin:disable customfields`).
2. Замените каталог `glpi/plugins/customfields` новыми файлами.
3. Включите плагин.

## Удаление
1. Отключите плагин.
2. Удалите каталог `/var/www/glpi/plugins/customfields`.

## Настройка/доработки
- Локализация и логика скрытия/переименования находятся в `plugins/customfields/js/customfields.js`.
