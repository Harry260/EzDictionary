import fetch from "node-fetch";
import { title } from "process";
import { formatDictResponse, createMessageText } from "./formatter.js";

const dictionaryGetMsg = async function (word = false) {
    return new Promise(async (resolve, reject) => {
        var errorMsg = `*Sorry, I couldn't find definitions for the word you were looking for..* 😔  \n\n You can search google with this link:\nhttp://google.com/search?q=${encodeURI(
            word
        )}`;

        if (typeof word === "string") {
            var haveToTryAgain = word.includes(" ");
            try {
                const response = await fetch(
                    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
                );
                const data = await response.json();

                var formattedResponse = formatDictResponse(data[0]);
                var msg = createMessageText(formattedResponse);
                resolve({
                    content: msg,
                    data: formattedResponse,
                    error: false,
                });
            } catch (error) {
                var tryAgain = haveToTryAgain ? word.split(" ")[0] : false;
                resolve({
                    content: errorMsg,
                    error: true,
                    tryAgain,
                });
            }
        } else {
            resolve(
                "*Sorry, I couldn't find definitions for the word you were looking for..* 😔"
            );
        }
    });
};

export default dictionaryGetMsg;
