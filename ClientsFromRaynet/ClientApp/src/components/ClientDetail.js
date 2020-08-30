import React, { useEffect } from 'react';
import { useStore } from 'react-context-hook';
import { enumDisplayString, Role, State, colorHexForState } from './../Enums';

/**
 * Helper for null display
 */
const d = (x) => !!x ? x : '–';

const formatValueObj = (obj) => {
  if (obj === void 0 || obj === null || obj.value === null) {
    return d(null);
  }

  return d(obj.value);
};

const formatYesNo = (val) =>
  (val === 'YES') ? 'Ano' :
    (val === 'NO') ? 'Ne' :
      d(null);

const formatLatLng = (addr) =>
  !!addr.lat ?
    d(addr.lat) + ", " + d(addr.lng) :
    d(null);

/**
 * Helper for date display
 */
const formatDate = (dt) => {
  if (!dt) {
    return '–';
  }

  const date = new Date(dt)

  return date.toLocaleDateString('cs-CZ');
}


function AddressesInfo({ addresses }) {
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

export function ClientDetail({ clientId }) {
  const [username] = useStore('username', 'risul.kubny@centrum.cz');
  const [apiKey] = useStore('apiKey', 'crm-9c4fde5a37a847c79aae988a7b7528c7');
  const [appUrl] = useStore('appUrl', 'https://app.raynet.cz/api/v2/company/');
  const [selectedCompany, setSelectedCompany] = useStore('selectedCompany');
  const [companyImageData, setCompanyImageData] = useStore('companyImageData', null);

  async function fetchData() {
    setSelectedCompany(null); setCompanyImageData(null);

    const response = await fetch(appUrl + clientId, {
      method: 'GET',
      headers: {
        "X-Instance-Name": "taktozkusime",
        'Authorization': 'Basic ' + btoa(username + ':' + apiKey),
      },
      timeout: 5000
    });

    const json = await response.json();
    const company = json.data;

    setSelectedCompany(company);

    if (company && company.logo && company.logo.id) {
      // fetch image
      const imageResponse = await fetch('https://app.raynet.cz/api/v2/image/' + company.logo.id, {
        method: 'GET',
        headers: {
          "X-Instance-Name": "taktozkusime",
          'Authorization': 'Basic ' + btoa(username + ':' + apiKey),
        },
        timeout: 5000
      });

      const imageData = (await imageResponse.json()).imgData;

      setCompanyImageData(imageData);
    }
  }

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const ratingDisplay = (c) => {
    const stars = c === 'A' ? '&#9733;&#9733;&#9733;' :
      c === 'B' ? '&#9733;&#9733;&#9734;' :
        c === 'C' ? '&#9733;&#9734;&#9734;' :
          '&#9734;&#9734;&#9734;';

    return stars;
  };

  console.log('selectedCompany', selectedCompany);

  const companyInfo = !!selectedCompany ?
    (<>
      <div style={{
        "display": "inline-block",
        "height": "160px",
        "maxWidth": "500px",
        paddingLeft: "8px"
      }}>
        <h2 style={{ "display": "inline-block", width: "500px", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selectedCompany.name}
        </h2><br />
        <i>{selectedCompany.person ? "Fyzická osoba" : "Firma"}</i>
        <br />
        {
          selectedCompany.person && !!selectedCompany.firstName &&
          <>
            <span className="label-client">Jméno:&nbsp;</span>
            <strong>{d(selectedCompany.firstName)}</strong>&nbsp;
          </>
        }
        {
          selectedCompany.person && !!selectedCompany.lastName &&
          <>
            <span className="label-client">Příjmení:&nbsp;</span>
            <strong>{d(selectedCompany.lastName)}</strong>
            <br />
          </>
        }
        <span className="label-client">Vlastník:&nbsp;</span>
        <strong>{selectedCompany.owner && selectedCompany.owner.fullName && d(selectedCompany.owner.fullName)}</strong>
        <br />
        <span style={{ position: "relative" }}>
          <span className="label-client">Rating:&nbsp;</span>{selectedCompany.rating}&nbsp;
            <span className="client-rating" dangerouslySetInnerHTML={{ __html: ratingDisplay(selectedCompany.rating) }}></span>
        </span>
      </div>
      <hr />

      <h4>Základní údaje</h4>
      <div className="row">
        <div className="col-sm-6">

          <span className="label-client">Stav:&nbsp;</span>
          <span style={{ color: colorHexForState(selectedCompany.state) }}>
            {enumDisplayString(selectedCompany.state, State)}
          </span><br />
          <span className="label-client">Vztah:&nbsp;</span>
          <span>{enumDisplayString(selectedCompany.role, Role)}</span><br />

          <span className="label-client">Kategorie:&nbsp;</span>
          <span>{formatValueObj(selectedCompany.category)}</span><br />

          <span className="label-client">Obor:&nbsp;</span>
          <span>{formatValueObj(selectedCompany.economyActivity)}</span><br />

          <span className="label-client">Zdroj kontaktu:&nbsp;</span>
          <span>{formatValueObj(selectedCompany.contactSource)}</span><br />

          <span className="label-client">IČ:&nbsp;</span>
          <span>{selectedCompany.regNumber}</span><br />

          <span className="label-client">DIČ:&nbsp;</span>
          <span>{selectedCompany.taxNumber}</span><br />
        </div>
        <div className="col-sm-6">
          <span className="label-client">Oslovení:&nbsp;</span>
          <span>{selectedCompany.salutation}</span><br />

          <span className="label-client">Obrat:&nbsp;</span>
          <span>{formatValueObj(selectedCompany.turnover)}</span><br />

          <span className="label-client">Zaměstnanců:&nbsp;</span>
          <span>{formatValueObj(selectedCompany.employeesNumber)}</span><br />

          <span className="label-client">Bankovní spojení:&nbsp;</span>
          <span>{selectedCompany.bankAccount}</span><br />

          <span className="label-client">Platební podmínky:&nbsp;</span>
          <span>{formatValueObj(selectedCompany.paymentTerm)}</span><br />

          <span className="label-client">Plátce DPH:&nbsp;</span>
          <span>{formatYesNo(selectedCompany.taxPayer)}</span><br />

          <span className="label-client">Narozeniny/výročí:&nbsp;</span>
          <span>{formatDate(selectedCompany.birthday)}</span>
        </div>
      </div>
      <hr />

      <h4>Adresy a kontakty</h4>
      <div className="row">
        <AddressesInfo addresses={selectedCompany.addresses} />
      </div>
      <hr className="mt-0" />

      <span className="label-client">Poznámka</span>
      <div className="notice" dangerouslySetInnerHTML={{ __html: selectedCompany.notice }}></div>
    </>)
    :
    <i></i>;

  return (
    <div className="modal-detail-body">
      {
        companyImageData === null ?
          (<div style={{ 
            "width": "160px",
            "height": "160px",
            "float": "left",
            textAlign: "center",
            paddingTop: "50px",
            fontStyle: "italic",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "8px"
          }}>Klient nemá žádný obrázek</div>)
        :
          (<img src={companyImageData} alt="Obrázek/logo klienta" style={{ float: "left" }} width="160" height="160" />)
      }
      {companyInfo}
    </div>);
}
/*
//name
//
firstName
lastName
bankAccount
birthday: "2004-10-07"
//owner: {id: 1, fullName: "RAYNET CRM"}

rating: "A"

role: "C_SUPPLIER"
state: "A_POTENTIAL"

rowInfo.createdAt: "2020-08-12 15:54"
notice: "<p>ратататататата</p>"

bankAccount: "string"
legalForm: {id: 48, value: "s.r.o."}
regNumber: "26843820" (IC)
taxNumber: "CZ26843820" (DIC)
taxNumber2: null
taxPayer: null
titleAfter: null
titleBefore: null

economyActivity: {value:"str"}
employeesNumber: {value:"str"}
paymentTerm: {value:"str"}

primaryAddress:
  address:
    city: "Ostrava-Poruba"
    country: "Česká republika"
    countryCode: "CZ"
    id: 1
    lat: 49.827535
    lng: 18.186293
    name: "Sídlo klienta"
    province: null
    street: "Francouzská 6167/5"
    zipCode: "708 00"
    __proto__: Object
  contactAddress: true
  contactInfo:
    email: "info@raynet.cz"
    email2: null
    fax: null
    otherContact: null
    primary: true
    tel1: "+420 553 401 520"
    tel1Type: null
    tel2: null
    tel2Type: null
    www: "raynet.cz"
    __proto__: Object
  id: 1
  primary: true
  territory: null

addresses[] typeofprimaryAddress[]

socialNetworkContact:
  facebook: "raynetsw"
  googleplus: null
  instagram: null
  linkedin: null
  pinterest: null
  skype: null
  twitter: null
  youtube: null


*/