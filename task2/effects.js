/* Task 2 keeps PARTY as the room membership state. Effects only display changes. */
var detailVersion=0, detailGuest=null;
function spotlight($found) {
 var $keep=$found.is('.room')?$found.find('.guest'):$found;
 $('.guest').stop('spotlight',true).animate({opacity:0.2},{duration:300,queue:'spotlight'}).dequeue('spotlight');
 $keep.stop('spotlight',true).animate({opacity:1},{duration:300,queue:'spotlight'}).dequeue('spotlight');
}
function locate(name) {
 for(var room of PARTY){var guest=room.guests.find(g=>g.name===name);if(guest)return {room:room,guest:guest};}
 return null;
}
function closeDetail(done) {
 var $panel=$('#guest-detail'),$avatar=$('.guest').filter(function(){return $(this).attr('data-name')===detailGuest;}).find('.avatar');
 if($panel.prop('hidden')){if(done)done();return;}
 var end=$avatar.length?$avatar.offset():$panel.offset();
 $panel.stop(true,false).animate({left:end.left,top:end.top,width:58,height:58,opacity:0},220,function(){$panel.prop('hidden',true);detailGuest=null;if(done)done();});
}
function openDetail(name) {
 var token=++detailVersion;
 closeDetail(function(){
  if(token!==detailVersion)return;
  var match=locate(name),$g=$('.guest').filter(function(){return $(this).attr('data-name')===name;});
  // Miras is a temporary DOM addition from case 18.
  var g=match?match.guest:{name:name,time:$g.attr('data-time'),color:$g.attr('data-color'),aitu:$g.attr('data-aitu')==='true',items:($g.attr('data-items')||'').split(' ').filter(Boolean)};
  if(!$g.length)return;
  detailGuest=name;
  var $panel=$('#guest-detail').empty();
  $('<button>',{type:'button',class:'close-detail',text:'×','aria-label':'Close guest details'}).appendTo($panel);
  $('<h2>').text(g.name).appendTo($panel);
  $('<p>').text('Came at '+g.time+' · Wears '+g.color).appendTo($panel);
  $('<p>').text(g.aitu?'AITU student':'Not an AITU student').appendTo($panel);
  $('<p>').text(g.items.length?'Has '+g.items.join(', ').replace(/, ([^,]*)$/,' and $1'):'Came with no items').appendTo($panel);
  if(match) PARTY.filter(r=>r.id!==match.room.id).forEach(r=>$('<button>',{class:'move',type:'button','data-room':r.id,'data-name':name,text:'Move to the '+r.name.toLowerCase()}).appendTo($panel));
  var start=$g.find('.avatar').offset(),width=Math.min(280,$(window).width()-24);
  $panel.prop('hidden',false).css({left:start.left,top:start.top,width:width,height:'auto',opacity:0});
  var height=$panel.outerHeight(),left=Math.max(12,Math.min(start.left,$(window).scrollLeft()+$(window).width()-width-12));
  var top=Math.max($(window).scrollTop()+12,Math.min(start.top,$(window).scrollTop()+$(window).height()-height-12));
  $panel.css({width:58,height:58}).animate({left:left,top:top,width:width,height:height,opacity:1},300);
 });
}
function settleMotion() {
 ++detailVersion;
 $('#guest-detail').stop(true,false).prop('hidden',true);detailGuest=null;
 $('.fly,.slot,.departing').stop(true,true).remove();
 $('.guest').stop('sort',true,true).stop('spotlight',true,true);
}
function moveGuest(name,targetId) {
 var match=locate(name),target=PARTY.find(r=>r.id===targetId);
 if(!match||!target||target===match.room)return;
 settleMotion();buildPage();
 var $old=$('.guest').filter(function(){return $(this).attr('data-name')===name;}),start=$old.offset(),width=$old.outerWidth(),height=$old.outerHeight();
 match.room.guests=match.room.guests.filter(g=>g.name!==name);
 match.guest.order=target.guests.reduce((n,g)=>Math.max(n,g.order),-1)+1;
 target.guests.push(match.guest);target.sorted=false;
 var $destination=$('#'+targetId+' .guests'),$slot=$('<span>',{class:'slot'}).css({width:width,height:height}).appendTo($destination),end=$slot.offset();
 var $fly=$old.clone().removeClass('guest found').addClass('fly').css({left:start.left,top:start.top,width:width,height:height,opacity:1}).appendTo('body');
 $old.removeClass('guest').addClass('departing').css({overflow:'hidden'}).animate({width:0,opacity:0,paddingLeft:0,paddingRight:0},700,function(){$(this).remove();});
 $slot.css({width:0}).animate({width:width},700);
 $fly.animate({left:end.left,top:end.top},700,function(){$slot.replaceWith(makeCard(match.guest));$fly.remove();});
 $('#'+targetId+' .sort').text('Sort by time');
}
function sortRoom(id) {
 // Finish a flight before calculating positions so the final DOM matches the array.
 if($('.fly').length){settleMotion();buildPage();}
 var room=PARTY.find(r=>r.id===id),$cards=$('#'+id+' .guest'),positions={};
 $cards.each(function(){positions[$(this).attr('data-name')]=$(this).offset();});
 $cards.stop('sort',true,false).css({left:0,top:0});
 room.sorted=!room.sorted;
 var ordered=room.guests.slice().sort(room.sorted?(a,b)=>minutes(a.time)-minutes(b.time):(a,b)=>a.order-b.order);
 var $container=$('#'+id+' .guests');
 ordered.forEach(g=>$cards.filter(function(){return $(this).attr('data-name')===g.name;}).appendTo($container));
 $cards.each(function(){var $card=$(this),now=$card.offset(),old=positions[$card.attr('data-name')];$card.css({left:old.left-now.left,top:old.top-now.top}).animate({left:0,top:0},{duration:600,queue:'sort'}).dequeue('sort');});
 $('#'+id+' .sort').text(room.sorted?'Picture order':'Sort by time');
}
$(function(){
 $('#house').on('click','.guest',function(e){e.stopPropagation();openDetail($(this).attr('data-name'));});
 $('#guest-detail').on('click',function(e){e.stopPropagation();}).on('click','.close-detail',function(){++detailVersion;closeDetail();}).on('click','.move',function(){moveGuest($(this).attr('data-name'),$(this).attr('data-room'));});
 $('#house').on('click','.sort',function(){sortRoom($(this).closest('.room').attr('id'));});
 $(document).on('click',function(){++detailVersion;closeDetail();}).on('keydown',function(e){if(e.key==='Escape'){++detailVersion;closeDetail();}});
});
