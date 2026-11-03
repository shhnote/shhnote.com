---
title: "암호화 수명 주기의 모든 것"
description: "shhnote에서 내 데이터가 단계마다 어떻게 처리되는지, 사용하는 기본 요소와 매개변수, 신뢰 경계를 솔직한 한계와 함께 설명해요."
eyebrow: "보안 · 심층 설명"
intro: "내 데이터가 단계마다 어떻게 처리되는지 기본 요소, 매개변수, 신뢰 경계까지 정확하게 짚어 봐요. 단계마다 쉬운 말로 된 요약이 먼저 나오니, 원하는 깊이만큼 읽으면 돼요."
wide: true
depth: detailed
---

<section class="section">
<div class="container">
<div class="explainer">
  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">01단계 · 암호화</p>
      <h3>시크릿은 내 기기에서 봉인돼요</h3>
      <p class="plain"><b>쉽게 말하면:</b> 데이터를 뒤섞는 작업은 무엇이든 업로드되기 전에 브라우저에서 이루어져요. 저희가 받는 건 이미 읽을 수 없는 상태예요.</p>
    </div>
    <div class="explainer__detail">
      <p><b>암호화</b>를 누르면 브라우저가 WebCrypto CSPRNG에서 새 256비트 콘텐츠 키를 뽑아 <b>AES-256-GCM</b>으로 데이터를 암호화해요. GCM은 인증 암호화 방식이에요. 모든 청크에 128비트 태그가 붙어 있어서, 나중에 변조되면 조용히 복호화되는 대신 변조 사실이 탐지돼요.</p>
      <p>텍스트와 파일은 똑같이 처리돼요. 둘 다 하나의 불투명한 바이너리 데이터가 되고, 표준 크기로 패딩되어 짧은 비밀번호와 작은 파일이 똑같아 보여요. 평문은 절대 네트워크에 닿지 않고, 탭의 메모리를 벗어나지 않아요.</p>
      <div class="spec-list">
        <div><span class="k">암호</span><span class="v">AES-256-GCM, 64 KiB 청크</span></div>
        <div><span class="k">콘텐츠 키</span><span class="v">256비트, 시크릿마다 새로 생성</span></div>
        <div><span class="k">논스</span><span class="v">7바이트 무작위 접두사 + 카운터</span></div>
        <div><span class="k">인증 태그</span><span class="v">청크당 128비트</span></div>
        <div><span class="k">패딩</span><span class="v">Padmé, 최소 64 KiB</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">02단계 · 키 보관</p>
      <h3>키는 저희 서버가 아니라 링크에 숨어 있어요</h3>
      <p class="plain"><b>쉽게 말하면:</b> 링크에서 <span class="color-accent">#</span> 뒷부분에 키가 들어 있고, 브라우저는 그 부분을 어떤 서버에도 보내지 않아요.</p>
    </div>
    <div class="explainer__detail">
      <p>링크에는 무작위 256비트 <b>시드</b>가 URL <b>프래그먼트</b>에 들어 있어요. 프래그먼트란 <span class="color-accent">#</span> 뒤의 모든 부분을 말해요. URL 명세에 따라 브라우저는 프래그먼트를 떼어 내고, 저희 서버로 보내는 <b>요청에 절대 포함하지 않아요</b>. 브라우저는 이 시드에서 HKDF로 시크릿을 찾는 조회 값과 콘텐츠 키를 풀어 주는 키를 유도해요. 서버가 보는 건 조회 값의 해시뿐이에요.</p>
      <p>받는 사람의 브라우저는 프래그먼트에서 시드를 읽고 로컬에서 똑같이 유도해요. 이것이 여기서 말하는 “제로 지식”의 의미예요. 링크 없이 암호문만 가지고서는 아무 쓸모가 없어요.</p>
      <div class="spec-list">
        <div><span class="k">키 위치</span><span class="v">URL 프래그먼트 #</span></div>
        <div><span class="k">서버로 전송?</span><span class="v">절대 안 함</span></div>
        <div><span class="k">시드</span><span class="v">무작위 32바이트, base64url</span></div>
        <div><span class="k">유도</span><span class="v">HKDF-SHA-256</span></div>
        <div><span class="k">서버 저장 정보</span><span class="v">SHA-256(조회 값)만</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">03단계 · 선택 사항: 암호 문구</p>
      <h3>사람만 아는 두 번째 잠금</h3>
      <p class="plain"><b>쉽게 말하면:</b> 암호 문구를 추가하면 전체 링크를 가진 사람도 암호 문구 없이는 시크릿을 열 수 없어요.</p>
    </div>
    <div class="explainer__detail">
      <p>암호 문구를 설정하면 메모리 하드 키 유도 함수인 <b>Argon2id</b>로 강화한 뒤, 시드와 결합해 콘텐츠 키를 감싸는 키를 만들어요. 암호 문구 자체는 절대 전송되거나 저장되지 않아요. 나와 받는 사람만 알고 있어요. 틀린 추측은 받는 사람의 브라우저가 이미 가진 데이터로 다시 시도되므로, 서버는 시도 횟수를 셀 수 없어요.</p>
      <p>메모리 하드 특성 덕분에 GPU나 ASIC을 쓰더라도 대규모 오프라인 추측은 비용이 많이 들어요. 암호 문구를 링크와 <b>다른 경로</b>로 전달하면 두 요소가 한곳에서 만나는 일이 없어요. Argon2 모듈은 시크릿을 만들거나 열 때마다 항상 불러오므로, 네트워크에서는 어떤 시크릿이 암호 문구를 쓰는지 알 수 없어요.</p>
      <div class="spec-list">
        <div><span class="k">KDF</span><span class="v">Argon2id</span></div>
        <div><span class="k">솔트</span><span class="v">무작위 128비트</span></div>
        <div><span class="k">키 래핑</span><span class="v">AES-256-GCM, 96비트 IV</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">04단계 · 전송 &amp; 저장</p>
      <h3>내 기기를 떠나는 건 암호문뿐이에요</h3>
      <p class="plain"><b>쉽게 말하면:</b> 저희는 잠긴 상자와 만료 시각만 저장해요. 그 외에는 아무것도 없어요. 평문도, 키도, 나에 대한 기록도 없어요.</p>
    </div>
    <div class="explainer__detail">
      <p>데이터는 <b>TLS</b>로 업로드되고, 해시된 자격 증명, 유효 방식, 반올림된 만료 시각과 함께 암호문 상태로 저장돼요. 보낸 사람의 신원, 받는 사람, IP 로그, 생성 시각, 접근 기록은 의도적으로 <b>전혀</b> 보관하지 않아요. 시크릿을 사람과 연결할 계정 시스템도 없어요. 속도 제한은 주기적으로 바뀌는 솔트를 사용한 주소의 HMAC으로 작동하므로, 솔트가 바뀌기 전과 후의 정보는 서로 연결할 수 없어요.</p>
      <p>저장된 데이터는 프래그먼트에 든 시드 없이는 의미가 없으므로, 서버가 침해되거나 법원 제출 명령을 받더라도 나오는 건 되돌릴 수 없는 불투명한 바이트와 해시뿐이에요.</p>
      <div class="spec-list">
        <div><span class="k">전송 중</span><span class="v">TLS</span></div>
        <div><span class="k">저장 시</span><span class="v">암호문 + 해시된 키 + 만료 시각</span></div>
        <div><span class="k">로그</span><span class="v">시크릿별 로그 없음</span></div>
      </div>
    </div>
  </div>

  <div class="explainer__row">
    <div class="explainer__aside">
      <p class="eyebrow">05단계 · 열람 &amp; 파기</p>
      <h3>먼저 읽은 사람만, 그다음엔 삭제</h3>
      <p class="plain"><b>쉽게 말하면:</b> 1회용 링크를 열면 상자를 한 번 건네주고 서버의 사본을 삭제해요. 언제든 직접 파기할 수도 있어요.</p>
    </div>
    <div class="explainer__detail">
      <p>열람 페이지가 로드될 때는 아무것도 가져오지 않아요. 요청은 실제 클릭이나 키 입력이 있을 때만 전송되므로, 링크 스캐너나 채팅 미리보기가 시크릿을 소진할 수 없어요. 1회용 시크릿의 경우 서버는 단일 조건부 업데이트로 행을 <b>점유</b>해요. 정확히 하나의 요청만 성공하고, 그 순간부터 시크릿은 소진된 것으로 간주돼요. 연결이 끊기면 같은 브라우저에서 15분 동안 다시 다운로드할 수 있어요. 다른 사람은 그럴 수 없고, 확인되지 않은 점유는 되돌려지지 않고 파기돼요. 기한제 시크릿은 만료될 때까지 일반적인 읽기로 처리돼요.</p>
      <p>모든 시크릿에는 비공개 <b>파기 링크</b>도 있어요. 링크를 여는 것만으로는 아무것도 파기되지 않아요. 확인하면 받는 사람이 읽기 전에 암호문이 즉시 삭제돼요.</p>
      <div class="spec-list">
        <div><span class="k">1회 열람</span><span class="v">원자적 점유 후 파기</span></div>
        <div><span class="k">재다운로드 허용 시간</span><span class="v">15분, 같은 클라이언트만</span></div>
        <div><span class="k">만료</span><span class="v">15분 – 14일</span></div>
        <div><span class="k">소유자 관리</span><span class="v">파기 링크</span></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">위협 모델</p>
  <h2 class="section__heading">shhnote가 볼 수 있는 것과 없는 것</h2>
  <p class="section__intro">솔직하게 말씀드릴게요. 신뢰 경계가 정확히 어디에 있는지 알려 드려요.</p>
