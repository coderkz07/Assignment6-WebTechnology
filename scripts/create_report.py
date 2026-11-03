from pathlib import Path
import json
from xml.sax.saxutils import escape
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle, Preformatted
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'report'; SHOTS=OUT/'screenshots'
cases=json.loads((OUT/'case-results.json').read_text()); tests=json.loads((OUT/'motion-results.json').read_text())
data=json.loads((ROOT/'assets/data.js').read_text().split('var ORIGINAL_PARTY = ')[1].split(';')[0])
repo='https://github.com/coderkz07/Assignment6-WebTechnology'
doc=Document();sec=doc.sections[0];sec.top_margin=Inches(.65);sec.bottom_margin=Inches(.65)
normal=doc.styles['Normal'];normal.font.name='Calibri';normal.font.size=Pt(10)
for h in ['Title','Heading 1','Heading 2']:doc.styles[h].font.color.rgb=RGBColor.from_string('29392F')
styles=getSampleStyleSheet();styles.add(ParagraphStyle(name='CodeSmall',fontName='Courier',fontSize=7.3,leading=10,spaceAfter=8));styles['BodyText'].fontSize=10;styles['BodyText'].leading=14
flow=[]
def heading(text,level=1):
 doc.add_heading(text,level);flow.append(Paragraph(escape(text),styles['Title' if level==0 else 'Heading'+str(level)]))
def p(text):
 doc.add_paragraph(text);flow.append(Paragraph(escape(text),styles['BodyText']));flow.append(Spacer(1,7))
def code(text):
 para=doc.add_paragraph();r=para.add_run(text);r.font.name='Consolas';r.font.size=Pt(8)
 import textwrap
 wrapped='\n'.join('\n'.join(textwrap.wrap(line,width=100,replace_whitespace=False,drop_whitespace=False)) for line in text.splitlines())
 flow.append(Preformatted(wrapped,styles['CodeSmall']))
def image(name,caption,maxheight=390):
 path=SHOTS/name
 if not path.exists():raise FileNotFoundError(path)
 w,h=ImageReader(str(path)).getSize();scale=min(470/w,maxheight/h)
 doc.add_picture(str(path),width=Inches(w*scale/72))
 flow.append(Image(str(path),width=w*scale,height=h*scale));p(caption)
def page():doc.add_page_break();flow.append(PageBreak())
def table(rows,widths=None):
 t=doc.add_table(rows=1,cols=len(rows[0]));t.style='Light Shading Accent 1'
 for i,v in enumerate(rows[0]):t.rows[0].cells[i].text=str(v)
 for row in rows[1:]:
  cells=t.add_row().cells
  for i,v in enumerate(row):cells[i].text=str(v)
 wrapped=[[Paragraph(escape(str(v)),styles['BodyText']) for v in row] for row in rows]
 t=Table(wrapped,colWidths=widths,repeatRows=1,hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e5ebd8')),('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.4,colors.HexColor('#c9cfbe')),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]));flow.extend([t,Spacer(1,12)])
