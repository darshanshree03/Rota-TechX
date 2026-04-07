import re

filepath = r'e:\Websites\Rota-TechX\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# Make background images data-bg and convert to webp while adding performance inline styles
html = re.sub(
    r'style="background-image:\s*url\([\'"]?assets/images/(.*?)\.(jpg|JPG|png|PNG)[\'"]?\)\s*;?"',
    r'data-bg="url(\'assets/images/\1.webp\')" style="background-color: #0d1b2a; will-change: transform; transition: background-image 0.5s ease;"',
    html
)

# Convert filmstrip images and add loading="lazy"
html = re.sub(
    r'<img\s+src=[\'"]assets/images/(.*?)\.(jpg|JPG|png|PNG)[\'"]',
    r'<img loading="lazy" src="assets/images/\1.webp"',
    html
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html with regex")
