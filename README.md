# UN 진상조사단 인터뷰 시스템

강원온라인학교 "국제 관계의 이해" 공개 수업용 아티팩트.
학생이 UN 진상조사관 역할로 분쟁 당사자 가상 페르소나를 인터뷰합니다.

## 환경변수 (필수)

Vercel 대시보드에서 다음 환경변수를 등록하세요.

- `ANTHROPIC_API_KEY` : Anthropic Console에서 발급받은 API 키

이 환경변수가 없으면 인터뷰 화면에서 응답을 받을 수 없습니다.

## 로컬 개발

```bash
npm install
npm run dev
```

`.env.local` 파일에 `ANTHROPIC_API_KEY=sk-ant-...` 입력 후 실행.

## 배포

GitHub 저장소를 Vercel에 연결하면 자동 배포됩니다.

## 비용

Claude Sonnet 4.5 사용. 학생 1명당 약 $0.10 예상.
9명 학급 1회 시연 약 $0.90 (1,260원).
