import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MapComponent.css';
import label02 from '../image/store_image/checkout_label02.png';
import { debounce } from 'lodash';
import { FaSearch } from "react-icons/fa";
import { FaStore } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const MapComponent = ({addToPlace}) => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]); // 모든 마커를 추적
  const [selectedInfowindow, setSelectedInfowindow] = useState(null); // 선택된 인포윈도우 추적
  const [circle, setCircle] = useState(null); // 지도에 그릴 원(circle)을 추적
  const [customerAddress, setCustomerAddress] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const customerIdx = localStorage.getItem('customerIdx');
  const token = localStorage.getItem('jwtAuthToken');
  const url = process.env.REACT_APP_API_BASE_URL;
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

  useEffect(() => {
    const fetchCustomerAddress = async () => {
      try {
        const response = await axios.get(url + `/getCustomerIdx/${customerIdx}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const customerAddress = response.data.customerAdd;
        setCustomerAddress(customerAddress);
      } catch (error) {
        console.error('고객 주소를 가져오는 중 오류 발생:', error);
      }
    };

    fetchCustomerAddress();

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
          draggable: true,
          zoomable: true
        };
        const mapInstance = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(mapInstance);

        const debouncedSearch = debounce((center) => searchConvenienceStores(mapInstance, center), 300);
        window.kakao.maps.event.addListener(mapInstance, 'center_changed', () => {
          const center = mapInstance.getCenter();
          debouncedSearch(center);
        });

        // 줌 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        mapInstance.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerIdx, token, url]);

  useEffect(() => {
    if (map && customerAddress) {
      moveToAddress(customerAddress);
    }
  }, [map, customerAddress]);

  const moveToAddress = (address, isCustomerAddress = false) => {
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        setCurrentLocation(coords); // 현재 위치로 설정
        map.setCenter(coords);
        const markerMessage = '<div style="padding:5px">배송지</div>';
        displayMarker(map, coords, 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', markerMessage);
        drawCircle(map, coords); // 현재 위치에 원을 그림
        searchConvenienceStores(map, coords);
      } else {
        console.error('주소를 찾을 수 없습니다.');
      }
    });
  };

  const displayMarker = (mapInstance, locPosition, icon = null, message = null) => {
    const markerOptions = {
      map: mapInstance,
      position: locPosition,
    };

    if (icon) {
      markerOptions.image = new window.kakao.maps.MarkerImage(
        icon,
        new window.kakao.maps.Size(24, 35),
        { offset: new window.kakao.maps.Point(12, 35) }
      );
    }

    const marker = new window.kakao.maps.Marker(markerOptions);

    if (message) {
      const infowindow = new window.kakao.maps.InfoWindow({
        content: message,
        removable: true,
      });
      infowindow.open(mapInstance, marker);
      return { marker, infowindow };
    }

    return { marker };
  };

  const searchConvenienceStores = (mapInstance, center) => {
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch('편의점', (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        removeMarkers();
        const limitedData = data.slice(0, 8);

        // 편의점 위치와 기준 위치 간의 거리 계산
        const sortedPlaces = limitedData.map((place) => {
          const distance = calculateDistance(center, new window.kakao.maps.LatLng(place.y, place.x));
          return { ...place, distance };
        }).sort((a, b) => a.distance - b.distance); // 거리순 정렬

        setPlaces(sortedPlaces);
        const newMarkers = sortedPlaces.map((place, i) => displaySearchMarker(mapInstance, place, i));
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

    markers.push({ marker });

    return { marker };
  };

  const removeMarkers = () => {
    markers.forEach(({ marker }) => marker.setMap(null));
    setMarkers([]);
  };

  const calculateDistance = (loc1, loc2) => {
    const R = 6371e3; // meters
    const φ1 = loc1.getLat() * Math.PI/180;
    const φ2 = loc2.getLat() * Math.PI/180;
    const Δφ = (loc2.getLat() - loc1.getLat()) * Math.PI/180;
    const Δλ = (loc2.getLng() - loc1.getLng()) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c; // in meters
    return Math.round(distance); // 반올림하여 정수로 반환
  };

  const handleSearch = () => {
    const keyword = document.getElementById('keyword').value;
    if (!keyword.trim()) {
      alert('검색어를 입력하세요!');
      return;
    }
    moveToAddress(keyword);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locPosition = new window.kakao.maps.LatLng(lat, lon);
        setCurrentLocation(locPosition); // 현재 위치로 설정
        map.setCenter(locPosition);
        
        displayMarker(map, locPosition, 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', '<div style="padding:3px;font-size:11px;">배송지</div>');
        drawCircle(map, locPosition); // 현재 위치에 원을 그림
        searchConvenienceStores(map, locPosition);
      }, (error) => {
        console.error('Error occurred. Error code: ' + error.code);
        alert('현재 위치를 가져올 수 없습니다.');
      });
    } else {
      alert('Geolocation을 지원하지 않는 브라우저입니다.');
    }
  };

  const handleGoToMyAddress = () => {
    if (customerAddress) {
      moveToAddress(customerAddress, true);
    } else {
      alert('고객 주소를 불러오지 못했습니다.');
    }
  };

  const handleItemClick = (index) => {
    const selectedPlace = places[index];
    const { marker } = markers[index];
    console.log(selectedPlace)
    addToPlace(selectedPlace);
    // 이전에 선택된 인포윈도우가 있다면 닫기
    if (selectedInfowindow) {
      selectedInfowindow.close();
    }

    // 새로운 인포윈도우 생성 및 열기
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">${selectedPlace.place_name}</div>`,
    });
    infowindow.open(map, marker);

    // 선택된 인포윈도우 상태로 저장
    setSelectedInfowindow(infowindow);

    // 지도 중심을 선택된 마커 위치로 이동
    map.setCenter(marker.getPosition());
  };

  const drawCircle = (mapInstance, center) => {
    // 이전에 그린 원이 있으면 제거
    if (circle) {
      circle.setMap(null);
    }

    // 새로운 원을 생성
    const newCircle = new window.kakao.maps.Circle({
      center: center, // 원의 중심 좌표
      radius: 250, // 원의 반지름 (미터 단위)
      strokeWeight: 3.8, // 선의 두께
      strokeColor: '#75B8FA', // 선의 색깔
      strokeOpacity: 1, // 선의 불투명도
      strokeStyle: 'solid', // 선의 스타일
      fillColor: 'transparent', // 채우기 색깔 없음
      fillOpacity: 0, // 채우기 불투명도 없음
    });

    // 지도에 원을 표시
    newCircle.setMap(mapInstance);
    setCircle(newCircle); // 상태에 원을 저장
  };

  const handleSkuNavigation = () => {
    navigate('/Sku');
  };

  function selectCard(cardElement) {
    // 이전에 선택된 카드에서 'selected' 클래스 제거
    const previousSelected = document.querySelector('.sidebar-card.selected');
    if (previousSelected) {
      previousSelected.classList.remove('selected');
    }
  
    // 새로 선택된 카드에 'selected' 클래스 추가
    cardElement.classList.add('selected');
  }

  // 카드 클릭 이벤트 리스너 예시
  document.querySelectorAll('.sidebar-card').forEach(card => {
    card.addEventListener('click', () => selectCard(card));
  });

  return (
    <div className="map-container flex-sb">
      <div className="floating-circle flex-c flex-d-column" onClick={handleSkuNavigation}>
        <FaStore />
        <span>매장선택</span>
      </div>  
      <div className="map-sidemenu">
        <div className="map-sidemenu-top flex-sb flex-d-column">
          <div className="flex-sb w-100">
            <p>편의점 찾기</p>
            <img src={label02} alt="Label" />
          </div>
          
          <div className="search-container">
            <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <input type="text" id="keyword" placeholder="검색어를 입력하세요." />
              <button type="submit"><FaSearch /></button>
            </form>
            
            <div className="location-buttons">
              <button onClick={handleCurrentLocation}>현재 위치로 이동</button>
              <button onClick={handleGoToMyAddress}>내 주소로 이동</button>
            </div>
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
                  <p>거리: {place.distance} m</p> {/* 거리 정보 표시 */}
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
