// ===== 1. 오늘 날짜 표시 =====

// 오늘 날짜와 시간 정보를 가진 Date 객체를 만들어요
const today = new Date();

// 날짜에서 연, 월, 일, 요일을 꺼내요
const year = today.getFullYear();        // 예: 2026
const month = today.getMonth() + 1;      // 월은 0부터 시작해서 +1을 해줘요
const day = today.getDate();             // 예: 6
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
const weekday = weekdays[today.getDay()]; // getDay()는 0(일)~6(토)

// HTML에서 id="today-date"인 요소를 찾아서 글자를 넣어요
const dateElement = document.getElementById("today-date");
dateElement.textContent = `${year}년 ${month}월 ${day}일 ${weekday}요일`;


// ===== 2. "태어난 시간을 몰라요" 체크박스 =====

// 필요한 요소들을 id로 찾아요
const timeUnknown = document.getElementById("time-unknown");
const ampmSelect = document.getElementById("birth-ampm");
const hourSelect = document.getElementById("birth-hour");
const minuteSelect = document.getElementById("birth-minute");

// 시간 선택칸 3개를 켜거나 끄는 함수예요
function updateTimeInputs() {
  // 체크되어 있으면 true, 아니면 false
  const isUnknown = timeUnknown.checked;

  // disabled가 true이면 선택할 수 없고, 흐리게 보여요 (CSS의 select:disabled)
  ampmSelect.disabled = isUnknown;
  hourSelect.disabled = isUnknown;
  minuteSelect.disabled = isUnknown;
}

// 체크박스가 바뀔 때마다 위 함수를 실행해요
timeUnknown.addEventListener("change", updateTimeInputs);


// ===== 3. 운세 로직 =====

