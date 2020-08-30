import React, { useEffect } from 'react';
import { useStore } from 'react-context-hook';
import { enumDisplayString, Role, State, colorHexForState } from './../Enums';
import { getColorForCategory, ratingDisplay, d, formatDate, formatYesNo, formatValueObj, formatLatLng } from '../Helpers';
import { LoadingElement, AddressesInfo } from './Subcomponents';


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

  

  const categoryColor = selectedCompany && selectedCompany.category && selectedCompany.category.value ?
    getColorForCategory(selectedCompany.category.value, categories)
    : null;

  console.log('selectedCompany', selectedCompany);
  const socNetData = (!!selectedCompany && selectedCompany.socialNetworkContact) ?
    selectedCompany.socialNetworkContact
    : {};

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
      <div className="row">
        <div className="col-sm-6">

          <span className="label-client">Stav:&nbsp;</span>
          <span style={{ color: colorHexForState(selectedCompany.state) }}>
            {enumDisplayString(selectedCompany.state, State)}
          </span><br />
          <span className="label-client">Vztah:&nbsp;</span>
          <span>{enumDisplayString(selectedCompany.role, Role)}</span><br />

          <span className="label-client">Kategorie:&nbsp;</span>
          <span style={{ backgroundColor: '#' + categoryColor }}
            className="category-cell">
            {formatValueObj(selectedCompany.category)}
          </span><br />

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
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3 social-row">
            <div className={"icon-social icon-fb" + (socNetData.facebook ? ' icon-active' : '')}>
              {socNetData.facebook && <a href={socNetData.facebook }></a>}
            </div>
            <div className={"icon-social icon-twitter" + (socNetData.twitter ? ' icon-active' : '')}>
              {socNetData.twitter && <a href={socNetData.twitter}></a>}
            </div>
            <div className={"icon-social icon-linkedin" + (socNetData.linkedin ? ' icon-active' : '')}>
              {socNetData.linkedin && <a href={socNetData.linkedin}></a>}
            </div>
            <div className={"icon-social icon-pinterest" + (socNetData.pinterest ? ' icon-active' : '')}>
              {socNetData.pinterest && <a href={socNetData.pinterest}></a>}
            </div>
            <div className={"icon-social icon-instagram" + (socNetData.instagram ? ' icon-active' : '')}>
              {socNetData.instagram && <a href={socNetData.instagram}></a>}
            </div>
            <div className={"icon-social icon-skype" + (socNetData.skype ? ' icon-active' : '')}>
              {socNetData.skype && <a href={"skype:" + socNetData.skype + "?chat"}></a>}
            </div>
            <div className={"icon-social icon-yt" + (socNetData.youtube ? ' icon-active' : '')}>
              {socNetData.youtube && <a href={socNetData.youtube}></a>}
            </div>
          </div>
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
        isDetailLoading ? <LoadingElement /> :
          companyImageData === null ?
            (<div class="no-client-image">Klient nemá žádný obrázek</div>)
          : (<img src={companyImageData} alt="Obrázek/logo klienta" className="client-image" width="160" height="160" />)
      }
      {companyInfo}
    </div>);
}
