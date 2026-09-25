import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';

// Leaflet 기본 마커 아이콘 깨짐 방지 설정
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 데이터 인터페이스 정의
interface VisionItem {
  id: number;
  title: string;
  category: 'disaster' | 'mission' | 'protestant' | 'word';
  lat: number;
  lng: number;
  description: string;
  verse: string;
  urgent: boolean;
}

// 세계 상황, 재난, 선교 및 세계 개신교 현황 데이터
const visionData: VisionItem[] = [
  {
    id: 1,
    title: "세계 개신교 현황: 글로벌 성장과 중심 이동",
    category: "protestant",
    lat: 0.0,
    lng: 20.0,
    description: "현대 세계 개신교의 중심이 서구권에서 아프리카, 아시아, 라틴아메리카 등 글로벌 사우스(Global South) 지역으로 급격히 이동하고 있으며, 전 세계 기독교 인구의 큰 축을 담당하고 있습니다.",
    verse: "또 이르시되 너희는 온 천하에 다니며 만민에게 복음을 전파하라 (막 16:15)",
    urgent: false
  },
  {
    id: 2,
    title: "미전도 종족 밀집 지역 (10/40 윈도우)",
    category: "mission",
    lat: 27.1750,
    lng: 78.0421,
    description: "복음이 전파되지 않은 수많은 영혼들이 어둠 가운데 방황하고 있습니다. 마지막 때에 모든 민족에게 복음이 증거되어야 합니다.",
    verse: "이 천국 복음이 모든 민족에게 증언되기 위하여 온 세상에 전파되리니 그제야 끝이 오리라 (마 24:14)",
    urgent: true
  },
  {
    id: 3,
    title: "동남아시아 대지진 및 기후 재난",
    category: "disaster",
    lat: 15.8700,
    lng: 100.9925,
    description: "처처에 기근과 지진이 일어나며 세상의 고통이 극에 달하고 있습니다. 영원한 나라를 소망하며 깨어 있어야 할 때입니다.",
    verse: "민족이 민족을, 나라가 나라를 대적하여 일어나겠고 곳곳에 기근과 지진이 있으리니 (마 24:7)",
    urgent: true
  },
  {
    id: 4,
    title: "중동 지역의 영적 갈등과 난민 위기",
    category: "disaster",
    lat: 31.9522,
    lng: 35.2332,
    description: "예루살렘과 중동의 역사적 긴장 속에서 예언의 말씀들이 성취되어 가고 있습니다. 주님의 재림이 가까웠음을 분별하십시오.",
    verse: "너희가 무화과나무의 비유를 배우라 그 가지가 연하여지고 잎사귀를 내면 여름이 가까운 줄을 아나니 (마 24:32)",
    urgent: true
  },
  {
    id: 5,
    title: "유럽 및 서구의 세속화와 개신교 영적 갱신",
    category: "protestant",
    lat: 48.8566,
    lng: 2.3522,
    description: "전통적인 기독교 국가였던 유럽은 급격한 세속화를 겪고 있으나, 이민자 교회와 새로운 형태의 개신교 공동체를 중심으로 영적 회복의 불씨가 지펴지고 있습니다.",
    verse: "내가 네 행위를 아노니 네가 살았다 하는 이름은 가졌으나 죽은 자로다 너는 깨어 그 남은 바 된 바 죽게 된 것들을 굳건하게 하라 (계 3:1-2)",
    urgent: false
  },
  {
    id: 6,
    title: "아프리카 개신교 폭발적 부흥과 선교사 파송",
    category: "mission",
    lat: -1.2921,
    lng: 36.8219,
    description: "아프리카 대륙은 사상 최대의 개신교 부흥을 맞이하고 있으며, 이제 수혜자를 넘어 열방으로 선교사를 파송하는 주역으로 성장하고 있습니다.",
    verse: "눈을 들어 밭을 보라 희어져 추수하게 되었도다 (요 4:35)",
    urgent: false
  },
  {
    id: 7,
    title: "아메리카 대륙 - 전통적 개신교의 사명",
    category: "protestant",
    lat: 37.0902,
    lng: -95.7129,
    description: "세계 최대의 선교사 파송국 중 하나인 아메리카의 개신교회들은 물질주의의 도전 속에서 본질적인 복음의 능력과 회개를 촉구받고 있습니다.",
    verse: "보라 내가 속히 오리니 내가 줄 상이 내게 있어 각 사람에게 그가 행한 대로 갚아 주리라 (계 22:12)",
    urgent: false
  },
  
  {
    "id": 8,
    "title": "북아프리카 및 사헬 지대의 극심한 기근과 가뭄",
    "category": "disaster",
    "lat": 13.4432,
    "lng": 15.3101,
    "description": "물과 식량의 부족으로 인해 수많은 생명이 위협받고 있습니다. 물질이 아닌 생명의 양식을 구하며 기도로 깨어있어야 합니다.",
    "verse": "기근이 땅에 있으니 양식이 없어 주림이 아니며 물이 없어 갈이 아니요 여호와의 말씀을 듣지 못한 기갈이라 (암 8:11)",
    "urgent": true
  },
  {
    "id": 9,
    "title": "태평양 도서 지역의 해수면 상승 및 기후 위기",
    "category": "disaster",
    "lat": -17.7134,
    "lng": 178.0650,
    "description": "삶의 터전을 잃어가는 섬나라들의 아픔 속에서 창조 세계의 탄식을 바라보며 영원한 도성을 사모하게 됩니다.",
    "verse": "바다와 파도의 소란한 소리로 인하여 민족들이 곤란하여 혼란스럽고 (눅 21:25)",
    "urgent": false
  },
  {
    "id": 10,
    "title": "동유럽 지역의 전쟁과 안보 불안",
    "category": "disaster",
    "lat": 50.4501,
    "lng": 30.5234,
    "description": "끝나지 않는 전쟁의 소문과 폭력 속에서 세상의 평화가 얼마나 허상인지 깨닫고 참된 평강의 주님을 의지해야 합니다.",
    "verse": "난리와 난리 소문을 들을 때에 두려워하지 말라 이런 일이 있어야 하되 아직 끝은 아니니라 (마 24:6)",
    "urgent": true
  },
  {
    "id": 11,
    "title": "중앙아메리카의 극단적 폭력과 치안 불안",
    "category": "disaster",
    "lat": 15.7835,
    "lng": -90.2308,
    "description": "법과 질서가 무너지고 불법이 성함으로 인해 사랑이 식어가는 세태 속에서 끝까지 견디는 자가 구원을 얻을 것입니다.",
    "verse": "불법이 성하므로 많은 사람의 사랑이 식어지리라 그러나 끝까지 견디는 자는 구원을 받으리라 (마 24:12-13)",
    "urgent": false
  },
  {
    "id": 12,
    "title": "북아메리카 대륙의 대형 산불과 이상 기후",
    "category": "disaster",
    "lat": 37.0902,
    "lng": -95.7129,
    "description": "기후 재앙으로 삶의 터전이 순식간에 소멸하는 현장을 목도하며 이 세상이 지나가고 있음을 기억해야 합니다.",
    "verse": "주의 날이 도적 같이 오리니 그 날에는 하늘이 큰 소리로 떠나가고 체질이 뜨거운 불에 풀어지고 (벧후 3:10)",
    "urgent": true
  },
  {
    "id": 13,
    "title": "동아시아의 극심한 경제적 압박과 영적 공허",
    "category": "disaster",
    "lat": 35.8617,
    "lng": 104.1954,
    "description": "치열한 경쟁과 물질주의 속에서 영혼의 갈급함이 커져가는 시대입니다. 헛된 재물에 소망을 두지 말아야 합니다.",
    "verse": "사람이 만일 온 천하를 얻고도 제 목숨을 유익하게 하겠느냐 사람이 무엇을 주고 제 목숨과 바꾸겠느냐 (마 16:26)",
    "urgent": false
  },
  {
    "id": 14,
    "title": "남아메리카 아마존의 환경 파괴와 생태계 위기",
    "category": "disaster",
    "lat": -3.4653,
    "lng": -62.2159,
    "description": "지구의 허파가 파괴되는 고통 속에서 피조물들이 다 함께 탄식하며 구속을 기다리고 있는 때입니다.",
    "verse": "피조물이 다 이제까지 함께 탄식하며 함께 고통을 겪고 있는 것을 우리가 아느니라 (롬 8:22)",
    "urgent": false
  },
  {
    "id": 15,
    "title": "남아프리카 지역의 물 부족과 사회적 갈등",
    "category": "disaster",
    "lat": -30.5595,
    "lng": 22.9375,
    "description": "생존의 기본 조건인 물의 고갈과 양극화 속에서 오직 목마르지 않는 생명수 되신 주님만을 갈구해야 합니다.",
    "verse": "내가 주는 물을 마시는 자는 영원히 목마르지 아니하리니 (요 4:14)",
    "urgent": true
  }
];