// ---------- 3-1. 문구 목록 (여기에 문구를 더 추가하면 결과가 다양해져요) ----------
const fortuneData = {
  // 총운: 화면에는 "오늘 운세는 ___" 뒤에 이어서 나와요
  summaries: [
    "잔잔한 물결 같아. 서두르지 않아도 순서대로 잘 풀릴 거야.",
    "맑게 갠 아침 같아. 미뤄둔 일을 시작하기에 딱 좋은 날이야.",
    "따뜻한 차 한 잔 같아. 마음이 편안해지는 순간들이 찾아올 거야.",
    "뜻밖의 선물 같아. 기대하지 않았던 곳에서 좋은 소식이 올지도 몰라.",
    "산책길 같아. 천천히 걸으면서 생각을 정리하면 답이 보일 거야.",
    "새 노트 같아. 오늘 적는 작은 계획이 앞으로 큰 힘이 될 거야.",
    "살랑이는 바람 같아. 사람들과 나누는 대화에서 힌트를 얻게 될 거야.",
    "햇살 좋은 창가 같아. 여유를 가질수록 기분 좋은 일이 늘어날 거야.",
    "잘 익은 과일 같아. 그동안 쌓아온 노력이 슬슬 빛을 보기 시작해.",
    "조용한 도서관 같아. 혼자 집중하는 시간이 큰 도움이 될 거야.",
    "퍼즐의 마지막 조각 같아. 고민하던 일의 실마리가 풀릴 것 같아.",
    "봄비 같아. 잠깐 흐려도 지나고 나면 훨씬 맑아질 거야.",
    "든든한 우산 같아. 주변 사람들이 생각보다 큰 힘이 되어줄 거야.",
    "갓 구운 빵 같아. 소소하지만 확실한 행복을 느끼는 하루가 될 거야.",
    "새로 난 길 같아. 평소와 다른 선택이 좋은 변화를 가져다줄 거야.",
    "깊은 숨 같아. 잠깐 쉬어가면 오히려 더 멀리 갈 수 있어.",
    "선선한 저녁 공기 같아. 하루를 차분하게 마무리하면 내일이 가벼워져.",
    "반짝이는 별 같아. 작은 칭찬 한마디가 오늘의 힘이 될 거야.",
    "여행 가기 전날 같아. 설레는 마음으로 시작하면 일도 술술 풀려.",
    "포근한 담요 같아. 무리하지 말고 나를 챙기는 날로 보내면 좋아."
  ],
  // 총운에 이어 붙는 하루 흐름 한마디
  summaryTips: [
    "오전에는 차분히 준비하고, 오후에 속도를 내면 좋아.",
    "점심 이후에 집중력이 올라가니 중요한 일은 그때 해봐.",
    "아침에 짧게 계획을 세워두면 하루가 훨씬 가벼워져.",
    "오후에 반가운 연락이나 소식이 올 수 있으니 휴대폰을 가까이 둬.",
    "초반엔 조금 느려도 괜찮아. 후반으로 갈수록 흐름이 좋아질 거야.",
    "저녁 시간이 오늘의 하이라이트야. 좋아하는 일을 하나 남겨둬.",
    "오전에 미뤄둔 일 하나만 끝내도 하루 전체가 편안해질 거야.",
    "사람을 만나는 자리에서 좋은 기운을 얻을 수 있는 날이야.",
    "중요한 대화는 오후 이른 시간에 꺼내면 잘 풀릴 것 같아.",
    "작은 일에 흔들려도 금방 중심을 되찾을 수 있는 날이야.",
    "평소보다 감각이 예민해서 눈에 띄는 기회를 알아차릴 수 있어.",
    "한 가지에 몰두하기보다 짧게 나눠서 하면 효율이 좋아.",
    "점심시간에 잠깐 걷거나 바람을 쐬면 오후가 더 잘 풀려.",
    "오늘은 새로운 것보다 익숙한 방법이 더 잘 맞아.",
    "예상보다 일찍 마무리되는 일이 있을지도 몰라.",
    "하루 중 한 번은 꼭 숨을 고르는 시간을 가져봐."
  ],

  // 총운 마지막에 붙는 응원 한마디
  summaryClosings: [
    "오늘도 충분히 잘하고 있어.",
    "너무 애쓰지 않아도 괜찮아, 지금 속도로 충분해.",
    "작은 행복을 놓치지 않는 하루가 되길 바라.",
    "마음 가는 대로 한 걸음만 내디뎌 봐.",
    "오늘 하루도 무사히, 그리고 기분 좋게 마무리하자.",
    "스스로를 믿어. 좋은 흐름은 이미 시작됐어.",
    "작은 칭찬을 나에게 먼저 해주는 날로 만들어봐.",
    "힘이 들면 잠깐 쉬어도 돼. 쉬는 것도 하루의 일부야.",
    "오늘의 나에게 수고했다고 말해줄 수 있기를.",
    "웃을 일이 하나쯤은 꼭 생길 거야.",
    "오늘은 네 편이 되어주는 날이야.",
    "좋은 일은 생각보다 가까이에 있어."
  ],

  luckyColors: [
    "딥 틸", "아이보리", "세이지 그린", "버터 옐로", "라벤더", "코랄",
    "네이비", "베이지", "스카이 블루", "민트", "테라코타", "올리브", "로즈 핑크", "차콜"
  ],
  luckyItems: [
    "작은 노트", "이어폰", "텀블러", "손수건", "향이 좋은 핸드크림", "볼펜",
    "책 한 권", "따뜻한 차", "립밤", "에코백", "작은 거울", "초콜릿 한 조각",
    "좋아하는 노래 플레이리스트", "펜던트 목걸이", "포근한 양말", "손난로"
  ],
  luckyTimes: [
    "오전 7시~9시", "오전 9시~11시", "오전 11시~오후 1시", "오후 1시~3시",
    "오후 3시~5시", "오후 5시~7시", "저녁 7시~9시", "밤 9시~11시"
  ],

  // 오늘의 레드 포인트 (피하면 좋은 것)
  avoidThings: [
    "충동적인 쇼핑",
    "말을 급하게 내뱉는 것",
    "밤늦게까지 폰 보기",
    "약속을 너무 많이 잡는 것",
    "끼니를 거르는 것",
    "남과 비교하는 것",
    "중요한 결정을 서두르는 것",
    "카페인을 너무 많이 마시는 것",
    "메시지에 바로 답장하려고 서두르는 것",
    "혼자 다 끌어안으려는 마음",
    "무리한 야식",
    "과한 약속 변경",
    "사소한 일에 날을 세우는 것",
    "감정이 올라올 때 바로 말하는 것",
    "해야 할 일을 계속 미루는 것",
    "지나치게 완벽을 따지는 것"
  ],

  // 분야별 운 (한마디 문장)
  money: [
    "큰돈은 아니어도 작은 행운이 있어. 지갑은 꼭 닫아두자.",
    "지출이 늘기 쉬운 날이야. 사기 전에 한 번만 더 생각해봐.",
    "아끼던 것이 빛을 보는 날이야. 계획대로 가도 좋아.",
    "소소한 절약이 기분 좋은 결과로 돌아올 거야.",
    "뜻밖의 작은 수입이나 혜택이 생길 수 있어. 쿠폰이나 포인트를 확인해봐.",
    "친구와 함께하는 지출은 가볍게 정하자. 즐거움이 더 오래 남을 거야.",
    "오늘은 저축 목표를 다시 확인하기 좋아. 숫자를 한번 정리해봐.",
    "필요한 것과 갖고 싶은 것을 잘 구분하면 좋은 하루야.",
    "공동으로 쓰는 돈은 꼼꼼히 확인해봐. 작은 실수를 막을 수 있어.",
    "한 번 더 비교하고 사면 만족도가 높아질 거야.",
    "돈 쓰는 일에 감정이 섞이기 쉬워. 기분 좋을 때 큰 결제는 미뤄두자.",
    "투자나 큰 소비보다는 작은 정리가 이득인 날이야."
  ],
  love: [
    "먼저 건네는 안부 한마디가 분위기를 확 바꿔줄 거야.",
    "솔직한 말이 잘 통하는 날이야. 마음을 표현해봐.",
    "혼자만의 시간이 오히려 마음을 채워줄 거야.",
    "가까운 사람의 작은 배려를 놓치지 말고 살펴봐.",
    "오래 연락 못 한 사람에게서 반가운 소식이 올 수 있어.",
    "웃는 얼굴이 인연을 끌어당기는 날이야. 인사를 먼저 건네봐.",
    "상대의 말을 끝까지 들어주면 마음이 한 뼘 가까워질 거야.",
    "서운한 마음이 있다면 오늘 차분하게 풀기 좋은 날이야.",
    "새로운 만남보다 익숙한 사람들과의 시간이 더 편안할 거야.",
    "고마운 마음은 미루지 말고 표현해봐. 생각보다 크게 전해질 거야.",
    "농담 한마디가 어색함을 풀어줘. 가볍게 다가가봐.",
    "나 자신에게 다정한 날이 곧 좋은 관계로 이어질 거야."
  ],
  achieve: [
    "집중이 잘되는 날이야. 어려운 일부터 처리해봐.",
    "작은 성과가 쌓이는 날이야. 하나씩 체크해 나가자.",
    "속도보다 꼼꼼함이 빛나는 날이야. 한 번 더 확인해봐.",
    "도움을 청하면 일이 빨리 풀려. 혼자 끌어안지 말자.",
    "오늘 시작한 일은 끝까지 가기 쉬워. 망설이던 일을 시작해봐.",
    "배운 것을 정리하면 실력이 한 단계 올라갈 거야.",
    "아이디어가 잘 떠오르는 날이야. 떠오른 건 바로 메모해둬.",
    "작게 쪼개서 하면 부담이 줄고 속도가 붙을 거야.",
    "피드백을 열린 마음으로 들으면 큰 도움이 될 거야.",
    "완벽하게 하려는 것보다 먼저 끝내는 쪽이 더 좋은 날이야.",
    "꾸준함이 보상받는 날이야. 어제보다 조금만 더 해봐.",
    "마감이 있다면 오전에 끝내는 게 유리해. 오후는 여유를 남겨두자."
  ]
};

