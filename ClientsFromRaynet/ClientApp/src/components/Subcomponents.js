import React from 'react';
import { useStore } from 'react-context-hook';
import styled from 'styled-components';

const CheckboxStyles = styled.span`
.cbx-use-modal {
  -webkit-perspective: 20;
  perspective: 20;
  position: relative;
  margin: -5px 0 -5px 16px;
  border: 2px solid rgb(150, 150, 150);
  background: #e8e8eb;
  border-radius: 4px;
  transform: translate3d(0, 0, 0);
  cursor: pointer;
  transition: all 0.3s ease;
}
.cbx-use-modal:hover {
  border-color: #0b76ef;
}
.flip {
  display: block;
  transition: all 0.4s ease;
  transform-style: preserve-3d;
  position: relative;
  width: 20px;
  height: 20px;
}
#cbx-use-modal {
  display: none;
}
#cbx-use-modal:checked + .cbx-use-modal {
  border-color: #0b76ef;
}
#cbx-use-modal:checked + .cbx-use-modal .flip {
  transform: rotateY(180deg);
}
.front,
.back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 2px;
}
.front {
  background: #fff;
  z-index: 1;
}
.back {
  transform: rotateY(180deg);
  background: #0b76ef;
  text-align: center;
  color: #fff;
  line-height: 14px;
  box-shadow: 0 0 0 1px #0b76ef;
}
.back svg {
  margin-top: 3px;
  fill: none;
}
.back svg path {
  stroke: #fff;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
`;

export function LoadingElement({ className }) {
  className = !!className ? (className + ' ') : '';

  const loadingElement = <div className={className + "loading-div"}><div className="lds-dual-ring"></div></div>;

  return loadingElement;
}


export function SearchBox() {
  const [searchValue, setSearchValue] = useStore('searchValue', null);
  const debounceTimeInMs = 650;

  let timeoutHandle = null;
  const debounceSearchValue = function (inputEl) {
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(() => {
      setSearchValue(inputEl.value);
    }, debounceTimeInMs);
  }

  const searchBoxInputEl = (<input type="text"
    placeholder="🔍 Hledat"
    id="search-box"
    onInput={(e) => { debounceSearchValue(e.target); }} />);

  return searchBoxInputEl;
}

/**
 * Checkbox for switching between modal version and detail-on-left-side version
 * */
export function UseModalSwitch() {
  const [useModal, setUseModal] = useStore('useModal', true);
  const [isModalOpened, setIsModalOpened] = useStore('isModalOpened');

  return (<CheckboxStyles>
    <input
      id="cbx-use-modal"
      type="checkbox"
      checked={useModal}
      onChange={(e) => { setUseModal(!useModal); setIsModalOpened(false); }}
    />
    <label className="cbx-use-modal" htmlFor="cbx-use-modal">
      <div className="flip">
        <div className="front"></div>
        <div className="back">
          <svg width="16" height="14" viewBox="0 0 16 14">
            <path d="M2 8.5L6 12.5L14 1.5"></path>
          </svg>
        </div>
      </div>
    </label>
    &nbsp;Používat modální okno pro detail
    </CheckboxStyles>);
}

