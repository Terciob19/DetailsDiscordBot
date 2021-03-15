
//grab the discord 'library'
const Discord = require ('discord.js');
//make the bot client object
const botClient = new Discord.Client();

//categories
const categoryOtherAddons = "503975658708402206";
const categoryPlaterNameplates = "503974893558169611";
const categoryDetailsDamageMeter = "503973116163391488";
const categoryMods = "821051201142652948";
const modLogChannel = "821051497525542923";

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
    //console.log("I am ready!");
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

                case 'scale':
                    return sendMessage(message, `Look at the top left corner, there's a scale slider there, right click it and type 1.0 and press enter.`, user);                    
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
                        return sendMessage(message, `Go to options; Mythic Dungeon section; Enable: 'Make Overall Segment' AND 'Merge Trash' AND 'Delete Merged trash'; also increase the amount of segments under Display section.`, user);

                    case 'reinstall':
                        return sendMessage(message, `Use the command '/details reinstall', or search for 'Details' in the WTF folder and delete all findings.`, user);

                    case 'scale':
                        return sendMessage(message, `Look at the top left corner, there's a scale slider there, right click it and type 1.0 and press enter.`, user);

                    case 'short':
                        return sendMessage(message, `To modify how numbers are shown, go into the options; Display section; Modify the value of 'Number Format'.`, user);


                }
                break;            
    }

})

botClient.on('guildBanAdd', function (guild, user) { 
    console.log(`guildBanAdd: ${guild}, ${user}`);
    const logs = botClient.channels.get(modLogChannel);
    console.log(`logs: ${logs}`);
    const fetchedLogs = guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_ADD',
    });
    console.log(`fetchedLogs: ${fetchedLogs}`);
    // Since we only have 1 audit log entry in this collection, we can simply grab the first one
    const banLog = fetchedLogs.entries.first();
    console.log(`banLog: ${banLog}`);

    // Let's perform a coherence check here and make sure we got *something*
    if (!banLog) return logs.send(`${user} - ${user.tag} was banned, but no audit log could be found.`);

    // We now grab the user object of the person who banned the user
    // Let us also grab the target of this action to double check things
    const { executor, target, reason } = banLog;
    console.log(`data: ${executor}, ${target}, ${reason}`);

    // And now we can update our output with a bit more information
    // We will also run a check to make sure the log we got was for the same kicked member
    if (target.id === user.id) {
        logs.send(`${user} - ${user.tag} was banned by ${executor.tag} for '${reason}'`);
    } else {
        logs.send(`${user} - ${user.tag} was banned, audit log fetch was inconclusive.`);
    }
})


//token for the login process
botClient.login(process.env.TOKENID);