</header>

<div class="bordered-cells bordered-cells--stack">
  <div class="cell">
    <p class="eyebrow eyebrow--danger">내 기기를 절대 떠나지 않음</p>
    <h3>저희가 볼 수 없는 것</h3>
    <p>평문 · 콘텐츠 키와 시드 · 암호 문구 · 암호 문구 설정 여부 · 시크릿을 만들거나 연 사람 · 생성 시각 · IP 수준의 접근 로그. 이 중 어떤 것도 전송되거나 보관되지 않아요.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">저희 서버에 저장됨</p>
    <h3>저희가 보관하는 것</h3>
    <p>저희가 열 수 없는 암호화된 데이터 · 패딩된 크기 등급 · 브라우저가 시크릿을 찾거나 파기하는 데 쓰는 값의 단방향 해시 · 1회용인지 기한제인지 여부 · 반올림된 만료 시각. 모두 링크에 든 시드 없이는 쓸모가 없어요.</p>
  </div>
  <div class="cell">
    <p class="eyebrow">알아 두면 좋은 점</p>
    <h3>솔직한 한계</h3>
    <p>전체 링크(설정했다면 암호 문구까지)를 가진 사람은 누구나 1회용 시크릿을 읽을 수 있어요. 링크 자체를 시크릿처럼 다루세요. 시크릿이 표시된 뒤 페이지를 떠나면 페이지가 지울 수 있는 만큼 덮어쓰지만, JavaScript로는 이를 보장할 수 없어요. 다 봤다면 탭을 닫으세요. 실제 입력을 주입하는 자동화된 브라우저는 사람처럼 1회용 시크릿을 열 수 있어요. 그러면 받는 사람은 아무것도 찾지 못하는데, 이것이 솔직한 결과예요. 시크릿을 삭제하면 레코드는 제거되지만, 암호화된 잔여 데이터가 덮어쓰일 때까지 저널, 디스크 여유 공간, 백업에 키 없는 암호문으로 남아 있을 수 있어요. 데이터베이스 외부에 저장된 큰 시크릿에는 파일이 기록된 시각이 남아요. 그리고 모든 웹 앱이 그렇듯, 브라우저로 전달되는 코드를 신뢰해야 해요. 그래서 shhnote는 오픈 소스이며 셀프 호스팅이 가능해요.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">암호 명세</p>
  <h2 class="section__heading">모든 기본 요소를 한곳에</h2>
