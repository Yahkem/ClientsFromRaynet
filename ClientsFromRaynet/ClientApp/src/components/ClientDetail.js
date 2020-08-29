import React, { useEffect } from 'react';
import { useStore } from 'react-context-hook';

export function ClientDetail({ clientId }) {
  const [username, setUsername, deleteUsername] = useStore('username', 'risul.kubny@centrum.cz');
  const [apiKey, setApiKey, deleteApiKey] = useStore('apiKey', 'crm-9c4fde5a37a847c79aae988a7b7528c7');
  const [appUrl, setAppUrl, deleteAppUrl] = useStore('appUrl', 'https://app.raynet.cz/api/v2/company/');
  const [selectedCompany, setSelectedCompany, deleteSelectedCompany] = useStore('selectedCompany');
  const [companyImageData, setCompanyImageData, deleteCompanyImageData] = useStore('companyImageData', null);

  async function fetchData() {
    setSelectedCompany(null); setCompanyImageData(null);
    console.log('clientIdclientIdclientId', clientId)

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
    console.log('setSelectedCompany=', company)

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
      console.log('kekekek', imageData);

      setCompanyImageData(imageData);
    }
  }

  useEffect(() => {
    fetchData();
  }, [clientId]);

  /**
   * Helper for null display
   */
  const d = (x) => !!x ? x : '–';

  /**
   * Helper for date display
   */
  const formatDate = (dt) => {
    if (!!dt) {
      return '–';
    }

    const date = new Date(dt)

    return date.toLocaleDateString('cs-CZ');
  }

  const companyInfo = !!selectedCompany ?
    (<>
      <div style={{
        "display": "inline-block",
        "height": "160px",
        "maxWidth": "500px",
        paddingLeft: "8px"}}>
        <h2 style={{ "display": "inline-block", width: "500px", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selectedCompany.name}
        </h2><br />
          <i>{selectedCompany.person ? "Fyzická osoba" : "Firma"}</i>
          <br />
          Jméno:&nbsp;<strong>{d(selectedCompany.firstName)}</strong>&nbsp;
          Příjmení:&nbsp;<strong>{d(selectedCompany.lastName)}</strong>
        <br />
        Narozeniny/Výročí:&nbsp;<strong>{formatDate(selectedCompany.birthday)}</strong>
      </div>
      <br />
      <div dangerouslySetInnerHTML={{ __html: selectedCompany.notice }}></div>
      <br />
      selectedCompany={JSON.stringify(selectedCompany, null, " ")}
    </>)
    :
    <i></i>;

  return (
    <div style={{ "maxWidth": "700px", "maxHeight": "700px" }}>
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
//legalForm: {id: 48, value: "s.r.o."}
firstName
lastName
bankAccount
birthday: "2004-10-07"
//owner: {id: 1, fullName: "RAYNET CRM"}

rating: "A"
regNumber: "26843820"
role: "C_SUPPLIER"
state: "A_POTENTIAL"

rowInfo.createdAt: "2020-08-12 15:54"
notice: "<p>ратататататата</p>"

taxNumber: "CZ26843820"
taxNumber2: null
taxPayer: null
titleAfter: null
titleBefore: null

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