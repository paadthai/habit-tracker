// ── 픽셀아트 동물 시스템 ──────────────────────────────
// 16×16 픽셀 그리드. 각 숫자 = 색상 인덱스
// 0=투명, 1=아웃라인, 2=몸통, 3=포인트1, 4=포인트2, 5=눈, 6=볼터치

const PIXEL_SIZE = 8; // px per pixel
const GRID = 16;

// ── 월 → 동물 매핑 (4월 시작) ──────────────────────
export const MONTH_ANIMAL = {
  4:  'rabbit',   // 🐰 토끼
  5:  'dragon',   // 🐲 용
  6:  'snake',    // 🐍 뱀
  7:  'horse',    // 🐴 말
  8:  'monkey',   // 🐵 원숭이
  9:  'dog',      // 🐶 개
  10: 'rat',      // 🐭 쥐
  11: 'ox',       // 🐮 소
  12: 'tiger',    // 🐯 호랑이
  1:  'sheep',    // 🐑 양
  2:  'rooster',  // 🐔 닭
  3:  'pig',      // 🐷 돼지
};

export const ANIMAL_NAMES = {
  rabbit:  '토끼',
  dragon:  '용',
  snake:   '뱀',
  horse:   '말',
  monkey:  '원숭이',
  dog:     '개',
  rat:     '쥐',
  ox:      '소',
  tiger:   '호랑이',
  sheep:   '양',
  rooster: '닭',
  pig:     '돼지',
};

