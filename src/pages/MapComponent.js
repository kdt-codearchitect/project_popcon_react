import React, { useEffect, useState } from 'react'; // 리액트에서 필요한 기능들을 불러옵니다
import './MapComponent.css'; // 스타일 파일을 불러옵니다

// 지도와 관련된 컴포넌트를 만듭니다
const MapComponent = () => {
  // 검색된 장소들을 저장할 상태입니다
  const [places, setPlaces] = useState([]); // places: 장소들, setPlaces: 장소들을 설정하는 함수
  // 지도를 저장할 상태입니다
  const [map, setMap] = useState(null); // map: 지도 객체, setMap: 지도를 설정하는 함수
  // 마커들을 저장할 상태입니다
  const [markers, setMarkers] = useState([]); // markers: 마커들, setMarkers: 마커들을 설정하는 함수
  // 현재 페이지를 저장할 상태입니다
  const [currentPage, setCurrentPage] = useState(1); // currentPage: 현재 페이지 번호, setCurrentPage: 현재 페이지를 설정하는 함수
  // 한 페이지에 표시할 아이템 수를 설정합니다
  const itemsPerPage = 5; // 한 페이지에 표시할 아이템 수를 5개로 설정합니다

  // 처음에 한 번 실행되는 코드입니다
  useEffect(() => {
    // 카카오 지도 API를 불러오는 스크립트를 만듭니다
    const script = document.createElement('script'); // 스크립트 요소를 만듭니다
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=b4eddb50f424d370591b88b62aeb79f5&libraries=services,clusterer,drawing&autoload=false'; // 스크립트의 소스를 설정합니다
    script.async = true; // 비동기로 로드되도록 설정합니다
    document.head.appendChild(script); // 스크립트를 문서의 head에 추가합니다

    // 스크립트가 로드되면 실행되는 함수입니다
    script.onload = () => {
      window.kakao.maps.load(() => {
        // 지도를 표시할 HTML 요소를 찾습니다
        const mapContainer = document.getElementById('map'); // 'map'이라는 id를 가진 요소를 찾습니다
        // 지도의 옵션을 설정합니다
        const mapOption = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심 좌표를 설정합니다
          level: 3, // 지도의 확대 수준을 설정합니다
        };
        // 지도를 만듭니다
        const mapInstance = new window.kakao.maps.Map(mapContainer, mapOption); // 지도 인스턴스를 만듭니다
        setMap(mapInstance); // 지도 인스턴스를 상태로 저장합니다

        // 사용자의 현재 위치를 가져옵니다
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude; // 현재 위치의 위도
            const lon = position.coords.longitude; // 현재 위치의 경도
            const locPosition = new window.kakao.maps.LatLng(lat, lon); // 현재 위치 좌표를 만듭니다
            const message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 메시지를 설정합니다

            // 현재 위치를 지도에 표시합니다
            displayMarker(mapInstance, locPosition, message);

            // 현재 위치 주변의 편의점을 검색합니다
            searchConvenienceStores(mapInstance, locPosition);

            // 지도의 중심이 바뀔 때마다 편의점을 검색합니다
            window.kakao.maps.event.addListener(mapInstance, 'center_changed', () => {
              const center = mapInstance.getCenter(); // 지도의 새로운 중심 좌표를 가져옵니다
              searchConvenienceStores(mapInstance, center); // 새로운 중심 좌표 주변의 편의점을 검색합니다
            });

          }, (error) => {
            console.error('Error occurred. Error code: ' + error.code); // 에러 발생 시 에러 코드를 출력합니다
            const locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667); // 기본 좌표를 설정합니다
            const message = 'geolocation을 사용할 수 없어요..'; // 에러 메시지를 설정합니다
            displayMarker(mapInstance, locPosition, message); // 기본 좌표에 마커를 표시합니다
            searchConvenienceStores(mapInstance, locPosition); // 기본 좌표 주변의 편의점을 검색합니다
          });
        } else {
          const locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667); // geolocation을 사용할 수 없을 때의 기본 좌표를 설정합니다
          const message = 'geolocation을 사용할 수 없어요..'; // 에러 메시지를 설정합니다
          displayMarker(mapInstance, locPosition, message); // 기본 좌표에 마커를 표시합니다
          searchConvenienceStores(mapInstance, locPosition); // 기본 좌표 주변의 편의점을 검색합니다
        }
      });
    };
  }, []); // 빈 배열을 두 번째 인자로 주어 컴포넌트가 처음 렌더링될 때만 실행되도록 합니다

  // 마커 이미지를 만드는 함수입니다
  const createMarkerImage = (src, size, options) => {
    return new window.kakao.maps.MarkerImage(src, size, options); // 마커 이미지를 생성하여 반환합니다
  };

  // 마커를 만드는 함수입니다
  const createMarker = (position, image) => {
    return new window.kakao.maps.Marker({
      position: position, // 마커의 위치를 설정합니다
      image: image // 마커의 이미지를 설정합니다
    });
  };

  // 마커를 지도에 표시하는 함수입니다
  const displayMarker = (mapInstance, locPosition, message) => {
    const marker = new window.kakao.maps.Marker({
      map: mapInstance, // 마커를 표시할 지도 인스턴스를 설정합니다
      position: locPosition // 마커의 위치를 설정합니다
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: message, // 인포윈도우에 표시할 메시지를 설정합니다
      removable: true, // 인포윈도우를 닫을 수 있도록 설정합니다
    });

    infowindow.open(mapInstance, marker); // 인포윈도우를 마커 위에 열어줍니다
    mapInstance.setCenter(locPosition); // 지도의 중심을 마커 위치로 설정합니다
  };

  // 편의점을 검색하는 함수입니다
  const searchConvenienceStores = (mapInstance, center) => {
    const ps = new window.kakao.maps.services.Places(); // 장소 검색 객체를 만듭니다
    ps.keywordSearch('편의점', (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        removeMarkers(); // 기존 마커를 지웁니다
        setPlaces(data); // 검색된 장소들을 상태에 저장합니다
        const newMarkers = data.map((place, i) => displaySearchMarker(mapInstance, place, i)); // 새로운 마커를 만듭니다
        setMarkers(newMarkers); // 새로운 마커들을 상태에 저장합니다
      }
    }, {
      location: center, // 검색할 중심 위치를 설정합니다
      radius: 2000 // 검색할 반경을 설정합니다
    });
  };

  // 검색된 편의점 마커를 표시하는 함수입니다
  const displaySearchMarker = (mapInstance, place, idx) => {
    const marker = new window.kakao.maps.Marker({
      map: mapInstance, // 마커를 표시할 지도 인스턴스를 설정합니다
      position: new window.kakao.maps.LatLng(place.y, place.x) // 마커의 위치를 설정합니다
    });

    window.kakao.maps.event.addListener(marker, 'click', () => {
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`, // 마커 클릭 시 인포윈도우에 표시할 내용을 설정합니다
      });
      infowindow.open(mapInstance, marker); // 인포윈도우를 마커 위에 열어줍니다
    });

    return marker; // 생성된 마커를 반환합니다
  };

  // 마커를 지우는 함수입니다
  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null)); // 모든 마커를 지도에서 제거합니다
    setMarkers([]); // 상태에서 마커들을 제거합니다
  };

  // 검색 버튼을 눌렀을 때 실행되는 함수입니다
  const handleSearch = () => {
    const keyword = document.getElementById('keyword').value; // 입력된 검색어를 가져옵니다
    if (!keyword.trim()) {
      alert('검색어를 입력하세요!'); // 검색어가 없을 경우 경고 메시지를 표시합니다
      return;
    }

    const ps = new window.kakao.maps.services.Places(); // 장소 검색 객체를 만듭니다
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data); // 검색된 장소들을 상태에 저장합니다
        const firstPlace = data[0]; // 검색된 첫 번째 장소를 가져옵니다
        const center = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x); // 첫 번째 장소의 위치를 중심으로 설정합니다
        map.setCenter(center); // 지도의 중심을 첫 번째 장소의 위치로 설정합니다

        removeMarkers(); // 기존 마커를 지웁니다
        const newMarkers = data.map((place, i) => displaySearchMarker(map, place, i)); // 새로운 마커를 만듭니다
        setMarkers(newMarkers); // 새로운 마커들을 상태에 저장합니다
        setCurrentPage(1); // 검색할 때 페이지를 첫 페이지로 설정합니다
      } else {
        alert('검색 결과가 없습니다.'); // 검색 결과가 없을 경우 경고 메시지를 표시합니다
      }
    });
  };

  // 현재 위치로 이동하는 버튼을 눌렀을 때 실행되는 함수입니다
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude; // 현재 위치의 위도
        const lon = position.coords.longitude; // 현재 위치의 경도
        const locPosition = new window.kakao.maps.LatLng(lat, lon); // 현재 위치 좌표를 만듭니다
        map.setCenter(locPosition); // 지도의 중심을 현재 위치로 설정합니다

        const message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시할 메시지를 설정합니다
        displayMarker(map, locPosition, message); // 현재 위치에 마커를 표시합니다
      }, (error) => {
        console.error('Error occurred. Error code: ' + error.code); // 에러 발생 시 에러 코드를 출력합니다
        alert('현재 위치를 가져올 수 없습니다.'); // 현재 위치를 가져올 수 없을 때 경고 메시지를 표시합니다
      });
    } else {
      alert('Geolocation을 지원하지 않는 브라우저입니다.'); // Geolocation을 지원하지 않는 경우 경고 메시지를 표시합니다
    }
  };

  // 리스트 아이템을 클릭했을 때 실행되는 함수입니다
  const handleItemClick = (index) => {
    const selectedPlace = places[index]; // 클릭된 아이템의 장소를 가져옵니다
    const center = new window.kakao.maps.LatLng(selectedPlace.y, selectedPlace.x); // 클릭된 장소의 위치를 중심으로 설정합니다
    map.setCenter(center); // 지도의 중심을 클릭된 장소의 위치로 설정합니다

    window.kakao.maps.event.trigger(markers[index], 'click'); // 클릭된 장소의 마커를 클릭 이벤트를 발생시킵니다
  };

  // 페이지 번호를 눌렀을 때 실행되는 함수입니다
  const handlePageChange = (page) => {
    setCurrentPage(page); // 클릭된 페이지 번호를 상태로 저장합니다
  };

  // 현재 페이지의 아이템을 가져옵니다
  const currentItems = places.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // 현재 페이지에 해당하는 아이템들을 가져옵니다

  // 총 페이지 수를 계산합니다
  const totalPages = Math.ceil(places.length / itemsPerPage); // 총 페이지 수를 계산합니다

  return (
    <div className="map_wrap">
      <div id="menu_wrap" className="bg_white">
        <div className="option">
          <div>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              키워드 : <input type="text" id="keyword" size="30" /> {/* 검색어를 입력받는 입력창입니다 */}
              <button type="submit">검색하기</button> {/* 검색 버튼입니다 */}
            </form>
            <button onClick={handleCurrentLocation}>현재 위치로 이동</button> {/* 현재 위치로 이동하는 버튼입니다 */}
          </div>
        </div>
        <hr />
        <ul id="placesList">
          {currentItems.map((place, index) => (
            <li key={index} className="item" onClick={() => handleItemClick((currentPage - 1) * itemsPerPage + index)}>
              <span className={`markerbg marker_${index + 1}`}></span>
              <div className="info">
                <h5>{place.place_name}</h5> {/* 장소 이름을 표시합니다 */}
                {place.road_address_name ? (
                  <>
                    <span>{place.road_address_name}</span> {/* 도로명 주소를 표시합니다 */}
                    <span className="jibun gray">{place.address_name}</span> {/* 지번 주소를 표시합니다 */}
                  </>
                ) : (
                  <span>{place.address_name}</span> //지번주소를 표시합니다
                )}
                <span className="tel">{place.phone}</span> {/* 전화번호를 표시합니다 */}
              </div>
            </li>
          ))}
        </ul>
        <div id="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)} className={currentPage === i + 1 ? 'on' : ''}>
              {i + 1} {/* 페이지 번호를 표시하는 버튼입니다 */}
            </button>
          ))}
        </div>
      </div>
      <div id="map" style={{ width: '100%', height: '600px', position: 'relative', overflow: 'hidden' }}></div> {/* 지도를 표시할 요소입니다 */}
    </div>
  );
};

export default MapComponent; // 컴포넌트를 내보냅니다
