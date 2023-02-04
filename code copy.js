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
        for (const platform of msg.platforms) {
            let width, height;
            switch (platform) {
                case 'twitter':
                    width = 1024;
                    height = 512;
                    break;
                case 'instagram':
                    width = 1080;
                    height = 1080;
                    break;
                case 'linkedin':
                    width = 1024;
                    height = 512;
                    break;
                case 'facebook':
                    width = 820;
                    height = 312;
                    break;
                default:
                    width = 100;
                    height = 100;
            }
            const frame = figma.createFrame();
            frame.resize(width, height);
            frame.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];
            figma.currentPage.appendChild(frame);
            const text = figma.createText();
            yield figma.loadFontAsync(text.fontName);
            text.x = frame.x;
            text.y = frame.y;
            text.characters = platform;
            text.fontSize = 18;
            text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            frame.appendChild(text);
            // add sub heading text node
            const subHeadingText = figma.createText();
            subHeadingText.x = 0;
            subHeadingText.y = 25;
            subHeadingText.characters = 'sub heading';
            subHeadingText.fontSize = 14;
            subHeadingText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];
            frame.appendChild(subHeadingText);
            // Use createImageAsync to create an image from a URL
            const image = yield figma.createImageAsync('https://picsum.photos/200');
            // Get the size of the image
            const { width: imageWidth, height: imageHeight } = yield image.getSizeAsync();
            // Set the fill of the frame to be the image
            frame.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }];
            figma.currentPage.selection = [frame];
            figma.viewport.scrollAndZoomIntoView([frame]);
        }
    }
    figma.closePlugin();
});
