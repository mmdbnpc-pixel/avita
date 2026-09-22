const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');

const SUPPORTED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png'
]);

async function getImageFiles(dir) {
  const entries = await fs.promises.readdir(dir, {
    withFileTypes: true
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await getImageFiles(fullPath);
      files.push(...nestedFiles);
    } else {
      const ext = path.extname(entry.name).toLowerCase();

      if (SUPPORTED_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

async function convertImages() {
  console.log('🔍 در حال بررسی پوشه public...\n');

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error('❌ پوشه public پیدا نشد.');
    process.exit(1);
  }

  const imageFiles = await getImageFiles(PUBLIC_DIR);

  if (imageFiles.length === 0) {
    console.log('⚠️ هیچ فایل JPG یا PNG پیدا نشد.');
    return;
  }

  console.log(`📸 تعداد تصاویر پیدا شده: ${imageFiles.length}\n`);

  let converted = 0;
  let skipped = 0;
  let failed = 0;

  for (const inputPath of imageFiles) {
    const ext = path.extname(inputPath);
    const outputPath =
      inputPath.slice(0, -ext.length) + '.webp';

    const relativePath = path.relative(
      PUBLIC_DIR,
      inputPath
    );

    try {
      // اگر WebP از قبل وجود داشته باشد، رد می‌شود
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️ رد شد: ${relativePath}`);
        skipped++;
        continue;
      }

      await sharp(inputPath)
        .webp({
          quality: 88,
          effort: 6
        })
        .toFile(outputPath);

      console.log(
        `✅ ${relativePath} → ${path.basename(outputPath)}`
      );

      converted++;
    } catch (error) {
      console.error(
        `❌ خطا در تبدیل ${relativePath}:`,
        error.message
      );

      failed++;
    }
  }

  console.log('\n────────────────────────────');
  console.log('🎉 عملیات تبدیل تمام شد.');
  console.log(`✅ تبدیل شده: ${converted}`);
  console.log(`⏭️ رد شده: ${skipped}`);
  console.log(`❌ ناموفق: ${failed}`);
  console.log('────────────────────────────');
}

convertImages().catch((error) => {
  console.error('\n❌ خطای کلی:', error);
  process.exit(1);
});