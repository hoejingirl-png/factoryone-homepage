
(()=>{
const CATALOG_URL='/data/tool-catalog.json';
const norm=s=>(s||'').toLocaleLowerCase('ko-KR').replace(/[·→\-_/:%()²³.,]/g,' ').replace(/\s+/g,' ').trim();
const compact=s=>norm(s).replace(/\s/g,'');
const corrections=[
 ['부과세','부가세'],['피디에프','pdf'],['pdf파일','pdf'],['사진줄이기','이미지 용량 줄이기'],
 ['사진용량','이미지 용량'],['사진크기','이미지 크기'],['큐알','qr'],['디데이','d day'],
 ['평방미터','제곱미터'],['m2','제곱미터'],['루베','콘크리트 m3'],['엔빵','더치페이'],['n빵','더치페이'],
 ['원리금','원리금균등'],['주휴','주휴수당'],['월급여','월급'],['글자 수','글자수'],['중복줄','중복 줄']
];
function expand(q){
 let out=norm(q);
 corrections.forEach(([a,b])=>{out=out.replaceAll(norm(a),norm(b))});
 return out;
}
function scoreTool(t,q){
 const nq=expand(q), cq=compact(nq);
 if(!nq)return 0;
 const title=norm(t.title), ct=compact(title);
 const aliases=(t.aliases||[]).map(norm), keys=(t.keywords||[]).map(norm);
 const desc=norm(t.desc), center=norm(t.center);
 let s=0;
 if(ct===cq)s+=120;
 if(title===nq)s+=120;
 if(ct.startsWith(cq)||title.startsWith(nq))s+=80;
 if(ct.includes(cq)||title.includes(nq))s+=62;
 aliases.forEach(a=>{const ca=compact(a);if(ca===cq)s+=95;else if(ca.includes(cq)||cq.includes(ca))s+=48;});
 keys.forEach(k=>{const ck=compact(k);if(ck===cq)s+=40;else if(ck.includes(cq)||cq.includes(ck))s+=20;});
 nq.split(' ').filter(Boolean).forEach(tok=>{
   const c=compact(tok);
   if(ct.includes(c))s+=18;
   if(aliases.some(a=>compact(a).includes(c)))s+=13;
   if(keys.some(k=>compact(k).includes(c)))s+=9;
   if(compact(desc).includes(c))s+=5;
   if(compact(center).includes(c))s+=4;
 });
 return s;
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function rootUrl(s){s=String(s||'');if(!s)return '#';if(/^(https?:|data:|blob:|\/)/i.test(s))return s;return '/'+s.replace(/^\.\//,'').replace(/^\/+/, '')}
async function getCatalog(){
 try{
   const r=await fetch(CATALOG_URL,{cache:'no-store'});
   if(!r.ok)throw new Error('catalog');
   return (await r.json()).tools||[];
 }catch(e){return []}
}
function resultCard(t,score){
 return `<a class="toolSearchResultCard" href="${esc(rootUrl(t.url))}">
  <div class="toolSearchThumb"><img src="${esc(rootUrl(t.image))}" alt=""></div>
  <div class="toolSearchInfo"><div class="toolSearchMeta">${esc(t.center)}<span>FREE</span></div><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p></div>
  <div class="toolSearchGo">바로 실행 →</div>
 </a>`;
}
async function initMain(){
 const input=document.getElementById('toolSearchInput');
 if(!input)return;
 const tools=await getCatalog();
 const host=document.getElementById('toolSearchResults');
 const count=document.getElementById('toolCatalogCount');
 if(count)count.textContent=`등록 도구 ${tools.length}개`;
 function render(){
   const q=input.value.trim();
   if(!host)return;
   if(!q){host.innerHTML='';host.hidden=true;return;}
   const ranked=tools.map(t=>[t,scoreTool(t,q)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,8);
   host.hidden=false;
   if(!ranked.length){
      host.innerHTML=`<div class="toolSearchNoResult"><b>“${esc(q)}”와 정확히 맞는 도구를 찾지 못했습니다.</b><span>PDF, 이미지, 급여, 날짜, 할인, 단위처럼 작업 목적을 짧게 입력해 보세요.</span></div>`;
      return;
   }
   host.innerHTML=`<div class="toolSearchResultHead"><div><b>검색 결과</b><span>${ranked.length}개 추천</span></div><small>제목·별칭·작업 키워드를 함께 검색합니다.</small></div><div class="toolSearchResultGrid">${ranked.map(x=>resultCard(x[0],x[1])).join('')}</div>`;
 }
 input.addEventListener('input',render);
 document.querySelector('.heroSearch button')?.addEventListener('click',()=>{render();host?.scrollIntoView({behavior:'smooth',block:'nearest'})});
 const params=new URLSearchParams(location.search);
 if(params.get('q')){input.value=params.get('q');render();}
 document.querySelectorAll('[data-tool-query]').forEach(el=>el.addEventListener('click',()=>{input.value=el.dataset.toolQuery;render();input.focus();}));
}
async function initRecommendations(){
 if(document.getElementById('toolSearchInput'))return;
 const main=document.querySelector('main');
 if(!main)return;
 const tools=await getCatalog();
 if(!tools.length)return;
 const path=location.pathname.replace(/index\.html$/,'').replace(/\/+/g,'/');
 const current=tools.find(t=>path.endsWith(t.url)||t.url.endsWith(path));
 if(!current)return;
 let rec=(current.related||[]).map(id=>tools.find(t=>t.id===id)).filter(Boolean);
 if(rec.length<3)rec=rec.concat(tools.filter(t=>t.center===current.center&&!rec.includes(t)&&t.id!==current.id)).slice(0,3);
 if(!rec.length)return;
 const section=document.createElement('section');
 section.className='autoToolRelated';
 section.innerHTML=`<div class="titleRow"><h2>이 작업과 연결되는 도구</h2><span>AUTO RECOMMEND</span></div><div class="autoToolRelatedGrid">${rec.slice(0,3).map(t=>`<a href="${esc(rootUrl(t.url))}"><img src="${esc(rootUrl(t.image))}" alt=""><div><small>${esc(t.center)}</small><b>${esc(t.title)}</b><span>${esc(t.desc)}</span></div></a>`).join('')}</div>`;
 const comments=main.querySelector('.commentsSection');
 if(comments)main.insertBefore(section,comments); else main.appendChild(section);
}
document.addEventListener('DOMContentLoaded',()=>{initMain();initRecommendations();});
})();
