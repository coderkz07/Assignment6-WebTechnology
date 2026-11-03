(async function(){
 const wait=ms=>new Promise(r=>setTimeout(r,ms)), results=[];
 const check=(name,pass,detail)=>results.push({name,pass,detail});
 runCase(2);await wait(400);
 check('Spotlight', $('.guest').filter(function(){return +$(this).css('opacity')===1}).length===5 && $('.guest').filter(function(){return +$(this).css('opacity')===0.2}).length===16,'5 bright; 16 pale');
 $('#clear').trigger('click');await wait(50);check('Clear',$('.guest').filter(function(){return +$(this).css('opacity')!==1}).length===0);
 openDetail('Arman');await wait(400);check('Guest details',!$('#guest-detail').prop('hidden')&&$('#guest-detail').text().includes('Not an AITU student'));
 $(document).trigger($.Event('keydown',{key:'Escape'}));await wait(300);check('Escape',$('#guest-detail').prop('hidden'));
 moveGuest('Arman','balcony');await wait(800);runCase(0);await wait(350);check('Move then case 1',$('#hall .guest').length===5&&$('#balcony .guest').last().attr('data-name')==='Arman'&&$('#result').text().includes('5 guests'));
 sortRoom('living-room');await wait(700);check('Sort by arrival',$('#living-room .guest').map(function(){return $(this).attr('data-time')}).get().join(',')==='19:55,20:20,20:30,21:00,21:10');
 sortRoom('living-room');await wait(700);check('Restore picture order',$('#living-room .guest').map(function(){return $(this).attr('data-name')}).get().join(',')==='Daniel,Zarina,Natasha,Askar,Inkar');
 for(let i=0;i<5;i++)sortRoom('living-room');await wait(700);check('Five rapid sort clicks',$('#living-room .guest').map(function(){return $(this).attr('data-time')}).get().join(',')==='19:55,20:20,20:30,21:00,21:10'&&$('#living-room .guest').filter(function(){return parseFloat($(this).css('left'))!==0||parseFloat($(this).css('top'))!==0}).length===0);
 openDetail('Daniel');openDetail('Sophia');openDetail('Ivan');await wait(650);check('Rapid guest clicks',detailGuest==='Ivan'&&!$('#guest-detail').prop('hidden'));
 moveGuest('Sophia','kitchen');moveGuest('Ivan','hall');await wait(800);check('Rapid moves',$('#kitchen .guest[data-name="Sophia"]').length===1&&$('#hall .guest[data-name="Ivan"]').length===1&&$('.fly,.slot,.departing').length===0);
 check('Unique guests',$('.guest').length===21&&new Set($('.guest').map(function(){return $(this).attr('data-name')}).get()).size===21);
 return JSON.stringify(results);
})()
