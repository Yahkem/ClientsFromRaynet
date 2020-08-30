
import React, { useEffect } from 'react';
import { useStore } from 'react-context-hook';
import { d, formatLatLng } from '../Helpers';

export function LoadingElement() {
  const loadingElement = <div className="loading-div"><div className="lds-dual-ring" ></div></div>;

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

export function AddressesInfo({ addresses }) {
  let primaryAddressInfo = null;
  let contactAddressInfo = null;
  const otherAdressesInfo = [];

  if (!!addresses) {
    for (const a of addresses) {
      if (a.primary === true) {
        primaryAddressInfo = a;
      }

      if (a.contactAddress === true) {
        contactAddressInfo = a;
      }
    }

    if (addresses.length > 1) {
      for (const a of addresses) {
        if (a !== primaryAddressInfo && a !== contactAddressInfo) {
          otherAdressesInfo.push(a);
        }
      }
    }
  } else {
    primaryAddressInfo = {
      address: {},
      contactInfo: {}
    };
    contactAddressInfo = primaryAddressInfo;
  }

  const AddressInfo = ({ addrInfo, otherInfo }) => {
    const addr = addrInfo.address;
    const contact = addrInfo.contactInfo;

    const infoEl = (<>
      <span className="label-client">
        <strong>{addr.name}</strong>
        {otherInfo && (" (" + otherInfo + ")")}
      </span>
      <br />
    </>);

    const gMapsHref = addr.street !== null ?
      ("https://www.google.cz/maps?q=" + addr.street + ", " + addr.city)
      : null;


    return (<div className="col-md-6 col-addr">
      {infoEl}
      {
        gMapsHref &&
        <>
          <a href={gMapsHref} target="_blank" rel="noopener noreferrer">
            <span role="img" aria-label="map">🗺️</span>Zobrazit na mapě
          </a>
          <br />
        </>
      }

      <span className="label-client">Ulice:&nbsp;</span>
      {d(addr.street)}<br />
      <span className="label-client">Město:&nbsp;</span>
      {d(addr.city)}<br />
      <span className="label-client">Kraj:&nbsp;</span>
      {d(addr.region)}
      &emsp;
      <span className="label-client">PSČ:&nbsp;</span>
      {d(addr.zipCode)}<br />
      <span className="label-client">Země:&nbsp;</span>
      {d(addr.country)}<br />
      <span className="label-client">GPS:&nbsp;</span>
      {formatLatLng(addr)}<br />

      <span className="label-client">Telefon:&nbsp;</span>
      {d(contact.tel1)}<br />

      {contact.tel2 &&
        (<>
          <span className="label-client">Telefon 2:&nbsp;</span>
          {d(contact.tel2)}<br />
        </>)
      }

      <span className="label-client">E-mail:&nbsp;</span>
      {d(contact.email)}<br />

      {contact.email2 &&
        (<>
          <span className="label-client">E-mail 2:&nbsp;</span>
          {d(contact.email2)}<br />
        </>)
      }

      <span className="label-client">www:&nbsp;</span>
      {!!contact.www ?
        (<a href={contact.www} target="_blank" rel="noopener noreferrer">{contact.www}</a>)
        : d(contact.www)}

      {contact.fax &&
        (<>
          <br />
          <span className="label-client">Fax:&nbsp;</span>
          {d(contact.fax)}
        </>)
      }

      {contact.otherContact &&
        (<>
          <br />
          <span className="label-client">Jiný kontakt:&nbsp;</span>
          {d(contact.otherContact)}
        </>)
      }
    </div>);
  }

  return (<>
    <AddressInfo addrInfo={primaryAddressInfo} otherInfo="Hlavní adresa" />
    {contactAddressInfo !== primaryAddressInfo && <AddressInfo addrInfo={contactAddressInfo} otherInfo="Kontaktní adresa" />}
    {otherAdressesInfo.map((a) => <AddressInfo addrInfo={a} key={a.address.id} />)}
  </>);
}