heading('Assignment 6',0);heading('jQuery: selectors, effects and animations',1)
p('Student: Makanow Madiyar');p('Group: IT 2515');p('Course: Web Technology');p('GitHub repository: '+repo)
p('The project rebuilds the birthday party from the assignment picture. Task 1 answers twenty questions by searching the page. Task 2 adds a spotlight, animated guest details, room moves and sorting by arrival time.')
image('overview.png','Figure 1. The party page, built from the room and guest array.',400)
page();heading('Task 1. Selector Detective')
p('The array stores four rooms and 21 guests. Each room has an id, name, floor and guest list. Guest order follows the picture from left to right. Each guest stores a name, clothing color, arrival time, AITU status and items.')
table([['Floor','Room','Guests in picture order']]+[[r['floor'],r['name'],', '.join(g['name'] for g in r['guests'])] for r in data],[40,85,345])
p('I checked the AITU badges against the picture: Arman has no badge and Natasha has one. These details affect case 3 and the neighbour checks.')
code("{name: 'Arman', color: 'yellow', time: '20:35', aitu: false, items: ['bag', 'glasses'], order: 0}")
p('buildPage() creates the floors, rooms and guest buttons with jQuery. makeCard() adds the local avatar, clothing-color ring, name, arrival time, item icons and AITU badge. Time is also stored as minutes after midnight for comparisons.')
table([['Information','DOM representation'],['Room and floor','.room id, data-room; .floor data-floor'],['Guest details','data-name, data-color, data-time, data-aitu, data-items'],['Time comparison','data-min, for example 20:35 = 1235'],['Items and student status','.has-phone, .has-glasses, .has-bag, .has-cup, .has-crumbs; .aitu']],[145,325])
p('Each case uses one jQuery chain. The chain searches elements on the page instead of filtering PARTY. A click rebuilds the page, highlights the results, makes matching guests jump once with animate(), and displays the count and names. Cases 14-16 return rooms. Cases 18 and 19 demonstrate adding and removing a guest.')
explanations=[
'The hall id limits the search to guest cards inside that room.',
'The comma combines two clothing-color attribute selectors.',
'The floor attribute selects upstairs. The aitu class keeps student cards.',
'The comma means a guest can have glasses, a bag, or both.',
'Guests with no items have no class containing has-. The not selector keeps them.',
'The guest must have the phone class and must not have the bag class.',
'The filter compares minutes against 1230 and 1260. Both boundaries are included.',
'The first selector excludes AITU students. The filter keeps arrivals later than 21:00.',
'prev() finds the left neighbour. The adjacent sibling selector finds the right neighbour.',
'last-child selects the last guest inside each room container.',
'nth-child(3) selects the third guest in every room, counting from one.',
'nextAll() returns Timur\'s following guest siblings in the same room.',
'The selector finds black clothing. prev() returns the guest immediately before each match. Emma is first in the kitchen, so she has no previous guest.',
'closest() travels up from Aruzhan to the room section containing her.',
'The filter counts guest cards in each room and keeps counts below six.',
'has() requires a cup in the room. The nested not selector excludes rooms containing glasses.',
'A guest arrived first if no sibling has a smaller arrival time. This checks time rather than position.',
'makeCard() creates Miras. hide(), insertAfter() and fadeIn() place him after Askar and reveal him smoothly.',
'fadeOut() hides Natasha. Its completion callback removes the card from the DOM.',
'The chain checks the downstairs floor, crumbs, absence of a cup, arrival after 21:00 and before 21:30, and an immediate AITU neighbour.']
for c,ex in zip(cases,explanations):
 page();heading('Case '+str(c['case'])+'. '+c['title'])
 code(c['chain'].removeprefix('() => '));p('Result: '+str(len(c['names']))+' '+('room(s)' if 14<=c['case']<=16 else 'guest(s)')+' - '+', '.join(c['names'])+'.');p(ex)
 image('case-'+str(c['case']).zfill(2)+'.png','Figure '+str(c['case']+1)+'. Result of case '+str(c['case'])+'.',425)
