import React, {useState, useEffect} from "react"
import "./Inquiry.css"
import { Link, useNavigate } from "react-router-dom";
import image_icon from '../image/image_icon.png';




// 문의 등록하기
const InquiryComponent = () => {
    
    const url = process.env.REACT_APP_API_BASE_URL;
    var customerIdx = localStorage.getItem('customerIdx');
    var customerId = localStorage.getItem('userid');
    const sub_url=`/ask/${customerIdx}`;

    // 데이터, 로딩, 에러 상태확인
    const[inquiry, setInquiry] = useState({
        faqtypeIdx:'1',
        customerIdx: customerIdx,        
        customerId: customerId,        
        qnaTitle:'',
        qnaText:'',
        qnaPicture:'',
        qnaImage:'',
        qnaDel:'false'
    }); 
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);
    // const[userid,setUserid] = useState(""); //아이디 가져오기 위한 상태확인
    // setUserid(name);
    console.log("customerIdx: ", customerIdx);
    console.log("customerId: ", customerId);


    // 링크 이동을 위한 네비게이션
    const navigate = useNavigate();

    // 이미지 업로드 상태 확인 [ 미리보기에 사용 ]
    const [imageFile,setImageFile] = useState(null);

    // 입력 정보 JSON 실시간 저장
    const handleChange=(inquiryInput)=>{
        console.log(inquiryInput);
        const { name , value } = inquiryInput.target;
        setInquiry(prevInquiry => ({
                ...prevInquiry,
                [name]:value
        }));
    };

    // 업로드 이미지 파일명 저장
    const handleImgChange = (event) => {
        const file = event.target.files[0];
        if(file){

            //파일 읽기
            const reader = new FileReader();
            reader.onloadend=()=>{
                setImageFile(reader.result);
                console.log("이미지 업로드: ", file); 

                //이미지 파일명 추출
                setInquiry(prevInquiry=>({
                    ...prevInquiry, 
                    qnaPicture: file.name,
                    qnaImage: reader.result

                }))
                console.log("imageFile: ", imageFile);
                console.log("qnaImage: ", reader.result);
            };
            // 이미지를 Base64 인코딩된 데이터로 읽음. 미리보기에 사용
            reader.readAsDataURL(file)
        }
    }

    // 등록하기 기능 (JSON 정보 전송)
    const handleSubmit =() =>{

        //문의신청 POST 데이터 전송 [JSON 처리]
        fetch(url+sub_url,{
               method: 'POST',
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
        

    return(
        <div className="inquiry-page flex-c">
            <div className="inquiry-layout-parent">
                <div className="inquiry-header">
                    <div className="inquiry-h1"><h1> 문의신청 </h1></div>
                    <div className="inquiry-button">
                        <Link to="/myinquiry" className="my-inquiry-button">문의내역</Link>
                    </div>
                </div>
                <div className="inquiry-form">
                <div className="inquiry-form-head flex-sb">
                <select id="inquiry-category" onChange={handleChange} name="faqtypeIdx" className="inquiry-category-dropdown">
                    <option value="1">취소/교환/반품</option>
                    <option value="2">배송문의</option>
                    <option value="3">주문/결제</option>
                    <option value="4">회원 서비스</option>
                    <option value="5">환불</option>
                </select>
                <input type="text" name="qnaTitle" onChange={handleChange} className="inquiry-title" placeholder="제목을 입력하세요."></input>
                </div>
                <div className="inquiry-content">
                <textarea name="qnaText" onChange={handleChange} className="inquiry-content-item" placeholder="내용을 입력하세요."></textarea>
                </div>
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
                    {!imageFile && <img src={image_icon} className="inquiry-imgupload" alt="업로드 아이콘"/>}
                    {imageFile  && <img src={imageFile}  alt="미리보기" className='inquiry-imguploaded'/>}
                </label>
            </div>
            <div className="inquiry-submit-buttons">
                <button type="submit" className="thema-btn-01 inquiry-register" onClick={handleSubmit}>등록</button>
                <Link to="/faq" className="inquiry-cancel">취소</Link>
            </div>
        </div>
        </div>
    )
}

export default InquiryComponent;