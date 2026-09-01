Factory One V4 B RC30 - Tool Discovery Engine

핵심 변경
1. 통합 도구 카탈로그 JSON
   - /data/tool-catalog.json
   - 52개 실제 도구 등록
   - title / center / url / image / description / aliases / keywords / related
   - 앞으로 신규 도구는 catalog 항목 추가로 검색/추천 시스템에 연결 가능

2. TOOLS 메인 검색 개편
   - 기존 센터 카드 단순 문자열 필터 제거
   - 개별 도구 검색 결과를 점수순으로 표시
   - 대표 컬러 이미지 + 센터 + 도구명 + 설명 + 바로 실행
   - 최대 8개 추천
   - 제목 / 별칭 / 작업 키워드 / 설명 / 센터 통합 검색

3. 자연어·별칭 검색
   예시:
   - 사진 100kb -> 이미지 용량 줄이기
   - 대출 이자 -> 대출이자 계산기
   - 1:100 -> 도면 축척 계산기
   - 중복줄 삭제 -> 중복 줄 제거기
   - 부과세 -> 부가세 계산기
   - 피디에프 합치기 -> PDF 합치기
   - 엔빵 -> 더치페이
   - 루베 -> 콘크리트 물량

4. 자동 관련도구 연결
   - 52개 실제 도구 페이지에 discovery script 연결
   - catalog의 related ID를 읽어 관련 작업 3개 자동 표시
   - 개별 HTML에 관련도구를 매번 수동 추가할 필요 감소

5. 기존 기능 유지
   - RC29 단위/텍스트
   - RC28 금융/생활/쇼핑
   - RC27 PDF/이미지
   - RC26 급여/사업/CAD
   - 기존 프로그램/LISP/APPS/GAMES 유지

실행
START_FACTORYONE_RC30.bat
http://127.0.0.1:8040/tools/
