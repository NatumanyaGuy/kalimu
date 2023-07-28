// @ts-nocheck

//RGB to Hex
function rgbToHex(rgb) {
	const [r, g, b] = rgb.split(',').map(Number);
	const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
	return `#${hex}`;
}

//Get Text Color
function getTextColor(backgroundHex) {
	const hex = backgroundHex.replace('#', '');
	const [r, g, b] = hex.match(/.{1,2}/g).map((value) => parseInt(value, 16));

	// Calculate the perceived brightness using the sRGB color space formula
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	// Choose white or black based on the brightness threshold (128)
	const textColor = brightness > 128 ? '#000000' : '#ffffff';

	return textColor;
}

// Get Palatte
export function extractColors(base64Image, palatte, callback) {
	const image = new Image();
	image.crossOrigin = 'Anonymous';

	image.onload = function () {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		canvas.width = image.width;
		canvas.height = image.height;

		context.drawImage(image, 0, 0);

		const data = context.getImageData(0, 0, canvas.width, canvas.height).data;

		let colorCounts = {};

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const rgb = `${r},${g},${b}`;

			if (rgb in colorCounts) {
				colorCounts[rgb] += 1;
			} else {
				colorCounts[rgb] = 1;
			}
		}

		const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);

		const palette = sortedColors.slice(0, palatte);

		let paletteHex = palette.map((c) => {
			return {
				bg: rgbToHex(c),
				text: getTextColor(rgbToHex(c))
			};
		});

		// console.log(paletteHex);
		callback(paletteHex);
	};

	image.src = base64Image;
}

export function removeSymbols(str) {
	// Use a regular expression to remove symbols
	const regex = /[^a-zA-Z0-9\s]/g;
	return str.replace(regex, '');
}
