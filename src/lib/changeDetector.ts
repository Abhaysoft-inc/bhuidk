export interface ChangeDetectionResult {
  changeMaskDataUrl: string;
  percentageChanged: number;
  changeCategory: 'None' | 'Deforestation/Canopy Loss' | 'Unauthorized Construction' | 'Water Body Shrinkage' | 'Mixed/Unknown';
}

/**
 * Runs a simple pixel-differencing threshold segmentation on two image URLs.
 * Designed to run entirely in the browser using HTML5 Canvas for the hackathon demo.
 */
export async function detectSatelliteChanges(
  imgUrlBefore: string, 
  imgUrlAfter: string, 
  threshold: number = 40
): Promise<ChangeDetectionResult> {
  return new Promise((resolve, reject) => {
    const imgBefore = new Image();
    const imgAfter = new Image();
    imgBefore.crossOrigin = "Anonymous";
    imgAfter.crossOrigin = "Anonymous";
    
    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        try {
          const result = processImages(imgBefore, imgAfter, threshold);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }
    };
    
    imgBefore.onload = onLoad;
    imgAfter.onload = onLoad;
    imgBefore.onerror = reject;
    imgAfter.onerror = reject;
    
    imgBefore.src = imgUrlBefore;
    imgAfter.src = imgUrlAfter;
  });
}

function processImages(img1: HTMLImageElement, img2: HTMLImageElement, threshold: number): ChangeDetectionResult {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Use the dimensions of the first image
  const width = img1.width;
  const height = img1.height;
  canvas.width = width;
  canvas.height = height;
  
  // Draw and get data for Image 1 (Before)
  ctx.drawImage(img1, 0, 0, width, height);
  const data1 = ctx.getImageData(0, 0, width, height).data;
  
  // Draw and get data for Image 2 (After)
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img2, 0, 0, width, height);
  const data2 = ctx.getImageData(0, 0, width, height).data;
  
  // Create output mask data
  const outputImageData = ctx.createImageData(width, height);
  const outputData = outputImageData.data;
  
  let changedPixels = 0;
  let greenLossCount = 0;
  let greyGainCount = 0;
  
  // Loop through all pixels (4 array elements per pixel: R, G, B, A)
  for (let i = 0; i < data1.length; i += 4) {
    const r1 = data1[i];
    const g1 = data1[i+1];
    const b1 = data1[i+2];
    
    const r2 = data2[i];
    const g2 = data2[i+1];
    const b2 = data2[i+2];
    
    // Calculate Euclidean color distance
    const distance = Math.sqrt(
      Math.pow(r2 - r1, 2) + 
      Math.pow(g2 - g1, 2) + 
      Math.pow(b2 - b1, 2)
    );
    
    if (distance > threshold) {
      changedPixels++;
      
      // Heuristic Classification
      // If before was very green and after is not
      if (g1 > r1 && g1 > b1 && g2 < r2) {
        greenLossCount++;
        // Color mask RED for deforestation/construction
        outputData[i] = 255;   // R
        outputData[i+1] = 0;   // G
        outputData[i+2] = 0;   // B
        outputData[i+3] = 180; // Alpha (semi-transparent)
      } 
      // If after is very grey/white (concrete)
      else if (Math.abs(r2-g2) < 20 && Math.abs(g2-b2) < 20 && r2 > 150) {
        greyGainCount++;
        outputData[i] = 255;   // R
        outputData[i+1] = 165; // G (Orange)
        outputData[i+2] = 0;   // B
        outputData[i+3] = 180; // Alpha
      } else {
        // Generic change (Yellow)
        outputData[i] = 255;
        outputData[i+1] = 255;
        outputData[i+2] = 0;
        outputData[i+3] = 150;
      }
    } else {
      // No change, make transparent
      outputData[i] = 0;
      outputData[i+1] = 0;
      outputData[i+2] = 0;
      outputData[i+3] = 0;
    }
  }
  
  // Put mask data back to canvas and convert to base64 Data URL
  ctx.putImageData(outputImageData, 0, 0);
  const changeMaskDataUrl = canvas.toDataURL('image/png');
  
  const totalPixels = width * height;
  const percentageChanged = (changedPixels / totalPixels) * 100;
  
  let changeCategory: ChangeDetectionResult['changeCategory'] = 'Mixed/Unknown';
  if (percentageChanged < 0.5) {
    changeCategory = 'None';
  } else if (greenLossCount > greyGainCount && greenLossCount > changedPixels * 0.3) {
    changeCategory = 'Deforestation/Canopy Loss';
  } else if (greyGainCount > greenLossCount) {
    changeCategory = 'Unauthorized Construction';
  }
  
  return {
    changeMaskDataUrl,
    percentageChanged: Number(percentageChanged.toFixed(2)),
    changeCategory
  };
}
