
//grab the discord 'library'
const Discord = require ('discord.js');
//make the bot client object
const botClient = new Discord.Client();

//categories
const categoryOtherAddons = "503975658708402206";
const categoryPlaterNameplates = "503974893558169611";
const categoryDetailsDamageMeter = "503973116163391488";

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return botClient.users.get(mention);
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
            //debug prints
            //message.channel.send(`withoutPrefix: ${withoutPrefix}`);
            //message.channel.send(`split: ${split}`);
            //message.channel.send(`command: ${command}`);
            //message.channel.send(`targetUser: ${targetUser}`);
            //message.channel.send(`user: ${user}`);

            switch (command)
            {
                case 'faq':
                    if (user)
                    {
                        return message.channel.send(`${user} https://www.curseforge.com/wow/addons/details/pages/faq`);
                    }
                    else
                    {
                        return message.channel.send('FAQ');
                    }
                    break;
            }
            break;

        case categoryPlaterNameplates:
            switch (command)
            {
                case 'faq':
                    message.channel.send ('https://www.curseforge.com/wow/addons/plater-nameplates/pages/faq');
                    break;
				
                case 'version':
                    message.channel.send (`Please verify that you are running the correct versions of Plater AND Details (if you\'re using it).
Twitch tends to "update" to wrong versions, e.g. classic for retail installations.
Both Details and Plater need to be in the correct version for your WoW installation.
Newer Plater versions support the following chat command to get version information: \`/plater version\`
Please provide this version info, if available.`
                    );
                    break;
            }
            break;

        case categoryDetailsDamageMeter:
                switch (command)
                {
                    case 'faq':
                        message.channel.send ('FAQ! https://www.curseforge.com/wow/addons/details/pages/faq');
                        break;

                    case 'aggro':
                        message.channel.send ('Hellow :) how to install Tiny Threat plugin: https://www.youtube.com/watch?v=8qD58jJPYrg');
                        break;

                    case 'classic':
                        message.channel.send ('Hellow :) here is the link for Details! Classic: https://www.curseforge.com/wow/addons/details-damage-meter-classic-wow');
                        break;
                }
                break;            
    }

})



//token for the login process
botClient.login(process.env.TOKENID);

