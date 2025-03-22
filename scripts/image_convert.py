import os
import sys
from pathlib import Path
import argparse
from PIL import Image

#!/usr/bin/env python3
import pillow_avif  # Required for AVIF support with PIL

def resize_and_convert_to_avif(input_path, output_path, target_width):
    """Resize image to target width (maintaining aspect ratio) and convert to AVIF"""
    with Image.open(input_path) as img:
        # Calculate new height to maintain aspect ratio
        width_percent = target_width / float(img.width)
        target_height = int(float(img.height) * width_percent)

        # Resize the image
        resized_img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)

        # Convert to AVIF format
        resized_img.save(output_path, format="AVIF", quality=70)

def process_directory(directory_path, output_directory, target_width):
    """Process all JPEG files in the given directory"""
    # Create output directory if it doesn't exist

    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    # Get all JPEG files in the directory
    jpeg_files = list(Path(directory_path).glob("*.jpg")) + list(Path(directory_path).glob("*.jpeg"))

    print(f"Found {len(jpeg_files)} JPEG files to process")

    for jpeg_file in jpeg_files:
        output_file = Path(output_directory) / f"{jpeg_file.stem}.avif"
        print(f"Processing: {jpeg_file} -> {output_file}")

        try:
            resize_and_convert_to_avif(jpeg_file, output_file, target_width)
        except Exception as e:
            print(f"Error processing {jpeg_file}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Resize JPEGs and convert to AVIF format")
    parser.add_argument("input_dir", help="Directory containing JPEG images")
    parser.add_argument("output_dir", help="Directory to save converted AVIF images")
    parser.add_argument("--width", type=int, default=800, help="Target width for resized images (default: 800)")

    args = parser.parse_args()

    # Validate input directory exists
    if not os.path.isdir(args.input_dir):
        print(f"Error: Input directory '{args.input_dir}' does not exist")
        sys.exit(1)

    process_directory(args.input_dir, args.output_dir, args.width)
    print("Conversion complete")

if __name__ == "__main__":
    main()
