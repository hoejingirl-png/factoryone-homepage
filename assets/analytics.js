(()=>{
const RC='RC40',isLocal=/^(localhost|127\.0\.0\.1)$/.test(location.hostname),state={enabled:false,debug:false,queue:[]};
const clean=(v,m=120)=>String(v??'').replace(/\s+/g,' ').trim().slice(0,m);
function pageType(){const p=location.pathname;if(p.includes('/tools/'))return'tool';if(p.includes('/programs'))return'program_listing';if(p.includes('/lisp'))return'lisp_listing';if(p.includes('/apps'))return'app_listing';if(p.includes('/games'))return'game_listing';if(/detail\.html$/.test(p))return'product_detail';return p==='/'?'home':'page'}
function toolSlug(){const m=location.pathname.match(/\/tools\/(?:[^/]+\/)?([^/]+)\/?$/);return m?m[1]:''}
function localLog(n,p){if(!state.debug)return;const row={time:new Date().toISOString(),event:n,...p};try{const k='factoryone_rc40_events',a=JSON.parse(sessionStorage.getItem(k)||'[]');a.push(row);sessionStorage.setItem(k,JSON.stringify(a.slice(-200)))}catch(_){}console.info('[Factory One analytics]',n,p)}
function track(name,params={}){const p={page_type:pageType(),tool_slug:toolSlug(),page_title:clean(document.title,160),rc_version:RC,...params};localLog(name,p);if(state.enabled&&typeof gtag==='function')gtag('event',name,p);else{state.queue.push([name,p]);if(state.queue.length>50)state.queue.shift()}}
window.FactoryOneAnalytics={track,getLocalEvents(){try{return JSON.parse(sessionStorage.getItem('factoryone_rc40_events')||'[]')}catch(_){return[]}}};
function loadGA(id){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.appendChild(s);gtag('js',new Date());gtag('config',id,{send_page_view:true});state.enabled=true;while(state.queue.length){const [n,p]=state.queue.shift();gtag('event',n,p)}}
fetch('/data/site-config.json',{cache:'no-store'}).then(r=>r.json()).then(c=>{const a=c.analytics||{};state.debug=!!a.debugOnLocalhost&&isLocal;const id=clean(a.ga4MeasurementId,32);if(a.enabled&&/^G-[A-Z0-9]+$/i.test(id))loadGA(id)}).catch(()=>{state.debug=isLocal});
const label=el=>clean(el.getAttribute('aria-label')||el.dataset.analyticsLabel||el.textContent||el.value||el.name||el.id||el.tagName,100);
document.addEventListener('click',e=>{const el=e.target.closest('button,a,input[type="submit"]');if(!el)return;const l=label(el),href=el.tagName==='A'?clean(el.getAttribute('href')||'',240):'';
 if(el.classList.contains('kakaoInquiry')||/카카오.*구매|구매.*문의/.test(l))return track('purchase_inquiry_click',{action_label:l,destination:href});
 if(el.tagName==='A'&&(/다운로드/.test(l)||/\.(lsp|zip|exe|apk|pdf)(\?|$)/i.test(href)))return track('download_click',{action_label:l,destination:href});
 if(el.closest('.toolSearchResultCard'))return track('tool_search_result_click',{action_label:l,destination:href});
 if(el.closest('.relatedLinks,.relatedToolGrid,.autoRelated,[data-related]'))return track('related_tool_click',{action_label:l,destination:href});
 if(el.tagName==='BUTTON'&&!el.closest('nav,header'))track('tool_action',{action_label:l});
},true);
document.addEventListener('change',e=>{const el=e.target;if(el?.matches('input[type="file"]')){const fs=el.files||[];let total=0;for(const f of fs)total+=f.size||0;track('tool_file_select',{file_count:fs.length,total_bytes:total,control_label:label(el)})}},true);
let timer=0;document.addEventListener('input',e=>{const el=e.target;if(!el?.matches('input[type="search"],#toolSearch,#search,[data-tool-search]'))return;clearTimeout(timer);timer=setTimeout(()=>{const q=clean(el.value,80);if(q.length>=2)track('site_search',{search_term:q})},700)},true);
window.addEventListener('load',()=>{if(isLocal)setTimeout(()=>track('local_test_page_view',{local_test:true}),100)});
})();