// ---------- 3-2. 글자를 숫자로 바꾸는 함수 ----------
// 같은 글자를 넣으면 항상 같은 숫자가 나와요
function stringToNumber(text) {
  // FNV-1a 방식: 글자를 하나씩 섞어 넣어요
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);          // 글자 번호를 섞고
    hash = Math.imul(hash, 16777619);    // 32비트 안에서 곱해요
  }

  // 마지막에 한 번 더 크게 섞어요. 이걸 안 하면 끝 글자(항목 이름)가 비슷할 때
  // 결과가 몇 개 값에 쏠려요 ("행운의 시간"이 모두 똑같이 나오던 원인)
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;

  return hash >>> 0;   // 음수가 나오지 않게 0 이상의 숫자로 바꿔요
}

// 목록(list)에서 하나를 골라주는 함수
// seed는 사람과 날짜에 따라 정해진 값, salt는 항목마다 다르게 하려고 섞는 값이에요
function pick(list, seed, salt) {
  const number = stringToNumber(`${seed}-${salt}`);
  return list[number % list.length];
}

// ---------- 3-3. 폼에서 입력값 읽기 ----------
// profile: 저장된 내 정보 (생년월일, 양력/음력, 태어난 시간 등)
function getBirthTimeText(profile) {
  // 시간을 모르면 "모름"으로 처리해요
  if (profile.timeUnknown) {
    return "unknown";
  }

  let hour = Number(profile.hour);           // 1~12
  const isPM = profile.ampm === "PM";

  // 12시간제를 24시간제로 바꿔요 (오전 12시 = 0시, 오후 12시 = 12시)
  if (hour === 12) {
    hour = isPM ? 12 : 0;
  } else if (isPM) {
    hour = hour + 12;
  }
  return `${hour}:${profile.minute}`;
}

