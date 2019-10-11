
//grab the discord 'library'
const Discord = require ('discord.js');
//make the bot client object
const botClient = new Discord.Client();

//categories
const categoryOtherAddons = "503975658708402206";
const categoryPlaterNameplates = "503974893558169611";
const categoryDetailsDamageMeter = "503973116163391488";

//bot goes online
botClient.on('ready', () => {

})

//events from the discord server
botClient.on('message', function (message) 
{
    //the message isn't from the bot
    if (message.author.bot)
    { 
        return;
    }

    //first letter isn't an exclamation point
    if (!message.content.startsWith('!')) 
    {
        return;
    }

    //get category
    let cagetoryId = message.channel.parentID;

    switch (cagetoryId)
    {
        case categoryOtherAddons:
            switch (message.content)
            {
                case '!faq':
                    message.channel.send ('FAQ');
                    break;
            }
            break;

        case categoryPlaterNameplates:
            switch (message.content)
            {
                case '!faq':
                    message.channel.send ('https://www.curseforge.com/wow/addons/plater-nameplates/pages/faq');
                    break;
            }
            break;

        case categoryDetailsDamageMeter:
                switch (message.content)
                {
                    case '!faq':
                        message.channel.send ('FAQ! https://www.curseforge.com/wow/addons/details/pages/faq');
                        break;

                    case '!aggro':
                        message.channel.send ('Hellow :) how to install Tiny Threat plugin: https://www.youtube.com/watch?v=8qD58jJPYrg');
                        break;

                    case '!classic':
                        message.channel.send ('Hellow :) here is the link for Details! Classic: https://www.curseforge.com/wow/addons/details-damage-meter-classic-wow');
                        break;
                }
                break;            
    }

})

//token for the login process
botClient.login(process.env.tokenId);

