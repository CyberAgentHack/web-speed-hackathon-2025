from playwright.sync_api import sync_playwright
import os
import sys
from pathlib import Path
import base64

def svg_to_png(input_svg_path, output_png_path):
    with open(input_svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()
    
    # Encode SVG as base64 for src attribute
    svg_base64 = base64.b64encode(svg_content.encode()).decode()
    data_url = f"data:image/svg+xml;base64,{svg_base64}"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Set SVG as img src instead of direct embedding
        page.set_content(f'<html><body><img width="250px" height="44px" src="{data_url}" id="svg-img"></body></html>')

        # Wait for image to load
        page.wait_for_timeout(1000)

        # Take screenshot of the img element
        img_element = page.query_selector("#svg-img")
        img_bounding_box = img_element.bounding_box()
        page.screenshot(
            path=output_png_path,
            clip=img_bounding_box,
            omit_background=True
        )

        browser.close()

if __name__ == "__main__":
    # Rest of the code remains unchanged
    if len(sys.argv) < 2:
        print("Usage: python svg_to_png.py <input_directory> [output_directory]")
        sys.exit(1)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else input_dir

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Process all SVG files in the input directory
    for svg_file in Path(input_dir).glob("*.svg"):
        png_file = os.path.join(output_dir, svg_file.stem + ".png")
        print(f"Converting {svg_file} to {png_file}")
        svg_to_png(str(svg_file), png_file)