// ---------- 3-3-2. 생년월일 입력칸: 숫자만 받고 자동으로 점(.) 넣기 ----------
const birthInput = document.getElementById("birth-date");
const birthError = document.getElementById("birth-error");

// 글자를 칠 때마다 실행돼요 ("19940509" → "1994.05.09")
birthInput.addEventListener("input", function () {
  // 숫자가 아닌 글자는 모두 지우고, 최대 8자리까지만 남겨요
  const digits = birthInput.value.replace(/\D/g, "").slice(0, 8);

  // 연(4) 월(2) 일(2)로 나누어 점으로 이어요
  let formatted = digits.slice(0, 4);
  if (digits.length > 4) formatted += "." + digits.slice(4, 6);
  if (digits.length > 6) formatted += "." + digits.slice(6, 8);

  birthInput.value = formatted;
  birthError.hidden = true;   // 다시 입력하면 오류 문구를 숨겨요
});

// 입력한 생년월일이 올바른지 검사해요. 문제가 있으면 문구를, 없으면 빈 글자("")를 돌려줘요
function validateBirthDate(digits) {
  if (digits.length !== 8) {
    return "숫자 8자리로 입력해 주세요. (예: 19940509)";
  }
  const y = Number(digits.slice(0, 4));
  const m = Number(digits.slice(4, 6));
  const d = Number(digits.slice(6, 8));

  if (y < 1900 || y > year) {
    return `연도는 1900년부터 ${year}년 사이로 입력해 주세요.`;
  }
  if (m < 1 || m > 12) {
    return "월은 01~12 사이로 입력해 주세요.";
  }
  // 그 달의 마지막 날짜(28~31)를 구해서 비교해요
  const lastDay = new Date(y, m, 0).getDate();
  if (d < 1 || d > lastDay) {
    return `${m}월은 ${lastDay}일까지 있어요.`;
  }
  return "";
}

// ---------- 3-4. 운세를 만들어서 화면에 보여주기 ----------
function showFortune(event) {
  // 폼은 원래 제출하면 페이지가 새로고침돼요. 그걸 막아요
  event.preventDefault();

  // 입력값에서 숫자만 꺼내 검사해요
  const digits = birthInput.value.replace(/\D/g, "");
  const errorText = validateBirthDate(digits);
  if (errorText !== "") {
    birthError.textContent = errorText;
    birthError.hidden = false;
    return;   // 여기서 함수를 끝내서 운세를 만들지 않아요
  }

  // 입력한 내용을 하나의 객체(profile)로 모아요. 이걸 저장하고, 운세도 이걸로 만들어요
  const profile = {
    digits: digits,                                                              // 예: "19940509"
    calendar: document.querySelector('input[name="calendar"]:checked').value,   // "solar" 또는 "lunar"
    timeUnknown: timeUnknown.checked,
    ampm: ampmSelect.value,
    hour: hourSelect.value,
    minute: minuteSelect.value
  };

  saveProfile(profile);        // 브라우저에 저장
  renderFortune(profile);      // 운세 보여주기
  showSavedState(profile);     // 입력칸을 접고 "내 정보 초기화하기" 버튼 보여주기
}

