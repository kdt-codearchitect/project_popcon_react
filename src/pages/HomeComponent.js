import React, { useEffect, useRef, useState } from "react";
import { Link, useRouteLoaderData, Form } from "react-router-dom";
import LoginModal from "../pages/LoginModal";
import Popcon from '../image/store_image/Popcon.png';
import popcon_logo from '../image/store_image/popcon_logo.png';
import "./HomeComponent.css"; // External CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faStore, faDoorOpen } from '@fortawesome/free-solid-svg-icons';

const HomeComponent = () => {

    const token = useRouteLoaderData('tokenRoot');
    console.log("MainNavigation.token", token);

    const xxx = useRef(null)

    function show_modal() {
        xxx.current.modal_open();
    }
    const [index, setIndex] = useState(0);
    const firstCardRef = useRef(null);
    const firstCardImgRef = useRef([]);
    const firstCardTextRef = useRef(null);
    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const mainRef = useRef(null);


    const images = [
        "https://picsum.photos/1500/700?random=1",
        "https://picsum.photos/1500/700?random=2",
        "https://picsum.photos/1500/700?random=3",
        "https://picsum.photos/1500/700?random=4",
        "https://picsum.photos/1500/700?random=5",
        "https://picsum.photos/1500/700?random=1",
        "https://picsum.photos/1500/700?random=2",
        "https://picsum.photos/1500/700?random=3",
        "https://picsum.photos/1500/700?random=4",
        "https://picsum.photos/1500/700?random=5"
    ];

    useEffect(() => {
        let slideDuration = 5000; // 슬라이드 시간
        if(index === 5 ){
            slideDuration = 510;
        }else{
            slideDuration = 5000;
        }
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % 6);
        }, slideDuration);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [index]);

    useEffect(() => {

        const enlargeDuration = 500; // 애니매이션 시간

        if (containerRef.current) {
            if (index === 0) {
                containerRef.current.style = `transition: none;`;
                for(let i =1; i<images.length; i++){
                    cardRefs.current[i].style.opacity = 1;
                    firstCardImgRef.current[i].style.opacity = 0;
                    // firstCardImgRef.current[i].classList.remove('enlarge-animation');
                }

                images.forEach((image, index)=>{
                    // cardRefs.current[index].style.opacity = 1;
                    // firstCardImgRef.current[index].style.opacity = 0;
                    firstCardImgRef.current[index].classList.remove('enlarge-animation');
                })
                
                setTimeout(() => {
                    containerRef.current.style.transition = 'transform 0.5s ease-out'; //리셋될때 삭제된 애니매이션 복구
                }, 100);
            } else {
                setTimeout(() => {
                    cardRefs.current[index].style.opacity = 0; //클론과 겹치는 가장앞에 위치한 카드를 투명화
                    firstCardImgRef.current[index].style.opacity = 1;
                }, enlargeDuration);

                const offset = -220 * index;
                containerRef.current.style.transform = `translateX(${offset}px)`;

                if(firstCardImgRef.current[index]){
                    firstCardImgRef.current[index-1].classList.add('enlarge-animation')
                }
                if (firstCardRef.current) {
                    mainRef.current.classList.add('fade-out-move-left'); //왼쪽으로 이동하면서 사라지는 애니매이션
                    firstCardTextRef.current.classList.add('fade-out-move-down'); //아래로 이동하면서 사라지는 애니매이션

                    setTimeout(() => {
                        firstCardTextRef.current.classList.remove('fade-out-move-down'); //아래로 이동하면서 사라지는 애니매이션 제거
                        firstCardTextRef.current.style.opacity = 1;
                        mainRef.current.classList.remove('fade-out-move-left'); //왼쪽으로 이동하면서 사라지는 애니매이션 제거
                        mainRef.current.classList.add('slide-up');
                    }, enlargeDuration);

                }
            }
        }
    }, [index]);

    useEffect(() => {
        cardRefs.current[0].style.opacity = 0;
        firstCardImgRef.current[0].style.opacity = 1;
        firstCardTextRef.current.style.opacity = 1;
        // firstCardImgRef.current[0].classList.remove('card-clone-frame');
        // firstCardImgRef.current[0].style.clipPath = 'inset(0 round 0)';
    }, []);

    return (
        <div className="home-component">
            {/* header */}
            <div className="main-header-container">
                <div className="header-top-box flex-sb">
                    <Link to="/">
                        <div className="header-logo flex-c">
                            <img src={Popcon} alt="" />
                            <img src={popcon_logo} alt="" />
                        </div>
                    </Link>
                    <div className="main-header-mymenu flex-sa">
                        <nav>
                            <ul className="flex-sa">
                                <li><Link to="/Sku"><FontAwesomeIcon icon={faStore}/></Link></li>
                                {!token &&
                                    <li><FontAwesomeIcon icon={faUser} onClick={show_modal}/></li>
                                }

                                {token && <Form action="/logout" method="post">
                                    <li><FontAwesomeIcon icon={faDoorOpen}/></li>
                                </Form>
                                }

                                <li><Link to="/faq"><FontAwesomeIcon icon={faPhone}/></Link></li>
                            </ul>
                        </nav>
                        <LoginModal ref={xxx} />
                    </div>
                </div>
            </div>


            <div className="main-title-box">
                <div className="main-title-text" ref={mainRef}>
                    <p>Project Popcon's Event</p>
                    <p>개같이 망하고 있는것 같은데...</p>
                </div>
            </div>
            <div className="first-card-clone" ref={firstCardRef}>
                <img className="card-clone-img" style={{zIndex:'0'}} src={images[4]}/>
                {images.map((image, idx) => (
                    <img className="card-clone-img card-clone-frame" src={image} key={idx} style={{zIndex :`${idx}`}} ref={(el) => (firstCardImgRef.current[idx] = el)}/>
                ))}
            </div>
            <div className="clone-card-text" ref={firstCardTextRef}>
                <p>대충 이벤트 이름이란 text</p>
                <p>대충 이벤트내용이나 기간</p>
            </div>
            <div className="event-card-slide">
                <div className="event-card-container" ref={containerRef}>
                    {images.map((image, idx) => (
                        <div className="event-card" key={idx} ref={(el) => (cardRefs.current[idx] = el)} >
                            <img src={image} alt={`Slide ${idx + 1}`}/>
                            <div className="event-card-text">
                                <p>대충 이벤트 이름이란 text</p>
                                <p>대충 이벤트내용이나 기간</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeComponent;
