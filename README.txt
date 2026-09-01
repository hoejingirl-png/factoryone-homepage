Factory One V4 B 데이터 엔진 03

이번 단계
- B 시안 디자인 유지
- data/catalog.json 하나로 프로그램/LISP/웹도구/게임/앱 관리
- 프로그램 및 LISP 무료/유료 자동 분류
- 프로그램/LISP 상세페이지 자동 생성
- LISP 명령어 및 AutoCAD 지원버전 표시
- 영상 URL이 비어 있으면 영상 섹션 자동 숨김
- 검색 및 필터 기본 동작
- GitHub Pages 배포 가능한 정적 구조

로컬 실행
1. START_LOCAL_SERVER.bat 실행
2. 브라우저에서 http://localhost:8000 접속

새 프로그램: catalog.json items에 type=program 항목 추가
새 LISP: type=lisp + command + cadVersions 추가
priceType은 free 또는 paid
