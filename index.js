const Discord = require('discord.js');
const Key = require('cryptolens').Key;
var fs = require('fs');
const request = require('request');
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
const enmap = require('enmap');
const {token, prefix, role, keys, key, muterole, accounts1,} = require('./config.json');
const config = require("./config.json");
const {download} = require("./download.json")
const {numbers} = require("./numbers.json");
const {test} = require("./index.json")
const webhookClient = new Discord.WebhookClient(config.webhookID, config.webhookToken);
const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});
const activities_list = [
    "Buy boltchecker", 
    "Boltchecker",
    "Developed by sharkdance#0001", 
    "Suicide",
    "The joy of there being no joy | Sharkdance 2020",
    "Hentai",
    "End my suffering",
    "Buy boltchecker to end my poverty",
    "Coding seems fun, its not",
    "Mumma once told me i was gonna do well, she lied",
    ]; // creates an arraylist containing phrases you want your bot to switch through.


client.on('ready', () => {
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 3000); // Runs this every 10 seconds.
});


client.once("ready", () => {
  console.log("Ready for action!");
});

client.on("message", (message) => {
  if (!message.content.startsWith("?") || message.author.bot) return;

  const args = message.content.slice(1).trim().split(' ');
  const command1 = args.shift().toLowerCase();
    if (command1 == "announce") {
        if(!message.channel.name.includes("announce")) return message.channel.send("You cannot use that here!")
        message.channel.send('Ok boomer i announced it')
        var announcement = "";
        for (const word in args) {
          announcement = announcement + args[word] + " ";
        }
        webhookClient.send(announcement)
      }
});
client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

        if(command == "help") {
        let embedhelp = new Discord.MessageEmbed()
        .setAuthor('Boltchecker', 'https://cdn.discordapp.com/icons/737993398602170378/696b902d26e4fc3b4989a0ca600c414f.png')
        .setTitle('List of commands currently added:')
        .addFields(
            { name: '?Help:', value: ("shows list of commands"), inline: true},
            { name: '?Announce:', value: ("Staff only command for announcements"), inline: true},
            { name: '?buy:', value: ("Creates a ticket to buy"), inline: true},
            { name: '?boomerate:', value: ("Displays your boomerate"), inline: true},
            { name: '?Boltchecker:', value: ("Customer only command for download"), inline: true},
            { name: '?Testkey:', value: ("Test if a key is working or not"), inline: true},
        )
        .setThumbnail('https://cdn.discordapp.com/icons/737993398602170378/696b902d26e4fc3b4989a0ca600c414f.png')
        .setFooter('Made by sharkdance#0001')
        .setTimestamp();
        message.channel.send(embedhelp)
    }
    if(command == "testkey") {
        message.channel.send("Usage: ?Testkey {key}")
    }
    if(command == "boltchecker") {
        if(message.member.roles.cache.has(role)) {
            let result1 = Math.floor((Math.random() * download.length))
            let downloadembed = new Discord.MessageEmbed()
            .setAuthor('Boltchecker')
            .setColor('#94bf49')
            .setTitle("Here is your download!")
            .setDescription(`[Click This Link](${download[result1]})\n\n`)
            .setTimestamp()
            .addField('-', "**Instructions:**\nClick the link to download it then put it in a folder and run it")
            .addField('-', "**If you have any issues make a ticket**\n Thanks for buying Boltchecker!")
            .setFooter("Made by sharkdance")
            .setThumbnail('https://cdn.discordapp.com/icons/737993398602170378/696b902d26e4fc3b4989a0ca600c414f.png');
            message.author.send(downloadembed)
            message.channel.send('Check your dms!')
          } else {
              message.channel.send("You must be a customer to use this")
          }
    }
     if(command == "buy") {
        // if command = buy Do the following (react with tick)



        message.react('✅');
        settings.set(`${message.guild.id}-ticket`, message.id);
        message.channel.send("Are you sure? (React with the tick to confirm)")
    }
    if(command == "boomerate") {
        rate = Math.floor(Math.random() * (numbers.length - 1) + 1);
        message.channel.send(`you are: ${rate}% boomer`)
    }

    if(command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("You cannot use that here!")
        message.channel.delete();
    }
});
client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '✅') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("Welcome to your ticket!").setDescription("We will be with you shortly").setColor("00ff00"))
        })
    }
});
client.login(token);
