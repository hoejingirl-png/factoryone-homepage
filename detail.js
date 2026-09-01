const qs=new URLSearchParams(location.search),id=qs.get('id'),typeText={program:'프로그램',lisp:'LISP',app:'앱'};function moneyText(i){return i.priceType==='free'?'무료':'₩'+Number(i.price||0).toLocaleString('ko-KR')}function listBlock(t,l){if(!Array.isArray(l)||!l.length)return'';return`<section class="block"><h2>${t}</h2><ul>${l.map(x=>`<li>${x}</li>`).join('')}</ul></section>`}async function boot(){const r=await fetch('data/catalog.json'),d=await r.json(),i=d.items.find(x=>x.id===id);if(!i){document.getElementById('detail').innerHTML='<div class="empty">항목을 찾을 수 없습니다.</div>';return}document.title=i.title+' | Factory One';let button='';if(i.priceType==='free'&&i.downloadUrl)button=`<a class="btn" href="${i.downloadUrl}">무료 다운로드</a>`;if(i.priceType==='paid'&&(i.type==='program'||i.type==='lisp')){
 const contact=d.site&&d.site.salesContact?d.site.salesContact:null;
 const url=(contact&&contact.url)||i.purchaseUrl;
 const label=(contact&&contact.label)||'구매 문의';
 if(url)button=`<a class="btn kakaoInquiry" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}const command=i.type==='lisp'&&i.command?`<span class="metaPill">명령어 ${i.command}</span>`:'',cad=i.type==='lisp'&&i.cadVersions?`<span class="metaPill">AutoCAD ${i.cadVersions.join(' · ')}</span>`:'',video=i.videoUrl?`<section class="block"><h2>사용 영상</h2><p><a href="${i.videoUrl}" target="_blank">영상 보기 →</a></p></section>`:'',gallery=(i.screenshots||[]).length?`<section class="block productGalleryBlock"><div class="galleryHead"><div><h2>실제 사용 화면</h2><p>제품의 실제 인터페이스를 확인해보세요.</p></div><span>${i.screenshots.length}장</span></div><div class="productGallery">${i.screenshots.map((s,idx)=>`<figure class="galleryItem"><button type="button" class="galleryOpen" data-gallery-index="${idx}" aria-label="${s.alt||i.title+' 실제 화면'} 크게 보기"><img src="${s.src}" alt="${s.alt||i.title+' 실제 화면'}" loading="lazy"></button>${s.caption?`<figcaption>${s.caption}</figcaption>`:''}</figure>`).join('')}</div></section>`:'';faq=(i.faq||[]).length?`<section class="block"><h2>자주 묻는 질문</h2>${i.faq.map(f=>`<div class="faqItem"><b>${f.q}</b><p>${f.a}</p></div>`).join('')}</section>`:'';document.getElementById('detail').innerHTML=`<section class="detailHero"><div class="detailVisual">${i.coverImage?`<img src="${i.coverImage}" alt="${i.title} 대표 이미지">`:(i.cover||'ITEM')}</div><div class="detailInfo"><div style="font-size:12px;letter-spacing:.13em">${typeText[i.type]||i.type}</div><h1>${i.title}</h1><p class="summary">${i.summary||''}</p><div class="detailMeta"><span class="metaPill">${moneyText(i)}</span><span class="metaPill">${i.platform||''}</span>${i.version?`<span class="metaPill">버전 ${i.version}</span>`:''}${command}${cad}</div><div class="buy">${button}<a class="btn secondary" href="index.html">목록으로</a></div>${i.priceType==='paid'&&(i.type==='program'||i.type==='lisp')&&d.site?.salesContact?.notice?`<p class="purchaseNotice">${d.site.salesContact.notice}</p>`:''}</div></section><div class="blocks">${listBlock('주요 기능',i.features)}${gallery}${listBlock('설치 방법',i.install)}${listBlock('사용 방법',i.usage)}${video}${i.updated?`<section class="block"><h2>업데이트</h2><p>최근 업데이트 ${i.updated}</p></section>`:''}${faq}</div>`;setTimeout(()=>{
 const shots=i.screenshots||[];
 if(shots.length){
  document.querySelectorAll('.galleryOpen').forEach(btn=>btn.addEventListener('click',()=>{
   const idx=Number(btn.dataset.galleryIndex||0);
   const s=shots[idx];
   let modal=document.getElementById('productLightbox');
   if(!modal){
    modal=document.createElement('div');
    modal.id='productLightbox';
    modal.className='productLightbox';
    modal.innerHTML='<button class="lightboxClose" aria-label="닫기">×</button><div class="lightboxInner"><img alt=""><p></p></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal||e.target.classList.contains('lightboxClose'))modal.classList.remove('show')});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('show')});
   }
   const img=modal.querySelector('img'),cap=modal.querySelector('p');
   img.src=s.src; img.alt=s.alt||i.title+' 실제 화면'; cap.textContent=s.caption||'';
   modal.classList.add('show');
  }));
 }
},0)}boot().catch(()=>document.getElementById('detail').innerHTML='<div class="empty">START_LOCAL_SERVER.bat로 실행해 주세요.</div>');
// RC11 optional product media sections
setTimeout(()=>{
 const p=window.item||null;
},0);
