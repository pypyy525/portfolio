from pathlib import Path
import json, shutil, zipfile
root=Path(__file__).parent
out=root/'_site'
out.mkdir(exist_ok=True)
for name in ['index.html','style.css','app.js','galleries.js','videos.js','.nojekyll']:
    shutil.copy2(root/name,out/name)
for item in json.loads((root/'media-manifest.json').read_text()):
    destination=out/item['target']
    destination.parent.mkdir(parents=True,exist_ok=True)
    with destination.open('wb') as target:
        for name in item['parts']:
            with (root/name).open('rb') as source:
                shutil.copyfileobj(source,target)
    if item.get('unzip'):
        with zipfile.ZipFile(destination) as archive: archive.extractall(out)
        destination.unlink()
assert (out/'assets/zijun-fei-resume.pdf').is_file()
print('Website assembled; resume available.')
