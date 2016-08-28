/*
    A hodgepodge of random scripts to aid in rendering Minecraft skins
	Latest code should be available at https://github.com/earthiverse/3D-Minecraft-Skin-Viewer
	
	The MIT License

	Copyright (c) 2014-2018 Kent Rasmussen

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

// Detects if the player has the steve or the alex skin
function IsSmallSkinFormat(context) {
    var value = HasTransparency(context, 46, 52, 2, 12);
    if (value)
        console.log("Detected Alex Skin");
    else
        console.log("Detected Steve Skin");
    return value;
}

// Expects a canvas with a 64x32 Minecraft skin drawn in the very top left corner (0,0)
// Your canvas should be 64x64 in size to show the skin parts that were converted
function Convert6432To6464(context) {
	// Convert old format to new format
    console.log("Skin converted");
	Copy(context, 4, 16, 4, 4, 20, 48, true);	// Top Leg
	Copy(context, 8, 16, 4, 4, 24, 48, true);	// Bottom Leg
	Copy(context, 0, 20, 4, 12, 24, 52, true);	// Outer Leg
	Copy(context, 4, 20, 4, 12, 20, 52, true);	// Front Leg
	Copy(context, 8, 20, 4, 12, 16, 52, true);	// Inner Leg
	Copy(context, 12, 20, 4, 12, 28, 52, true);	// Back Leg
	
	Copy(context, 44, 16, 4, 4, 36, 48, true);	// Top Arm
	Copy(context, 48, 16, 4, 4, 40, 48, true);	// Bottom Arm
	Copy(context, 40, 20, 4, 12, 40, 52, true);	// Outer Arm
	Copy(context, 44, 20, 4, 12, 36, 52, true);	// Front Arm
	Copy(context, 48, 20, 4, 12, 32, 52, true);	// Inner Arm
	Copy(context, 52, 20, 4, 12, 44, 52, true);	// Back Arm
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the non-visible parts of the Minecraft skin transparent
function FixNonVisible(context, smallSkin) {
	// 64x32 and 64x64 skin parts
	context.clearRect(0, 0, 8, 8);
	context.clearRect(24, 0, 16, 8);
	context.clearRect(56, 0, 8, 8);
    
	context.clearRect(0, 16, 4, 4);
	context.clearRect(12, 16, 8, 4);
	context.clearRect(36, 16, 8, 4);
    if (smallSkin) {
        context.clearRect(50, 16, 4, 4);
        context.clearRect(54, 16, 10, 32);
    } else {
       context.clearRect(52, 16, 4, 4);
	    context.clearRect(56, 16, 8, 32);
    }
	
	// 64x64 skin parts
	context.clearRect(0, 32, 4, 4);
	context.clearRect(12, 32, 8, 4);
	context.clearRect(36, 32, 8, 4);
    if (smallSkin) {
        context.clearRect(50, 32, 4, 4);
    } else {
        context.clearRect(52, 32, 4, 4);
    }
    
	context.clearRect(0, 48, 4, 4);
	context.clearRect(12, 48, 8, 4);
	context.clearRect(28, 48, 8, 4);
    if (smallSkin) {
        context.clearRect(42, 48, 10, 4);
        context.clearRect(46, 52, 2, 12);
        context.clearRect(58, 48, 6, 4);
        context.clearRect(62, 52, 2, 12);
    } else {
        context.clearRect(44, 48, 8, 4);
        context.clearRect(60, 48, 4, 4);
    }
}

// Checks if the given part of the canvas contains a pixel with 0 alpha value (transparent)
function HasTransparency(context, x, y, w, h) {
	var imgData = context.getImageData(x, y, w, h);
	
	for(y = 0; y < h; y++) {
		for(x = 0; x < w; x++) {
			var index = (x + y * w) * 4;
			if(imgData.data[index + 3] == 0) return true;	// Has transparency
		}
	}
	
	return false;
}

// Copies one part of the canvas to another, with the option of flipping it horizontally
function Copy(context, sX, sY, w, h, dX, dY, flipHorizontal) {
	var imgData = context.getImageData(sX, sY, w, h);
	
	if(flipHorizontal)
	{
		// Flip horizontal
		for(y = 0; y < h; y++) {
			for(x = 0; x < (w / 2); x++) {
				index = (x + y * w) * 4;
				index2 = ((w - x - 1) + y * w) * 4;
				var pA1 = imgData.data[index];
				var pA2 = imgData.data[index+1];
				var pA3 = imgData.data[index+2];
				var pA4 = imgData.data[index+3];
				
				var pB1 = imgData.data[index2];
				var pB2 = imgData.data[index2+1];
				var pB3 = imgData.data[index2+2];
				var pB4 = imgData.data[index2+3];
				
				imgData.data[index] = pB1;
				imgData.data[index+1] = pB2;
				imgData.data[index+2] = pB3;
				imgData.data[index+3] = pB4;
				
				imgData.data[index2] = pA1;
				imgData.data[index2+1] = pA2;
				imgData.data[index2+2] = pA3;
				imgData.data[index2+3] = pA4;
			}
		}
	}
	
	context.putImageData(imgData,dX,dY);
}
