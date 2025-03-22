#!/bin/sh

# Script to convert TS video segments to a single MP4 file
# Usage: ./ts2mp4.sh <directory_name>
# Example: ./ts2mp4.sh caminandes2

# Check if ffmpeg is installed
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is not installed. Please install it before running this script."
  exit 1
fi

# Normalize directory path
INPUT_DIR=$(echo "$1" | sed 's/\/$//')  # Remove trailing slash if present
DIR_NAME=$(basename "$INPUT_DIR")  # Get the base directory name

# Check if directory argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <directory_name>"
  echo "Available directories:"
  ls -d */ 2>/dev/null | sed 's#/##'
  exit 1
fi

# Check if the directory exists
if [ ! -d "$INPUT_DIR" ]; then
  echo "Error: Directory '$INPUT_DIR' not found."
  exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$INPUT_DIR/mp4"

# Create a temporary file list
FILELIST="$INPUT_DIR/filelist.txt"
rm -f "$FILELIST"

# Find all .ts files and add them to the file list with absolute paths
echo "Finding all .ts files in '$INPUT_DIR'..."
find "$(pwd)/$INPUT_DIR" -maxdepth 1 -name "*.ts" | sort | while read -r tsfile; do
  echo "file '$tsfile'" >> "$FILELIST"
done

# Check if we found any files
if [ ! -s "$FILELIST" ]; then
  echo "Error: No .ts files found in directory '$INPUT_DIR'."
  rm -f "$FILELIST"
  exit 1
fi

# Output file
OUTPUT_FILE="$INPUT_DIR/mp4/$DIR_NAME.mp4"

# Convert and concatenate all ts files into a single mp4
echo "Converting and concatenating all .ts files to a single MP4 file..."
ffmpeg -f concat -safe 0 -i "$FILELIST" -c copy "$OUTPUT_FILE" -hide_banner -loglevel error

if [ $? -eq 0 ]; then
  echo "Success! All segments have been converted and concatenated."
  echo "Output file: $OUTPUT_FILE"
else
  echo "Error occurred during conversion."
fi

# Clean up
rm -f "$FILELIST"

