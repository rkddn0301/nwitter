import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true); // 새 계정 여부 판별
  const [error, setError] = useState("");
  const onChange = (event) => {
    // 로그인 로직 설정
    /*
        target에 있는 값들을 if문을 통해 가져옴
        name과 value 값이 변경될 때마다 event를 발생시킴
        실시간으로 event가 발생되는 부분을 useState 'set~'에 적용 시킴
    */
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    // 폼에 해당 내용 제출
    /*
        preventDefault : submit 할 때 자동으로 실행되는 새로고침 방지
        async, await : 자바스크립트의 비동기 처리 패턴
     */
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        // newAccount일 시 계정 생성
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
        console.log("새로 생성");
      } else {
        // 아닐 시 로그인
        data = await authService.signInWithEmailAndPassword(email, password);
        console.log("로그인");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    // 로그인 폼
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input
          type="submit"
          className="authInput authSubmit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
