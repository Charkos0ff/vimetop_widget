const { default: axios } = require("axios");
const { VK } = require("vk-io");
const config = require("./config");
const moment = require("moment");

const vk = new VK({
    token: config.access_token,
    apiLimit: 20,
    apiMode: "sequential",
});

async function rank(data){
    switch(data){
        case 'ADMIN':
            data = '[Гл. Админ] '
        break;    
        case 'CHIEF':
            data = '[Гл. Модер] '
        break;   
        case 'WARDEN':
            data = '[Пр. Модер] '
        break;
        case 'MODER':
            data = '[Модер] '
        break;
        case 'ORGANIZER':
            data = '[Организатор] '
        break; 
        case 'DEV':
            data = '[Разработчик] '
        break; 
        case 'YOUTUBE':
            data = '[YouTube] '
        break; 
        case 'MAPLEAD':
            data = '[Гл. Билдер] '
        break; 
        case 'SRBUILDER':
            data = '[Пр. Билдер] '
        break; 
        case 'BUILDER':
            data = '[Билдер] '
        break; 
        case 'IMMORTAL':
            data = '[Immortal] '
        break; 
        case 'HOLY':
            data = '[Holy] '
        break; 
        case 'PREMIUM':
            data = '[Premium] '
        break; 
        case 'VIP':
            data = '[VIP] '
        break; 
        case 'PLAYER':
            data = ''
        break;
        default:
            data = `[${data}] `
        break;        
    }
    return data;
}
module.exports = {
    online: async function(){
        const servers = await axios.get('http://mc.vimeworld.ru/mon/min.json')

        //блок "хочу себе такой виджет"
        let more = "Хочу себе такой виджет"
        let more_url = "https://vk.com/vimenotify?w=product-166620940_1633803"

        if(config.ad == false){
            more = ""
            more_url = ""
        }

        let widget = {
            title: `Онлайн на сервере VimeWorld`,
            head: [
                {
                    text: 'Сервер'
                },
                {
                    text: 'Текущий онлайн',
                    align: 'center'
                },
            ],
            more: more,
            more_url: more_url,
            body: 
            [
                [{text: `MiniGames`},
                {text: servers.data.MiniGames.online}],
                [{text: `CivCraft`},
                {text: servers.data.CivCraft.online}],
                [{text: `Vime`},
                {text: servers.data.Vime.online}],
                [{text: `Explore`},
                {text: servers.data.Explore.online}],
                [{text: `Discover`},
                {text: servers.data.Discover.online}],
                [{text: `Flair`},
                {text: servers.data.Flair.online}],
                [{text: `Empire`},
                {text: servers.data.Empire.online}],
                [{text: `Wurst`},
                {text: servers.data.Wurst.online}],
                [{text: `Hoden`},
                {text: servers.data.Hoden.online}],
            ]
        }

        if(config.update_message == true) console.log(`[Widget] Обновление..`)
        vk.api.appWidgets.update({
            type: 'table',
            access_token: config.access_token,
            code: `return ${JSON.stringify(widget)};`,
        })
    },
    guild: async function(){
        if(!config.guild_id) return console.error(`[Widget] Для запуска этого виджета необходим ID гильдии`)

        const guild = await axios.get(`https://api.vimeworld.ru/guild/get?id=${config.guild_id}`)

        if(guild && guild.data && guild.data.error) return console.error(`[Widget] При получении гильдии произошла ошибка ${response.data.error_code}: ${response.data.error_msg}`)
        let totalMembers = 20 + 5 * guild.data.perks.MEMBERS.level;

        //получение топов
        let tops = await new Promise((resolve) => {
            var promise1 = axios.get(`https://api.vimeworld.ru/leaderboard/get/guild/level?size=1000`);
            var promise2 = axios.get(`https://api.vimeworld.ru/leaderboard/get/guild/total_coins?size=1000`);

            Promise.all([promise1, promise2]).then(function(values) {
                let top_level = `-`;
                let top_coins = `-`;
                for (let i = 0; i !== values[0].data.records.length; i++) {
                    if(values[0].data.records[i].name == guild.data.name){
                        top_level = i+1
                    }
                }
                if(top_level == -1){
                    
                }

                for (let i = 0; i !== values[1].data.records.length; i++) {
                    if(values[1].data.records[i].name == guild.data.name){
                        top_coins = i+1
                    }
                }
                if(top_coins == -1){
                    
                }
                resolve([top_level, top_coins])
            })
        });

        //получение лидера
        for (let i = 0; i !== guild.data.members.length; i++) {
            if(guild.data.members[i].status === "LEADER"){
                var leader = `${await rank(guild.data.members[i].user.rank)}${guild.data.members[i].user.username}`;
            }
        }
        
        //последний вступивший
        let last_member = guild.data.members.sort((a, b) => b.joined - a.joined)[0]

        //вся инфа по лвлу
        let expLvl = (guild.data.level-1)*10000+50000;
        let exp = Math.floor(expLvl*guild.data.levelPercentage);
        let expPercent = Math.floor(guild.data.levelPercentage*100);

        //блок "хочу себе такой виджет"
        let more = "Хочу себе такой виджет"
        let more_url = "https://vk.com/vimenotify?w=product-166620940_1633803"

        //топ по вложенным коинам и заработанному опыту
        let members = guild.data.members;
        members.sort((prev, next) => next.guildCoins - prev.guildCoins);
        let top_coins = `${await rank(members[0].user.rank)}${members[0].user.username} - ${members[0].guildCoins}`
            + `\n${await rank(members[1].user.rank)}${members[1].user.username} - ${members[1].guildCoins}`
            + `\n${await rank(members[2].user.rank)}${members[2].user.username} - ${members[2].guildCoins}`;
        members.sort((prev, next) => next.guildExp - prev.guildExp);
        let top_exp = `${await rank(members[0].user.rank)}${members[0].user.username} - ${members[0].guildExp}`
            + `\n${await rank(members[1].user.rank)}${members[1].user.username} - ${members[1].guildExp}`
            + `\n${await rank(members[2].user.rank)}${members[2].user.username} - ${members[2].guildExp}`;
		
		if(config.ad == false){
            more = ""
            more_url = ""
        }
		
        let widget = {
            title: `Гильдия - ${guild.data.name}`,
            rows: [
                {
                    icon_id: config.group_id,
                    title: `Лидер: ${leader}`,
                    descr: `Место в топе по опыту: ${tops[0]} | Место в топе по коинам: ${tops[1]}`,
                    address: `Участников: ${guild.data.members.length}/${totalMembers} | Последний вступивший: ${await rank(last_member.user.rank)}${last_member.user.username}`,
                    time: `Создана: ${moment.unix(guild.data.created).format("DD.MM.YY HH:mm:ss")}`,
                    text: `Уровень: ${guild.data.level} [${exp}/${expLvl}] [${expPercent}%]\nКоинов вложено: ${guild.data.totalCoins}\nЗаработано опыта: ${guild.data.totalExp}\n\nПодробнее: vimetop.ru/guild/${guild.data.id}`
                },
                {
                    icon_id: config.group_id,
                    title: "Больше всего заработали опыта:",
                    text: top_exp
                },
                {
                    icon_id: config.group_id,
                    title: "Больше всего вложили коинов:",
                    text: top_coins
                }
            ],
            more: more,
            more_url: more_url
        }

        if(config.update_message == true) console.log(`[Widget] Обновление..`)
        vk.api.appWidgets.update({
            type: 'list',
            access_token: config.access_token,
            code: `return ${JSON.stringify(widget)};`,
        })
    }
}