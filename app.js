import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
const $ = id => document.getElementById(id);
const cfg = window.TEACHER_CIRCLE;
const client = cfg.supabaseUrl && cfg.supabaseKey ? createClient(cfg.supabaseUrl, cfg.supabaseKey) : null;
let user, rows = [], own, isHost = false;
const fields = ['name','role','mood','superpower','outside','wish'];
function status(message) { $('status').textContent = message; }
function show(id) { for (const part of ['login-view','answers-form','thanks']) $(part).hidden = part !== id; }
function ready() { if (client) return true; status('Email sign-in is not open yet. The host is finishing setup. Please come back soon.'); return false; }
async function busy(form, action) { const button = form.querySelector('button[type="submit"]'); button.disabled = true; status(''); try { await action(); } catch(error) { status(error.message || 'Something went wrong. Please try again.'); } finally { button.disabled = false; } }
$('login-form').addEventListener('submit', e => { e.preventDefault(); if (!ready()) return; busy(e.target, async () => { const {error} = await client.auth.signInWithOtp({email:$('email').value.trim(),options:{emailRedirectTo:location.origin + location.pathname}}); if(error) throw error; status('Check your inbox for your secure sign-in link. You can close this page and return through the email.'); }); });
async function loadSession() {
 if(!client) return;
 const {data:{session},error} = await client.auth.getSession(); if(error) throw error;
 user=session?.user; $('logout').hidden=!user;
 if(!user) { isHost=false; rows=[]; $('results').replaceChildren(); $('dashboard').hidden=true; show('login-view'); return; }
 const host = await client.from('host_accounts').select('user_id').eq('user_id',user.id); if(host.error) throw host.error;
 isHost=host.data.length>0;
 const response=await client.from('responses').select('*').eq('user_id',user.id).maybeSingle(); if(response.error) throw response.error;
 own=response.data; fields.forEach(k=>$(k).value=own?.[k]||''); show(own?'thanks':'answers-form');
 if(isHost) await dashboard();
}
$('answers-form').addEventListener('submit',e=>{e.preventDefault(); if(!ready()||!user)return; busy(e.target,async()=>{
 const entry=Object.fromEntries(fields.map(k=>[k,$(k).value.trim()])); if(fields.some(k=>!entry[k])) throw new Error('Please complete each question.');
 const {error}=await client.from('responses').upsert({...entry,user_id:user.id,email:user.email,updated_at:new Date().toISOString()},{onConflict:'user_id'}); if(error)throw error;
 own=entry; show('thanks'); if(isHost) await dashboard();
});});
$('edit').onclick=()=>{status('');show('answers-form');};
$('logout').onclick=async()=>{const {error}=await client.auth.signOut();if(error)status(error.message);else await loadSession();};
$('host').onclick=async()=>{if(!ready()){$('join').scrollIntoView();return;}if(!user){status('Sign in with your host email to open your private dashboard.');$('join').scrollIntoView();return;}if(!isHost){status('This account does not have host access.');$('join').scrollIntoView();return;}try{await dashboard();$('dashboard').scrollIntoView();}catch(error){status(error.message);}};
async function dashboard(){
 if(!isHost) return;
 const {data,error}=await client.from('responses').select('*').order('updated_at',{ascending:false}).limit(1000);if(error)throw error;
 rows=data;$('dashboard').hidden=false;$('count').textContent=`${rows.length} response${rows.length===1?'':'s'}${rows.length===1000?' (showing the latest 1,000)':''} · Visible only to the host`;render();
}
function element(tag,text){const node=document.createElement(tag);node.textContent=text;return node;}
function render(){const query=$('search').value.toLowerCase(); const list=rows.filter(row=>[row.email,...fields.map(k=>row[k])].join(' ').toLowerCase().includes(query));$('results').replaceChildren();for(const row of list){const card=element('article','');card.className='response';card.append(element('h3',row.name),element('small',`${row.email} · ${row.role}`));for(const [key,title] of [['mood','Arriving with'],['superpower','Teaching superpower'],['outside','Beyond the classroom'],['wish','Would love to learn']])card.append(element('strong',title),element('p',row[key]));card.append(element('small',`Updated ${new Date(row.updated_at).toLocaleString()}`));$('results').append(card);}if(!list.length)$('results').append(element('p',rows.length?'No matching responses.':'Your circle is ready. Responses will appear here after teachers submit.'));}
$('search').oninput=render;$('refresh').onclick=()=>dashboard().catch(e=>status(e.message));
if(client){loadSession().catch(e=>status(e.message));client.auth.onAuthStateChange(()=>{setTimeout(()=>loadSession().catch(e=>status(e.message)),0);});}
