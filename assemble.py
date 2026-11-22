from pathlib import Path
import shutil, tempfile, urllib.request, zipfile

root = Path(__file__).parent
out = root / '_site'
out.mkdir(exist_ok=True)
for name in ['index.html', 'style.css', 'app.js', 'galleries.js', 'videos.js', '.nojekyll']:
    shutil.copy2(root / name, out / name)

url = 'https://github.com/pypyy525/portfolio/releases/download/portfolio-media-v1/portfolio-assets-v1.zip'
with tempfile.TemporaryDirectory() as temp:
    archive = Path(temp) / 'assets.zip'
    urllib.request.urlretrieve(url, archive)
    with zipfile.ZipFile(archive) as bundle:
        bundle.extractall(out)

assert (out / 'assets/zijun-fei-resume.pdf').is_file()
print('Website assembled; resume available.')
