import os
import sys

def convert_images():
    try:
        from PIL import Image
    except ImportError:
        import subprocess
        print("Installing Pillow...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image

    image_dir = os.path.join("assets", "images")
    if not os.path.exists(image_dir):
        print(f"Directory not found: {image_dir}")
        return

    images_to_convert = [
        "2 (1).jpg",
        "4 (1).jpg",
        "Building together.JPG",
        "echoes of innovation.JPG",
        "Until next time.JPG",
        "6 (1).jpg",
        "8 (1).jpg",
        "1 (1).png",
        "3 (1).png"
    ]

    for img_name in images_to_convert:
        img_path = os.path.join(image_dir, img_name)
        if not os.path.exists(img_path):
            print(f"File not found: {img_path}")
            continue

        try:
            with Image.open(img_path) as img:
                # Convert to RGB if necessary (for saving as webp from RGBA)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Resize if too large (e.g. max 1920 width)
                # For filmstrip, maybe they don't need to be 4k. 
                # We'll just define max dimensions of 1920x1080 for backgrounds, and a smaller one for thumbnails?
                # Actually, wait, let's just create a standard size and a thumbnail
                
                # Full size webp
                img.thumbnail((1920, 1080), Image.ANTIALIAS if hasattr(Image, 'ANTIALIAS') else Image.Resampling.LANCZOS)
                new_name = os.path.splitext(img_name)[0] + ".webp"
                new_path = os.path.join(image_dir, new_name)
                img.save(new_path, "WEBP", quality=80)
                print(f"Converted: {new_name}")
                
        except Exception as e:
            print(f"Error processing {img_name}: {e}")

if __name__ == '__main__':
    convert_images()
