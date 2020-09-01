import React, { useState } from 'react';
import { useStore } from 'react-context-hook';
import { useHistory } from 'react-router-dom';
import { hashFunc } from '../Helpers';

export function Login() {
  const [isLoggedIn, setIsLoggedIn] = useStore('isLoggedIn');
  const [invalidPw, setInvalidPw] = useState(false);
  const history = useHistory();
  const hashValue = 1417606992;
  
  const onButtonClick = () => {
    const inputValue = document.getElementById('access-password').value;
    const hashedInput = hashFunc(inputValue);

    if (hashedInput === hashValue) {
      setInvalidPw(false);
      setIsLoggedIn(true);

      history.push('/client');
    } else {
      setInvalidPw(true);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}>
      <label htmlFor="access-password">Přístupový&nbsp;kód:</label>
      <input type="text" id="access-password" />
      <button
        onClick={onButtonClick}
        className="login-btn">
        Povrdit
      </button>
      {
        invalidPw && 
        <>
          <br />
          <span className="text-danger">Zadali jste špatný kód.</span>
        </>
      }
    </form>);
}