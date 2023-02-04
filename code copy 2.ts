figma.showUI(__html__);


// why is it all highlighted? Don't delete it all.
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

        let width = frameSize[Object.keys(frameSize)[i]][0]
        let height = frameSize[Object.keys(frameSize)[i]][1]

        testframe.name = `frame${width}x${height}`
        testframe.x = startingX
        testframe.y = startingY
        startingX += width + 80;
        testframe.resize(width, height);


        const text = figma.createText();
        let testFont = { family: 'Inter', style: 'Regular' }
        await figma.loadFontAsync(testFont);
        text.x = testframe.width / 8;
        text.y = testframe.height / 8;
        text.characters = record[0];
        text.fontSize = 18;
        text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        testframe.appendChild(text);


        const subText = figma.createText();
        await figma.loadFontAsync(testFont);
        subText.x = testframe.width / 8;
        subText.y = testframe.height / 3;
        subText.characters = record[1];
        subText.fontSize = 18;
        subText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        testframe.appendChild(subText);


        const image = await figma.createImageAsync(
          'https://picsum.photos/200'
        );

        // Get the size of the image
        const { width: imageWidth, height: imageHeight } = await image.getSizeAsync();

        // Set the fill of the frame to be the image
        testframe.fills = [
          { type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }];

        assets.push(testframe);
      }
      const assetGroup = figma.group(assets, assets[0].parent)
      
      startingY += assetGroup.height +50;
      startingX = 0
    }
  }
  figma.closePlugin();
};
