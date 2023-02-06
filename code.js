"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__);
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'create-frame') {
        let startingX = 0;
        let startingY = 0;
        console.log("did it break2");
        fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                prompt: "A cute baby sea otter",
                n: 2,
                size: "1024x1024"
            })
        });
        const response = yield fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                prompt: "A cute baby sea otter",
                n: 1,
                size: "1024x1024",
                response_format: "b64_json"
            })
        });
        function base64ToBytesArr(str) {
            const abc = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"]; // base64 alphabet
            let result = [];
            for (let i = 0; i < str.length / 4; i++) {
                let chunk = [...str.slice(4 * i, 4 * i + 4)];
                let bin = chunk.map(x => abc.indexOf(x).toString(2).padStart(6, 0)).join('');
                let bytes = bin.match(/.{1,8}/g).map(x => +('0b' + x));
                result.push(...bytes.slice(0, 3 - (str[4 * i + 2] == "=") - (str[4 * i + 3] == "=")));
            }
            return result;
        }
        const imageData = yield response.json();
        const base64String = imageData.data[0].b64_json;
        const imageConverted = base64ToBytesArr(base64String);
        console.log(base64String);
        console.log(imageConverted);
        console.log("it works");
        // figma.createImage(imageData.data[0].b64_json);
        // .then(response => response.json())
        // .then(data => console.log(data))
        // .catch(error => console.error(error));
        // console.log("did it break3");
        // const { Configuration, OpenAIApi } = require("openai");
        // const configuration = new Configuration({
        //   apiKey: process.env.OPENAI_API_KEY,
        // });
        // const openai = new OpenAIApi(configuration);
        // const response = await openai.createImage({
        //   prompt: "A cute baby sea otter",
        //   n: 2,
        //   size: "1024x1024",
        // });
        // console.log(response);
        for (const record of msg.values) {
            let assets = [];
            // let parent = new Node({type:'GROUP'})
            const frameSize = { twitter: [1024, 512], instagram: [1080, 1080], linkedin: [1920, 680], facebook: [820, 312], instagramStory: [1080, 1920] };
            for (let i = 0; i < Object.keys(frameSize).length; i++) {
                const testframe = figma.createFrame();
                console.log(testframe.parent);
                let frameWidth = frameSize[Object.keys(frameSize)[i]][0];
                let frameHeight = frameSize[Object.keys(frameSize)[i]][1];
                testframe.name = `frame${frameWidth}x${frameHeight}`;
                testframe.x = startingX;
                testframe.y = startingY;
                startingX += frameWidth + 80;
                testframe.resize(frameWidth, frameHeight);
                const headlineText = figma.createText();
                let testFont = { family: 'Inter', style: 'Regular' };
                yield figma.loadFontAsync(testFont);
                headlineText.x = testframe.width / 8;
                headlineText.y = testframe.height / 8;
                headlineText.characters = record[0];
                headlineText.fontSize = 96;
                headlineText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                testframe.appendChild(headlineText);
                const subText = figma.createText();
                yield figma.loadFontAsync(testFont);
                subText.x = testframe.width / 8;
                subText.y = testframe.height / 3;
                subText.resizeWithoutConstraints(frameWidth / 1.5, frameHeight / 3);
                subText.characters = record[1];
                subText.fontSize = 48;
                subText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                testframe.appendChild(subText);
                const image = yield figma.createImageAsync('https://picsum.photos/200');
                // Get the size of the image
                const { width: imageWidth, height: imageHeight } = yield image.getSizeAsync();
                // Set the fill of the frame to be the image
                testframe.fills = [
                    { type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }, { type: 'SOLID', color: { r: 244 / 255.0, g: 136 / 255.0, b: 31 / 255.0 }, opacity: 0.5 }
                ];
                assets.push(testframe);
            }
            const assetGroup = figma.group(assets, assets[0].parent);
            startingY += assetGroup.height + 50;
            startingX = 0;
        }
    }
    figma.closePlugin();
});
