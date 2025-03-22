#!/bin/bash

# This script will optimise all images in the public/images directory, convert them into webp format

# Check if required tools are installed
command -v cwebp >/dev/null 2>&1 || { echo "Error: cwebp is required but not installed. Please install libwebp-tools."; exit 1; }
command -v convert >/dev/null 2>&1 || { echo "Warning: ImageMagick is not installed. Large image resizing will be skipped."; }

# Base directory
BASE_DIR="$(dirname "$0")"
cd "$BASE_DIR" || { echo "Error: Could not change to directory $BASE_DIR"; exit 1; }

# Create a temporary directory for processed files
mkdir -p .tmp

# Maximum dimensions for images (width or height)
MAX_DIMENSION=1920

# Function to optimize and convert an image to WebP
optimize_image() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local output="$name.webp"
    local ext="${filename##*.}"
    local lower_ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    local resized_file=".tmp/${name}_resized.${ext}"
    
    echo "Processing: $file -> $output"
    
    # Check if the image is too large and needs resizing
    if command -v convert >/dev/null 2>&1 && command -v identify >/dev/null 2>&1; then
        # Get image dimensions
        local dimensions=$(identify -format "%wx%h" "$file" 2>/dev/null)
        if [ $? -eq 0 ]; then
            local width=$(echo "$dimensions" | cut -d'x' -f1)
            local height=$(echo "$dimensions" | cut -d'x' -f2)
            
            # Check if either dimension exceeds the maximum
            if [ "$width" -gt "$MAX_DIMENSION" ] || [ "$height" -gt "$MAX_DIMENSION" ]; then
                echo "Image is too large (${width}x${height}), resizing to max dimension $MAX_DIMENSION"
                # Resize the image while maintaining aspect ratio
                convert "$file" -resize "${MAX_DIMENSION}x${MAX_DIMENSION}>" "$resized_file"
                if [ $? -eq 0 ]; then
                    file="$resized_file"
                    echo "Resized to: $(identify -format "%wx%h" "$file")"
                else
                    echo "Warning: Failed to resize image, will proceed with original size"
                    rm -f "$resized_file"
                fi
            fi
        else
            echo "Warning: Could not determine image dimensions, skipping resize check"
        fi
    fi
    
    # Process based on file extension
    case "$lower_ext" in
        jpg|jpeg)
            cwebp -q 80 -m 6 -mt "$file" -o ".tmp/$output"
            ;;
        png)
            # Use lossless for PNG to preserve transparency
            cwebp -lossless -z 9 -m 6 -mt "$file" -o ".tmp/$output"
            ;;
        gif)
            # Convert GIF to WebP
            if command -v gif2webp >/dev/null 2>&1; then
                gif2webp -lossy -q 80 -m 6 "$file" -o ".tmp/$output"
            else
                echo "Warning: gif2webp not found, converting GIF as still image"
                cwebp -q 80 -m 6 "$file" -o ".tmp/$output"
            fi
            ;;
        webp)
            # Already WebP, check if we can optimize further
            cwebp -q 80 -m 6 -mt "$file" -o ".tmp/$output"
            
            # If the new file is larger, keep the original
            if [ -f ".tmp/$output" ] && [ $(stat -f%z ".tmp/$output" 2>/dev/null || stat -c%s ".tmp/$output") -gt $(stat -f%z "$file" 2>/dev/null || stat -c%s "$file") ]; then
                cp "$file" ".tmp/$output"
            fi
            ;;
        *)
            echo "Skipping unsupported file: $file"
            return
            ;;
    esac
    
    # Check if conversion was successful and the new file is smaller
    if [ -f ".tmp/$output" ]; then
        # Use stat command that works on both macOS and Linux
        original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
        new_size=$(stat -f%z ".tmp/$output" 2>/dev/null || stat -c%s ".tmp/$output")
        
        if [ "$new_size" -lt "$original_size" ]; then
            echo "Success: Reduced $file from ${original_size}B to ${new_size}B (saved $((original_size - new_size))B, $((100 - (new_size * 100 / original_size)))%)"
            mv ".tmp/$output" "$output"
        else
            echo "No size reduction for $file, keeping original format"
            rm ".tmp/$output"
        fi
    else
        echo "Error: Failed to convert $file"
    fi
    
    # Clean up resized file if it exists
    [ -f "$resized_file" ] && rm -f "$resized_file"
}

# Find all images and optimize them
echo "Starting image optimization in $BASE_DIR"
find . -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) | while read -r file; do
    optimize_image "$file"
done

# Cleanup
rm -rf .tmp

echo "Optimization complete!"
