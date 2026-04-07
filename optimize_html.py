import re

filepath = r'e:\Websites\Rota-TechX\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update gallery slide background images to use data-bg and webp
html = html.replace(
    'style="background-image:url(\'assets/images/2 (1).jpg\')"',
    'data-bg="url(\'assets/images/2 (1).webp\')" style="background-color: #0d1b2a; will-change: transform;"'
)
html = html.replace(
    'style="background-image:url(\'assets/images/4 (1).jpg\')"',
    'data-bg="url(\'assets/images/4 (1).webp\')" style="background-color: #0d1b2a; will-change: transform;"'
)
html = html.replace(
    'style="background-image:url(\'assets/images/Building\\ together.JPG\')"',
    'data-bg="url(\'assets/images/Building together.webp\')" style="background-color: #0d1b2a; will-change: transform;"'
)
html = html.replace(
    'style="background-image:url(\'assets/images/echoes\\ of\\ innovation.JPG\')"',
    'data-bg="url(\'assets/images/echoes of innovation.webp\')" style="background-color: #0d1b2a; will-change: transform;"'
)
html = html.replace(
    'style="background-image:url(\'assets/images/Until\\ next\\ time.JPG\')"',
    'data-bg="url(\'assets/images/Until next time.webp\')" style="background-color: #0d1b2a; will-change: transform;"'
)

# 2. Update filmstrip images to use loading=lazy and webp
html = html.replace('<img src="assets/images/2 (1).jpg"', '<img loading="lazy" src="assets/images/2 (1).webp"')
html = html.replace('<img src="assets/images/4 (1).jpg"', '<img loading="lazy" src="assets/images/4 (1).webp"')
html = html.replace('<img src="assets/images/6 (1).jpg"', '<img loading="lazy" src="assets/images/6 (1).webp"')
html = html.replace('<img src="assets/images/8 (1).jpg"', '<img loading="lazy" src="assets/images/8 (1).webp"')
html = html.replace('<img src="assets/images/1 (1).png"', '<img loading="lazy" src="assets/images/1 (1).webp"')
html = html.replace('<img src="assets/images/3 (1).png"', '<img loading="lazy" src="assets/images/3 (1).webp"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html")
