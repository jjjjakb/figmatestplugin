

figma.showUI(__html__);



figma.ui.onmessage = async msg => {
  if (msg.type === 'create-frame') {
    let startingX = 0
    let startingY = 0

    for (const record of msg.values) {
      let assets = [];
      // let parent = new Node({type:'GROUP'})
      const frameSize = { twitter: [1024, 512], instagram: [1080, 1080], linkedin: [1920, 680], facebook: [820, 312], instagramStory:[1080, 1920] };

      for (let i = 0; i < Object.keys(frameSize).length; i++) {
        const testframe = figma.createFrame();

        console.log(testframe.parent)

        let frameWidth = frameSize[Object.keys(frameSize)[i]][0]
        let frameHeight = frameSize[Object.keys(frameSize)[i]][1]

        testframe.name = `frame${frameWidth}x${frameHeight}`
        testframe.x = startingX
        testframe.y = startingY
        startingX += frameWidth + 80;
        testframe.resize(frameWidth, frameHeight);


        const headlineText = figma.createText();
        let testFont = { family: 'Inter', style: 'Regular' }
        await figma.loadFontAsync(testFont);
        headlineText.x = testframe.width / 8;
        headlineText.y = testframe.height / 8;
        headlineText.characters = record[0];
        headlineText.fontSize = 96;
        headlineText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        testframe.appendChild(headlineText);


        const subText = figma.createText();
        await figma.loadFontAsync(testFont);
        subText.x = testframe.width / 8;
        subText.y = testframe.height / 3;
        subText.resizeWithoutConstraints(frameWidth/1.5,frameHeight/3)
        subText.characters = record[1];
        subText.fontSize = 48;
        subText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        testframe.appendChild(subText);


        const image = await figma.createImageAsync(
          'https://picsum.photos/200'
        );

        // Get the size of the image
        const { width: imageWidth, height: imageHeight } = await image.getSizeAsync();

        // Set the fill of the frame to be the image
        testframe.fills = [
          { type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' },{ type: 'SOLID', color: { r: 244/ 255.0, g: 136/ 255.0, b: 31/ 255.0} , opacity : 0.5 }];

        assets.push(testframe);
      }
      const assetGroup = figma.group(assets, assets[0].parent)
      
      startingY += assetGroup.height +50;
      startingX = 0
    }
  }
  figma.closePlugin();
};