</header>

<div class="spec-sheet">
  <div class="spec">
    <p class="eyebrow">암호화</p>
    <div class="spec__val">AES-256-GCM</div>
    <p>64 KiB 청크 단위의 인증된 대칭 암호화예요. 256비트 키와 청크마다 붙는 무결성 태그 덕분에, 변조나 잘림이 생기면 단순히 읽을 수 없게 되는 게 아니라 탐지돼요.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">키 유도</p>
    <div class="spec__val">HKDF · Argon2id</div>
    <p>키와 식별자는 HKDF-SHA-256으로 시드에서 유도돼요. 선택 사항인 암호 문구는 메모리 하드 KDF로 강화되어, 전용 하드웨어를 쓰더라도 오프라인 무차별 대입이 느리고 비용이 많이 들어요.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">난수</p>
    <div class="spec__val">WebCrypto CSPRNG</div>
    <p>시드, 키, 솔트, 논스는 브라우저의 암호학적으로 안전한 생성기에서 만들어져요. <span class="color-faint">Math.random()</span>은 절대 쓰지 않으며, 예측할 수 없어요.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">키 보관</p>
    <div class="spec__val">URL 프래그먼트&nbsp;#</div>
    <p>시드는 링크의 # 뒤에 붙어 다녀요. 브라우저는 프래그먼트를 절대 전송하지 않으므로, 시드는 저희 서버에 절대 도달하지 않아요.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">전송 중</p>
    <div class="spec__val">TLS</div>
    <p>내 기기를 떠나는 건 최신 TLS로 전송되는 암호문뿐이에요. 저희가 받는 건 열 수 없는 불투명한 데이터예요.</p>
  </div>
  <div class="spec">
    <p class="eyebrow">저장 시</p>
    <div class="spec__val">암호문 + 해시</div>
    <p>저희는 암호화된 데이터, 자격 증명의 단방향 해시, 반올림된 만료 시각만 저장해요. 평문도, 키도, 보낸 사람이나 받는 사람의 메타데이터도 없어요.</p>
  </div>