// ---------- 3-5. 저장된 정보(profile)로 운세를 만들어 화면에 넣기 ----------
function renderFortune(profile) {
  const digits = profile.digits;
  const birthDate = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;   // 예: "1994-05-09"
  const calendarType = profile.calendar;
  const birthTime = getBirthTimeText(profile);
  const todayText = `${year}-${month}-${day}`;

  // 사람 + 날짜가 합쳐진 "오늘의 기준값" (양력/음력도 포함해요)
  const seed = `${birthDate}|${calendarType}|${birthTime}|${todayText}`;

  // 행운의 숫자는 1~45 중 서로 다른 두 개
  const num1 = stringToNumber(`${seed}-n1`) % 45 + 1;
  let num2 = stringToNumber(`${seed}-n2`) % 45 + 1;
  if (num2 === num1) {
    num2 = num1 % 45 + 1;   // 같으면 다음 숫자로 바꿔요
  }

  // 행운의 색깔을 고르고, 피할 색깔은 행운의 색깔을 뺀 목록에서 골라요
  const luckyColor = pick(fortuneData.luckyColors, seed, "color");
  const otherColors = fortuneData.luckyColors.filter(function (color) {
    return color !== luckyColor;
  });
  const avoidColor = pick(otherColors, seed, "avoidColor");

  // 화면에 글자 넣기 (id로 찾아서 textContent에 넣어요)
  // 총운은 세 부분을 이어서 보여줘요: 총운 + 하루 흐름 + 응원 한마디
  // "\n"은 줄바꿈이에요. CSS의 white-space: pre-line 덕분에 화면에서도 줄이 바뀌어요
  const summaryPart = "오늘 운세는 " + pick(fortuneData.summaries, seed, "summary");
  const tipPart = pick(fortuneData.summaryTips, seed, "tip");
  const closingPart = pick(fortuneData.summaryClosings, seed, "closing");
  document.getElementById("fortune-summary").textContent =
    summaryPart + "\n" + tipPart + "\n" + closingPart;

  document.getElementById("lucky-number").textContent = `${num1}, ${num2}`;
  document.getElementById("lucky-color").textContent = luckyColor;
  document.getElementById("lucky-item").textContent = pick(fortuneData.luckyItems, seed, "item");
  document.getElementById("lucky-time").textContent = pick(fortuneData.luckyTimes, seed, "time");

  document.getElementById("avoid-thing").textContent = pick(fortuneData.avoidThings, seed, "avoid");
  document.getElementById("avoid-color").textContent = avoidColor;

  document.getElementById("luck-money").textContent = pick(fortuneData.money, seed, "money");
  document.getElementById("luck-love").textContent = pick(fortuneData.love, seed, "love");
  document.getElementById("luck-achieve").textContent = pick(fortuneData.achieve, seed, "achieve");
}

// ---------- 3-6. 내 정보 저장하기 / 불러오기 / 초기화하기 ----------
// localStorage: 브라우저 안에 글자를 저장해 두는 작은 창고예요. 창을 닫았다 열어도 남아 있어요.
const STORAGE_KEY = "todaysRecommendationsProfile";

const birthForm = document.getElementById("birth-form");
const savedInfo = document.getElementById("saved-info");
const savedInfoText = document.getElementById("saved-info-text");

function saveProfile(profile) {
  try {
    // localStorage에는 글자만 저장할 수 있어서, 객체를 글자(JSON)로 바꿔요
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    // 저장이 막혀 있어도(시크릿 모드 등) 운세는 보이게 둬요
    console.error(error);
  }
}

function loadProfile() {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) {
      return null;              // 저장된 게 없어요
    }
    return JSON.parse(text);    // 글자(JSON)를 다시 객체로 바꿔요
  } catch (error) {
    console.error(error);
    return null;
  }
}

function clearProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(error);
  }
}

