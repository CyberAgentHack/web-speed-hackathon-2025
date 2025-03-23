#!/bin/sh

# Check if ImageMagick is installed
command -v convert >/dev/null 2>&1 || { echo "Error: ImageMagick is required but not installed."; exit 1; }

# Base directory
IMAGES_OLD_DIR="$(dirname "$0")"
OUTPUT_DIR="$IMAGES_OLD_DIR/../images"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Maximum dimensions for images (width or height)
MAX_DIMENSION=1920

echo "Starting image optimization..."
echo "Source directory: $IMAGES_OLD_DIR"
echo "Output directory: $OUTPUT_DIR"

# Process all images
find "$IMAGES_OLD_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) | while read -r file; do
    # Get filename and extension
    filename=$(basename "$file")
    extension="${filename##*.}"
    name="${filename%.*}"
    
    # Convert extension to lowercase using tr command
    extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
    
    # If extension is webp, convert to jpeg
    if [ "$extension_lower" = "webp" ]; then
        output_filename="${name}.jpeg"
        echo "Processing: $filename (converting WebP to JPEG)"
    else
        output_filename="$filename"
        echo "Processing: $filename"
    fi
    
    # Get image dimensions
    dimensions=$(identify -format "%wx%h" "$file" 2>/dev/null)
    if [ $? -eq 0 ]; then
        width=$(echo "$dimensions" | cut -d'x' -f1)
        height=$(echo "$dimensions" | cut -d'x' -f2)
        
        # Check if image needs resizing
        if [ "$width" -gt "$MAX_DIMENSION" ] || [ "$height" -gt "$MAX_DIMENSION" ]; then
            echo "  Resizing image from ${width}x${height} to max dimension $MAX_DIMENSION"
            # Resize the image while maintaining aspect ratio and converting webp to jpeg if needed
            if [ "$extension_lower" = "webp" ]; then
                magick "$file" -resize "${MAX_DIMENSION}x${MAX_DIMENSION}>" "$OUTPUT_DIR/$output_filename"
            else
                magick "$file" -resize "${MAX_DIMENSION}x${MAX_DIMENSION}>" "$OUTPUT_DIR/$output_filename"
            fi
            
            # Get file sizes for reporting
            original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
            new_size=$(stat -f%z "$OUTPUT_DIR/$output_filename" 2>/dev/null || stat -c%s "$OUTPUT_DIR/$output_filename")
            
            echo "  Reduced from ${original_size}B to ${new_size}B (saved $((100 - (new_size * 100 / original_size)))%)"
        else
            echo "  Image is already within size limits (${width}x${height})"
            # Copy the file as is or convert webp to jpeg
            if [ "$extension_lower" = "webp" ]; then
                magick "$file" "$OUTPUT_DIR/$output_filename"
                echo "  Converted WebP to JPEG"
            else
                cp "$file" "$OUTPUT_DIR/$output_filename"
            fi
        fi
    else
        echo "  Could not determine image dimensions"
        # Copy the file as is or convert webp to jpeg
        if [ "$extension_lower" = "webp" ]; then
            magick "$file" "$OUTPUT_DIR/$output_filename"
            echo "  Converted WebP to JPEG"
        else
            cp "$file" "$OUTPUT_DIR/$output_filename"
        fi
    fi
done

echo "Optimization complete!"
