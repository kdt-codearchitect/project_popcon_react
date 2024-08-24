import React,{useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import './AllInquiryModal.css';
import image_icon from '../image/image_icon.png';
import DeleteCheckModal from './DeleteCheckModal';
import Error from './Error';



const MyInquiryModalComponent=({qnaIdx,
                                faqtypeIdx,
                                title,
                                text,
                                imgname,
                                image,
                                qnaAns,
                                onClose})=>{
        
        const url = process.env.REACT_APP_API_BASE_URL;
        var customerIdx = localStorage.getItem('customerIdx'); 
        var CustomerId = localStorage.getItem('customerId');
        const sub_url=`/ans/${CustomerId}/${qnaIdx}`;
    

    console.log("qnaIdx: ", qnaIdx);

    // 링크 이동을 위한 네비게이션
    const navigate = useNavigate();

    const [isDelModalOpen, setIsDelModalOpen] = useState(false)
    const openDelModal = () => {
        setIsDelModalOpen(true);
    };

    const closeDelModal = () => {
        setIsDelModalOpen(false);
    };

    const [imageFile,setImageFile] = useState(image); // 이미지 업로드 상태 확인
    const [inquiry, setInquiry] = useState({
        qnaIdx: qnaIdx,
        faqtypeIdx: faqtypeIdx,
        customerIdx: customerIdx,
        qnaTitle: title,
        qnaText: text,
        qnaPicture: imgname,
        qnaImage: image,
        qnaAns: qnaAns,
        qnaState:'대기중',
        qnaDel:'false'
    });

    const [answer, setAnswer] = useState({
        qnaAns:'',
        qnaStated:'처리완료',
        faqtypeIdxed:inquiry.faqtypeIdx
    })

    // 입력 정보 JSON 실시간 저장
    const handleChange=(managerInput)=>{
        console.log("managerInput: ", managerInput);
        const { name, value } = managerInput.target;
        setInquiry(prevInquiry => ({
            ...prevInquiry,
            [name]: value,
            ...(name === 'faqtypeIdx' && { faqtypeIdxed: value })
        }));
        setAnswer(prevAnswer => ({
            ...prevAnswer,
            [name]: value,
            ...(name === 'faqtypeIdx' && { faqtypeIdxed: value })
        }));
        }
    
    useEffect(() => {
        console.log("answer: ", answer);
    }, [answer]);
    

    // 등록하기 기능 (JSON 정보 전송)
    const handleSubmit =() =>{

        // submit.preventDefault(); // 새로고침 방지
        
        //문의신청 POST 데이터 전송 [JSON 처리]
        fetch(url+sub_url,{
               method: 'PUT',
               headers:{    
                'Content-Type':'application/json'},
                  body: JSON.stringify(answer),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답이 실패했습니다.');
                }
                return response.json();
            })
            .then (data =>{
                console.log('Response:',data);
                console.log('inquiry', answer);
                navigate('/allInquiries'); //요청 성공시 이동
            })
            .catch(error=>{
                console.log('Error', error);
            })
        }

        const handleDelete =()=>{
            const sub_url2 = `/asknot/${qnaIdx}`;
            
            fetch(url+sub_url2,{
                method: 'PUT',
                headers: {    
                    'Content-Type':'application/json'},
                body: JSON.stringify(inquiry),})
                .then(response => {
                    if(!response.ok){
                        throw new Error('삭제 요청에 실패했습니다.');
                    }
                    console.log("항목이 삭제되었습니다.");
                    closeDelModal();
                    onClose();
                })
                .catch(error => {
                    <Error/>
                    console.log("Error: ", error);
                })      
            }

    return(
        // 모달창 페이지
        <dialog className="modal-sample-bg modal-form-inquiry">
        <div className="flex-c flex-d-column">
            <div className="flex-c flex-d-column">
                <form className="modal-faqedit-form">
                    <div className="modal-faqedit-header flex-c"><h1> 문의 답변 </h1></div>
                    <div className="modal-faqedit-title">
                        <p className="myIq-q-logo">Q</p>
                        <select id="inquiry-category" 
                                onChange={handleChange} 
                                name="faqtypeIdx" 
                                className="inquiry-category-dropdown"
                                value={inquiry.faqtypeIdx}>
                                <option value="1">취소/교환/반품</option>
                                <option value="2">배송문의</option>
                                <option value="3">주문/결제</option>
                                <option value="4">회원 서비스</option>
                                <option value="5">환불</option>
                        </select>
                        <div   name="qnaTitle"
                               className="faqedit-manager-title faqedit-m-left"
                               >{inquiry.qnaTitle}</div>
                        </div>
                            <div name="qnaText" 
                                 className="modal-manager-txtara"
                                    >{inquiry.qnaText}</div>
                    <div className="modal-faqedit-title">
                        <p className="myIq-a-logo">A</p>
                            <input type="text"
                                   name="qnaAns"
                                   onChange={handleChange}
                                   className="modal-manager-reply faqedit-m-left"
                                   value={inquiry.qnaAns}
                                 />
                    </div>
                    <div className="inquiry-picture">
                    <div name="qnaPicture"
                         type="file" 
                         accept="image/*" 
                         style={{ display: 'none' }} 
                         id="imageFile"
                        />
                        <label htmlFor="imageFile">
                            {!imageFile && <img src={image_icon} className='inquiry-imgupload' alt="업로드 아이콘"/>}
                            {imageFile  && <img src={imageFile} className='inquiry-imguploaded' alt="미리보기" />}
                        </label>
            </div>
                    <div className="modal-login-botton-box flex-c gap">
                        <button onClick={handleSubmit} className="thema-btn-01">등록</button>
                        <button onClick={onClose} className="thema-btn-02">취소</button>
                        <button onClick={(e) => { e.preventDefault(); openDelModal(); }} className="inquiry-delete-button">삭제</button>
                        <div>
                            <DeleteCheckModal
                            isOpen={isDelModalOpen}
                            onClose={closeDelModal}
                            onDelete={handleDelete}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </dialog>
    )
}

export default MyInquiryModalComponent;