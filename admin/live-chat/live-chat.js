import { chatClient, command, rows, history, watch } from '/chat/api.js';
import { chronological } from '/chat/core.mjs';
const $=selector=>document.querySelector(selector);
const client=await chatClient();
let profile,selected,messages=[],stopWatch,attempt,offset=0,items=[],generation=0;
let desiredPresence='offline',syncing=false,syncAgain=false,searchTimer,lastTyping=0;
const readUpTo=new Map(),drafts=new Map();
const time=value=>new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
function notify(text=''){ $('#notice').textContent=text;$('#notice').hidden=!text; }
function clearWorkspace(){
  generation++;stopWatch?.();stopWatch=null;profile=null;selected=null;messages=[];items=[];attempt=null;drafts.clear();readUpTo.clear();
  $('#workspace').hidden=true;$('#login').hidden=false;$('#thread-content').hidden=true;$('#empty').hidden=false;
  for(const id of ['messages','inbox-list','lead-details'])$(`#${id}`).replaceChildren();$('#reply').value='';
}
async function authenticate(){
  const {data:{session}}=await client.auth.getSession();if(!session){clearWorkspace();return;}
  const current=await command(client,'profile');if(!current){clearWorkspace();throw new Error('This account is not authorized for Flyo travel support. Ask your administrator to enable your staff account.');}
  profile=current;generation++;$('#staff-name').textContent=profile.display_name;$('#workspace').hidden=false;$('#login').hidden=true;
  desiredPresence='offline';$('#presence').value='offline';
  stopWatch?.();stopWatch=watch(client,`staff-${profile.user_id}`,[['flyo_conversations'],['flyo_messages'],['flyo_chat_reads'],['flyo_chat_typing']],()=>refresh().catch(error=>notify(error.message)),status=>{
    if(['CHANNEL_ERROR','TIMED_OUT'].includes(status))notify('Live connection interrupted. Checking for replies automatically.');
    if(status==='SUBSCRIBED'&&$('#notice').textContent.startsWith('Live connection interrupted.'))notify();
  });
  await command(client,'presence',null,{status:'offline'});await refresh();
}
$('#login-form').onsubmit=async event=>{
  event.preventDefault();const button=event.target.querySelector('button');button.disabled=true;notify();
  try{const {email,password}=Object.fromEntries(new FormData(event.target));const {error}=await client.auth.signInWithPassword({email,password});if(error)throw error;$('#login-form [name=password]').value='';await authenticate();}catch(error){notify(error.message);}finally{button.disabled=false;}
};
client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')clearWorkspace();});
$('#logout').onclick=async()=>{
  const offline=command(client,'presence',null,{status:'offline'}).catch(()=>{});clearWorkspace();await offline;
  const {error}=await client.auth.signOut();notify(error?'Could not revoke the server session. Reconnect and sign out again.':'Signed out.');
};
async function refresh(){
  if(!profile)return;if(syncing){syncAgain=true;return;}syncing=true;
  const version=generation;
  try{
    const current=await command(client,'profile');if(version!==generation)return;
    if(!current){clearWorkspace();throw new Error('Staff access has been removed.');}
    const records=await command(client,'inbox',null,{search:$('#search').value.trim(),status:$('#filter').value,offset,limit:50});
    if(version!==generation)return;items=records;renderInbox();if(selected)await loadThread(selected.id,version);
  }finally{syncing=false;if(syncAgain){syncAgain=false;refresh().catch(error=>notify(error.message));}}
}
function renderInbox(){
  const list=$('#inbox-list');list.replaceChildren();$('#inbox-count').textContent=`${items.length} enquiries · page ${offset/50+1}`;
  $('#previous').disabled=!offset;$('#next').disabled=items.length<50;
  if(!items.length){const p=document.createElement('p');p.className='inbox-empty muted';p.textContent='No conversations match this view.';list.append(p);}
  for(const item of items){
    const c=item.conversation;const button=document.createElement('button');button.className='inbox-item';button.setAttribute('aria-pressed',String(selected?.id===c.id));
    const name=document.createElement('strong');name.textContent=item.lead.customer_name;
    if(item.unread){const badge=document.createElement('b');badge.className='count';badge.textContent=item.unread;badge.setAttribute('aria-label',`${item.unread} unread`);name.append(badge);}
    const context=document.createElement('span');context.textContent=item.lead.package_title||item.lead.destination||'Travel enquiry';
    const preview=document.createElement('span');preview.textContent=(item.preview||'').slice(0,100);
    const stamp=document.createElement('small');stamp.textContent=`${c.status} · ${time(c.updated_at)}`;
    button.append(name,context,preview,stamp);button.onclick=()=>select(c);list.append(button);
  }
}
async function select(c){
  if(selected)drafts.set(selected.id,$('#reply').value);
  selected=c;messages=[];attempt=null;$('#reply').value=drafts.get(c.id)||'';$('#messages').replaceChildren();notify();renderInbox();
  try{await loadThread(c.id,generation);if(innerWidth<700)$('#thread-content').scrollIntoView({block:'start'});}catch(error){notify(error.message);}
}
async function loadThread(cid,version){
  const [records,thread,typing]=await Promise.all([rows(client.from('flyo_conversations').select('*,lead:flyo_enquiries(*)').eq('id',cid)),history(client,cid),rows(client.from('flyo_chat_typing').select('*').eq('conversation_id',cid).eq('sender_role','visitor').gt('expires_at',new Date().toISOString()))]);
  if(version!==generation||selected?.id!==cid||!profile)return;
  if(!records.length){selected=null;$('#thread-content').hidden=true;$('#empty').hidden=false;$('#messages').replaceChildren();$('#lead-details').replaceChildren();return;}
  selected=records[0];messages=chronological(thread);$('#thread-content').hidden=false;$('#empty').hidden=true;
  $('#customer').textContent=selected.lead.customer_name;$('#reference').textContent=`ENQUIRY ${cid.slice(0,8)}`;
  $('#trip-summary').textContent=[selected.lead.package_title,selected.lead.destination].filter(Boolean).join(' · ');$('#status').value=selected.status;
  const ended=['resolved','closed'].includes(selected.status);$('#reply-form').hidden=ended;$('#ended').hidden=!ended;
  const log=$('#messages'),atEnd=log.scrollHeight-log.scrollTop-log.clientHeight<80,keys=new Set([...log.children].map(node=>node.dataset.id));
  for(const message of messages){
    if(keys.has(message.id))continue;
    const article=document.createElement('article');article.className=`message ${message.sender_role}`;article.dataset.id=message.id;
    const name=document.createElement('strong');name.textContent=message.sender_role==='staff'?'Flyo travel team':selected.lead.customer_name;
    const body=document.createElement('p');body.textContent=message.body;article.append(name);
    if(message.package_context?.package_name){const about=document.createElement('p');about.className='message-context';about.textContent=`Regarding: ${message.package_context.package_name}`;article.append(about);}
    const stamp=document.createElement('time');stamp.dateTime=message.created_at;article.append(body,stamp);log.append(article);
  }
  for(const node of log.children){const message=messages.find(m=>m.id===node.dataset.id);if(message)node.querySelector('time').textContent=time(message.created_at)+(message.sender_role==='staff'?` · ${message.created_at<=selected.visitor_read_at?'Read by visitor':'Saved'}`:'');}
  if(atEnd)log.scrollTop=log.scrollHeight;$('#typing').textContent=typing.length?'The traveller is typing…':'';
  const lead=selected.lead,fields={'Phone / WhatsApp':lead.phone,Email:lead.email,Package:lead.package_title,'Package page':lead.package_url,Destination:lead.destination,'Travel dates':lead.travel_date,Travellers:lead.travellers,'Enquiry source':lead.source_url,'Created':time(lead.created_at),'Contact consent':lead.consent_at?time(lead.consent_at):'Not recorded'};
  $('#lead-details').replaceChildren();for(const [label,value] of Object.entries(fields)){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value||'Not provided';$('#lead-details').append(dt,dd);}
  if(document.visibilityState==='visible'&&atEnd&&messages.length&&readUpTo.get(cid)!==messages.at(-1).id){
    await command(client,'read',cid,{message_id:messages.at(-1).id});readUpTo.set(cid,messages.at(-1).id);
  }
}
$('#status').onchange=async event=>{const cid=selected?.id;if(!cid)return;event.target.disabled=true;try{await command(client,'status',cid,{status:event.target.value});await refresh();notify('Conversation status saved.');}catch(error){notify(error.message);}finally{event.target.disabled=false;}};
$('#presence').onchange=async event=>{try{await command(client,'presence',null,{status:event.target.value});desiredPresence=event.target.value;notify();}catch(error){event.target.value=desiredPresence;notify(error.message);}};
$('#search').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{offset=0;refresh().catch(error=>notify(error.message));},250);};
$('#filter').onchange=()=>{offset=0;refresh().catch(error=>notify(error.message));};
$('#previous').onclick=()=>{offset=Math.max(0,offset-50);refresh().catch(error=>notify(error.message));};
$('#next').onclick=()=>{offset+=50;refresh().catch(error=>notify(error.message));};
$('#reply').oninput=()=>{if(!selected||Date.now()-lastTyping<2500)return;lastTyping=Date.now();command(client,'typing',selected.id,{typing:!!$('#reply').value.trim()}).catch(()=>{});};
$('#reply-form').onsubmit=async event=>{
  event.preventDefault();const cid=selected?.id,body=$('#reply').value.trim();if(!cid||!body)return;
  const button=event.target.querySelector('button');button.disabled=true;notify();
  if(!attempt||attempt.body!==body||attempt.cid!==cid)attempt={cid,body,message_id:crypto.randomUUID()};
  const sending=attempt,version=generation;
  try{await command(client,'send',cid,{body,message_id:sending.message_id});if(version!==generation)return;
    drafts.delete(cid);if(selected?.id===cid){$('#reply').value='';attempt=null;}command(client,'typing',cid,{typing:false}).catch(()=>{});await refresh();notify('Reply saved.');
  }catch(error){notify(`Reply not confirmed: ${error.message} Your text is kept here; retry to confirm.`);}finally{button.disabled=false;}
};
$('#messages').onscroll=()=>{if($('#messages').scrollHeight-$('#messages').scrollTop-$('#messages').clientHeight<30)refresh().catch(()=>{});};
async function heartbeat(){if(!profile)return;try{await command(client,'presence',null,{status:desiredPresence==='online'&&document.visibilityState!=='visible'?'away':desiredPresence});await refresh();}catch(error){notify(`Connection interrupted: ${error.message}`);}}
setInterval(heartbeat,25000);setInterval(()=>{if(profile)refresh().catch(()=>{});},8000);
document.addEventListener('visibilitychange',heartbeat);window.addEventListener('online',heartbeat);
window.addEventListener('offline',()=>notify('You are offline. Reconnect, then retry any unconfirmed reply.'));
authenticate().catch(error=>notify(`Unable to open the inbox: ${error.message}`));
