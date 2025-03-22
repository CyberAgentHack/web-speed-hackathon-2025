import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import sharp from "sharp";

// Configuration
const ROOT_DIR = process.cwd();
const INPUT_DIR = path.resolve(ROOT_DIR, "../../public/orig_images");
const OUTPUT_DIR = path.resolve(ROOT_DIR, "../../public/images");
const OUTPUT_QUALITY = 80; // WebP quality (0-100)
const EXTENSIONS = ["jpg", "jpeg", "png"]; // Image formats to convert
const OPTIONS = {
	width: 3072,
	withoutEnlargement: true,
};

async function convertToWebP() {
	// Find all images with specified extensions
	const imageFiles = await glob(`${INPUT_DIR}/**/*.{${EXTENSIONS.join(",")}}`, {
		nodir: true,
	});

	console.log(`Found ${imageFiles.length} images to convert to WebP`);

	// Process each image
	for (const imagePath of imageFiles) {
		const relativePath = path.relative(INPUT_DIR, imagePath);
		const outputRelativePath = relativePath.replace(/\.[^.]+$/, ".webp");
		const outputPath = path.join(OUTPUT_DIR, outputRelativePath);

		try {
			await sharp(imagePath)
				.resize({
					width: OPTIONS.width,
					withoutEnlargement: OPTIONS.withoutEnlargement,
				})
				.webp({ quality: OUTPUT_QUALITY })
				.toFile(outputPath);

			// Get file sizes for comparison
			const originalSize = fs.statSync(imagePath).size;
			const webpSize = fs.statSync(outputPath).size;
			const savings = (1 - webpSize / originalSize) * 100;

			console.log(
				`Converted: ${relativePath} → ${outputRelativePath} ` +
					`(${(originalSize / 1024).toFixed(2)}KB → ${(webpSize / 1024).toFixed(2)}KB, ${savings.toFixed(2)}% saved)`,
			);
		} catch (error) {
			console.error(`Error converting ${imagePath}:`, error.message);
		}
	}

	console.log("Conversion completed!");
}

convertToWebP().catch((error) => {
	console.error("Conversion failed:", error);
	process.exit(1);
});
