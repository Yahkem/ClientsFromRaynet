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
      <span className="label-client address-name">
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

      <table className="client-info-table">
        <tbody>
          <tr>
            <td>
              <span className="label-client">Ulice:</span>
            </td>
            <td>
              {d(addr.street)}
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Město:</span>
            </td>
            <td>
              {d(addr.city)}
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">PSČ:</span>
            </td>
            <td>
              {d(addr.zipCode)}
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Kraj:</span>
            </td>
            <td>
              {d(addr.province)}
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Země:</span>
            </td>
            <td>
              {d(addr.country)}
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">GPS:</span>
            </td>
            <td>
              {formatLatLng(addr)}
            </td>
          </tr>
          {
            gMapsHref &&
            <tr>
              <td>&nbsp;</td>
              <td>
                <a href={gMapsHref} target="_blank" rel="noopener noreferrer">
                  <span role="img" aria-label="map">🗺️</span>&nbsp;Zobrazit na mapě
                </a>
              </td>
            </tr>
          }
          <tr>
            <td>
              <span className="label-client">Telefon:</span>
            </td>
            <td>
              {d(contact.tel1)}
            </td>
          </tr>
          {contact.tel2 &&
            <tr>
              <td>
                <span className="label-client">Telefon&nbsp;2:</span>
              </td>
              <td>
                {d(contact.tel2)}
              </td>
            </tr>
          }
          <tr>
            <td>
              <span className="label-client">E-mail:</span>
            </td>
            <td>
              {
                !!contact.email ?
                  <a href={"mailto:" + contact.email} rel="noopener noreferrer">{contact.email}</a>
                  : d(null)
              }
            </td>
          </tr>
          {
            contact.email2 &&
            (
              <tr>
                <td>
                  <span className="label-client">E-mail&nbsp;2:</span>
                </td>
                <td>
                  <a href={"mailto:" + contact.email2} rel="noopener noreferrer">{contact.email2}</a>
                </td>
              </tr>
            )
          }
          <tr>
            <td>
              <span className="label-client">WWW:</span>
            </td>
            <td>
              {
                contact.www ?
                  (<a href={formatHref(contact.www)} target="_blank" rel="noopener noreferrer">{contact.www}</a>)
                  : d(contact.www)
              }
            </td>
          </tr>
          {
            !!contact.fax &&
            <tr>
              <td>
                <span className="label-client">Fax:</span>
              </td>
              <td>
                {d(contact.fax)}
              </td>
            </tr>
          }
          {
            contact.otherContact &&
            <tr>
              <td>
                <span className="label-client">Jiný&nbsp;kontakt:</span>
              </td>
              <td>
                {d(contact.otherContact)}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>);
  }

  const isPrimaryAlsoContact = contactAddressInfo === primaryAddressInfo;

  return (<>
    {!isPrimaryAlsoContact && <AddressInfo addrInfo={primaryAddressInfo} />}
    <AddressInfo addrInfo={contactAddressInfo} otherInfo={(!isPrimaryAlsoContact || otherAdressesInfo.length > 0) ? "Kontaktní adresa" : null} />
    {otherAdressesInfo.map((a) => <AddressInfo addrInfo={a} key={a.address.id} />)}
  </>);
}