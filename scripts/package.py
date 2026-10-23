"""Build a bounded source plugin ZIP, never a workspace or repository archive."""
import hashlib,json,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'manifest.json').read_text())
out=root/'dist';out.mkdir(exist_ok=True)
archive=out/('aide-pkg-'+manifest['id']+'-v'+manifest['version']+'.zip')
files=['manifest.json','index.js','capabilities.json','LICENSE','README.md']
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for name in files:
  p=root/name
  assert p.is_file() and not p.is_symlink() and p.stat().st_size<128*1024
  info=zipfile.ZipInfo(name,(2026,10,22,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16
  z.writestr(info,p.read_bytes())
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None and len(z.namelist())==len(files)
digest=hashlib.sha256(archive.read_bytes()).hexdigest()
(archive.with_suffix('.zip.sha256')).write_text(digest+'  '+archive.name+'\n')
print(json.dumps({'archive':str(archive),'sha256':digest,'files':files},ensure_ascii=False))
