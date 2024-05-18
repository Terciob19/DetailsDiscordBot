
//grab the discord 'library'
//const Discord = require ('discord.js');
//make the bot client object
//const botClient = new Discord.Client();

//grab the discord 'library'
const { Client, GatewayIntentBits, MessageAttachment, MessageEmbed, WebhookClient, ChannelType, Partials, AuditLogEvent, Events } = require ('discord.js');
//make the bot client object and register intents (events)
const botClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildBans], partials: [Partials.GuildMember] });


//categories
const categoryOtherAddons = "503975658708402206";
const categoryPlaterNameplates = "503974893558169611";
const categoryDetailsDamageMeter = "503973116163391488";
const categoryMods = "821051201142652948";
const modLogChannel = "821051497525542923";
const spamBotBaitChannel = "1237093406124015737";
//const spamBotBaitWarningMessage = "1237100480602050590";
const spamBotBaitWarningMessage = "1241501020819947624";
const roleAuthors = "702641998410154004";
const roleDetailsAuthor = "505445195832098827";
const roleMods = "504034889310666771";

const streamerRoleName = 'Patreon Legend';

//the discord
const discordDetails = "503971787718131713";

//some sleeping
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function sendMessage(message, textToSend, user)
{
    if (user)
    {
        return message.channel.send({ content: `${user} ${textToSend}` }).catch((err) => { console.log(err) });
    }
    else
    {
        return message.channel.send({ content: `${textToSend}` }).catch((err) => { console.log(err) });;
    }
}

function incrementBanCounter()
{
    //const channel = botClient.channels.fetch(spamBotBaitChannel);
    const channel = botClient.channels.fetch(modLogChannel);
    channel.fetchMessages({around: spamBotBaitWarningMessage, limit: 1})
    .then(msg => {
        const fetchedMsg = msg.first();
        const countStr = msg.content.match(/Ban Count: ([0-9]+)/);
        var count = parseInt(countStr, 10);
        if (count) {
            count = count + 1;
            var content = msg.content;
            content.replace(/Ban Count: ([0-9]+)/g, `Ban Count: ${count}`)
            fetchedMsg.edit(content);
        }
    });
}

function banUserForSpam(user, message)
{
    // Ban a user by id (or with a user/guild member object)
    user.guild.bans.create(user, { deleteMessageSeconds: 6 * 60 * 60, reason: `#spam-bot-bait: ${message}` }) //6h
    .then(banInfo => {
        console.log(`Banned ${banInfo.user?.tag ?? banInfo.tag ?? banInfo}`);
        incrementBanCounter();
    })
    .catch(console.error);
}

function handleBotSpamChannel(message)
{
    if (message.channel.id == spamBotBaitChannel)
    {
        if (!message.member.roles.cache.some(role => (role.id === roleAuthors || role.id === roleDetailsAuthor || role.id === roleMods))) {
            banUserForSpam(message.member, message.content)
            console.log(`Banned ${message.member}/${message.member.tag}/${message.member.id} - ${message.content}`)
        } else {
            console.log(`HasRole ${message.member} - ${message.member.roles.cache.some(role => (role.id === roleAuthors || role.id === roleDetailsAuthor || role.id === roleMods))}`)
        }
    }
}