// 지도를 동적으로 이동시켜 주는 헬퍼 컴포넌트
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

  // 카테고리 필터링된 데이터
  const filteredData = selectedCategory === 'all' 
    ? visionData 
    : visionData.filter(item => item.category === selectedCategory);

  // 현재 활성화된 아이템 (필터 변경 시 인덱스 보정)
  const activeItem = filteredData.length > 0 
    ? filteredData[currentIndex % filteredData.length] 
    : visionData[0];

  // 10초마다 자동으로 다음 항목으로 변경 (자동 재생이 켜져 있을 때)
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (filteredData.length || 1));
    }, 10000);

    return () => clearInterval(timer);
  }, [filteredData.length, isAutoPlay]);

  // 카테고리 변경 시 인덱스 초기화
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  const getCategoryBadgeName = (cat: string) => {
    switch(cat) {
      case 'mission': return '선교 비전';
      case 'disaster': return '시대적 징조';
      case 'protestant': return '세계 개신교 현황';
      default: return '영적 기록';
    }
  };

  return (
    <div className="antique-container">
      {/* 상단 고대 문서풍 헤더 */}
      <header className="antique-header">
        <div className="ornament-top">✦ ─── † ─── ✦</div>
        <h1>세계 비전과 개신교 현황 지도</h1>
        <p className="subtitle">"때가 짧은 고로, 깨어 경성하여 마지막 추수를 준비하라"</p>
        <div className="ornament-bottom">☩ 영원한 복음과 마지막 예언의 지도 ☩</div>
      </header>

      {/* 필터 컨트롤 바 (모바일 스크롤 지원) */}
      <nav className="antique-nav">
        <button 
          className={`antique-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          📜 전체 보기
        </button>
        <button 
          className={`antique-btn ${selectedCategory === 'protestant' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('protestant')}
        >
          ⛪ 세계 개신교
        </button>
        <button 
          className={`antique-btn ${selectedCategory === 'mission' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('mission')}
        >
          🌍 선교 현황 (10/40)
        </button>
        <button 
          className={`antique-btn ${selectedCategory === 'disaster' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('disaster')}
        >
          ⚡ 재난 및 징조
        </button>
      </nav>

      {/* 자동 순환 제어 바 */}
      <div className="autoplay-control-bar">
        <span>⏱️ 10초 자동 순환: <strong>{isAutoPlay ? '작동 중' : '일시정지'}</strong></span>
        <button className="antique-small-btn" onClick={() => setIsAutoPlay(!isAutoPlay)}>
          {isAutoPlay ? '⏸️ 정지' : '▶️ 재생'}
        </button>
      </div>

      {/* 메인 콘텐츠 영역 (지도 + 정보 패널) */}
      <div className="antique-main-layout">
        {/* 지도 영역 */}
        <div className="map-frame">
          <div className="map-corner top-left"></div>
          <div className="map-corner top-right"></div>
          <div className="map-corner bottom-left"></div>
          <div className="map-corner bottom-right"></div>

          <MapContainer 
            center={[20, 10]} 
            zoom={2} 
            scrollWheelZoom={true} 
            className="leaflet-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapRecenter lat={activeItem.lat} lng={activeItem.lng} />

            {filteredData.map((item) => {
              const isSelected = item.id === activeItem.id;
              return (
                <React.Fragment key={item.id}>
                  <Marker 
                    position={[item.lat, item.lng]}
                    eventHandlers={{
                      click: () => {
                        setIsAutoPlay(false); // 수동 클릭 시 자동 순환 일시정지
                        const idx = filteredData.findIndex(d => d.id === item.id);
                        if (idx !== -1) setCurrentIndex(idx);
                      },
                    }}
                  >
                    <Popup>
                      <div className="popup-content">
                        <span className="popup-badge">
                          {getCategoryBadgeName(item.category)}
                        </span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <blockquote className="popup-verse">{item.verse}</blockquote>
                      </div>
                    </Popup>
                  </Marker>

                  {/* 선택되었거나 긴급한 지역일 경우 강조 원형 표시 */}
                  {(item.urgent || isSelected) && (
                    <Circle 
                      center={[item.lat, item.lng]} 
                      radius={500000} 
                      pathOptions={{ 
                        color: isSelected ? '#d4af37' : '#8b0000', 
                        fillColor: isSelected ? '#ffd700' : '#b22222', 
                        fillOpacity: 0.3, 
                        weight: isSelected ? 2 : 1, 
                        dashArray: '4, 4' 
                      }} 
                    />
                  )}
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        {/* 우측 또는 하단 상세 정보 스크롤 패널 */}
        <aside className="scroll-panel">
          <div className="scroll-header">
            <h2>📜 역사의 두루마리 기록</h2>
            <p>10초마다 다음 지역의 현황과 말씀이 자동으로 펼쳐집니다.</p>
          </div>

          {activeItem && (
            <div className="scroll-detail active" key={activeItem.id}>
              <span className={`badge ${activeItem.category}`}>
                {getCategoryBadgeName(activeItem.category)}
              </span>
              <h3>{activeItem.title}</h3>
              <p className="detail-desc">{activeItem.description}</p>
              <div className="verse-box">
                <p className="verse-text">"{activeItem.verse}"</p>
              </div>
              <div className="panel-actions">
                <span className="slide-indicator">
                  항목 {currentIndex + 1} / {filteredData.length}
                </span>
                <button 
                  className="next-item-btn" 
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentIndex((prev) => (prev + 1) % filteredData.length);
                  }}
                >
                  다음 보기 ➔
                </button>
              </div>
            </div>
          )}

          <div className="warning-box">
            <h4>⚠️ 경각심과 권고</h4>
            <p>세계 개신교의 부흥과 지구촌 곳곳의 징조들은 주님의 오심이 임박했음을 알립니다. 깨어 기도하며 복음을 땅끝까지 전파합시다.</p>
          </div>
        </aside>
      </div>

      {/* 하단 푸터 */}
      <footer className="antique-footer">
        <p>“이것들을 증언하신 이가 이르시되 내가 진실로 속히 오리라 하시거늘 아멘 주 예수여 오시옵소서 (계시록 22:20)”</p>
      </footer>
    </div>
  );
}