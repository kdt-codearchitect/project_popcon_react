import React, { useEffect, useState } from 'react';
import './DeliveryComponent.css';

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [movingMarker, setMovingMarker] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=58dcdb5415a2809bb09eac9f25345ac3&libraries=services,clusterer,drawing&autoload=false';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(mapInstance);

        // 두 개의 임의 지점 설정
        const point1 = new window.kakao.maps.LatLng(37.566826, 126.9786567);
        const point2 = new window.kakao.maps.LatLng(37.570975, 126.992295);

        // 마커 생성 및 지도에 표시
        const marker1 = new window.kakao.maps.Marker({ position: point1 });
        const marker2 = new window.kakao.maps.Marker({ position: point2 });
        marker1.setMap(mapInstance);
        marker2.setMap(mapInstance);
        setMarkers([marker1, marker2]);

        // 길찾기 API 사용
        const drawRoute = () => {
          const apiKey = '65241b00649b5b9503657f2c9834055b';
          const origin = `${point1.getLng()},${point1.getLat()}`;
          const destination = `${point2.getLng()},${point2.getLat()}`;
          const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}&priority=RECOMMEND&car_type=1&car_fuel=GASOLINE`;

          fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `KakaoAK ${apiKey}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(data => {
            const path = data.routes[0].sections[0].roads.flatMap(road => 
              road.vertexes.reduce((acc, coord, i) => {
                if (i % 2 === 0) acc.push(new window.kakao.maps.LatLng(road.vertexes[i+1], coord));
                return acc;
              }, [])
            );

            // 예상 소요 시간 (초 단위)
            const duration = data.routes[0].summary.duration;

            // 경로 그리기
            const polyline = new window.kakao.maps.Polyline({
              path: path,
              strokeWeight: 5,
              strokeColor: '#FF0000',
              strokeOpacity: 0.7,
              strokeStyle: 'solid'
            });
            polyline.setMap(mapInstance);

            // 남은 시간 포맷팅 함수
            const formatRemainingTime = (seconds) => {
              const minutes = Math.floor(seconds / 60);
              const remainingSeconds = seconds % 60;
              return `${minutes}분 ${remainingSeconds}초`;
            };

            // 이동하는 마커 생성
            const imageSrc = 'https://media.fmkorea.com/files/attach/new/20161109/486616/18051795/505582909/99b983892094b5c6d2fc3736e15da7d1.gif';
            const imageSize = new window.kakao.maps.Size(64, 69);
            const imageOption = {offset: new window.kakao.maps.Point(27, 60)};

            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            const movingMarkerInstance = new window.kakao.maps.Marker({
              position: path[0],
              image: markerImage,
              map: mapInstance
            });
            setMovingMarker(movingMarkerInstance);

            // 커스텀 오버레이 생성
            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: path[0],
              content: `<div class="custom-overlay">도착까지: ${formatRemainingTime(duration)}</div>`,
              yAnchor: 2.5
            });
            customOverlay.setMap(mapInstance);

            // 마커 이동 애니메이션
            let step = 0;
            const totalSteps = Math.floor(duration / 3); // 3초마다 업데이트
            const interval = setInterval(() => {
              step++;
              if (step > totalSteps) {
                clearInterval(interval);
                return;
              }
              const progress = step / totalSteps;
              const position = path[Math.floor(progress * (path.length - 1))];
              const remainingTime = duration - (step * 3);
              
              movingMarkerInstance.setPosition(position);
              customOverlay.setContent(`<div class="custom-overlay">도착까지: ${formatRemainingTime(remainingTime)}</div>`);
              customOverlay.setPosition(position);
            }, 3000);
          })
          .catch(error => console.error('Error:', error));
        };

        drawRoute();
      });
    };
  }, []);

  return (
      <div className="delivery-container">
        <div className='delivery-map' id="map"/>
      </div>
  );
};

export default MapComponent;