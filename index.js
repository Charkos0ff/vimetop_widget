const widgets = require('./widgets.js')
const config = require('./config.js')

if(!config.access_token) return console.error(`[VT Widget] Для запуска виджета необходим токена доступа к сообществу.`)
if(!config.group_id) return console.error(`[VT Widget] Для запуска виджета необходим адрес группы, в которой он будет расположен.`)

console.log(`[VT Widget] Запущен`)
switch(config.widget){
    case 'online':
        console.log(`[VT Widget] Используемый виджет - Онлайн. Обновление раз в ${config.interval} сек.`)
        setInterval(async function () {
            widgets.online()
        }, config.interval * 1000);
    break;
    case 'guild':
        console.log(`[VT Widget] Используемый виджет - Гильдия. Обновление раз в ${config.interval} сек.`)
        setInterval(async function () {
            widgets.guild()
        }, config.interval * 1000);
    break;
}