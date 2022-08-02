import numberTransorm from "number-to-emoji";

const formatDictResponse = function (data) {
    var Obj = {
        word: data.word,
        phonetic: data.phonetic,
        meanings: {},
        audio: false,
    };

    data.meanings.forEach((elem) => {
        var defObj = [];
        elem.definitions.forEach((def) => {
            defObj.push(def.definition);
        });
        Obj.meanings[elem.partOfSpeech] = defObj;
    });

    data.phonetics.forEach((px) => {
        if (px.audio) {
            Obj.audio = px.audio;
            Obj.phonetic = px.text;
        }
    });

    return Obj;
};

const createMessageText = function (data, isThread = false) {
    if (typeof data === "object") {
        var msg = `*${data.word}* ⦿ \`\`\`${data.phonetic}\`\`\``;

        var meanings = data.meanings;

        if (isThread === true) {
            var thread = [];

            Object.keys(meanings).forEach((item) => {
                var subtext = `${msg}\n\n *_${item.toUpperCase()}_*\n`;

                meanings[item].map((m, i) => {
                    subtext += `${numberTransorm.toEmoji(i + 1)} _${m}_ \n\n`;
                });
                thread.push(subtext);
            });

            return thread;
        } else {
            msg = msg + "\n";
            Object.keys(meanings).forEach((item) => {
                var subtext = `*_${item.toUpperCase()}_*\n`;

                meanings[item].map((m, i) => {
                    subtext += `${numberTransorm.toEmoji(i + 1)} _${m}_ \n\n`;
                });
                msg += "\n" + subtext;
            });

            return msg;
        }
    }
};

export { formatDictResponse, createMessageText };
