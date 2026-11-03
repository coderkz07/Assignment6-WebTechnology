from pathlib import Path
from urllib.request import urlretrieve
from concurrent.futures import ThreadPoolExecutor
import json
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'assets/data.js').read_text().split('var ORIGINAL_PARTY = ')[1].split(';')[0])
out=root/'assets/avatars';out.mkdir(exist_ok=True)
names=[g['name'] for r in data for g in r['guests']]+['Miras']
def download(n):
 urlretrieve('https://api.dicebear.com/9.x/open-peeps/svg?seed='+n,out/(n+'.svg'))
with ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(download,names))
print('Downloaded',len(names),'CC0 Open Peeps avatars')
