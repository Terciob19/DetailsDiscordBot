
//grab the discord 'library'
const Discord = require ('discord.js');
//make the bot client object
const botClient = new Discord.Client();

//bot goes online
botClient.on('ready', () => {
    //console.log('!');
})

//events from the discord server
botClient.on('message', msg=> {
    switch (msg.content)
    {
        case "!test":
            msg.reply("test test");
            break;
    }
})

//token for the login process
botClient.login(process.env.tokenId);

