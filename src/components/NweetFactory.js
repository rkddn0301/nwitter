import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState(""); // form에 nweet 텍스트 데이터 삽입
  const [attachment, setAttachment] = useState(""); // 이미지 추출
  /*
    attachmentRef : 작성자 uid + 파일 임의의 코드 uuid 생성
    response : putString을 통해 attachmentRef 코드(이미지)를 Storage에 업로드
    attachmentUrl : 업로드된 이미지의 URL 저장
    nweet : 트윗 내용 + 이미지 URL 웹에 기록
    --> nweet을 db컬렉션에 저장

    ! if문에 있는 attachmentUrl이 조건에 맞지 않더라도 nweetObj에서는
    attachmentUrl을 출력하도록 설계되어 있는데 이 것을 lexical scope라고한다.
    이런 경우에는 변수를 let으로 바깥에 생성하여 따로 처리한다.
  */

  const onSubmit = async (event) => {
    if (nweet === "") {
      return;
    }
    // 이미지 Storage 업로드
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment != "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    console.log(attachmentUrl);
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    // 데이터베이스 생성
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };

  // 타이핑 기록 저장
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  // 이미지 업로드
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  // 이미지 삭제
  const onClearAttachment = () => setAttachment("");
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};
export default NweetFactory;
