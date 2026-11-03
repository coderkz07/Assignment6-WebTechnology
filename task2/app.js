var motion = $('body').attr('data-task') === '2';
var COLORS = {green:'#328268',black:'#292d32',yellow:'#d39c20',purple:'#9163b3',blue:'#4778bd',red:'#c95155'};
var ICONS = {phone:'▯',glasses:'⌘',bag:'▱',cup:'☕',crumbs:'▤'};
function minutes(time) { var p=time.split(':'); return +p[0]*60 + +p[1]; }
function makeCard(g) {
 var $g=$('<button>',{type:'button',class:'guest '+(g.aitu?'aitu ':'')+g.items.map(x=>'has-'+x).join(' '),'data-name':g.name,'data-color':g.color,'data-time':g.time,'data-min':minutes(g.time),'data-aitu':String(g.aitu),'data-items':g.items.join(' '),'aria-label':g.name+', arrived '+g.time+(g.aitu?', AITU student':'')}).css('--ring',COLORS[g.color]);
 $('<img>',{class:'avatar',src:'../assets/avatars/'+g.name+'.svg',alt:'',width:54,height:54}).appendTo($g);
 if(g.aitu) $('<span>',{class:'aitu-badge',text:'AITU'}).appendTo($g);
 $('<strong>').text(g.name).appendTo($g); $('<time>').text(g.time).appendTo($g);
 var $items=$('<span>',{class:'items'}).appendTo($g);
 g.items.forEach(x=>$('<span>',{title:x,'aria-label':x,text:ICONS[x]}).appendTo($items));
 if(!g.items.length) $items.append($('<span>',{class:'empty-items',text:'No items'}));
 return $g;
}
function buildPage() {
 $('#house').empty();
 [2,1].forEach(function(floor){
  var $floor=$('<section>',{class:'floor','data-floor':floor,'aria-label':'Floor '+floor}).appendTo('#house');
  $('<div>',{class:'floor-label',text:'FLOOR 0'+floor}).appendTo($floor);
  var $rooms=$('<div>',{class:'rooms'}).appendTo($floor);
  PARTY.filter(r=>r.floor===floor).forEach(function(r){
   var $room=$('<section>',{class:'room',id:r.id,'data-room':r.name}).appendTo($rooms);
   var $head=$('<div>',{class:'room-heading'}).appendTo($room);
   $('<h3>').text(r.name).appendTo($head);
   if(motion) $('<button>',{class:'sort',type:'button',text:r.sorted?'Picture order':'Sort by time'}).appendTo($head);
   var $guests=$('<div>',{class:'guests'}).appendTo($room);
   var guests=r.guests.slice(); if(r.sorted) guests.sort((a,b)=>minutes(a.time)-minutes(b.time));
   guests.forEach(g=>$guests.append(makeCard(g)));
  });
 });
}
function settle() { if(motion && window.settleMotion) window.settleMotion(); $('.guest').stop(true,true).css({top:0,left:0}); }
function runCase(index) {
 settle();
 if(!motion) PARTY=$.extend(true,[],ORIGINAL_PARTY);
 buildPage();
 var c=CASES[index], $found=c.run();
 $found.addClass('found');
 if(index!==18) $found.filter('.guest').animate({top:-12},130).animate({top:0},150);
 var names=$found.map(function(){return $(this).attr($(this).hasClass('room')?'data-room':'data-name');}).get();
 $('#result-label').text('CASE '+String(index+1).padStart(2,'0')+' / '+c.title);
 $('#result').text(names.length+' '+($found.is('.room')?'room':'guest')+(names.length===1?'':'s')+': '+names.join(', '));
 $('#explanation').text(index===19?'Zarina has crumbs, no cup, arrived at 21:10 downstairs and stands next to an AITU student.':index===17?'Miras appears between Askar and Inkar.':index===18?'Natasha fades out and is removed from the page.':'Highlighted results come from the rendered page.');
 $('#chain').text(c.run.toString().replace(/^\(\) => /,''));
 $('#cases button').removeAttr('aria-current').eq(index).attr('aria-current','true');
 if(motion && window.spotlight) window.spotlight($found);
}
$(function(){
 CASES.forEach((c,i)=>$('<button>',{type:'button','data-case':i}).append($('<span>',{text:String(i+1).padStart(2,'0')}),document.createTextNode(c.title)).appendTo('#cases'));
 buildPage();
 $('#cases').on('click','button',function(){runCase(+$(this).attr('data-case'));});
 $('#clear').on('click',function(){settle(); if(!motion) PARTY=$.extend(true,[],ORIGINAL_PARTY); buildPage(); $('#cases button').removeAttr('aria-current'); $('#result-label').text('THE PARTY · 19:30–22:30'); $('#result').text($('.guest').length+' guests in 4 rooms'); $('#explanation').text('Highlights cleared. Choose another clue.'); $('#chain').text('Select a case to see its chain.');});
});
