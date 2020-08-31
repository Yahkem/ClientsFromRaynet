import React from 'react';
import { useStore } from 'react-context-hook';


export function LoadingElement({ className }) {
  className = !!className ? (className + ' ') : '';

  const loadingElement = <div className={className + "loading-div"}><div className="lds-dual-ring"></div></div>;

  return loadingElement;
}


export function SearchBox() {
  //const [searchValue, setSearchValue] = useState(searchValue2);
  const [searchValue, setSearchValue] = useStore('searchValue', null);

  let timeoutHandle = null;
  const debounceSearchValue = function (inputEl) {
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(() => {
      setSearchValue(inputEl.value);
    }, 700);
  }

  const searchBoxInputEl = (<input type="text"
    placeholder="🔍 Hledat"
    id="search-box"
    onInput={(e) => { debounceSearchValue(e.target); }} />);

  return searchBoxInputEl;
}