</div>
</div>
</section>

<section class="section">
<div class="container">
<header class="section__header-group">
  <p class="eyebrow">기술 FAQ</p>
  <h2 class="section__heading">보안에 관심 많은 분들을 위해</h2>
</header>

<div class="faq">
  <details open>
    <summary>동시 요청 경쟁 상황에서 1회 열람은 어떻게 보장되나요?</summary>
    <p>열람 시 행을 “active”에서 “claimed”로 바꾸는 단일 조건부 업데이트가 실행돼요. 동시에 들어온 두 요청이 모두 성공할 수는 없어요. 두 번째 요청은 이미 점유된 레코드를 보게 되고, 다른 누구와도 똑같은 “시크릿 없음” 응답을 받아요. 점유는 절대 되돌려지지 않아요. 다운로드가 실패하면 점유 토큰을 가진 쪽이 허용 시간 안에 다시 다운로드할 수 있고, 그렇지 않으면 시크릿은 읽히지 않은 채 파기돼요.</p>
  </details>
  <details>
    <summary>왜 쿼리 매개변수 대신 URL 프래그먼트를 쓰나요?</summary>
    <p>쿼리 매개변수는 서버로 전송되어 접근 로그, 프록시, 분석 도구에 남아요. 프래그먼트(<span class="color-accent">#</span> 뒷부분)는 URL 명세상 클라이언트 쪽에만 머물도록 정의되어 있어서, 브라우저가 HTTP 요청에 절대 포함하지 않아요. 이 특성이 제로 지식 설계의 기반이에요. 열람 후에는 페이지가 주소창과 방문 기록에서도 프래그먼트를 지워요.</p>
  </details>
  <details>
    <summary>링크 스캐너가 1회용 시크릿을 먼저 소진하지 못하게 하는 방법은요?</summary>
    <p>열람 페이지는 모든 시크릿에 대해 똑같은 정적 문서이며, 로드될 때 아무것도 가져오지 않아요. 요청은 사용자가 실제로 클릭하거나 키를 눌렀을 때만 전송돼요. 스크립트로 실행한 <code>click()</code>이나 양식 제출은 해당되지 않아요. 자동 스캐너(이메일 보안, 채팅 링크 미리보기, 백신 프로그램)는 그 정적인 껍데기만 불러올 뿐이에요.</p>
  </details>
  <details>
    <summary>직접 검증하거나 셀프 호스팅할 수 있나요?</summary>
    <p>네. 전체 소스는 AGPLv3로 공개되어 있고, 프로토콜은 어떤 구현이든 스스로 검증할 수 있는 적합성 테스트 벡터와 함께 명세로 문서화되어 있으며, 셀프 호스팅 가이드도 있어요. 클라이언트 쪽 암호 코드를 직접 감사하고 자신만의 인스턴스를 운영하면, 신뢰 경계를 온전히 직접 관리할 수 있어요.</p>
  </details>
  <details>
    <summary>악용 방지를 위해 기록하는 것이 있나요?</summary>
    <p>시크릿별 접근 로그나 IP 기록은 남기지 않아요. 속도 제한은 주기적으로 바뀌는 솔트를 사용한 주소의 키 해시로 이루어지며, 솔트가 바뀔 때 모든 카운터도 함께 초기화돼요. 악용 신고는 하루 단위로 건수만 집계하며, 어떤 시크릿이 신고되었는지는 기록하지 않아요.</p>
  </details>
</div>
</div>
</section>

<section class="section">
<div class="container">
<div class="prose">

## 안전하게 공유하는 팁

- 암호 문구는 링크와 다른 방법으로 보내세요. 예를 들어 링크는 이메일로, 암호 문구는 전화로 알려 주세요.
- 필요한 만큼만 가장 짧은 만료 시간을 고르세요.
- 비밀번호처럼 딱 한 번만 읽어야 하는 정보에는 1회용 시크릿을 사용하세요.

<h2 id="reporting-a-vulnerability">취약점 신고</h2>

이 사이트에서 보안 문제를 발견했다고 생각되면, 다른 사람에게 알리기 전에 [security@shhnote.com](mailto:security@shhnote.com)으로 먼저 비공개로 알려 주세요. 발견한 내용과 재현 방법을 함께 적어 주세요.

저희는 다음을 약속해요.

- [number]영업일 이내에 답변해요.
- 수정하는 동안 진행 상황을 계속 알려 드려요.
- 원하시면 수정 사항을 공개할 때 발견자로 이름을 밝혀 드려요.

테스트하는 동안 다른 사람의 데이터에 접근하거나, 서비스를 방해하거나, 큰 부하를 주는 자동 스캔을 실행하지 마세요.

shhnote 소프트웨어 자체의 취약점은 [프로젝트 보안 정책](https://github.com/shhnote/shhnote/security)을 참고하세요.

<p class="btn-row btn-row--center"><a href="/ko/#create" class="btn btn--primary"><span>시크릿 만들기</span></a> <a href="https://github.com/shhnote/shhnote" target="_blank" rel="noopener" class="btn btn--ghost"><span>GitHub에서 소스 보기</span></a></p>

</div>
</div>
</section>
