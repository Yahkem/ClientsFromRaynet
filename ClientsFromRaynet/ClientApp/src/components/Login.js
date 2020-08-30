import { withStore, useStore } from 'react-context-hook';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';

export function Login() {
  const [isLoggedIn, setIsLoggedIn] = useStore('isLoggedIn');
  const [invalidPw, setInvalidPw] = useState(false);

  function hashFunc(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  const hashValue = 1417606992;
  const history = useHistory();

  const onButtonClick = (e) => {
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
      <label htmlFor="access-password">Přístupový kód:&nbsp;</label>
      <input type="text" id="access-password" onInput={(e) => {
        console.log('e',e, e.persist());
      }} />
      <button
        onClick={onButtonClick}
        className="login-btn">
        Zadat
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