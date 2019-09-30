
//grab the discord 'library'
const Discord = require ("discord.js");
//make the bot client object
const botClient = new Discord.Client();

//bot goes online
botClient.on("ready", () => {

})

//events from the discord server
botClient.on("message", msg=> {

    //msg.channel.send(msg.channel)
    //msg.channel.send(msg.channel.id)

    switch (msg.channel.parent)
    {
        case "Details! Damage Meter":
            switch (msg.content)
            {
                case "!faq":
                    msg.channel.send("https://www.curseforge.com/wow/addons/details/pages/faq")
                    break;
            }
    }

})

//token for the login process
botClient.login(process.env.tokenId);

