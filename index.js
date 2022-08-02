import wweb from "whatsapp-web.js";
import QRcode from "qrcode-terminal";
import dictionaryGetMsg from "./lib/api.js";

const { Client, LocalAuth, MessageMedia } = wweb;
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
});

client.on("qr", (qr) => {
    QRcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Bot is ready!");
});

client.on("message", (msg) => handleMsg(msg));
//client.on("message_create", (msg) => handleMsg(msg));

async function handleMsg(msg) {
    const chat = await msg.getChat();
    var mBody = msg.body;

    var helpTriggers = ["hi", "hello", "help"];
    if (helpTriggers.includes(mBody.toLowerCase())) {
        var msg = `Welcome to 𝐄𝐳𝐃𝐢𝐜𝐭𝐢𝐨𝐧𝐚𝐫𝐲! I am a WhatsApp bot that can define any word you want ☺️\n\n*_Just text it!_*`;
        await chat.sendMessage(msg);
    } else if (mBody) {
        var mb = await dictionaryGetMsg(mBody);

        if (mb.error === false) {
            sendMsg(mb);
        } else if (mb.error === true && mb.tryAgain !== false) {
            var mb = await dictionaryGetMsg(mb.tryAgain);

            if (mb.error === true) {
                msg.reply(mb.content);
            } else {
                sendMsg(mb);
            }
        } else {
            msg.reply(mb.content);
        }

        async function sendMsg(msgBody) {
            msg.reply(msgBody.content + "𝐄𝐳𝐃𝐢𝐜𝐭𝐢𝐨𝐧𝐚𝐫𝐲™ by Harry");

            console.log(msgBody.data);
            if (msgBody.data.audio != false) {
                console.log(msgBody.data.audio);
                const media = await MessageMedia.fromUrl(msgBody.data.audio, {
                    sendAudioAsVoice: true,
                });
                await chat.sendMessage(media);
            }
        }
    }
}

client.initialize();
