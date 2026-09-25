import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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
  category: 'disaster' | 'mission' | 'word';
  lat: number;
  lng: number;
  description: string;
  verse: string;
  urgent: boolean;
}

// 세계 상황, 재난, 선교현황 및 말씀 데이터 (마지막 때의 경각심과 비전)
const visionData: VisionItem[] = [
  {
    id: 1,
    title: "미전도 종족 밀집 지역 (10/40 윈도우)",
    category: "mission",
    lat: 27.1750,
    lng: 78.0421,
    description: "복음이 전파되지 않은 수많은 영혼들이 어둠 가운데 방황하고 있습니다. 마지막 때에 모든 민족에게 복음이 증거되어야 합니다.",
    verse: "이 천국 복음이 모든 민족에게 증언되기 위하여 온 세상에 전파되리니 그제야 끝이 오리라 (마 24:14)",
    urgent: true
  },
  {
    id: 2,
    title: "동남아시아 대지진 및 기후 재난",
    category: "disaster",
    lat: 15.8700,
    lng: 100.9925,
    description: "처처에 기근과 지진이 일어나며 세상의 고통이 극에 달하고 있습니다. 영원한 나라를 소망하며 깨어 있어야 할 때입니다.",
    verse: "민족이 민족을, 나라가 나라를 대적하여 일어나겠고 곳곳에 기근과 지진이 있으리니 (마 24:7)",
    urgent: true
  },
  {
    id: 3,
    title: "중동 지역의 영적 갈등과 난민 위기",
    category: "disaster",
    lat: 31.9522,
    lng: 35.2332,
    description: "예루살렘과 중동의 역사적 긴장 속에서 예언의 말씀들이 성취되어 가고 있습니다. 주님의 재림이 가까웠음을 분별하십시오.",
    verse: "너희가 무화과나무의 비유를 배우라 그 가지가 연하여지고 잎사귀를 내면 여름이 가까운 줄을 아나니 (마 24:32)",
    urgent: true
  },
  {
    id: 4,
    title: "유럽 및 서구의 세속화와 영적 잠언",
    category: "mission",
    lat: 48.8566,
    lng: 2.3522,
    description: "한때 복음의 불길이 타올랐던 열방이 세속화와 물질주의로 잠들어 있습니다. 첫사랑을 회복하고 다시 깨어날 부흥이 필요합니다.",
    verse: "내가 네 행위를 아노니 네가 살았다 하는 이름은 가졌으나 죽은 자로다 너는 깨어 그 남은 바 된 바 죽게 된 것들을 굳건하게 하라 (계 3:1-2)",
    urgent: false
  },
  {
    id: 5,
    title: "아프리카 영적 추수의 땅",
    category: "mission",
    lat: -1.2921,
    lng: 36.8219,
    description: "가장 열악한 환경 속에서도 폭발적인 성령의 역사와 추수가 일어나고 있는 최전선 선교 현장입니다.",
    verse: "눈을 들어 밭을 보라 희어져 추수하게 되었도다 (요 4:35)",
    urgent: false
  },
  {
    id: 6,
    title: "아메리카대륙 - 마지막 추수와 경고",
    category: "disaster",
    lat: 37.0902,
    lng: -95.7129,
    description: "풍요 속에서 영적 기갈이 깊어가는 세대. 교회가 세상의 유혹을 끊고 거룩한 신부로 단장해야 할 마지막 기회입니다.",
    verse: "보라 내가 속히 오리니 내가 줄 상이 내게 있어 각 사람에게 그가 행한 대로 갚아 주리라 (계 22:12)",
    urgent: false
  }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<VisionItem | null>(null);

  // 카테고리 필터링
  const filteredData = selectedCategory === 'all' 
    ? visionData 
    : visionData.filter(item => item.category === selectedCategory);

  return (
    <div className="antique-container">
      {/* 상단 고대 문서풍 헤더 */}
      <header className="antique-header">
        <div className="ornament-top">✦ ─── † ─── ✦</div>
        <h1>세계 비전과 마지막 때의 경각심</h1>
        <p className="subtitle">"때가 짧은 고로, 깨어 경성하여 마지막 추수를 준비하라"</p>
        <div className="ornament-bottom">☩ 영원한 복음과 마지막 예언의 지도 ☩</div>
      </header>

      {/* 필터 컨트롤 바 */}
      <nav className="antique-nav">
        <button 
          className={`antique-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          📜 전체 보기
        </button>
        <button 
          className={`antique-btn ${selectedCategory === 'mission' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('mission')}
        >
          ⛪ 선교 현황 (10/40)
        </button>
        <button 
          className={`antique-btn ${selectedCategory === 'disaster' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('disaster')}
        >
          ⚡ 재난 및 징조
        </button>
      </nav>

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
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CARTO'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {filteredData.map((item) => (
              <React.Fragment key={item.id}>
                <Marker 
                  position={[item.lat, item.lng]}
                  eventHandlers={{
                    click: () => setActiveItem(item),
                  }}
                >
                  <Popup>
                    <div className="popup-content">
                      <span className="popup-badge">
                        {item.category === 'mission' ? '선교현황' : '마지막징조'}
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <blockquote className="popup-verse">{item.verse}</blockquote>
                    </div>
                  </Popup>
                </Marker>

                {/* 긴급 재난 또는 중요 선교지일 경우 시각적 강조 원형 표시 */}
                {item.urgent && (
                  <Circle 
                    center={[item.lat, item.lng]} 
                    radius={600000} 
                    pathOptions={{ color: '#8b0000', fillColor: '#b22222', fillOpacity: 0.2, weight: 1, dashArray: '4, 4' }} 
                  />
                )}
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* 우측 또는 하단 상세 정보 스크롤 패널 */}
        <aside className="scroll-panel">
          <div className="scroll-header">
            <h2>📜 역사의 두루마리 기록</h2>
            <p>지도의 지점을 선택하여 상세한 영적 상황과 말씀을 확인하십시오.</p>
          </div>

          {activeItem ? (
            <div className="scroll-detail active">
              <span className={`badge ${activeItem.category}`}>
                {activeItem.category === 'mission' ? '선교 비전' : '시대적 재난/징조'}
              </span>
              <h3>{activeItem.title}</h3>
              <p className="detail-desc">{activeItem.description}</p>
              <div className="verse-box">
                <p className="verse-text">"{activeItem.verse}"</p>
              </div>
              <button className="close-detail-btn" onClick={() => setActiveItem(null)}>
                기록 닫기 ✕
              </button>
            </div>
          ) : (
            <div className="scroll-placeholder">
              <p>✝ 지도의 마커를 클릭하여 마지막 때의 긴급한 영적 상황과 말씀을 펼쳐보세요.</p>
            </div>
          )}

          <div className="warning-box">
            <h4>⚠️ 경각심과 권고</h4>
            <p>지구촌 곳곳에서 일어나는 영적 공백과 재난은 주님의 오심이 임박했음을 알리는 나팔 소리입니다. 깨어 기도하며 복음을 땅끝까지 전파합시다.</p>
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