page();heading('Task 2. The party in motion')
p('Task 2 has its own copy of app.js and continues Task 1 with effects.js. The two tasks share the data, selector chains, stylesheet and avatars. All interactive behavior uses jQuery; there are no inline onclick handlers, CSS transitions or CSS keyframe animations.')
heading('1. Spotlight',2)
p('The matched guests stay bright. All other guests animate to opacity 0.2 in 300 milliseconds. When a case returns rooms, the guests inside those rooms stay bright. Clear rebuilds the current room state with full opacity. A named spotlight queue prevents this fade from interrupting a sorting animation.')
code("$('.guest').stop('spotlight', true)\n  .animate({opacity: 0.2}, {duration: 300, queue: 'spotlight'})\n  .dequeue('spotlight');")
image('spotlight.png','Figure 22. Case 3 keeps the five upstairs AITU students bright.',410)
page();heading('2. Guest details')
p('Clicking a guest opens one shared detail panel. Its content describes the arrival time, clothing, student status and items in words. offset() finds the avatar position. The panel starts there at 58 by 58 pixels and animate() grows it to the measured content size. Escape, the close button and a click outside shrink the panel back to the avatar.')
p('A version counter handles rapid guest clicks. Only the latest requested guest opens after the previous panel closes. stop(true, false) cancels an unfinished panel animation before starting the next one.')
image('details.png','Figure 23. Arman\'s detail panel includes the correct student status and room buttons.',440)
page();heading('3. Moving a guest')
p('A room button first updates PARTY: it removes the guest from the old room and appends the guest to the destination room. A clone flies between the old and new offsets over 700 milliseconds. The old card collapses while a destination slot opens. The clone is removed when the real card replaces the slot.')
p('The destination returns to picture-order mode so the moved guest stays at its end. Before a new move or case, unfinished moves settle and the page rebuilds from PARTY. This avoids duplicate guests and leftover clones. After moving Arman to the balcony, case 1 finds five hall guests.')
image('moved.png','Figure 24. Arman is last on the balcony and no longer appears in the hall.',430)
page();heading('4. Sorting and fast clicks')
p('The room button toggles between arrival time and picture order. The original order is stored on each guest. Before reordering, the code saves the visible position of every card. After append() changes the DOM order, the cards receive offsets that place them at their old positions. animate() moves those offsets to zero over 600 milliseconds.')
p('The sort state changes immediately. A new click stops the previous sort queue and starts from the current visible positions. Five rapid clicks finish in arrival order; two clicks restore picture order. Guests who move into a room receive an order value at the end of its list.')
image('sorted.png','Figure 25. Living room ordered by arrival: Daniel, Inkar, Natasha, Askar, Zarina.',430)
page();heading('Verification')
p('The following checks were run in a local Chromium browser against the completed pages. Microsoft Edge and the public deployment have not been verified because the Windows browser connection was unavailable.')
table([['Check','Observed result']]+[[x['name'],'Passed'+(' - '+x['detail'] if x.get('detail') else '')] for x in tests],[190,280])
p('All 20 selector results were checked. Case 3 returns five guests. Case 13 returns Aigerim, Madina, Nurlan and Natasha. The result of case 20 is Zarina.')
heading('Conclusion',2)
p('Selectors work best when the page stores clear classes and data attributes. Attribute selectors handle clothing and floor information, while traversal methods answer questions about neighbours and rooms. The cake clues identify Zarina: she was downstairs, arrived at 21:10, had crumbs and no cup, and stood next to AITU students. Timur meets the time and item clues, but neither of his neighbours is an AITU student.')
p('The animation work showed why data updates and visual effects need separate responsibilities. PARTY records room membership, while jQuery animates the change. Stopping queues and keeping only the latest guest-card request makes fast clicks finish in the expected state.')
p('Source code repository: '+repo)
p('Libraries and artwork: jQuery 3.7.1 (MIT), https://jquery.com/; DiceBear Open Peeps avatars (CC0), https://www.dicebear.com/styles/open-peeps/. Avatars are saved locally.')
doc.core_properties.author='Makanow Madiyar';doc.core_properties.title='Assignment 6 - jQuery';doc.save(OUT/'Assignment6_Makanow_Madiyar.docx')
def footer(canvas,document):
 canvas.setFont('Helvetica',8);canvas.setFillColor(colors.HexColor('#667364'));canvas.drawString(42,25,'Makanow Madiyar | IT 2515 | Assignment 6');canvas.drawRightString(553,25,str(document.page))
SimpleDocTemplate(str(OUT/'Assignment6_Makanow_Madiyar.pdf'),pagesize=(595,842),rightMargin=48,leftMargin=48,topMargin=42,bottomMargin=44).build(flow,onFirstPage=footer,onLaterPages=footer)
print('DOCX and PDF reports generated')
