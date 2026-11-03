/* Each run function searches the rendered DOM with one jQuery chain. */
var CASES = [
 ['Who is in the hall?', () => $('#hall .guest')],
 ['Who is dressed in yellow or purple?', () => $('.guest[data-color="yellow"], .guest[data-color="purple"]')],
 ['Which AITU students are upstairs?', () => $('.floor[data-floor="2"] .guest.aitu')],
 ['Who has glasses or a bag?', () => $('.guest.has-glasses, .guest.has-bag')],
 ['Who came with nothing at all?', () => $('.guest:not([class*="has-"])')],
 ['Who has a phone but no bag?', () => $('.guest.has-phone:not(.has-bag)')],
 ['Who arrived between 20:30 and 21:00?', () => $('.guest').filter(function () { return +$(this).attr('data-min') >= 1230 && +$(this).attr('data-min') <= 1260; })],
 ['Who arrived after 21:00 and is not AITU?', () => $('.guest:not(.aitu)').filter(function () { return +$(this).attr('data-min') > 1260; })],
 ['Who stands right next to Askar?', () => $('.guest[data-name="Askar"]').prev('.guest').add('.guest[data-name="Askar"] + .guest')],
 ['Who stands last in each room?', () => $('.guests > .guest:last-child')],
 ['Who stands third in each room?', () => $('.guests > .guest:nth-child(3)')],
 ['Who stands after Timur in his room?', () => $('.guest[data-name="Timur"]').nextAll('.guest')],
 ['Who stands right before someone in black?', () => $('.guest[data-color="black"]').prev('.guest')],
 ['In which room is Aruzhan?', () => $('.guest[data-name="Aruzhan"]').closest('.room')],
 ['Which rooms have fewer than 6 guests?', () => $('.room').filter(function () { return $(this).find('.guest').length < 6; })],
 ['Which rooms have cups but no glasses?', () => $('.room:has(.has-cup):not(:has(.has-glasses))')],
 ['Who came first to each room?', () => $('.guest').filter(function () { var time = +$(this).attr('data-min'); return $(this).siblings('.guest').filter(function () { return +$(this).attr('data-min') < time; }).length === 0; })],
 ['Miras joins between Askar and Inkar.', () => makeCard({name:'Miras',color:'blue',time:'21:20',aitu:true,items:['phone']}).hide().insertAfter('.guest[data-name="Askar"]').fadeIn(650)],
 ['Natasha says goodbye and goes home.', () => $('.guest[data-name="Natasha"]').fadeOut(650, function () { $(this).remove(); })],
 ['Who took the cake?', () => $('.floor[data-floor="1"] .guest.has-crumbs:not(.has-cup)').filter(function () { return +$(this).attr('data-min') > 1260 && +$(this).attr('data-min') < 1290; }).filter(function () { return $(this).prev('.guest').add($(this).next('.guest')).filter('.aitu').length > 0; })]
].map(function (entry) { return {title:entry[0],run:entry[1]}; });
