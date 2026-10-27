import { validateLead, pageContext, chronological } from './core.mjs';
import { mountFaq } from '/faq/browser.js';

const host=document.createElement('div');host.id='flyo-live-chat';document.body.append(host);
const root=host.attachShadow({mode:'open'});
root.innerHTML=`<link rel="stylesheet" href="/chat/widget.css"><link rel="stylesheet" href="/faq/faq.css">
<button class="launcher" aria-label="Open Flyo Travel Support" aria-expanded="false" aria-controls="support"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 2V11.5a9 9 0 1 1 18 0Z"/><path d="M7 10h10M7 14h6"/></svg><span>Chat with Flyo</span><b class="badge" hidden>0</b></button>
<dialog id="support" aria-labelledby="chat-title"><header><div><span class="eyebrow">YOUR NEXT JOURNEY STARTS HERE</span><h2 id="chat-title">Flyo Travel Support</h2><p id="availability">Answers and human travel support</p></div><button class="close" aria-label="Close chat">×</button></header>
<nav class="support-nav" aria-label="Support options"><button data-view="home">Welcome</button><button data-view="team">Our team</button><button data-view="faq">FAQs</button></nav>
<div class="notice" role="status" aria-live="polite" hidden></div>
<section class="welcome" data-panel="home"><h3>Welcome to Flyo Travel &amp; Tourism! How can we help you?</h3><p>Plan your next journey with our travel team, or find an answer right away.</p><button class="primary" data-view="team">Chat with Our Team</button><button class="secondary" data-view="faq">Frequently Asked Questions</button><a href="/faq/">View all FAQs</a></section>
<section class="faq-pane" data-panel="faq" hidden></section>
<section class="team-pane" data-panel="team" hidden><section class="intro"><p class="context" hidden></p><form class="lead-form">
<label>Your name<input name="name" autocomplete="name" required minlength="2" maxlength="100"></label>
<label>WhatsApp / mobile number<input name="phone" type="tel" autocomplete="tel" required maxlength="40" placeholder="Include country code"></label>
<label>Email (optional)<input name="email" type="email" autocomplete="email" maxlength="254"></label>
<label class="selected-package" hidden>Selected package<input name="package_display" readonly></label>
<label>Destination or package<input name="destination" maxlength="160" placeholder="Where would you like to go?"></label>
<details><summary>Travel details <span>(optional)</span></summary><div class="pair"><label>Preferred travel dates<input name="travel_date" type="text" maxlength="50" placeholder="For example, early December"></label><label>Number of travellers<input name="travellers" type="number" min="1" max="999"></label></div></details>
<label>Your message<textarea name="message" required maxlength="4000" rows="3"></textarea></label>
<label class="consent"><input name="consent" type="checkbox" required><span>I agree that Flyo may store my contact details and conversation to handle this enquiry and follow up. Please don’t share passport, payment or other sensitive information.</span></label>
<button class="primary start" type="submit">Send enquiry</button></form></section>
<section class="conversation" hidden><div class="conversation-bar"><span class="chat-status"></span><button class="end">End chat</button></div><p class="pending-context" hidden></p><div class="messages" role="log" aria-label="Conversation messages" aria-live="polite" aria-relevant="additions"></div><p class="typing" aria-live="polite"></p><form class="composer"><label for="reply" class="sr-only">Message to Flyo</label><textarea id="reply" rows="2" maxlength="4000" placeholder="Write to our travel team…" required></textarea><button class="primary" type="submit">Send</button></form><button class="new" hidden>Start another enquiry</button></section></section>
<footer>Human support from the Flyo travel team · <a href="/contact/">Contact us</a></footer></dialog>`;
const $=selector=>root.querySelector(selector);
const storageKey='flyo-chat-conversation-v1';
let api,client,session,conversation,messages=[],context={},view='home',stopWatch,connecting,syncing=false,syncAgain=false,closingTimer;
let pending,startAttempt,lastTyping=0,liveConnected=false,acknowledged='',lastAvailability=0;
let requestedPackage=null;
const time=value=>new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
function notice(message=''){ $('.notice').textContent=message;$('.notice').hidden=!message; }
function saveConversation(){try{if(conversation)localStorage.setItem(storageKey,conversation.id);else localStorage.removeItem(storageKey);}catch{}}
function setView(next){
  view=next;root.querySelectorAll('[data-panel]').forEach(el=>{el.hidden=el.dataset.panel!==view;});
  root.querySelectorAll('.support-nav button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
  if(view==='team')connect().then(sync).catch(error=>{notice(error.message);$('#availability').textContent='Unable to check availability';});
  if(view==='faq')$('.faq-pane input')?.focus();
}
function fillContext(){
  $('.selected-package').hidden=!context.package_name;
  $('[name=package_display]').value=context.package_name||'';
  $('.context').textContent=context.package_name ? `Enquiry about ${context.package_name}` : '';
  $('.context').hidden=!context.package_name;
  if(context.destination)$('[name=destination]').value=context.destination;
}
function open(supplied={}){
  const suppliedContext={...window.flyoChatContext,...supplied};
  context=pageContext(location,document.title,suppliedContext);fillContext();
  if(suppliedContext.package_id) {
    requestedPackage={package_id:context.package_id,package_name:context.package_name,package_url:context.package_url,destination:context.destination};
  }
  for(const key of ['name','phone','email','travel_date','travellers','message'])if(typeof supplied[key]==='string')$(`[name=${key}]`).value=supplied[key];
  clearTimeout(closingTimer);$('#support').classList.remove('closing');
  if(!$('#support').open)$('#support').showModal();
  $('.launcher').setAttribute('aria-expanded','true');
  setView(supplied.view || (supplied.package_id ? 'team' : 'home'));
}
function close(){
  if(!$('#support').open)return;
  $('#support').classList.add('closing');
  closingTimer=setTimeout(()=>{$('#support').close();$('#support').classList.remove('closing');$('.launcher').focus();},180);
  $('.launcher').setAttribute('aria-expanded','false');
  if(conversation&&client)api.command(client,'typing',conversation.id,{typing:false}).catch(()=>{});
}
$('.launcher').onclick=()=>open();$('.close').onclick=close;
$('#support').addEventListener('cancel',event=>{event.preventDefault();close();});
$('#support').addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();}});
root.addEventListener('click',event=>{const button=event.target.closest('[data-view]');if(button)setView(button.dataset.view);});
mountFaq($('.faq-pane'),()=>setView('team'));
window.FlyoChat={open};
document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-flyo-chat]');if(!trigger)return;event.preventDefault();
  open({view:'team',...window.flyoChatContext,...Object.fromEntries([['package_id','packageId'],['package_name','packageName'],['package_url','packageUrl'],['destination','destination']].filter(([,key])=>trigger.dataset[key]).map(([key,attribute])=>[key,trigger.dataset[attribute]]))});
});
async function connect(){
  if(client&&session)return;
  if(connecting)return connecting;
  connecting=(async()=>{
    api=await import('./api.js');client ||= await api.chatClient(true);session=await api.visitorSession(client);
    const list=await api.rows(client.from('flyo_conversations').select('*').eq('visitor_id',session.user.id).order('created_at',{ascending:false}).limit(1));
    conversation=list[0]||null;saveConversation();
    client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){
      session=null;conversation=null;messages=[];stopWatch?.();saveConversation();render();notice('Your chat session ended. Open chat again to start a new enquiry.');
    }});
    watchConversation();
  })().finally(()=>{connecting=null;});return connecting;
}
function watchConversation(){
  stopWatch?.();if(!conversation)return;
  const filter=`conversation_id=eq.${conversation.id}`;
  stopWatch=api.watch(client,`visitor-${conversation.id}`,[['flyo_messages',filter],['flyo_conversations',`id=eq.${conversation.id}`],['flyo_chat_typing',filter]],()=>sync().catch(()=>{}),status=>{
    liveConnected=status==='SUBSCRIBED';
    if(liveConnected&&$('.notice').textContent.startsWith('Live connection interrupted.'))notice();
    if(!liveConnected&&$('#support').open)notice('Live connection interrupted. Checking for replies automatically…');
  });
}
async function sync(){
  if(!client||!session)return;
  if(syncing){syncAgain=true;return;}syncing=true;
  try{
    if(Date.now()-lastAvailability>15000){
      const available=await api.command(client,'availability');lastAvailability=Date.now();
      $('#availability').textContent=available.online?'Our travel team is online':"Our travel team is currently offline. Leave your enquiry and we'll get back to you.";
    }
    if(conversation){
      const cid=conversation.id;
      const [records,thread,typing]=await Promise.all([api.rows(client.from('flyo_conversations').select('*').eq('id',cid)),api.history(client,cid),api.rows(client.from('flyo_chat_typing').select('*').eq('conversation_id',cid).eq('sender_role','staff').gt('expires_at',new Date().toISOString()))]);
      if(conversation?.id!==cid)return;
      if(!records.length){conversation=null;messages=[];stopWatch?.();saveConversation();notice('This conversation is no longer available. Please start a new enquiry.');}
      else{conversation=records[0];messages=chronological(thread);}
      $('.typing').textContent=typing.length?'A Flyo representative is typing…':'';
    }
    const atEnd=render();
    if(conversation&&$('#support').open&&!$('#support').classList.contains('closing')&&view==='team'&&document.visibilityState==='visible'&&atEnd&&messages.length){
      const newest=messages.at(-1);
      if(newest.id!==acknowledged&&newest.created_at>conversation.visitor_read_at){
        await api.command(client,'read',conversation.id,{message_id:newest.id});acknowledged=newest.id;
        conversation.visitor_read_at=newest.created_at;render();
      }
    }
  }catch(error){
    if($('#support').open&&view==='team')notice(navigator.onLine?'The chat connection is unavailable. Please retry. Keep this page open to retain any unsent text.':'You’re offline. Your message has not been sent. Reconnect, then retry.');
    throw error;
  }finally{syncing=false;if(syncAgain){syncAgain=false;sync().catch(()=>{});}}
}
function render(){
  $('.intro').hidden=!!conversation;$('.conversation').hidden=!conversation;
  if(!conversation){$('.messages').replaceChildren();$('.badge').hidden=true;return true;}
  const ended=['closed','resolved'].includes(conversation.status);
  $('.pending-context').textContent=requestedPackage ? `Your next message will also attach ${requestedPackage.package_name} to this enquiry.` : '';
  $('.pending-context').hidden=!requestedPackage||ended;
  $('.chat-status').textContent=`Enquiry ${conversation.id.slice(0,8)} · ${conversation.status}`;
  $('.composer').hidden=ended;$('.new').hidden=!ended;$('.end').hidden=ended;
  const log=$('.messages'),atEnd=log.scrollHeight-log.scrollTop-log.clientHeight<80;
  const keys=new Set([...log.children].map(node=>node.dataset.id));
  for(const message of messages){
    if(keys.has(message.id))continue;
    const article=document.createElement('article');article.dataset.id=message.id;article.className=`message ${message.sender_role}`;
    const label=document.createElement('strong');label.textContent=message.sender_role==='staff'?'Flyo travel team':'You';
    const body=document.createElement('p');body.textContent=message.body;
    if(message.package_context?.package_name){const about=document.createElement('p');about.className='message-context';about.textContent=`Regarding: ${message.package_context.package_name}`;article.append(about);}
    const stamp=document.createElement('time');stamp.dateTime=message.created_at;stamp.textContent=`${time(message.created_at)} · Saved`;
    article.append(label,body,stamp);log.append(article);
  }
  if(atEnd)log.scrollTop=log.scrollHeight;
  const unread=messages.filter(m=>m.sender_role==='staff'&&m.created_at>conversation.visitor_read_at).length;
  $('.badge').textContent=String(unread);$('.badge').hidden=!unread;
  $('.launcher').setAttribute('aria-label',`Open Flyo Travel Support${unread?`, ${unread} unread messages`:''}`);
  return atEnd;
}
async function busy(form,action){const button=form.querySelector('button[type=submit]');button.disabled=true;try{notice();await action();}catch(error){notice(error.message);}finally{button.disabled=false;}}
$('.lead-form').onsubmit=event=>{
  event.preventDefault();busy(event.target,async()=>{
    const values=Object.fromEntries(new FormData(event.target));delete values.package_display;
    values.consent=values.consent==='on';values.category=context.package_id?'Tour package enquiry':'General enquiry';validateLead(values);
    startAttempt ||= {id:crypto.randomUUID(),message_id:crypto.randomUUID()};
    await connect();
    if(!conversation||['closed','resolved'].includes(conversation.status)){
      conversation=await api.command(client,'start',startAttempt.id,{...context,...values,message_id:startAttempt.message_id});requestedPackage=null;
    }
    saveConversation();messages=[];$('.messages').replaceChildren();watchConversation();await sync();
    notice('Your enquiry is saved. Our travel team can reply here.');$('#reply').focus();
  });
};
$('.composer').onsubmit=event=>{
  event.preventDefault();busy(event.target,async()=>{
    const body=$('#reply').value.trim();if(!body)throw new Error('Please write a message.');
    if(!pending||pending.body!==body)pending={message_id:crypto.randomUUID(),body,...(requestedPackage?{package:requestedPackage}:{})};
    await api.command(client,'send',conversation.id,pending);
    $('#reply').value='';pending=null;requestedPackage=null;$('.pending-context').hidden=true;
    api.command(client,'typing',conversation.id,{typing:false}).catch(()=>{});await sync();
  });
};
$('#reply').oninput=()=>{if(Date.now()-lastTyping<2500||!conversation)return;lastTyping=Date.now();api.command(client,'typing',conversation.id,{typing:!!$('#reply').value.trim()}).catch(()=>{});};
$('.messages').onscroll=()=>{if($('.messages').scrollHeight-$('.messages').scrollTop-$('.messages').clientHeight<30)sync().catch(()=>{});};
$('.end').onclick=async()=>{try{await api.command(client,'status',conversation.id,{status:'closed'});await sync();notice('Chat ended. Your enquiry remains saved for follow-up.');}catch(error){notice(error.message);}};
$('.new').onclick=()=>{
  conversation=null;messages=[];stopWatch?.();saveConversation();startAttempt=null;pending=null;acknowledged='';
  $('.lead-form').reset();fillContext();notice();render();$('[name=name]').focus();
};
window.addEventListener('online',()=>sync().catch(()=>{}));
window.addEventListener('offline',()=>notice('You’re offline. Reconnect before sending your enquiry or message.'));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')sync().catch(()=>{});});
setInterval(()=>{if(session)sync().catch(()=>{});},8000);
window.addEventListener('storage',event=>{if(event.key===storageKey&&session){
  api.rows(client.from('flyo_conversations').select('*').eq('visitor_id',session.user.id).order('created_at',{ascending:false}).limit(1)).then(rows=>{
    if(rows[0]?.id&&rows[0].id!==conversation?.id){conversation=rows[0];messages=[];$('.messages').replaceChildren();watchConversation();sync().catch(()=>{});}
  }).catch(()=>{});
}});
try{if(localStorage.getItem('flyo-chat-visitor-v1'))connect().then(sync).catch(()=>{});}catch{}
