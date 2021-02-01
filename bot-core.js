
//grab the discord 'library'
const Discord = require ('discord.js');
//make the bot client object
const botClient = new Discord.Client();

//categories
const categoryOtherAddons = "503975658708402206";
const categoryPlaterNameplates = "503974893558169611";
const categoryDetailsDamageMeter = "503973116163391488";

function getUserFromMention(mention) 
{
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return botClient.users.get(mention);
	}
}

function sendMessage(message, textToSend, user)
{
    if (user)
    {
        return message.channel.send(`${user} ${textToSend}`);
    }
    else
    {
        return message.channel.send(`${textToSend}`);
    }
}


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
    const withoutPrefix = message.content.slice(1);
    const split = withoutPrefix.split(/ +/);
    const command = split[0];
    const targetUser = split[1];
    const user = getUserFromMention(targetUser);

    switch (message.channel.parentID)
    {
        case categoryOtherAddons:
            switch (command)
            {
                case 'faq':
                    sendMessage(message, `https://www.curseforge.com/wow/addons/details/pages/faq`, user);
            }
            break;

        case categoryPlaterNameplates:
            switch (command)
            {
                case 'faq':
                    return sendMessage(message, `https://www.curseforge.com/wow/addons/plater-nameplates/pages/faq`, user);
				
                case 'version':
                    return sendMessage(message, `Please verify that you are running the correct versions of Plater AND Details (if you\'re using it).
                    Twitch tends to "update" to wrong versions, e.g. classic for retail installations.
                    Both Details and Plater need to be in the correct version for your WoW installation.
                    Newer Plater versions support the following chat command to get version information: \`/plater version\`
                    Please provide this version info, if available.`, user);
            }
            break;

        case categoryDetailsDamageMeter:
                switch (command)
                {
                    case 'faq':
                        return sendMessage(message, 'FAQ! https://www.curseforge.com/wow/addons/details/pages/faq', user);

                    case 'aggro':
                        return sendMessage(message, 'How to install Tiny Threat plugin: https://www.youtube.com/watch?v=8qD58jJPYrg', user);

                    case 'classic':
                        return sendMessage(message, 'here is the link for Details! Classic: https://www.curseforge.com/wow/addons/details-damage-meter-classic-wow', user);
                    
                    case 'nickname':
                        return sendMessage(message, `Update Details! and disable any weakaura modifiers for nicknames (like Nickname Extender).`, user);

                    case 'elvui':
                        return sendMessage(message, `Go to ElvUI; AddonsSkins Options; disable chat embed or reduce it to one window, depending on your problem.`, user);
                    
                    case 'mythic':
                        return sendMessage(message, `Go to options; Mythic Dungeon section; Enable 'Make Overall Segment' and 'Merge Trash' also increase the amount of segments under Display section.`, user);

                }
                break;            
    }

})


//token for the login process
botClient.login(process.env.TOKENID);

