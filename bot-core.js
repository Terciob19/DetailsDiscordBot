
//grab the discord 'library'
//const Discord = require ('discord.js');
//make the bot client object
//const botClient = new Discord.Client();

//grab the discord 'library'
const { Client, Intents } = require ('discord.js');
//make the bot client object and register intents (events)
const myIntents = new Intents();
myIntents.add('GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_BANS');
//myIntents.add('GUILDS', 'GUILD_MESSAGES', 'GUILD_BANS');
const botClient = new Client({ intents: myIntents, partials: ['GUILD_MEMBERS'] });


//categories
const categoryOtherAddons = "503975658708402206";
const categoryPlaterNameplates = "503974893558169611";
const categoryDetailsDamageMeter = "503973116163391488";
const categoryMods = "821051201142652948";
const modLogChannel = "821051497525542923";

//the discord
const discordDetails = "503971787718131713";

function getUserFromMention(mention) 
{
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return botClient.guilds.cache.get(discordDetails).users.get(mention);
    }
}

function sendMessage(message, textToSend, user)
{
    if (user)
    {
        return message.channel.send(`${user} ${textToSend}`).catch((err) => { console.log(err) });
    }
    else
    {
        return message.channel.send(`${textToSend}`).catch((err) => { console.log(err) });;
    }
}

//commands
const commandFAQ = {
  name: 'faq',
  description: 'Links the FAQ.',
  options: [{
    name: 'user',
    type: 'USER',
    description: 'The user which should be mentioned.',
    required: false,
  }],
};


//bot goes online
botClient.once('ready', () => {
    
    //https://github.com/discordjs/discord.js/blob/master/docs/examples/commands.md
    // Creating a global command
    //botClient.application.commands.create(commandData);
    // Creating a guild-specific command
    botClient.guilds.cache.get(discordDetails).commands.create(commandFAQ);
    
    //console.log("I am ready!");
})

botClient.on('interaction', interaction => {
  // If the interaction isn't a slash command, return
  if (!interaction.isCommand()) return;

  // Check if it is the correct command
  switch(interaction.commandName)
  {
    case 'faq':
        // Get the input of the user
        var input;
        if (interaction.options && interaction.options[0]) input = interaction.options[0].value;
        //const user = getUserFromMention(input);
        const user = input;
        
        // Reply to the command
        if (user) {
            interaction.reply(`${interaction.options[0]} ${user}: https://www.curseforge.com/wow/addons/details/pages/faq`);
        }
        else
        {
            interaction.reply(`https://www.curseforge.com/wow/addons/details/pages/faq`);
        }
        
  }
});

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
    //const user = getUserFromMention(targetUser);
    const user = message.mentions.users.first();

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

botClient.on('guildBanAdd', async (guild, user) => {
    //console.log(`guildBanAdd: ${guild}, ${user}`);
    const logs = await botClient.channels.fetch(modLogChannel);
        const fetchedBanLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_ADD',
    });
    const banLog = await fetchedBanLogs.entries.first();
    
    if (banLog && banLog.target.id === user.id) {
        var { executor, target, reason } = banLog;
        if (!reason) reason = '<No reason given>';
        logs.send(`${user}/${user.tag}/${user.id} was banned by ${executor}/${executor.tag} with reason: '${reason}'`);
    } else {
        logs.send(`${user}/${user.tag}/${user.id} was banned, but no audit log could be found.`);
    }
})

botClient.on('guildMemberRemove', async (member) => {
    if (member.partial) await member.fetch();
    console.log(`guildMemberRemove: ${member}`);

    const logs = await botClient.channels.fetch(modLogChannel);
    const fetchedKickLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
    });

    const kickLog = await fetchedKickLogs.entries.first();
    if (kickLog) console.log(`kickLog entry found: ${kickLog.target.id} / ${member.user.id} - ${kickLog.createdAt} / ${member.joinedAt}`);

    if (kickLog && kickLog.target.id === member.user.id && kickLog.createdAt > member.joinedAt) {
        var { executor, target, reason } = kickLog;
        if (!reason) reason = '<No reason given>';
        logs.send(`${member.user}/${member.user.tag}/${member.user.id} was kicked by ${executor}/${executor.tag} with reason: '${reason}'`);
    }
})

//token for the login process
botClient.login(process.env.TOKENID);

