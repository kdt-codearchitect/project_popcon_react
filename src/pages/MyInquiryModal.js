import React,{useState, useEffect} from 'react';
import './MyInquiryModal.css';
import image_icon from '../image/image_icon.png';

const MyInquiryModalComponent=({title,text,image,onClose})=>{

    // 이미지 업로드 상태 확인 [ 미리보기에 사용 ]
    const [imageFile,setImageFile] = useState(null);

    console.log("title",title);
    console.log("text",text);
    console.log("image",image);

    // const reader = new FileReader();
    //         reader.onloadend=()=>{
    //             setImageFile(reader.result);
    //             console.log("reader setImageFile: ", setImageFile)
    //         }
            
    return(
        // 모달창 페이지
        <dialog className="modal-sample-bg modal-form-inquiry">
        <div className="flex-c flex-d-column">
            <div className="flex-c flex-d-column">
                <form className="modal-faqedit-form">
                    <div className="modal-faqedit-header flex-c"><h1> 나의 문의 수정 </h1></div>
                    <div className="modal-faqedit-title">
                        <p className="myIq-q-logo">Q</p>
                        <select id="inquiry-category" name="faqtypeIdx" classNameName="inquiry-category-dropdown">
                            <option value="1">취소/교환/반품</option>
                            <option value="2">배송문의</option>
                            <option value="3">주문/결제</option>
                            <option value="4">회원 서비스</option>
                            <option value="5">환불</option>
                        </select>
                        <input type="text" className="faqedit-title-txt faqedit-m-left" value={title}></input>
                    </div>
                    <div className="modal-faqedit-title">
                        <p className="myIq-a-logo">A</p><textarea className="modal-faqedit-txtara faqedit-m-left">{text}</textarea>
                    </div>
                    <div className="modal-faqedit-pic flex-c">
                    {!image&& <img src={image_icon} className="" height="50px" width="50px"></img>}
                    {image&& <img src={image} className="" style={{opacity: 1, height: "auto", width: "140px"}}></img>}
                    </div>
                    <div className="modal-login-botton-box flex-c gap">
                        <button className="thema-btn-01">수정</button>
                        <button onClick={onClose} className="thema-btn-02">취소</button>
                    </div>
                </form>
            </div>
        </div>
    </dialog>
    )
}
export default MyInquiryModalComponent;