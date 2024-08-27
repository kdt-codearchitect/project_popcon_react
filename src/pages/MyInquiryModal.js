import React,{useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import './MyInquiryModal.css';
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
        var customerIdx = localStorage.getItem('customerIdx'); // 유저 idx 불러오기
        const sub_url=`/asks/${customerIdx}`;
        
    

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
        qnaState:'대기중',
        qnaAns:qnaAns,
        qnaDel:'false'
    });

    // 입력 정보 JSON 실시간 저장
    const handleChange=(inquiryInput)=>{
        console.log(inquiryInput);
        const { name , value } = inquiryInput.target;
        setInquiry(prevInquiry => ({
                ...prevInquiry,
                [name]:value
        }));
        }

    // 업로드 이미지 파일명 저장
    const handleImgChange = (event) => {
        const file = event.target.files[0];
        if(file){

            //파일 읽기
            const reader = new FileReader();
            reader.onloadend=()=>{
                setImageFile(reader.result);

                //이미지 파일명 추출
                setInquiry(prevInquiry=>({
                    ...prevInquiry, 
                    qnaPicture: file.name,
                    qnaImage: reader.result

                }))
            };
            // 이미지를 Base64 인코딩된 데이터로 읽음. 미리보기에 사용
            reader.readAsDataURL(file)
        }
    }

    // QNA 텍스트 및 이미지 로그
    useEffect(() => {
        console.log("imageFile: ", imageFile);
    }, [imageFile]);
    
    useEffect(() => {
        console.log("inquiry: ", inquiry);
    }, [inquiry]);
    

    // 등록하기 기능 (JSON 정보 전송)
    const handleSubmit =() =>{

        //문의신청 POST 데이터 전송 [JSON 처리]
        fetch(url+sub_url,{
               method: 'PUT',
               headers:{    
                'Content-Type':'application/json'},
                  body: JSON.stringify(inquiry),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답이 실패했습니다.');
                }
                return response.json();
            })
            .then (data =>{
                console.log('Response:',data);
                console.log('inquiry', inquiry);
                navigate('/myinquiry'); //요청 성공시 이동
            })
            .catch(error=>{
                console.log('Error', error);
            })

            console.log(inquiry);
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
                    <div className="modal-faqedit-header flex-c"><h1> 나의 문의 수정 </h1></div>
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
                        <input type="text" 
                               name="qnaTitle"
                               onChange={handleChange} 
                               className="faqedit-title-txt faqedit-m-left"
                               value={inquiry.qnaTitle}/>
                    </div>
                    <div className="modal-faqedit-title margin-txtbx">
                        <textarea onChange={handleChange} 
                                  name="qnaText" 
                                  className="modal-faqedit-txtara faqedit-m-left"
                                  value={inquiry.qnaText}/>
                    </div>
                    <div className="inquiry-picture">
                    <input 
                            name="qnaPicture"
                            type="file" 
                            accept="image/*" 
                            onChange={handleImgChange} 
                            style={{ display: 'none' }} 
                            id="imageFile"
                        />
                        <label htmlFor="imageFile">
                            {!imageFile && <img src={image_icon} className='inquiry-imgupload' alt="업로드 아이콘"/>}
                            {imageFile  && <img src={imageFile} className='inquiry-imguploaded' alt="미리보기" />}
                        </label>
            </div>
            {inquiry.qnaAns &&
            <div className="modal-faqedit-title">
                        <p className="myIq-a-logo">A</p>
                        <div      name="qnaText" 
                                  className="modal-faqedit-txtara faqedit-m-left"
                                  >{inquiry.qnaAns}</div>
                    </div>}
                    <div className="modal-login-botton-box flex-c gap">
                        <button onClick={handleSubmit} className="thema-btn-01">수정</button>
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