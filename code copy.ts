figma.showUI(__html__);

figma.ui.onmessage = async msg => {
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
      frame.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 1}}];

      figma.currentPage.appendChild(frame);

      const text = figma.createText();
      await figma.loadFontAsync(text.fontName);
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
  const image = await figma.createImageAsync(
    'https://picsum.photos/200'
  );

  // Get the size of the image
  const { width: imageWidth, height: imageHeight } = await image.getSizeAsync();

  // Set the fill of the frame to be the image
  frame.fills = [{        type: 'IMAGE',        imageHash: image.hash,        scaleMode: 'FILL'      }];

      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);
    }
  }
  figma.closePlugin();
};