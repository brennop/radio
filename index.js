require("dotenv").config();

const ytdl = require("ytdl-core");
const Discord = require("discord.js");

const settings = {
  prefix: process.env.PREFIX,
  token: process.env.TOKEN,
};

const radios = {
  indie: "https://www.youtube.com/watch?v=oVi5gtzTDx0",
  games: "https://www.youtube.com/watch?v=Sdf5-3yddvA",
  lofi1: "https://www.youtube.com/watch?v=5qap5aO4i9A",
  lofi2: "https://www.youtube.com/watch?v=mu8j6-k4HIM",
};

const client = new Discord.Client();

client.on("ready", () => {
  console.log("I'm ready !");
});

client.on("message", async (message) => {
  if (!message.content.startsWith(settings.prefix)) return;

  const [cmd, arg] = message.content.slice(settings.prefix.length).split(" ");

  if (cmd === "play" || cmd === "p") {
    if (message.member.voice.channel == null) {
      const error = "You need to be in a voice channel to use this command.";
      message.channel.send(error);
      return;
    }

    const url = radios[arg];
    if (url == null) {
      const error = `Radio not found: ${arg}\nAvailable radios: ${Object.keys(
        radios
      ).join(", ")}`;
      message.channel.send(error);
      return;
    }

    const stream = ytdl(url);

    message.member.voice.channel.join().then((connection) =>
      connection
        .play(stream, { type: "unknown" })
        .on("start", () => message.channel.send(`Now playing ${url}`))
        .on("finish", () => message.guild.me.voice.channel.leave())
    );
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  const members = oldState.channel?.members;
  if (members == null) return;
  if (
    members.get(client.user.id) &&
    members.filter(({ user }) => user.bot === false).size < 1
  ) {
    oldState.channel.leave();
  }
});

client.login(settings.token);

// spin an http server to live on fly
const http = require("http");

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Hello, World!");
};

const server = http.createServer(requestListener);
server.listen(8080, "0.0.0.0");
