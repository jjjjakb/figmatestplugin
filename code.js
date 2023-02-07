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
    var _a, _b, _c, _d, _e, _f, _g;
    if (msg.type === 'create-frame') {
        let startingX = 0;
        let startingY = 0;
        console.log("did it break2");
        function base64ToBytesUint8Array(str) {
            const abc = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"]; // base64 alphabet
            let result = [];
            for (let i = 0; i < str.length / 4; i++) {
                let chunk = [...str.slice(4 * i, 4 * i + 4)];
                let bin = chunk.map(x => abc.indexOf(x).toString(2).padStart(6, 0)).join('');
                let bytes = bin.match(/.{1,8}/g).map(x => +('0b' + x));
                result.push(...bytes.slice(0, 3 - (str[4 * i + 2] == "=") - (str[4 * i + 3] == "=")));
            }
            return new Uint8Array(result);
        }
        // console.log(base64String);
        // console.log(imageConverted);
        // const image = figma.createImage(imageConverted)
        // console.log("it works");
        // const node = figma.createRectangle()
        // // Set the fill on the node
        // node.fills = [
        //   {
        //     type: 'IMAGE',
        //     imageHash: image.hash,
        //     scaleMode: 'FILL'
        //   }
        // ]
        let twitter = {
            width: 1024,
            height: 512,
            itemSpacing: 64,
            horizontalPadding: 80,
            verticalPadding: 80,
            headlineFontSize: 80,
            subtextFontSize: 36,
        };
        let instagram = {
            width: 1080,
            height: 1080,
            itemSpacing: 112,
            horizontalPadding: 128,
            verticalPadding: 128,
            headlineFontSize: 96,
            subtextFontSize: 48,
        };
        let linkedin = {
            width: 1920,
            height: 680,
            itemSpacing: 40,
            horizontalPadding: 136,
            verticalPadding: 120,
            headlineFontSize: 96,
            subtextFontSize: 48,
        };
        let facebook = {
            width: 820,
            height: 312,
            itemSpacing: 16,
            horizontalPadding: 72,
            verticalPadding: 46,
            headlineFontSize: 48,
            subtextFontSize: 24,
        };
        let instagramStory = {
            width: 1080,
            height: 1920,
            itemSpacing: 64,
            horizontalPadding: 128,
            verticalPadding: 176,
            headlineFontSize: 128,
            subtextFontSize: 64,
        };
        for (const record of msg.values) {
            let assets = [];
            // let parent = new Node({type:'GROUP'})
            const platformProperties = { twitter, instagram, linkedin, facebook, instagramStory };
            //this is what generates the image from AI
            const response = yield fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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'
                },
                body: JSON.stringify({
                    prompt: record[1],
                    n: 1,
                    size: "1024x1024",
                    response_format: "b64_json"
                })
            });
            const imageData = yield response.json();
            const base64String = imageData.data[0].b64_json;
            const imageConverted = base64ToBytesUint8Array(base64String);
            for (let i = 0; i < Object.keys(platformProperties).length; i++) {
                const frame = figma.createFrame();
                console.log(frame.parent);
                let platforms = Object.keys(platformProperties);
                let currentPlatform = platforms[i];
                let frameWidth = (_a = platformProperties[currentPlatform]) === null || _a === void 0 ? void 0 : _a.width;
                let frameHeight = (_b = platformProperties[currentPlatform]) === null || _b === void 0 ? void 0 : _b.height;
                frame.name = `frame${frameWidth}x${frameHeight}`;
                frame.x = startingX;
                frame.y = startingY;
                startingX += frameWidth + 80;
                frame.resize(frameWidth, frameHeight);
                frame.layoutPositioning = 'AUTO';
                frame.layoutMode = 'VERTICAL';
                frame.primaryAxisSizingMode = 'FIXED';
                frame.counterAxisSizingMode = 'FIXED';
                frame.horizontalPadding = (_c = platformProperties[currentPlatform]) === null || _c === void 0 ? void 0 : _c.horizontalPadding;
                frame.verticalPadding = (_d = platformProperties[currentPlatform]) === null || _d === void 0 ? void 0 : _d.verticalPadding;
                frame.itemSpacing = (_e = platformProperties[currentPlatform]) === null || _e === void 0 ? void 0 : _e.itemSpacing;
                const headlineText = figma.createText();
                let testFont = { family: 'Inter', style: 'Regular' };
                yield figma.loadFontAsync(testFont);
                // headlineText.x = frame.width / 8;
                // headlineText.y = frame.height / 8;
                headlineText.characters = record[0];
                headlineText.fontSize = (_f = platformProperties[currentPlatform]) === null || _f === void 0 ? void 0 : _f.headlineFontSize;
                headlineText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                frame.appendChild(headlineText);
                const subText = figma.createText();
                yield figma.loadFontAsync(testFont);
                // subText.x = frame.width / 8;
                // subText.y = frame.height / 3;
                subText.resizeWithoutConstraints(frameWidth / 1.5, frameHeight / 3);
                subText.characters = record[1];
                subText.fontSize = (_g = platformProperties[currentPlatform]) === null || _g === void 0 ? void 0 : _g.subtextFontSize;
                subText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                frame.appendChild(subText);
                const image = figma.createImage(imageConverted);
                // Get the size of the image
                const { width: imageWidth, height: imageHeight } = yield image.getSizeAsync();
                // Set the fill of the frame to be the image
                frame.fills = [
                    { type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }, { type: 'SOLID', color: { r: 244 / 255.0, g: 136 / 255.0, b: 31 / 255.0 }, opacity: 0.5 }
                ];
                assets.push(frame);
            }
            const assetGroup = figma.group(assets, assets[0].parent);
            startingY += assetGroup.height + 50;
            startingX = 0;
        }
    }
    figma.closePlugin();
});
