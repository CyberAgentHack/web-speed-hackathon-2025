import { join, dirname, basename, extname, resolve } from 'path';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function compressImageToAvif(sourcePath: string, outputPath: string): Promise<void> {
  try {
    // Use sharp for image processing with higher compression
    await sharp(sourcePath)
      // Resize to reduce dimensions if needed
      .resize({
        width: 1280, // Max width
        height: 720, // Max height
        fit: 'inside', // Keep aspect ratio
        withoutEnlargement: true, // Don't enlarge small images
      })
      .avif({
        quality: 90, // Much lower quality for higher compression (0-100)
        effort: 5, // Maximum compression effort (0-9)
      })
      .toFile(outputPath);
    console.log(`✅ Converted: ${sourcePath} -> ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error converting ${sourcePath}:`, error);
  }
}

async function processDirectory(dirPath: string): Promise<void> {
  try {
    // Get all files in the directory
    const files = await readdir(dirPath, { withFileTypes: true });
    const tasks: Promise<void>[] = [];

    // Process subdirectories first (still sequential for subdirectories)
    for (const file of files) {
      if (file.isDirectory()) {
        const filePath = join(dirPath, file.name);
        // Recursively process subdirectories
        await processDirectory(filePath);
      }
    }

    // Then process all image files in parallel
    for (const file of files) {
      const filePath = join(dirPath, file.name);

      if (
        !file.isDirectory() &&
        file.isFile() &&
        ['.jpg', '.jpeg', '.png'].includes(extname(file.name).toLowerCase())
      ) {
        // Process image files
        const ext = extname(file.name).toLowerCase();
        const outputPath = join(dirname(filePath), `${basename(filePath, ext)}.avif`);

        // Create output directory if it doesn't exist
        const outputDir = dirname(outputPath);
        if (!existsSync(outputDir)) {
          await mkdir(outputDir, { recursive: true });
        }

        // Add to parallel tasks instead of awaiting immediately
        tasks.push(compressImageToAvif(filePath, outputPath));
      }
    }

    // Wait for all image processing tasks to complete
    if (tasks.length > 0) {
      console.log(`Processing ${tasks.length} images in parallel...`);
      await Promise.all(tasks);
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

async function main() {
  const startTime = performance.now();
  console.log('Starting image to AVIF compression with parallel processing...');

  // Process images and logos directories
  const rootDir = resolve(__dirname, '..');
  const directories = [join(rootDir, 'public/images'), join(rootDir, 'public/logos')];

  // Process all directories in parallel
  const dirTasks = directories.map(async (dir) => {
    console.log(`Processing directory: ${dir}`);
    await processDirectory(dir);
  });

  // Wait for all directory processing to complete
  await Promise.all(dirTasks);

  const endTime = performance.now();
  console.log(`Compression completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
}

// Run the main function
main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
