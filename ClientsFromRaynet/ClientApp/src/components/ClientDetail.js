import React, { useEffect } from 'react';
import { useStore } from 'react-context-hook';
import { ratingDisplay, d } from '../Helpers';
import { LoadingElement } from './Subcomponents';
import { SocialNetworkContacts } from './SocialNetworkContacts';
import { AddressesInfo } from './AddressesInfo';
import { BasicInfoRow } from './BasicInfoRow';  


export function ClientDetail({ clientId }) {
  const [username] = useStore('username', 'risul.kubny@centrum.cz');
  const [apiKey] = useStore('apiKey', 'crm-9c4fde5a37a847c79aae988a7b7528c7');
  const [appUrl] = useStore('appUrl', 'https://app.raynet.cz/api/v2/company/');
  const [selectedCompany, setSelectedCompany] = useStore('selectedCompany');
  const [companyImageData, setCompanyImageData] = useStore('companyImageData', null);
  const [categories, setCategories] = useStore('categories');
  const [isDetailLoading, setIsDetailLoading] = useStore('isDetailLoading', false);

  async function fetchData() {
    setIsDetailLoading(true);
    setSelectedCompany(null);
    setCompanyImageData(null);

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
    setIsDetailLoading(false);

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

  const companyInfo = !!selectedCompany ?
    (<>
      <div className="client-logo-wrapper">
        <h2 className="client-name">
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
        <span className="rating-wrapper">
          <span className="label-client">Rating:&nbsp;</span>{selectedCompany.rating}&nbsp;
            <span className="client-rating" dangerouslySetInnerHTML={{ __html: ratingDisplay(selectedCompany.rating) }}></span>
        </span>
      </div>
      <hr />

      <h4>Základní údaje</h4>
      <BasicInfoRow client={selectedCompany} categories={categories} />
      <SocialNetworkContacts client={selectedCompany} />
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
        isDetailLoading ? <LoadingElement /> :
          companyImageData === null ?
            (<div className="no-client-image">Klient nemá žádný obrázek</div>)
          : (<img src={companyImageData} alt="Obrázek/logo klienta" className="client-image" width="160" height="160" />)
      }
      {companyInfo}
    </div>);
}
