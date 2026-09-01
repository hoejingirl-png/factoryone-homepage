Factory One V4 B RC39 - Traffic Measurement Ready

이번 단계
검색 유입 이후 실제 행동을 측정할 수 있도록 사이트 전체에 GA4 이벤트 추적 구조를 준비했습니다.

자동 이벤트
- tool_action: 도구 버튼 실행
- tool_file_select: 이미지/PDF 파일 선택
- site_search: 내부 도구 검색어
- tool_search_result_click: 검색 결과 클릭
- related_tool_click: 연관 도구 이동
- download_click: 프로그램/LISP/파일 다운로드
- purchase_inquiry_click: 카카오 구매문의 클릭

현재 GA4 측정 ID가 없으므로 기본 enabled=false입니다.
Google Analytics에서 G-XXXXXXXXXX ID를 발급받은 뒤
data/site-config.json의 ga4MeasurementId를 입력하고 enabled=true로 바꾸면 됩니다.

로컬 테스트
/admin/traffic-diagnostics.html
localhost에서는 최근 이벤트를 sessionStorage에 기록하므로 GA4 연결 전에도 추적 동작을 검사할 수 있습니다.

Search Console / Naver Search Advisor
- 검색어/노출/클릭: 각 검색엔진 관리도구
- 사이트에 들어온 뒤 행동: GA4
소유권 확인 코드가 발급되면 다음 버전에 실제 HTML에 반영 가능합니다.

기존 RC38 기능/디자인/추천 이미지 수정 유지.
실행: START_FACTORYONE_RC39.bat
Port: 8049