// ── 픽셀맵 ──────────────────────────────────────────
// 각 행 = 16자 문자열 (0-6 숫자)
const MAPS = {
  // 🐰 토끼 — 긴 귀, 분홍 귀 안쪽, 볼 터치
  rabbit: [
    '0001100001100000',
    '0001100001100000',
    '0011310011310000',
    '0013310013310000',
    '0013310013310000',
    '0111111111111000',
    '0122222222221000',
    '0125222222521000',
    '0122222222221000',
    '0126211212621000',
    '0122222222221000',
    '0122222222221000',
    '0012222222210000',
    '0001122221100000',
    '0000111111000000',
    '0000000000000000',
  ],
  // 🐲 용 — 뿔, 비늘 무늬
  dragon: [
    '0000110000110000',
    '0000410000410000',
    '0001141001141000',
    '0111111111111000',
    '0122332223321000',
    '0122222222221000',
    '0125222222521000',
    '0122332223321000',
    '0122222222221000',
    '0122222222221000',
    '0012222222210000',
    '0001122221100000',
    '0000111111000000',
    '0000001100000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐍 뱀 — 동그란 얼굴, 갈래 혀
  snake: [
    '0000000000000000',
    '0000111111000000',
    '0001222222100000',
    '0012222222210000',
    '0125222222510000',
    '0122222222210000',
    '0012222222100000',
    '0001222222100000',
    '0000112211000000',
    '0000034300000000',
    '0000340430000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐴 말 — 갈기, 큰 콧구멍
  horse: [
    '0001113111100000',
    '0013333333310000',
    '0013222222310000',
    '0011111111110000',
    '0122222222221000',
    '0125222222521000',
    '0122222222221000',
    '0122244442221000',
    '0122242242221000',
    '0012222222210000',
    '0001122221100000',
    '0000111111000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐵 원숭이 — 둥근 귀, 밝은 얼굴 중앙
  monkey: [
    '0110000000001100',
    '1221111111112210',
    '1221333333312210',
    '0113333333311100',
    '0122333333221000',
    '0125233332521000',
    '0122333333221000',
    '0122233322221000',
    '0012222222210000',
    '0001122221100000',
    '0000111111000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐶 개 — 처진 귀, 혀
  dog: [
    '1100000000001100',
    '1310000000001310',
    '1310111111001310',
    '1311222222113110',
    '1312222222213100',
    '0115222222511000',
    '0122222222221000',
    '0122233322221000',
    '0122232322221000',
    '0012222222210000',
    '0001132231100000',
    '0000013100000000',
    '0000001000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐭 쥐 — 큰 동그란 귀, 뾰족한 얼굴
  rat: [
    '0110000000001100',
    '1331000000001331',
    '1331000000001331',
    '0111111111111000',
    '0122222222221000',
    '0125222222521000',
    '0122222222221000',
    '0012244422100000',
    '0001224221000000',
    '0001111111000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐮 소 — 뿔, 큰 코
  ox: [
    '1100000000001100',
    '1310000000001310',
    '0131000000001310',
    '0011111111110000',
    '0122222222221000',
    '0125222222521000',
    '0122222222221000',
    '0012233332100000',
    '0012231322100000',
    '0001122221100000',
    '0000111111000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐯 호랑이 — 삼각 귀, 줄무늬
  tiger: [
    '0011000000110000',
    '0132100001231000',
    '0011111111110000',
    '0122332233221000',
    '0122222222221000',
    '0125222222521000',
    '0122332233221000',
    '0122222222221000',
    '0122232322221000',
    '0012222222210000',
    '0001122221100000',
    '0000111111000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐑 양 — 복슬복슬 털, 뿔
  sheep: [
    '0030300003030000',
    '0303030303030300',
    '0030303030300300',
    '0003141001410000',
    '0012222222221000',
    '0125222222521000',
    '0122222222221000',
    '0122266622221000',
    '0012222222210000',
    '0001122221100000',
    '0000111111000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐔 닭 — 볏, 부리, 꼬리깃털
  rooster: [
    '0001300000000000',
    '0013310000000000',
    '0013310000000000',
    '0001111111110000',
    '0122222222221000',
    '0125222224521000',
    '0122224442221000',
    '0122222222221000',
    '0012222222210000',
    '0001122221100000',
    '0000111111000330',
    '0000000000003300',
    '0000000000000330',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
  // 🐷 돼지 — 동그란 코, 작은 귀
  pig: [
    '0011100001110000',
    '0122100001221000',
    '0011100001110000',
    '0011111111110000',
    '0122222222221000',
    '0125222222521000',
    '0122222222221000',
    '0012233332100000',
    '0012231322100000',
    '0001122221100000',
    '0000111111000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
  ],
};

// ── 동물별 팔레트 ────────────────────────────────────
// [_, 아웃라인, 몸통(stage4풀컬러), 포인트1, 포인트2, 눈, 볼터치]
// 몸통(2)도 stage4에서 고유 컬러로 채워짐
const PALETTES = {
  rabbit:  ['', '#7C3AED', '#FFACE4', '#FF6EB4', '#FFB7D5', '#4C1D95', '#FF6EB4'],
  dragon:  ['', '#064E3B', '#6EE7B7', '#059669', '#F6C90E', '#064E3B', '#A7F3D0'],
  snake:   ['', '#14532D', '#4ADE80', '#16A34A', '#FF6B6B', '#14532D', '#BBF7D0'],
  horse:   ['', '#431407', '#FB923C', '#9A3412', '#431407', '#1C0701', '#FED7AA'],
  monkey:  ['', '#431407', '#FCD34D', '#F59E0B', '#431407', '#1C0701', '#FDE68A'],
  dog:     ['', '#3D2B1A', '#FCD34D', '#92400E', '#F472B6', '#1A0A00', '#FEF08A'],
  rat:     ['', '#374151', '#D1D5DB', '#6B7280', '#F9A8D4', '#111827', '#F3F4F6'],
  ox:      ['', '#1C0A00', '#A16207', '#D97706', '#FCD34D', '#0A0400', '#FEF3C7'],
  tiger:   ['', '#1C0A00', '#FB923C', '#431407', '#FEF08A', '#1C0A00', '#FED7AA'],
  sheep:   ['', '#374151', '#E0E7FF', '#A5B4FC', '#C084FC', '#1E1B4B', '#FBCFE8'],
  rooster: ['', '#1C0A00', '#FBBF24', '#DC2626', '#FEF08A', '#0A0400', '#FDE68A'],
  pig:     ['', '#831843', '#FCA5A5', '#F43F5E', '#FB7185', '#4A0519', '#FECDD3'],
};

// ── 스테이지별 팔레트 적용 ─────────────────────────
function getStagePalette(animalKey, stage) {
  const full = PALETTES[animalKey];
  if (!full) return null;

  if (stage === 1) {
    // 흑백 윤곽선만 — 몸통도 회색 실루엣
    return ['', '#9CA3AF', '#E5E7EB', 'transparent', 'transparent', '#9CA3AF', 'transparent'];
  }
  if (stage === 2) {
    // 아웃라인 등장 + 몸통/포인트 연하게
    return ['',
      full[1],
      hexWithAlpha(full[2], 0.35),
      hexWithAlpha(full[3], 0.35),
      'transparent',
      full[5],
      'transparent',
    ];
  }
  if (stage === 3) {
    // 몸통 중간 색 + 포인트 등장, 볼터치 없음
    return ['',
      full[1],
      hexWithAlpha(full[2], 0.7),
      hexWithAlpha(full[3], 0.7),
      hexWithAlpha(full[4], 0.5),
      full[5],
      'transparent',
    ];
  }
  // stage 4: 몸통 풀컬러 + 볼터치 + 반짝임
  return full;
}

function hexWithAlpha(hex, alpha) {
  if (!hex || hex === 'transparent') return 'transparent';
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── 스프라이트 시트 설정 ─────────────────────────────
// final_cha.png: 3열 × 4행, 896×1200px → 셀 ~298×300px (거의 정사각형)
// 순서: 쥐(0) 소(1) 호랑이(2) / 토끼(3) 용(4) 뱀(5) / 말(6) 양(7) 원숭이(8) / 닭(9) 개(10) 돼지(11)
const SPRITE_URL_RAW = '../assets/final_cha.png';
let _spriteDataURL = null; // 배경 제거된 캐시
const SPRITE_COLS = 3;
const SPRITE_ROWS = 4;
const SPRITE_W = 896;  // 원본 이미지 너비
const SPRITE_H = 1200; // 원본 이미지 높이
const SPRITE_INDEX = {
  rat: 0, ox: 1, tiger: 2,
  rabbit: 3, dragon: 4, snake: 5,
  horse: 6, sheep: 7, monkey: 8,
  rooster: 9, dog: 10, pig: 11,
};

const STAGE_FILTER = {
  1: 'grayscale(100%) brightness(0.7)',
  2: 'grayscale(40%) saturate(0.4) brightness(0.85)',
  3: 'saturate(0.6) brightness(0.9)',
  4: 'saturate(2) brightness(1.1) drop-shadow(0 0 8px rgba(255,210,0,0.9))',
};

// ── 배경 제거: 가장자리에서 BFS flood fill → 연결된 배경만 투명화 ──
// 단순 색상 임계값 방식은 토끼 흰 얼굴 등 내부 흰색까지 지우므로
// 가장자리와 연결된 무채색 픽셀만 제거하는 flood fill 사용
function removeCheckerboard(img) {
  const canvas = document.createElement('canvas');
  const W = img.naturalWidth, H = img.naturalHeight;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, W, H);
  const px = data.data;

  function isBg(x, y) {
    const i = (y * W + x) * 4;
    const r = px[i], g = px[i+1], b = px[i+2];
    return Math.max(r,g,b) - Math.min(r,g,b) < 25 && r > 100;
  }

  const visited = new Uint8Array(W * H);
  const stack = [];

  // 네 테두리 픽셀을 시작점으로
  for (let x = 0; x < W; x++) { stack.push(x, 0); stack.push(x, H-1); }
  for (let y = 1; y < H-1; y++) { stack.push(0, y); stack.push(W-1, y); }

  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    if (x < 0 || x >= W || y < 0 || y >= H) continue;
    const idx = y * W + x;
    if (visited[idx]) continue;
    visited[idx] = 1;
    if (!isBg(x, y)) continue;

    px[idx * 4 + 3] = 0; // 투명

    stack.push(x+1, y); stack.push(x-1, y);
    stack.push(x, y+1); stack.push(x, y-1);
  }

  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL('image/png');
}

// 스프라이트 DataURL 초기화 (앱 시작 시 한 번만)
export function initSprite() {
  return new Promise((resolve) => {
    if (_spriteDataURL) { resolve(); return; }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      _spriteDataURL = removeCheckerboard(img);
      resolve();
    };
    img.src = SPRITE_URL_RAW;
  });
}

// ── 스프라이트 렌더링 ────────────────────────────────
export function renderAnimalSVG(animalKey, stage, sizePx = 128) {
  const idx = SPRITE_INDEX[animalKey];
  if (idx === undefined) return '';

  const col = idx % SPRITE_COLS;
  const row = Math.floor(idx / SPRITE_COLS);
  const scale = sizePx / (SPRITE_W / SPRITE_COLS);
  const bgW = Math.round(SPRITE_W * scale);
  const bgH = Math.round(SPRITE_H * scale);
  const cellH = Math.round((SPRITE_H / SPRITE_ROWS) * scale);
  const bgX = -(col * sizePx);
  const bgY = -(row * cellH);
  const url = _spriteDataURL || SPRITE_URL_RAW;

  const filter = STAGE_FILTER[stage] || STAGE_FILTER[4];
  const animClass = stage === 4 ? 'animal-stage4' : '';
  const sparkles = stage === 4
    ? '<span class="sparkle-dot" style="position:absolute;top:2px;left:2px;font-size:10px;color:white;pointer-events:none">✦</span>'
      + '<span class="sparkle-dot" style="position:absolute;top:4px;right:2px;font-size:8px;color:white;pointer-events:none">✦</span>'
      + '<span class="sparkle-dot" style="position:absolute;bottom:2px;right:2px;font-size:10px;color:white;pointer-events:none">★</span>'
    : '';

  return `<div class="${animClass}" style="position:relative;display:inline-block;width:${sizePx}px;height:${sizePx}px;">
    <div style="
      width:${sizePx}px;height:${sizePx}px;
      background-image:url('${url}');
      background-size:${bgW}px ${bgH}px;
      background-position:${bgX}px ${bgY}px;
      background-repeat:no-repeat;
      image-rendering:pixelated;
      filter:${filter};
    "></div>
    ${sparkles}
  </div>`;
}

// ── 달성률 → 스테이지 ──────────────────────────────
export function rateToStage(rate) {
  if (rate <= 25) return 1;
  if (rate <= 50) return 2;
  if (rate <= 75) return 3;
  return 4;
}

// ── 현재 월 동물 ──────────────────────────────────
export function getCurrentAnimal() {
  const month = new Date().getMonth() + 1;
  return MONTH_ANIMAL[month] ?? 'rabbit';
}