function getCommandResponse(parentId, command)
{
    switch (parentId)
    {
        case categoryMods:
            switch (command)
            {
                case 'commands':
                return `General: faq
                Plater: version, scale, error, alpha
                Details: report, aggro, classic, nickname, elvui, mythic, reinstall, scale, alpha, error, reset, skin, combatlog, version, fade`;
            }
            break;
            
        case categoryOtherAddons:
            switch (command)
            {
                case 'faq':
                    return `https://www.curseforge.com/wow/addons/details/pages/faq`;
            }
            break;

        case categoryPlaterNameplates:
            switch (command)
            {
                case 'faq':
                    return `https://www.curseforge.com/wow/addons/plater-nameplates/pages/faq`
                
                case 'version':
                    return `Please verify that you are running the correct versions of Plater AND Details (if you\'re using it).
                    Twitch tends to "update" to wrong versions, e.g. classic for retail installations.
                    Both Details and Plater need to be in the correct version for your WoW installation.
                    Newer Plater versions support the following chat command to get version information: \`/plater version\`
                    Please provide this version info, if available.`;

                case 'scale':
                    return `Look at the top left corner of the options menu, there's a scale slider. Right click it, type the value you want, e.g. 1.0, and press enter.`;

                case 'error':
                    return `First use **/plater** to grab the version of Plater, after that active errors with the command: **/console scriptErrors 1** and **/reload**. When an error occurs, a window with debug info is shown, note this window has arrows to nagivate among all errors occurred.`;                    

                case 'alpha':
                    return `To get an alpha version: right click the addon name on your favorite app, Release Type > Alpha. https://i.imgur.com/ghIQ7jg.png`;
            }
            break;

        case categoryDetailsDamageMeter:
            switch (command)
            {
                case 'faq':
                    return 'FAQ! https://www.curseforge.com/wow/addons/details/pages/faq';

                case 'report':
                    return 'could you post the **/details version**, **Game Version**, **Where/When the bug happens**?';

                case 'overall':
                    return 'The overall data updates after the current combat ends. If you want it to update while in combat, you can use Dynamic Overall Data.';

                case 'aggro':
                    'Heres a guide on how to install Tiny Threat plugin: https://www.youtube.com/watch?v=8qD58jJPYrg';

                case 'classic':
                    return 'Here is the link for Details! Classic: https://www.curseforge.com/wow/addons/details-damage-meter-classic-wow';
                
                case 'nickname':
                    return 'Update Details! and disable any weakaura modifiers for nicknames, such as Nickname Extender.';

                case 'elvui':
                    return `Go to ElvUI; AddonsSkins Options; disable chat embed or reduce it to one window, depending on your problem.`;
                
                case 'mythic':
                    return `Go to options; Mythic Dungeon section; Enable: 'Make Overall Segment' AND 'Merge Trash' AND 'Delete Merged trash'; also increase the amount of segments under Display section.`;

                case 'reinstall':
                    return `Use the command '/details reinstall', to do a hard reset: close the game, windows search 'Details' in the WoWFolder/retail/WTF/ and delete all findings.`;

                case 'scale':
                    return `Look at the top left corner, there's a scale slider there, right click it and type 1.0 and press enter.`;

                case 'alpha':
                    return `To get an alpha version: right click the addon name on your favorite app, Release Type > Alpha. https://i.imgur.com/ghIQ7jg.png`;

                case 'error':
                    return `Active to show errors with the command: **/console scriptErrors 1** and **/reload**. When a error occurs, a window with debug info is shown, note this window has arrows to nagivate among all errors occurred.`;

                case 'reset':
                    return `Use **/de reinstall** to reinstall Details!, if you problem persists, open the wow installation folder and search for Details, erase all results and download the latest version.`;

                case 'skin':
                    return `To copy a window select Skins in the options panel; Select the window to be copied in the bottom right corner; Give a name in the Save field, e.g. 'My New Skin', and press enter; Select the window to receive the new skin in the bottom right dropdown; Select a skin from the Select a Skin dropdown.`;
                
                case 'combatlog':
                    return `Raw combatlogs is required to study the case, please get on a group, type **/combatlog**, play normally, close your game and get the file from \World of Warcraft\_classic_\Logs\WoWCombatLog-date.txt`;

                case 'version':
                    return `Please use this command ingame: **/details version**, it'll open a box in the middle of the screen to copy the version text, the version is also printed to chat.`;

                case 'fade':
                    return `If the window is fading while in combat, check: Options > Automation > disable enabled options there. check: Options > Auto Run Code > On Enter Combat (dropdown) > Delete code there and hit save.`;

            }
            break;
    }
    return;
}

