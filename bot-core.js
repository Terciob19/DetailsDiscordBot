
//grab the discord 'library'
const Discord = require ('discord.js');
//make the bot client object
const botClient = new Discord.Client();

//categories
const categoryOtherAddons = "503975658708402206";

//bot goes online
botClient.on('ready', () => {

})

//events from the discord server
botClient.on('message', function (message) 
{

    if (message.content === "!q")
    {
        message.reply ('' + message.channel + ' ' + message.author + ' ' + message.guild + ' ' + message.channel.parentID + ' ' + typeof (message.channel.parentID));

        let cagetoryId = message.channel.parentID; //get the category
        if (cagetoryId === categoryOtherAddons) //other addons
        {
            //message.reply ('correct category!');
            botClient.sendMessage({
                to: message.channel,
                message: 'Pong!'
            });
        }

        return;

        botClient.sendMessage({
            to: channelID,
            message: '' + message.channelCategory + ' ' + message.categoryDetails + ' ' + message.channelID + ' ' + message.user + ' ' + message.userID
        });
    }

    return;

    //the message isn't from the bot
    if (message.author.bot)
    { 
        //return;
    }

    //first letter isn't an exclamation point
    if (!message.content.startsWith('!')) 
    {
        //return;
    }

    //get category
    let channelCategory = message.channelCategory; //parent_id

    if (message.author === "Tercioo")
    {
        botClient.sendMessage({
            to: channelID,
            message: '' + message.channelCategory + ' ' + message.categoryDetails + ' ' + message.channelID + ' ' + message.user + ' ' + message.userID
        });
    }
    else
    {
        return;
    }
    
    switch (channelCategory)
    {
        case categoryDetails:
            switch (message.content)
            {
                case '!faq':
                    botClient.sendMessage({
                        to: channelID,
                        message: 'https://www.curseforge.com/wow/addons/details/pages/faq'
                    });
                    break;
            }
    }

})

//token for the login process
botClient.login(process.env.tokenId);

