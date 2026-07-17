const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const toast = document.querySelector('.toast');

const fallbackPrograms = [{"id": "cad", "name": "CAD 업무센터", "icon": "📐", "category": "CAD", "status": "출시 준비", "featured": true, "description": "토목·측량·설계 반복 작업을 빠르고 안정적으로 자동화합니다.", "features": ["도면 작업 자동화", "전문 기능센터 연결", "반복 작업 시간 단축"], "keywords": ["캐드", "cad", "토목", "측량", "설계", "리습"]}, {"id": "capture", "name": "캡처센터", "icon": "📸", "category": "CAPTURE", "status": "출시 준비", "featured": false, "description": "영역 캡처, 스크롤 캡처, OCR, 화면 녹화를 한곳에서 처리합니다.", "features": ["영역·스크롤 캡처", "문자 인식 OCR", "화면 녹화"], "keywords": ["캡처", "스크롤", "ocr", "녹화", "화면"]}, {"id": "image", "name": "이미지센터", "icon": "🖼️", "category": "IMAGE", "status": "출시 준비", "featured": false, "description": "많은 이미지를 한 번에 자르고, 변환하고, 정리할 수 있습니다.", "features": ["일괄 자르기·변환", "워터마크·파일명 정리", "PDF 변환"], "keywords": ["이미지", "사진", "워터마크", "pdf", "변환", "자르기"]}, {"id": "excel", "name": "엑셀센터", "icon": "📊", "category": "EXCEL", "status": "출시 준비", "featured": false, "description": "사진 삽입, 함수 계산, 표 정리, 보고서 작성까지 자동화합니다.", "features": ["사진 자동 배치", "함수·자료 정리", "보고서 자동 생성"], "keywords": ["엑셀", "excel", "사진", "함수", "보고서", "표"]}, {"id": "memo", "name": "메모센터", "icon": "📝", "category": "MEMO", "status": "출시 준비", "featured": false, "description": "빠른 메모와 업무 기록을 쉽고 편리하게 관리합니다.", "features": ["빠른 기록", "업무별 분류", "최근 작업 기억"], "keywords": ["메모", "기록", "업무", "노트"]}, {"id": "explorer", "name": "파일탐색기센터", "icon": "📁", "category": "FILE", "status": "개발 중", "featured": false, "description": "분할 탐색, 검색, 파일 정리 기능으로 Windows 파일 작업을 강화합니다.", "features": ["2·3·4분할 탐색", "빠른 검색", "파일 일괄 정리"], "keywords": ["파일", "탐색기", "검색", "폴더", "정리", "분할"]}, {"id": "business", "name": "업무지원센터", "icon": "🧰", "category": "WORK", "status": "개발 중", "featured": false, "description": "직장인과 사업자의 반복 사무업무를 한곳에서 지원합니다.", "features": ["업무별 도구 모음", "반복 작업 자동화", "센터 간 연결"], "keywords": ["업무", "자동화", "사무", "지원", "직장인"]}];
let allPrograms = [];
let currentFilter = 'ALL';

const savedTheme = localStorage.getItem('factoryOneTheme');
if (savedTheme === 'dark') body.classList.add('dark');

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('factoryOneTheme', body.classList.contains('dark') ? 'dark' : 'light');
});

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

document.addEventListener('click', event => {
  const target = event.target.closest('[data-toast]');
  if (target) showToast(target.dataset.toast);
});

document.querySelectorAll('.showcase-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const index = tab.dataset.slide;
    document.querySelectorAll('.showcase-tab').forEach(item => item.classList.toggle('active', item === tab));
    document.querySelectorAll('[data-slide-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.slidePanel === index));
  });
});

function programCard(program) {
  return `
    <article class="program-card ${program.featured ? 'featured' : ''}">
      <div class="program-icon">${program.icon}</div>
      ${program.featured ? '<span class="badge">핵심</span>' : ''}
      <span class="status-badge">${program.status}</span>
      <h3>${program.name}</h3>
      <p>${program.description}</p>
      <ul>${program.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
      <button class="card-button" data-toast="${program.name} 상세 페이지는 준비 중입니다.">자세히 보기</button>
    </article>`;
}

function renderPrograms() {
  const query = document.querySelector('#programSearch').value.trim().toLowerCase();
  const filtered = allPrograms.filter(program => {
    const filterMatch = currentFilter === 'ALL' || program.category === currentFilter;
    const haystack = [program.name, program.description, program.category, ...program.features, ...program.keywords].join(' ').toLowerCase();
    return filterMatch && (!query || haystack.includes(query));
  });

  document.querySelector('#programGrid').innerHTML = filtered.map(programCard).join('');
  document.querySelector('#noPrograms').hidden = filtered.length > 0;
}

document.querySelector('#programSearch').addEventListener('input', renderPrograms);
document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach(item => item.classList.toggle('active', item === button));
    renderPrograms();
  });
});

async function loadPrograms() {
  try {
    const response = await fetch('programs.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('programs.json load failed');
    allPrograms = await response.json();
  } catch (error) {
    // index.html을 파일로 직접 열면 브라우저 보안정책 때문에 JSON 읽기가 차단될 수 있어 내장 데이터를 사용합니다.
    allPrograms = fallbackPrograms;
  }
  renderPrograms();
}

loadPrograms();