// 저장된 정보를 한 줄로 보여주고, 입력 폼은 접어요
function showSavedState(profile) {
  const d = profile.digits;
  const calendarText = profile.calendar === "lunar" ? "음력" : "양력";

  let timeText = "태어난 시간 모름";
  if (!profile.timeUnknown) {
    const ampmText = profile.ampm === "PM" ? "오후" : "오전";
    timeText = `${ampmText} ${profile.hour}시 ${profile.minute}분`;
  }

  savedInfoText.textContent =
    `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)} · ${calendarText} · ${timeText}`;

  birthForm.hidden = true;     // 폼 숨기기
  savedInfo.hidden = false;    // 저장된 정보 보이기
}

// 운세 칸을 처음 상태로 되돌려요
function clearFortuneView() {
  document.getElementById("fortune-summary").textContent = "생년월일을 입력하면 오늘의 운세가 나타나요.";

  const ids = [
    "lucky-number", "lucky-color", "lucky-item", "lucky-time",
    "avoid-thing", "avoid-color",
    "luck-money", "luck-love", "luck-achieve"
  ];
  ids.forEach(function (id) {
    document.getElementById(id).textContent = "-";
  });
}

// "내 정보 초기화하기" 버튼
function resetProfile() {
  clearProfile();            // 저장된 정보 지우기
  birthForm.reset();         // 입력칸을 처음 상태로
  updateTimeInputs();        // "시간 모름" 상태에 맞춰 시간 칸도 맞추기
  birthError.hidden = true;
  clearFortuneView();

  savedInfo.hidden = true;
  birthForm.hidden = false;  // 입력 폼 다시 보이기
}

// 폼의 "제출(submit)" 이벤트가 일어나면 showFortune을 실행해요
birthForm.addEventListener("submit", showFortune);
document.getElementById("reset-button").addEventListener("click", resetProfile);

// 페이지가 열릴 때: 저장된 정보가 있으면 바로 운세를 보여줘요
const savedProfile = loadProfile();
if (savedProfile && validateBirthDate(savedProfile.digits || "") === "") {
  renderFortune(savedProfile);
  showSavedState(savedProfile);
}


// ===== 4. 날씨 불러오기 + 옷차림 추천 =====

// ---------- 4-1. 날씨 코드를 한글 설명으로 바꾸기 ----------
// Open-Meteo는 날씨를 숫자 코드로 알려줘요 (예: 0 = 맑음)
function getWeatherText(code) {
  if (code === 0) return "맑음";
  if (code === 1 || code === 2) return "구름 조금";
  if (code === 3) return "흐림";
  if (code === 45 || code === 48) return "안개";
  if (code >= 51 && code <= 57) return "이슬비";
  if (code >= 61 && code <= 67) return "비";
  if (code >= 71 && code <= 77) return "눈";
  if (code >= 80 && code <= 82) return "소나기";
  if (code === 85 || code === 86) return "눈 소나기";
  if (code >= 95) return "천둥번개";
  return "알 수 없음";
}

// 비나 눈이 오는 날씨 코드인지 알려줘요 (true / false)
function isWetWeather(code) {
  return (code >= 51 && code <= 67) || (code >= 71 && code <= 86) || code >= 95;
}

// ---------- 4-2. 체감 온도로 옷차림 정하기 ----------
function getOutfit(temp) {
  if (temp < 5)  return "패딩, 두꺼운 코트, 목도리를 챙기세요. 단단히 껴입는 날이에요.";
  if (temp < 9)  return "코트나 가죽 자켓에 니트를 입으세요. 히트텍도 좋아요.";
  if (temp < 12) return "트렌치코트나 자켓에 니트를 입으세요.";
  if (temp < 17) return "가디건이나 얇은 자켓에 긴팔 티를 입으세요.";
  if (temp < 20) return "얇은 가디건에 긴팔 티나 맨투맨이 좋아요.";
  if (temp < 23) return "긴팔 티 한 장이나 얇은 셔츠면 충분해요.";
  if (temp < 28) return "반팔 티에 얇은 바지가 좋아요.";
  return "민소매나 반팔, 반바지처럼 시원하게 입으세요.";
}

