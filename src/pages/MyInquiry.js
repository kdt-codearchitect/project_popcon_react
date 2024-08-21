    import React,{useState,useEffect} from 'react';
    import './MyInquiry.css';
    import { Link } from 'react-router-dom';
    import MyInquiryModalComponent from './MyInquiryModal';

    const url = process.env.REACT_APP_API_BASE_URL
    var CustomerIdx = localStorage.getItem('customerIdx');

    const MyInquiryComponent=()=>{
        
        // 모달창 상태 확인 / props 
        const [isModalOpen,setIsModalOpen]=useState(false);
        const[inquiry, setInquiry] = useState({
            faqtypeIdx:'',
            customerIdx: CustomerIdx,               
            qnaTitle:'',
            qnaText:'',
            qnaPicture:'',
            qnaImage:'',
            qnaDel:'false'
        }); 

        const openModal=(qnaIdx, 
                         faqtypeIdx, 
                         title, 
                         text, 
                         imgname, 
                         image, 
                         qnaDate)=>{

                    setInquiry({
                         qnaIdx: qnaIdx,
                         faqtypeIdx: faqtypeIdx,
                         customerIdx: CustomerIdx,               
                         qnaTitle: title,
                         qnaText: text,
                         qnaPicture: imgname,
                         qnaImage: image,
                         qnaDate: qnaDate,
                         qnaDel:'false'
                });            

                setIsModalOpen(true)
                console.log("modal 상태: ", isModalOpen);
                console.log("props : ", myInquiry);  
            }

        const closeModal=()=>{setIsModalOpen(false);}

        // 데이터, 로딩, 에러 상태확인
        const[myInquiry, setMyinquiry] = useState([]); 
        const[loading, setLoading]=useState(true);
        const[error, setError]=useState(null);

        
        // 페이징 처리
        const[currentPage,setCurrentPage]=useState(1);
        const itemsPerPage = 7; //페이지당 아이템 수
        
        // 현재페이지 가져오기
        const idxLastItem = currentPage*itemsPerPage;
        const idxFirstItem = idxLastItem-itemsPerPage;
        const currentItems = myInquiry.slice(idxFirstItem,idxLastItem);

        // 전체페이지 계산 (라운딩업)
        const totalPages = Math.ceil(myInquiry.length/itemsPerPage);

        // 페이지 변경 함수
        const handlePage = (pageNum) => {
            setCurrentPage(pageNum);
        }

        useEffect(() => {
            const fetchMyinquiry = async () =>{
                const sub_url = `/myinquiry/${CustomerIdx}`;
                try{
                    // DB에 비동기 데이터 요청
                    // const MyinquiryResponse = await fetch(url+`/myinquiry/${CustomerIdx}`);
                    const MyinquiryResponse = await fetch(url+sub_url);
                        if(!MyinquiryResponse.ok){
                        throw new Error('네트워크 상태가 불안정합니다.') //응답이 성공이 아닐 경우
                    }
                        const MyinquiryData  = await MyinquiryResponse.json();
                        setMyinquiry(MyinquiryData); // DB 데이터 저장
                    }  catch(error){
                        setError(error.message); // 에러 상태 업데이트
                    }   finally{
                        setLoading(false); // 로딩 상태 업데이트 (중단)
                    }
                };
            fetchMyinquiry();
        },[]);
    
        return(
            <div className="myinquiry-page">
                <div className="inquiry-h1"><h1> 나의 문의내역 </h1></div>
                <div className="myinquiry-list">
                    <div className="myinquiry-list-headers margintop15">
                        <div className="myinquiry-list-short m-right"><p>순번</p></div>
                        <div className="myinquiry-list-long"><p>글제목</p></div>
                        <div className="myinquiry-list-head"><p>작성일자</p></div> 
                        <div className="myinquiry-list-head"><p>처리결과</p></div>
                        <div className="myinquiry-list-head"><p>처리일자</p></div>
                    </div>
                    <div><hr className="horizon"></hr></div>

                    {/* CustomerQna DB 매핑 */}
                    {currentItems.map((customer_qna,idx)=>(
                    <div className="myinquiry-list-headers margintop10" key={idx}>
                        <div className="myinquiry-list-short m-right"><p>{myInquiry.length-idx}</p></div>
                        <div className="myinquiry-list-long ta-left"><p>
                            <Link 
                            onClick={() => openModal(customer_qna.qnaIdx,
                                                     customer_qna.faqtypeIdx, 
                                                     customer_qna.qnaTitle, 
                                                     customer_qna.qnaText, 
                                                     customer_qna.qnaPicture, 
                                                     customer_qna.qnaImage,  
                                                     customer_qna.qnaDate)} 
                                                     style={{ cursor: 'pointer' }}
                                                     >
                                    [{customer_qna.faqtypeIdx}] {customer_qna.qnaTitle}</Link></p></div>
                        <div className="myinquiry-list-head"><p>{customer_qna.qnaDate}</p></div>   
                        <div className="myinquiry-list-head"><p>{customer_qna.qnaState}</p></div>    
                        <div className="myinquiry-list-head"><p>{customer_qna.qnaClearDate}</p></div>    
                    </div>
                    ))}
                    {/* 페이징 매핑 */}
                    <div className="myinquiry-list-pages">
                        <button onClick={()=>handlePage(currentPage-1)}     
                        className="myinquiry-list-page"
                        disabled={currentPage === 1}
                        >◀</button>
                        <p>{currentPage}</p>
                        <button onClick={()=>handlePage(currentPage+1)}
                        className="myinquiry-list-page"
                        disabled={currentPage === totalPages}
                        >▶</button>
                        </div>
                </div>
                {/* 모달 컴포넌트 렌더링 */}
                {isModalOpen && (
                    <MyInquiryModalComponent 
                    qnaIdx     =    {inquiry.qnaIdx}
                    faqtypeIdx =    {inquiry.faqtypeIdx} 
                    title      =    {inquiry.qnaTitle} 
                    text       =    {inquiry.qnaText} 
                    imgname    =    {inquiry.qnaPicture} 
                    image      =    {inquiry.qnaImage} 
                    qnaDate    =    {inquiry.qnaDate}
                    onClose    =    {closeModal}        
                    />
                )}
        </div>
        )
    }

    export default MyInquiryComponent;