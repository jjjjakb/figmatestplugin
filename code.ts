
figma.showUI(__html__);

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-frame') {
    let startingX = 0
    let startingY = 0
    console.log("did it break2");





    function base64ToBytesUint8Array(str:string) {
      const abc = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"]; // base64 alphabet
      let result = [];

      for (let i = 0; i < str.length / 4; i++) {
        let chunk = [...str.slice(4 * i, 4 * i + 4)]
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
    }

    let instagram = {
      width: 1080,
      height: 1080,
      itemSpacing: 112,
      horizontalPadding: 128,
      verticalPadding: 128,
      headlineFontSize: 96,
      subtextFontSize: 48,
    }

    let linkedin = {
      width: 1920,
      height: 680,
      itemSpacing: 40,
      horizontalPadding: 136,
      verticalPadding: 120,
      headlineFontSize: 96,
      subtextFontSize: 48,
    }

    let facebook = {
      width: 820,
      height: 312,
      itemSpacing: 16,
      horizontalPadding: 72,
      verticalPadding: 46,
      headlineFontSize: 48,
      subtextFontSize: 24,
    }

    let instagramStory = {
      width: 1080,
      height: 1920,
      itemSpacing: 64,
      horizontalPadding: 128,
      verticalPadding: 176,
      headlineFontSize: 128,
      subtextFontSize: 64,
    }

    for (const record of msg.values) {
      let assets = [];
      // let parent = new Node({type:'GROUP'})
      const platformProperties = { twitter, instagram, linkedin, facebook, instagramStory };

      //this is what generates the image from AI
      const response = await fetch("https://api.openai.com/v1/images/generations", {

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
      }
      )
      const imageData = await response.json();
      const base64String = imageData.data[0].b64_json;
      const imageConverted = base64ToBytesUint8Array(base64String)


      for (let i = 0; i < Object.keys(platformProperties).length; i++) {
        const frame = figma.createFrame();

        console.log(frame.parent)

        let platforms = Object.keys(platformProperties);
        let currentPlatform = platforms[i];
        let frameWidth = platformProperties[currentPlatform]?.width
        let frameHeight = platformProperties[currentPlatform]?.height

        frame.name = `frame${frameWidth}x${frameHeight}`
        frame.x = startingX
        frame.y = startingY
        startingX += frameWidth + 80;
        frame.resize(frameWidth, frameHeight);
        frame.layoutPositioning = 'AUTO';
        frame.layoutMode = 'VERTICAL';
        frame.primaryAxisSizingMode = 'FIXED';
        frame.counterAxisSizingMode = 'FIXED';
        frame.horizontalPadding = platformProperties[currentPlatform]?.horizontalPadding;
        frame.verticalPadding = platformProperties[currentPlatform]?.verticalPadding;
        frame.itemSpacing = platformProperties[currentPlatform]?.itemSpacing;



        const headlineText = figma.createText();
        let testFont = { family: 'Inter', style: 'Regular' }
        await figma.loadFontAsync(testFont);
        // headlineText.x = frame.width / 8;
        // headlineText.y = frame.height / 8;
        headlineText.characters = record[0];
        headlineText.fontSize = platformProperties[currentPlatform]?.headlineFontSize;
        headlineText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        frame.appendChild(headlineText);


        const subText = figma.createText();
        await figma.loadFontAsync(testFont);
        // subText.x = frame.width / 8;
        // subText.y = frame.height / 3;
        subText.resizeWithoutConstraints(frameWidth / 1.5, frameHeight / 3)
        subText.characters = record[1];
        subText.fontSize = platformProperties[currentPlatform]?.subtextFontSize;
        subText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        frame.appendChild(subText);


        const image = figma.createImage(imageConverted)
          ;

        // Get the size of the image
        const { width: imageWidth, height: imageHeight } = await image.getSizeAsync();

        // Set the fill of the frame to be the image
        frame.fills = [
          { type: 'IMAGE', imageHash: image.hash, scaleMode: 'FILL' }, { type: 'SOLID', color: { r: 244 / 255.0, g: 136 / 255.0, b: 31 / 255.0 }, opacity: 0.5 }];

        assets.push(frame);
      }
      const assetGroup = figma.group(assets, assets[0].parent)

      startingY += assetGroup.height + 50;
      startingX = 0
    }
  }
  figma.closePlugin();
};
