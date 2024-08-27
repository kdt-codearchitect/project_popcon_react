import React, { useEffect, useRef, useState } from "react";
import { Link, useRouteLoaderData, Form } from "react-router-dom";
import LoginModal from "../pages/LoginModal";
import Popcon from '../image/store_image/Popcon.png';
import popcon_logo from '../image/store_image/popcon_logo.png';
import "./HomeComponent.css"; // External CSS file for styling
import { IoStorefrontSharp } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";
import { FaPhone } from "react-icons/fa6";
import { AiOutlineLogin } from "react-icons/ai";

const HomeComponent = () => {

    const token = useRouteLoaderData('tokenRoot'); // 인증 토큰 가져오기
    const modalRef = useRef(null); // LoginModal의 참조
    const [events, setEvents] = useState([]); // 이벤트 데이터 상태
    const [error, setError] = useState(null); // 에러 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [index, setIndex] = useState(0); // 슬라이드 인덱스 상태
    const firstCardRef = useRef(null); // 첫 번째 카드의 참조
    const firstCardImgRef = useRef([]); // 카드 이미지 참조 배열
    const firstCardTextRef = useRef(null); // 카드 텍스트 참조
    const containerRef = useRef(null); // 슬라이드 컨테이너의 참조
    const cardRefs = useRef([]); // 각 카드의 참조 배열
    const mainRef = useRef(null); // 메인 텍스트의 참조
    const repeatedEvents = [...events, ...events];
    let slideDuration = 5000; // 슬라이드 시간
    const url = process.env.REACT_APP_API_BASE_URL;

    const [isFirstRender, setIsFirstRender] = useState(true); // 최초 렌더링 여부 상태

    const imgSrc = '../image/store_image/'

    function show_modal() {
        if (modalRef.current) {
            modalRef.current.modal_open(); // 모달 열기
        }
    }

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // DB에 비동기 데이터 요청
                const eventResponse = await fetch(url+'/');
                if (!eventResponse.ok) {
                    throw new Error('네트워크 상태가 원활하지 않습니다.'); // 응답이 성공이 아닐 경우
                }
                const eventData = await eventResponse.json();
                setEvents(eventData); // DB 데이터 저장
            } catch (error) {
                setError(error.message); // 에러 상태 업데이트
            } finally {
                setLoading(false); // 로딩 상태 업데이트 (중단)
            }
        };
        fetchEvent();
    }, []); // 컴포넌트 마운트 시 이벤트 데이터 요청

    useEffect(() => {
        if (index === 0) {
            slideDuration = 4500; 
        } else if(index === 5){
            slideDuration = 510;    // 마지막 인덱스에서 슬라이드 시간 변경
        }else {
            slideDuration = 5000;
        }
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % 6); // 슬라이드 인덱스 업데이트
        }, slideDuration);
        console.log("index : ", index)
        console.log("slideDuration : ", slideDuration)
        return () => clearInterval(interval); // Cleanup on unmount
    }, [index]);

    useEffect(() => {
        const enlargeDuration = 500; // 애니매이션 시간
    
        if (containerRef.current) {
            if (index === 0) {
                containerRef.current.style.transition = 'none'; // 초기 상태에서 애니메이션 제거
    
                // 초기 상태에서 슬라이드 위치를 0으로 설정
                containerRef.current.style.transform = `translateX(0px)`;
    
                for (let i = 1; i < (events.length * 2); i++) {
                    if (cardRefs.current[i]) {
                        cardRefs.current[i].style.opacity = 1; // 나머지 카드의 불투명도 조정
                    }
                    if (firstCardImgRef.current[i]) {
                        firstCardImgRef.current[i].style.opacity = 0; // 첫 번째 카드 이미지의 불투명도 조정
                    }
                }
    
                events.forEach((event, index) => {
                    if (firstCardImgRef.current[index]) {
                        firstCardImgRef.current[index].classList.remove('enlarge-animation'); // 애니매션 제거
                    }
                });
    
                setTimeout(() => {
                    if (containerRef.current) {
                        containerRef.current.style.transition = 'transform 0.5s ease-out'; // 리셋될 때 애니매이션 복구
                    }
                }, 520);
            } else {
                setTimeout(() => {
                    if (cardRefs.current[index]) {
                        cardRefs.current[index].style.opacity = 0; // 현재 카드 투명화
                    }
                    if (firstCardImgRef.current[index]) {
                        firstCardImgRef.current[index].style.opacity = 1; // 다음 카드 이미지 불투명화
                    }
                }, enlargeDuration);
    
                const offset = -220 * index;
                if (containerRef.current) {
                    containerRef.current.style.transform = `translateX(${offset}px)`; // 슬라이드 이동
                }
    
                if (firstCardImgRef.current[index - 1]) {
                    firstCardImgRef.current[index - 1].classList.add('enlarge-animation'); // 애니매션 추가
                }
                if (firstCardRef.current) {
                    if (mainRef.current) {
                        mainRef.current.classList.add('fade-out-move-left'); // 메인 텍스트 애니메이션 추가
                    }
                    if (firstCardTextRef.current) {
                        firstCardTextRef.current.classList.add('fade-out-move-down'); // 카드 텍스트 애니메이션 추가
                    }
    
                    setTimeout(() => {
                        if (firstCardTextRef.current) {
                            firstCardTextRef.current.classList.remove('fade-out-move-down'); // 카드 텍스트 애니메이션 제거
                            firstCardTextRef.current.style.opacity = 1;
                        }
                        if (mainRef.current) {
                            mainRef.current.classList.remove('fade-out-move-left'); // 메인 텍스트 애니메이션 제거
                            mainRef.current.classList.add('slide-up'); // 슬라이드 업 애니메이션 추가
                        }
                    }, enlargeDuration);
                }
            }
        }
    }, [index, events]);
    
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false); // 최초 렌더링이 끝났음을 표시
        }
        slideDuration = 5000;
        if (cardRefs.current[0]) {
            cardRefs.current[0].style.opacity = 0; // 초기 상태에서 첫 번째 카드 투명화
        }
        if (firstCardImgRef.current[0]) {
            firstCardImgRef.current[0].style.opacity = 1; // 초기 상태에서 첫 번째 카드 이미지 불투명화
        }
        if (firstCardTextRef.current) {
            firstCardTextRef.current.style.opacity = 1; // 초기 상태에서 카드 텍스트 불투명화
        }
    }, [events]);

    return (
        <div className="home-component">
            {/* header */}
            <div className="main-header-container">
                <div className="header-top-box flex-sb">
                    <Link to="/">
                        <div className="header-logo flex-c">
                            <img src={Popcon} alt="Popcon Logo" />
                            <img src={popcon_logo} alt="Popcon Logo Text" />
                        </div>
                    </Link>
                    <div className="main-header-mymenu flex-sa">
                        <nav>
                            <ul className="flex-sa">
                                <li><Link to="/maps" className="main-header-icon"><IoStorefrontSharp /><span>편의점 찾기</span></Link></li>
                                {!token &&
                                    <li onClick={show_modal}><AiOutlineLogin/><span>로그인</span></li>
                                }
                                {token && <Form action="/logout" method="post">
                                    <button id="logout-btn"><BiLogOutCircle /><span>로그아웃</span></button>
                                </Form>}
                                <li><Link to="/faq" className="main-header-icon"><FaPhone /><span>고객센터</span></Link></li>
                            </ul>
                        </nav>
                        <LoginModal ref={modalRef} />
                    </div>
                </div>
            </div>

            <div className="main-title-box">
                <div className="main-title-text" ref={mainRef}>
                    {events.length > 0 && events[index - 1] && (
                        <>
                            <p>{events[isFirstRender ? 4 : (index-1)]?.eventsName}</p>
                            <p>{events[isFirstRender ? 4 : (index-1)]?.eventsInfo}</p>
                        </>
                    )}
                </div>
            </div>
            <div className="first-card-clone" ref={firstCardRef}>
                {events.length > 0 && (
                    <>
                        <img className="card-clone-img" style={{ zIndex: '0' }} src={events[4]?.eventsImg} alt="Event Image" />
                        {events.map((event, idx) => (
                            <img
                                className="card-clone-img card-clone-frame"
                                src={imgSrc+event.eventsImg}
                                key={idx}
                                style={{ zIndex: `${idx}` }}
                                ref={(el) => (firstCardImgRef.current[idx] = el)}
                                alt={`Event ${idx}`}
                            />
                        ))}
                    </>
                )}
            </div>
            <div className="clone-card-text" ref={firstCardTextRef}>
                {events.length > 0 && events[index] && (
                    <>
                        <p>{events[index].eventsName}</p>
                        <p>{events[index].eventsInfo}</p>
                    </>
                )}
            </div>
            <div className="event-card-slide">
                <div className="event-card-container" ref={containerRef}>
                    {repeatedEvents.map((event, idx) => (
                        <div className="event-card" key={idx} ref={(el) => (cardRefs.current[idx] = el)}>
                            <img src={imgSrc+event.eventsImg} alt={`Slide ${idx + 1}`} />
                            <div className="event-card-text">
                                <p>{event.eventsName}</p>
                                <p>{event.eventsInfo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeComponent;
