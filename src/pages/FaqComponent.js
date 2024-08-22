import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";    
import './FaqComponent.css';
import './CustomerService.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import ErrorPage from './Error';


const FaqComponent=()=> {
    const url = process.env.REACT_APP_API_BASE_URL;
    const sub_url=`/faq`;
    console.log("url 내용 확인 : ",url);
    const[faqs, setFaqs] = useState([]);                 //FAQ데이터
    const[loading, setLoading] = useState(true);         //로딩 
    const[error, setError] = useState(null);             //에러 상태확인
    const[openIdx, setOpenidx] = useState(null);         //아코디언 상태 관리
    const[visibles, setVisibles] = useState(5)           //로딩할 항목 수
    const[divMore, setDiveMore] = useState(true);        //추가 로딩 항목 여부 확인
    const[selectedFaq, setSelectedFaq] = useState(0);    //항목별 FAQ 출력


    //추가 항목 로딩하기
    const loadMore =()=>{
          setVisibles(visibles+5);
          if(visibles> faqFilter.length){
            setDiveMore(false);
          }
          console.log("visibles "+visibles);
          console.log("faqFilter "+faqFilter.length);
    }

    // FAQ 필터링 로직
    const faqFilter = selectedFaq ? faqs.filter(faq => faq.faqtypeIdx === selectedFaq) : faqs;

    //항목별 FAQ 출력
    const handleNavClick=(type)=>{
          setSelectedFaq(type);
          setOpenidx(null);
          setVisibles(5);
          setDiveMore(faqFilter.length>=5);
          console.log("faqFilter "+faqFilter.length);
    }
    
    // FAQ 필터링 상태에 따라 더보기 버튼 상태 설정
    useEffect(() => {
        setDiveMore(visibles < faqFilter.length);
    }, [selectedFaq, faqFilter]);

    useEffect(() => {
        const fetchFaqs = async () =>{
            try{
                // DB에 비동기 데이터 요청
                const faqResponse = await fetch(url+sub_url);
                    if(!faqResponse.ok){
                    throw new Error('네트워크 상태가 원활하지 않습니다.') //응답이 성공이 아닐 경우
                    }
                    const faqData  = await faqResponse.json();
                    setFaqs(faqData); // DB 데이터 저장
    
                    }  catch(error){
                        setError(error.message); // 에러 상태 업데이트
                    }   finally{
                        setLoading(false); // 로딩 상태 업데이트 (중단)
                    }
        };
        fetchFaqs();
    },[]);

    console.log(faqs);

    //로딩 및 에러 처리
    if(loading) return <div> 로딩중</div>;
    if(error) return <ErrorPage/>;

    //토글 더보기 여부 확인



    //토글 열기-닫기
    const toggleAccordion =(idx)=>{
        setOpenidx(openIdx===idx?null:idx)
    }

    return (
        <div className="customer-service-page flex-d-column flex-sb">
            <div className="inquiry-header">
                <div className="inquiry-h1"><h1>자주 묻는 질문</h1></div>
                <div className="inquiry-button">
                    <button type="button" className="thema-btn-01 my-inquiry-button">
                        <Link to="/makeInquiry">문의하기</Link></button>
                </div>
            </div>
            <nav>
                <ul className="nav-list">
                    <li className={selectedFaq === 0? "hover-li-selected flex-c":"hover-li nav-list-link"} onClick={() => handleNavClick(0)}>FAQ</li>
                    <li className={selectedFaq === 1? "hover-li-selected flex-c":"hover-li nav-list-link"} onClick={() => handleNavClick(1)}>상품 문의</li>
                    <li className={selectedFaq === 2? "hover-li-selected flex-c":"hover-li nav-list-link"} onClick={() => handleNavClick(2)}>주문/결제</li>
                    <li className={selectedFaq === 3? "hover-li-selected flex-c":"hover-li nav-list-link"} onClick={() => handleNavClick(3)}>반품/환불</li>
                    <li className={selectedFaq === 4? "hover-li-selected flex-c":"hover-li nav-list-link"} onClick={() => handleNavClick(4)}>배송 문의</li>
                    <li className={selectedFaq === 5? "hover-li-selected flex-c":"hover-li nav-list-link"} onClick={() => handleNavClick(5)}>기타</li>
                </ul>
            </nav>

            <div className="faq-list">
                {/* 첫 번째 질문 */}
                {faqFilter.slice(0,visibles).map((faq, idx)=>(
                    <>
                <div className="faq-q flex-sb" key={idx} onClick={()=>toggleAccordion(idx)}>
                    <div className="faq-q-head" >
                        <p className="faq-q-logo">Q</p>
                        <p><span className="faq-q-start">[</span>&nbsp;{faq.faqType}&nbsp;<span>]</span></p>
                        <p>{faq.faqQ}</p>
                    </div>
                    <p><FontAwesomeIcon icon={openIdx===idx?faAngleUp:faAngleDown} className="faq-expand-up"></FontAwesomeIcon></p>
                </div>
                {openIdx===idx&&
                <div className="faq-a flex-sb">
                    <div className="faq-a-head">
                        <p className="faq-a-logo">A</p>
                        <p>
                            {faq.faqA}
                        </p>
                    </div>
                </div>
                }
                </>))}

                {divMore&&(
                <div className="faq-expand flex-c">
                    <button onClick={loadMore}>
                        더보기 <FontAwesomeIcon icon={faAngleDown} className="faq-expand-down"></FontAwesomeIcon>
                    </button>
                </div>
                )}
                {!divMore&&(
                <div className="faq-expand flex-c">
                </div>
                )}
            </div>
        </div>
    );
}

export default FaqComponent;