// ---------- 4-3. 받아온 날씨를 화면에 보여주기 ----------
function showWeather(data, placeName) {
  const current = data.current;   // 지금 날씨
  const daily = data.daily;       // 오늘 하루 정보

  const temp = Math.round(current.temperature_2m);
  const feels = Math.round(current.apparent_temperature);
  const minTemp = Math.round(daily.temperature_2m_min[0]);
  const maxTemp = Math.round(daily.temperature_2m_max[0]);
  const rainChance = daily.precipitation_probability_max[0];
  const code = current.weather_code;
  const humidity = Math.round(current.relative_humidity_2m);

  // placeName이 비어 있지 않을 때만 이름을 바꿔요 (도시 이름이 따로 들어오는 경우 덮어쓰지 않으려고)
  if (placeName) {
    document.getElementById("weather-place-name").textContent = placeName;
  }
  document.getElementById("weather-temp").textContent = `${temp}°`;
  document.getElementById("weather-desc").textContent = getWeatherText(code);
  document.getElementById("weather-feels").textContent = `${feels}°C`;
  document.getElementById("weather-range").textContent = `${minTemp}° / ${maxTemp}°`;
  document.getElementById("weather-rain").textContent = `${rainChance}%`;
  document.getElementById("weather-humidity").textContent = `${humidity}%`;
  // current.time은 "2026-11-06T14:00" 모양이라서, 11번째 글자부터 5글자("14:00")만 잘라 써요
  document.getElementById("weather-note").textContent =
    `${current.time.slice(11, 16)} 기준 · 기상 모델 예측값이라 실제 관측과 다를 수 있어요`;
  document.getElementById("outfit-text").textContent = getOutfit(feels);

  // 추가 안내: 우산, 일교차를 조건에 맞게 모아요
  const extras = [];
  if (isWetWeather(code) || rainChance >= 60) {
    extras.push("우산을 챙기세요.");
  }
  if (maxTemp - minTemp >= 10) {
    extras.push("일교차가 커요. 벗고 입기 쉬운 겉옷을 챙기세요.");
  }

  const extraElement = document.getElementById("outfit-extra");
  extraElement.textContent = extras.join(" ");
  extraElement.hidden = extras.length === 0;   // 안내가 없으면 숨겨요
}

