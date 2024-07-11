var utils = require("./utils.js");

const defaultUrl = "https://spark-api-open.xf-yun.com/v1/chat/completions";
const streamRequest = async ({ url, headers, body, query }) => {
    let resultText = "";
    return $http.streamRequest({
        method: "POST",
        url: url,
        header: headers,
        body: body,
        streamHandler: (stream) => {

            let streamText = stream.text;
            const dataReg = /^data: /gm;
            const doneReg = /\s*\[DONE\]\s*/;

            // 使用正则表达式将 streamText 按 "data: " 分割为多个块
            const dataBlocks = streamText.split(dataReg);

            dataBlocks.forEach((block) => {
                // 去除首尾空格和换行符
                block = block.trim();

                // 检测和移除 [DONE] 标记
                if (doneReg.test(block)) {
                    block = block.replace(doneReg, '');
                }


                // 忽略空块
                if (block === "") {
                    return;
                }

                let onData ;
                const resultJson = JSON.parse(block);

                if (resultJson.code !== 0) {
                    onData = {
                        error: {
                            type: resultJson.code || "unknown",
                            message: resultJson.message,
                            addtion: resultJson.message,
                        },
                    }
                } else {
                    resultText += resultJson.choices[0].delta.content;
                    onData = {
                        result: { toParagraphs: [resultText] },
                    }
                }

                query.onStream(onData);
            });
        },
        handler: (result) => {
            if (result.response.statusCode >= 400) {
                utils.handleError(query.onCompletion, result);
            } else {
                query.onCompletion({
                    result: { toParagraphs: [resultText]},
                });
            }
        },
    });
};

const normalRequest = async ({ url, headers, body , query}) => {
    return $http.request({
        method: "POST",
        url: url,
        header: headers,
        body: body,
        handler: (result) => {
            if (result.response.statusCode >= 400) {
                utils.handleError(query.onCompletion, result);
            } else {
                const data = result.data;
                // $log.info(JSON.stringify(data));
                let onData;
                if (data.code !== 0) {
                    onData = {
                        error: {
                            type: data.code || "unknown",
                            message: data.message,
                            addtion: data.message,
                        },
                    }
                } else {
                    onData = { result: { toParagraphs: [data.choices[0].message.content] } }
                }
                query.onCompletion(onData);
            }
        },
    });
};

exports.streamRequest = streamRequest;
exports.normalRequest = normalRequest;
exports.defaultUrl = defaultUrl;


//
// const nonStreamingRequest = async ({ method, url, headers, body }) => {
//     try {
//
//
//
//         const response = await fetch(url, {
//             method: method,
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...headers
//             },
//             body: JSON.stringify(body)
//         });
//         return await response.json();
//     } catch (error) {
//         throw new Error('Error in nonStreamingRequest: ' + error.message);
//     }
// };
//
// const streamingRequest = async ({ method, url, headers, body, streamHandler, completeHandler }) => {
//     try {
//
//
//
//         const response = await fetch(url, {
//             method: method,
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...headers
//             },
//             body: JSON.stringify(body)
//         });
//
//         const reader = response.body.getReader();
//         const decoder = new TextDecoder('utf-8');
//
//         let buffer = '';
//         while (true) {
//             const { done, value } = await reader.read();
//             if (done) {
//                 if (completeHandler) completeHandler();
//                 break;
//             }
//
//             buffer += decoder.decode(value, { stream: true });
//
//             let lines = buffer.split('\n');
//             buffer = lines.pop();  // Save the last partial line back to the buffer
//
//             for (let line of lines) {
//                 if (line.startsWith('data: ')) {
//                     line = line.substring(6);
//                     if (line) {
//                         try {
//                             const json = JSON.parse(line);
//                             streamHandler(json);
//                         } catch (e) {
//                             console.error('JSON parse error:', e);
//                         }
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         throw new Error('Error in streamingRequest: ' + error.message);
//     }
// };
//
//
// exports.nonStreamingRequest = nonStreamingRequest;
// exports.streamingRequest = streamingRequest;