//commands
const commandFAQ = {
  name: 'faq',
  description: 'Links the FAQ.',
  options: [{
    name: 'user',
    type: 6,
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
    
    console.log("I am ready!");
})

botClient.on('interactionCreate', async (interaction) => {
    // If the interaction isn't a slash command, return
    if (!interaction.isCommand()) return;
    
    const command = interaction.commandName;
    //console.log(interaction);
    const channel = await botClient.channels.fetch(interaction.channelId);
    if (!channel) return;
    var parentId;
    if (channel.type == ChannelType.PublicThread)
    {
        parentId = channel.parent.parentId;
    } else {
        parentId = channel.parentId;
    }
    
    var response = getCommandResponse(parentId, command);
    if (!response)
    {
        interaction.reply({ content: `This command is not valid here, ${interaction.user}` }).catch((err) => { console.log(err) });
        return;
    }
    
    if (interaction.options && interaction.options.get('user') && interaction.options.get('user').user)
    {
        //console.log(interaction.options.get('user').user);
        var user = interaction.options.get('user').user;
        response = `${user}: `.concat(response);
    }
    
    // Reply to the command
    interaction.reply({ content: `${response}` }).catch((err) => { console.log(err) });
});

//events from the discord server
botClient.on('messageCreate', async (message) => {
    //the message isn't from the bot
    if (message.author.bot)
    { 
        return;
    }

    //first letter isn't an exclamation point
    if (!message.content.startsWith('!')) 
    {
        handleBotSpamChannel(message)
        return;
    }

    //get category
    const withoutPrefix = message.content.slice(1);
    const split = withoutPrefix.split(/ +/);
    const command = split[0];
    const targetUser = split[1];
    const user = message.mentions.users.first();
    var parentId;
    if (message.channel.type == ChannelType.PublicThread)
    {
        parentId = message.channel.parent.parentId;
    } else {
        parentId = message.channel.parentId;
    }

    const response = getCommandResponse(parentId, command);
    
    if (response) sendMessage(message, response, user);
    
    if (command == 'testBanCount')
    {
        incrementBanCounter();
    }

})

botClient.on('guildBanAdd', async (guildBan) => {
    //if (guildBan.partial) await guildBan.fetch(); //this is causing 'DiscordAPIError: Missing Permissions'
    // like thaconsole.log(`guildBanAdd:`);
    //console.log(guildBan);
    
    const logs = await botClient.channels.fetch(modLogChannel);
    const user = guildBan.user;
    const guild = guildBan.guild;
    
    //wait a bit for audit logs
    await sleep(5000);
    
    const fetchedBanLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 22,
    });
    const banLog = await fetchedBanLogs.entries.first();
    
    if (banLog && banLog.target.id === user.id) {
        var { executor, target, reason } = banLog;
        if (!reason) reason = '<No reason given>';
        logs.send({ content: `${user}/${user.tag}/${user.id} was banned by ${executor}/${executor.tag} with reason: '${reason}'` });
    } else {
        var reason = guildBan.reason;
        if (!reason) reason = '<No reason given>';
        logs.send({ content: `${user}/${user.tag}/${user.id} was banned with reason: '${reason}'` });
    }
})

botClient.on('guildMemberRemove', async (member) => {
    //console.log(member);
    //if (member.partial) await member.fetch();
    //console.log(`guildMemberRemove: ${member}`);

    //wait a bit for audit logs
    await sleep(5000);
    
    const logs = await botClient.channels.fetch(modLogChannel);
    const fetchedKickLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 20,
    });

    const kickLog = await fetchedKickLogs.entries.first();
    //if (kickLog) console.log(`kickLog entry found: ${kickLog.target.id} / ${member.user.id} - ${kickLog.createdAt} / ${member.joinedAt}`);

    if (kickLog && kickLog.target.id === member.user.id && kickLog.createdAt > member.joinedAt) {
        var { executor, target, reason } = kickLog;
        if (!reason) reason = '<No reason given>';
        logs.send({ content: `${member.user}/${member.user.tag}/${member.user.id} was kicked by ${executor}/${executor.tag} with reason: '${reason}'` });
    }
})

botClient.on('presenceUpdate', async (oldPresence, newPresence) => 
{
    if (!newPresence.activities)
    { 
        return;
    }

    //get the role of the user
    const streamerRole = newPresence.guild.roles.cache.find(role => role.name === streamerRoleName);
    if (!streamerRole)
    {
        return;
    }
  
    const twitchStream = newPresence.activities.find(activity => activity.type === 'STREAMING' && activity.name.toLowerCase().includes('twitch.tv'));
  
    if (twitchStream) 
    {
        //const twitchUsername = twitchStream.url.split('/').pop();
        //detect which channel the user is in
        //const channel = await botClient.channels.fetch(newPresence.member.voice.channelId);

        const logs = await botClient.channels.fetch(modLogChannel);
        //testing
        logs.send({ content: `${newPresence.member.user}/${newPresence.member.user.tag}/${newPresence.member.user.id} is streaming on twitch: ${twitchStream.url}` });

        //const channel = botClient.channels.cache.get('channel_id_to_move_user_to');
        //const member = newPresence.member;
        //member.voice.setChannel(channel);
    }
});

//token for the login process
botClient.login(process.env.TOKENID);

