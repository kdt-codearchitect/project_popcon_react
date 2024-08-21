import React, { useEffect, useState } from 'react';
import './MapComponent.css';
import label02 from '../image/store_image/checkout_label02.png';

const MapComponent = () => {
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=b4eddb50f424d370591b88b62aeb79f5&libraries=services,clusterer,drawing&autoload=false';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(mapInstance);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locPosition = new window.kakao.maps.LatLng(lat, lon);
            const message = '<div style="padding:5px;">현재 위치</div>';

            displayMarker(mapInstance, locPosition, message);
            searchConvenienceStores(mapInstance, locPosition);

            window.kakao.maps.event.addListener(mapInstance, 'center_changed', () => {
              const center = mapInstance.getCenter();
              searchConvenienceStores(mapInstance, center);
            });

          }, (error) => {
            console.error('Error occurred. Error code: ' + error.code);
            const locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667);
            const message = 'geolocation을 사용할 수 없어요..';
            displayMarker(mapInstance, locPosition, message);
            searchConvenienceStores(mapInstance, locPosition);
          });
        } else {
          const locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667);
          const message = 'geolocation을 사용할 수 없어요..';
          displayMarker(mapInstance, locPosition, message);
          searchConvenienceStores(mapInstance, locPosition);
        }
      });
    };
  }, []);

  const displayMarker = (mapInstance, locPosition, message) => {
    const marker = new window.kakao.maps.Marker({
      map: mapInstance,
      position: locPosition,
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: message,
      removable: true,
    });

    infowindow.open(mapInstance, marker);
    mapInstance.setCenter(locPosition);
  };

  const searchConvenienceStores = (mapInstance, center) => {
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch('편의점', (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        removeMarkers();
        const limitedData = data.slice(0, 8); // 최대 8개로 제한
        setPlaces(limitedData);
        const newMarkers = limitedData.map((place, i) => displaySearchMarker(mapInstance, place, i));
        setMarkers(newMarkers);
      }
    }, {
      location: center,
      radius: 800,
    });
  };

  const displaySearchMarker = (mapInstance, place, idx) => {
    const marker = new window.kakao.maps.Marker({
      map: mapInstance,
      position: new window.kakao.maps.LatLng(place.y, place.x),
    });

    window.kakao.maps.event.addListener(marker, 'click', () => {
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
      });
      infowindow.open(mapInstance, marker);
    });

    return marker;
  };

  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const handleSearch = () => {
    const keyword = document.getElementById('keyword').value;
    if (!keyword.trim()) {
      alert('검색어를 입력하세요!');
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const limitedData = data.slice(0, 8); // 최대 8개로 제한
        setPlaces(limitedData);
        const firstPlace = limitedData[0];
        const center = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
        map.setCenter(center);

        removeMarkers();
        const newMarkers = limitedData.map((place, i) => displaySearchMarker(map, place, i));
        setMarkers(newMarkers);
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locPosition = new window.kakao.maps.LatLng(lat, lon);
        map.setCenter(locPosition);

        const message = '<div style="padding:5px;">현재 위치</div>';
        displayMarker(map, locPosition, message);
      }, (error) => {
        console.error('Error occurred. Error code: ' + error.code);
        alert('현재 위치를 가져올 수 없습니다.');
      });
    } else {
      alert('Geolocation을 지원하지 않는 브라우저입니다.');
    }
  };

  const handleItemClick = (index) => {
    const selectedPlace = places[index];
    const center = new window.kakao.maps.LatLng(selectedPlace.y, selectedPlace.x);
    map.setCenter(center);

    window.kakao.maps.event.trigger(markers[index], 'click');
  };

  return (
    <div className="map-container flex-sb">
      <div className="map-sidemenu">
        <div className="map-sidemenu-top flex-sb flex-d-column">
          <div className="flex-sb w-100">
            <p>편의점 찾기</p>
            <img src={label02} alt="" />
          </div>
          <div>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              키워드 : <input type="text" id="keyword" size="30" />
              <button type="submit">검색하기</button>
            </form>
            <button onClick={handleCurrentLocation}>현재 위치로 이동</button>
          </div>
        </div>
        <div className="map-sidemenu-bot flex-sb flex-d-column">
          <div className="sidebar-card-box">
            {places.map((place, index) => (
              <div key={index} className="sidebar-card flex-sb" onClick={() => handleItemClick(index)}>
                <div>
                  <p>{place.place_name}</p>
                  <p><i className="fas fa-box"></i>배달기능</p>
                  <p>{place.address_name}</p>
                </div>
                <div className="sidebar-card-logo">
                  <img src="./images/store_image/cu_logo.png" alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="map-api-box">
        <div id="map"></div>
      </div>
    </div>
  );
};

export default MapComponent;
