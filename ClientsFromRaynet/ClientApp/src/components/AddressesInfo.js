import React from 'react';
import { d, formatLatLng } from '../Helpers';


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

    const formatHref = (link) => {
      if (!!link && !link.startsWith('http')) {
        link = 'http://' + link;
      }

      return link;
    };

    return (<div className="col-md-6 col-addr">
      {infoEl}

      <span className="label-client">Ulice:&nbsp;</span>
      {d(addr.street)}<br />
      <span className="label-client">Město:&nbsp;</span>
      {d(addr.city)}<br />
      <span className="label-client">PSČ:&nbsp;</span>
      {d(addr.zipCode)}<br />
      <span className="label-client">Kraj:&nbsp;</span>
      {d(addr.province)}<br />
      <span className="label-client">Země:&nbsp;</span>
      {d(addr.country)}<br />
      <span className="label-client">GPS:&nbsp;</span>
      {formatLatLng(addr)}<br />
      {
        gMapsHref &&
        <>
          <a href={gMapsHref} target="_blank" rel="noopener noreferrer" className="show-on-map-link">
            <span role="img" aria-label="map">🗺️</span>&nbsp;Zobrazit na mapě
          </a>
          <br />
        </>
      }

      <span className="label-client">Telefon:&nbsp;</span>
      {d(contact.tel1)}<br />

      {contact.tel2 &&
        (<>
          <span className="label-client">Telefon 2:&nbsp;</span>
          {d(contact.tel2)}<br />
        </>)
      }

      <span className="label-client">E-mail:&nbsp;</span>
      {
        !!contact.email ?
          <a href={"mailto:" + contact.email} rel="noopener noreferrer">{contact.email}</a>
          : d(null)
      }
      <br />

      {contact.email2 &&
        (<>
          <span className="label-client">E-mail 2:&nbsp;</span>
          <a href={"mailto:" + contact.email2} rel="noopener noreferrer">{contact.email2}</a>
          <br />
        </>)
      }

      <span className="label-client">WWW:&nbsp;</span>
      {!!contact.www ?
        (<a href={formatHref(contact.www)} target="_blank" rel="noopener noreferrer">{contact.www}</a>)
        : d(contact.www)
      }

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

  const isPrimaryAlsoContact = contactAddressInfo === primaryAddressInfo;

  return (<>
    {!isPrimaryAlsoContact && <AddressInfo addrInfo={primaryAddressInfo} />}
    <AddressInfo addrInfo={contactAddressInfo} otherInfo={(!isPrimaryAlsoContact || otherAdressesInfo.length > 0) ? "Kontaktní adresa" : null} />
    {otherAdressesInfo.map((a) => <AddressInfo addrInfo={a} key={a.address.id} />)}
  </>);
}