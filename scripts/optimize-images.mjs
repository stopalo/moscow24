
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const INPUT_DIR = 'src/assets/images';
const OUTPUT_DIR = 'public/images';

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const QUALITY = 90;

const supportedExtensions = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.bmp',
    '.tif',
    '.tiff',
]);

await mkdir(OUTPUT_DIR, { recursive: true });

const files = await readdir(INPUT_DIR);

const images = files.filter((file) =>
    supportedExtensions.has(path.extname(file).toLowerCase()),
);

let successCount = 0;
let errorCount = 0;

for (const file of images) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputName = `${path.parse(file).name}.webp`;
    const outputPath = path.join(OUTPUT_DIR, outputName);

    try {
        const metadata = await sharp(inputPath).metadata();

        console.log(
            `Обработка ${file}: формат=${metadata.format}, ` +
            `размер=${metadata.width}×${metadata.height}`,
        );

        const result = await sharp(inputPath)
            .rotate()
            .resize({
                width: MAX_WIDTH,
                height: MAX_HEIGHT,
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality: QUALITY, effort: 5 })
            .toFile(outputPath);

        console.log(
            `✓ ${file} → ${outputName}, ` +
            `${result.width}×${result.height}, ` +
            `${(result.size / 1024).toFixed(1)} KB`,
        );

        successCount++;
    } catch (error) {
        console.error(`✗ Ошибка обработки ${file}:`, error.message);
        errorCount++;
    }
}

console.log(`\nГотово. Успешно: ${successCount}, с ошибками: ${errorCount}`);
