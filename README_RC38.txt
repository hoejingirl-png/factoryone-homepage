Factory One V4 B RC38 - Related Tool Image Fix

수정 범위
- RC37 신규 도구에서 '이 작업과 연결되는 도구' 추천 카드의 깨진 이미지 경로 수정
- 신규 10개 도구의 catalog URL/image 경로를 루트 절대경로로 통일
- tool-discovery.js에서 앞으로 상대경로가 들어와도 자동으로 / 기준 경로로 보정
- 추천 카드 링크도 동일하게 루트 기준으로 보정

다른 기능/디자인은 변경하지 않음.

실행
START_FACTORYONE_RC38.bat
Port 8048
