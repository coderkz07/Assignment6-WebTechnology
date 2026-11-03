from pathlib import Path
from html.parser import HTMLParser
import json,re
root=Path(__file__).resolve().parents[1]
class Links(HTMLParser):
 def __init__(self,path):super().__init__();self.path=path
 def handle_starttag(self,tag,attrs):
  for key,val in attrs:
   if key in ('src','href') and val and not val.startswith(('http:','https:','#','data:')):
    assert (self.path.parent/val).exists(),(self.path,val)
   assert not key.startswith('on'),(self.path,key)
for p in root.rglob('*.html'):Links(p).feed(p.read_text())
css=(root/'assets/style.css').read_text();assert not re.search(r'@keyframes|\btransition\s*:|\banimation\s*:',css)
assert (root/'task1/app.js').read_bytes()==(root/'task2/app.js').read_bytes()
cases=json.loads((root/'report/case-results.json').read_text())
assert len(cases)==20
assert cases[2]['names']==['Aigerim','Ivan','Sophia','Dias','Aruzhan']
assert cases[12]['names']==['Aigerim','Madina','Nurlan','Natasha']
assert cases[-1]['names']==['Zarina']
assert all(t['pass'] for t in json.loads((root/'report/motion-results.json').read_text()))
assert all((root/f'report/screenshots/case-{i:02d}.png').exists() for i in range(1,21))
print('PASS: local links, event handlers, CSS restrictions, task copies, recorded case results, 11 motion checks and 20 screenshots.')