// ---------- 4-4. 인터넷에서 날씨 받아오기 ----------
// async / await: 시간이 걸리는 일(인터넷 요청)을 "기다렸다가" 다음 줄로 넘어가요
async function fetchWeather(latitude, longitude, placeName) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}&longitude=${longitude}` +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code" +
    "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=auto&forecast_days=1";

  fetchAirQuality(latitude, longitude);   // 대기질은 따로 동시에 요청해요 (기다리지 않아요)

  try {
    const response = await fetch(url);          // 날씨 서버에 요청하고 기다려요
    if (!response.ok) {
      throw new Error("서버 응답 오류");
    }
    const data = await response.json();        // 받은 내용을 JavaScript 객체로 바꿔요
    showWeather(data, placeName);
  } catch (error) {
    // 인터넷이 끊겼거나 문제가 생기면 여기로 와요
    console.error(error);
    document.getElementById("weather-desc").textContent = "날씨를 불러오지 못했어요";
    document.getElementById("outfit-text").textContent = "인터넷 연결을 확인하고 새로고침해 주세요.";
  }
}

// ---------- 4-4-1. 대기질(미세먼지) 불러오기 ----------
// 한국 환경부 기준으로 농도(㎍/㎥)를 등급 글자로 바꿔요
// limits = [좋음 최대, 보통 최대, 나쁨 최대]
// 등급 정보: 순서대로 0(좋음) ~ 3(매우 나쁨). className은 CSS에서 색을 입힐 때 써요
const AIR_GRADES = [
  { name: "좋음",      className: "grade-good" },
  { name: "보통",      className: "grade-normal" },
  { name: "나쁨",      className: "grade-bad" },
  { name: "매우 나쁨", className: "grade-verybad" }
];

// 외출 안내 문구도 등급 순서(0~3)와 맞춰 놓았어요
const AIR_ADVICE = [
  "공기가 맑아요. 야외 활동하기 좋은 날이에요.",
  "대체로 괜찮아요. 호흡기가 약하다면 오래 격한 운동은 조금 줄여요.",
  "마스크(KF80 이상)를 쓰고, 오래 야외에 있는 건 줄이는 게 좋아요. 환기는 짧게 하세요.",
  "가능하면 외출을 자제하세요. 꼭 나가야 하면 KF94 마스크를 쓰고, 창문은 닫아두세요."
];

// 농도(value)가 어느 등급(0~3)인지 숫자로 알려줘요
function getAirLevel(value, limits) {
  if (value <= limits[0]) return 0;
  if (value <= limits[1]) return 1;
  if (value <= limits[2]) return 2;
  return 3;
}

async function fetchAirQuality(latitude, longitude) {
  const pm25Element = document.getElementById("air-pm25");
  const pm10Element = document.getElementById("air-pm10");
  const adviceElement = document.getElementById("air-advice");

  const url =
    "https://air-quality-api.open-meteo.com/v1/air-quality" +
    `?latitude=${latitude}&longitude=${longitude}` +
    "&current=pm10,pm2_5&timezone=auto";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("대기질 서버 응답 오류");
    }
    const data = await response.json();

    const pm25 = Math.round(data.current.pm2_5);
    const pm10 = Math.round(data.current.pm10);

    // 초미세먼지 기준: 15 / 35 / 75, 미세먼지 기준: 30 / 80 / 150
    const level25 = getAirLevel(pm25, [15, 35, 75]);
    const level10 = getAirLevel(pm10, [30, 80, 150]);

    // 글자와 함께 등급별 색 클래스를 붙여요 (예: "point-value grade-good")
    pm25Element.textContent = `${AIR_GRADES[level25].name} (${pm25}㎍/㎥)`;
    pm25Element.className = `point-value ${AIR_GRADES[level25].className}`;
    pm10Element.textContent = `${AIR_GRADES[level10].name} (${pm10}㎍/㎥)`;
    pm10Element.className = `point-value ${AIR_GRADES[level10].className}`;

    // 두 등급 중 더 나쁜 쪽(Math.max)을 기준으로 안내해요
    const worst = Math.max(level25, level10);
    adviceElement.textContent = AIR_ADVICE[worst];
    adviceElement.className = `air-advice ${AIR_GRADES[worst].className}`;
    adviceElement.hidden = false;
  } catch (error) {
    // 대기질만 실패해도 나머지 날씨는 그대로 보여요
    console.error(error);
    pm25Element.textContent = "불러오지 못했어요";
    pm10Element.textContent = "불러오지 못했어요";
    pm25Element.className = "point-value";
    pm10Element.className = "point-value";
    adviceElement.hidden = true;
  }
}

// ---------- 4-4-2. 좌표(위도·경도)로 도시 이름 알아내기 ----------
// 날씨는 먼저 보여주고, 도시 이름은 알아내는 대로 바꿔 넣어요
async function fetchCityName(latitude, longitude) {
  const url =
    "https://api.bigdatacloud.net/data/reverse-geocode-client" +
    `?latitude=${latitude}&longitude=${longitude}&localityLanguage=ko`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("도시 이름 조회 오류");
    }
    const data = await response.json();

    // city가 비어 있으면 locality, 그것도 비면 principalSubdivision(시·도)을 써요
    const cityName = data.city || data.locality || data.principalSubdivision;
    // 이름이 없으면 "현재 위치"라고 보여줘요
    document.getElementById("weather-place-name").textContent = cityName || "현재 위치";
  } catch (error) {
    // 실패해도 날씨는 보이도록, "현재 위치"라고 보여줘요
    console.error(error);
    document.getElementById("weather-place-name").textContent = "현재 위치";
  }
}

// ---------- 4-5. 내 위치를 알아내고 날씨 요청하기 ----------
function loadWeather() {
  const seoul = { latitude: 37.5665, longitude: 126.978 };

  // 브라우저가 위치 기능을 지원하지 않으면 서울로 해요
  if (!navigator.geolocation) {
    fetchWeather(seoul.latitude, seoul.longitude, "서울");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    // 위치를 허용했을 때 실행돼요
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeather(lat, lon, "");            // 이름은 비워 두고 날씨만 먼저
      fetchCityName(lat, lon);               // 도시 이름은 따로 알아내서 넣어요
    },
    // 거부했거나 실패했을 때 실행돼요
    function () {
      fetchWeather(seoul.latitude, seoul.longitude, "서울");
    },
    { timeout: 8000 }   // 8초 안에 못 알아내면 실패로 처리해요
  );
}

// 페이지가 열리면 바로 날씨를 불러와요
loadWeather();
