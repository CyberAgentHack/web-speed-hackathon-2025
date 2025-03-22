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
    """Process all JPEG and PNG files in the given directory"""
    # Create output directory if it doesn't exist

    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    # Get all JPEG and PNG files in the directory
    image_files = list(Path(directory_path).glob("*.jpg")) + \
                  list(Path(directory_path).glob("*.jpeg")) + \
                  list(Path(directory_path).glob("*.png"))

    print(f"Found {len(image_files)} image files to process")

    for image_file in image_files:
        output_file = Path(output_directory) / f"{image_file.stem}.avif"
        print(f"Processing: {image_file} -> {output_file}")

        try:
            resize_and_convert_to_avif(image_file, output_file, target_width)
        except Exception as e:
            print(f"Error processing {image_file}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Resize JPEGs/PNGs and convert to AVIF format")
    parser.add_argument("input_dir", help="Directory containing JPEG/PNG images")
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
