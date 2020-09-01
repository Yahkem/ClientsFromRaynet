import React, { useEffect, useState } from 'react';
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
  const [selectedClient, setSelectedClient] = useStore('selectedClient');
  const [clientImageData, setClientImageData] = useStore('clientImageData', null);
  const [categories] = useStore('categories');
  const [isDetailLoading, setIsDetailLoading] = useStore('isDetailLoading', false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [useModal, setUseModal] = useStore('useModal');

  async function fetchData() {
    setIsDetailLoading(true);
    setSelectedClient(null);
    setClientImageData(null);

    const response = await fetch(appUrl + clientId, {
      method: 'GET',
      headers: {
        "X-Instance-Name": "taktozkusime",
        'Authorization': 'Basic ' + btoa(username + ':' + apiKey),
      },
      timeout: 5000
    });

    const json = await response.json();
    const client = json.data;

    setSelectedClient(client);
    setIsDetailLoading(false);

    if (client && client.logo && client.logo.id) {
      // Fetch image
      setIsImageLoading(true);

      const imageResponse = await fetch('https://app.raynet.cz/api/v2/image/' + client.logo.id, {
        method: 'GET',
        headers: {
          "X-Instance-Name": "taktozkusime",
          'Authorization': 'Basic ' + btoa(username + ':' + apiKey),
        },
        timeout: 5000
      });

      const imageData = (await imageResponse.json()).imgData;

      setClientImageData(imageData);
      setIsImageLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const clientInfo = !!selectedClient ?
    (<>
      <div className="client-name-container">
        <h2 className="client-name">
          {selectedClient.name}
        </h2>

        <i>{selectedClient.person ? "Fyzická osoba" : "Firma"}</i>

        <table className="client-info-table">
          <tbody>
          {
            selectedClient.person &&
              <tr>
                <td>
                  <span className="label-client">Jméno:</span>
                </td>
                <td>
                  <strong className="client-firstname">{d(selectedClient.firstName)}</strong>
                </td>
                <td>
                  <span className="label-client">Příjmení:</span>
                </td>
                <td>
                  <strong className="client-surname">{d(selectedClient.lastName)}</strong>
                </td>
              </tr>
            }
            <tr>
              <td>
                <span className="label-client">Vlastník:</span>
              </td>
              <td colSpan="3">
                <strong>
                  {selectedClient.owner && selectedClient.owner.fullName && d(selectedClient.owner.fullName)}
                </strong>
              </td>
            </tr>
            <tr>
              <td>
                <span className="label-client">Rating:</span>
              </td>
              <td colSpan="3">
                <strong>
                  <span className="rating-container">
                    <strong>{selectedClient.rating}&nbsp;</strong>
                    <span className="client-rating" dangerouslySetInnerHTML={{ __html: ratingDisplay(selectedClient.rating) }}></span>
                  </span>
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />

      <h4>Základní údaje</h4>
      <BasicInfoRow client={selectedClient} categories={categories} />
      <SocialNetworkContacts client={selectedClient} />
      <hr />

      <h4>Adresy a kontakty</h4>
      <div className="row">
        <AddressesInfo addresses={selectedClient.addresses} />
      </div>
      <hr className="mt-0" />

      <span className="label-client">Poznámka</span>
      <div className="notice" dangerouslySetInnerHTML={{ __html: selectedClient.notice }}></div>
    </>)
    :
    <i></i>;
  
  return (
    <div className="modal-detail-body">
      {
        isDetailLoading ? <LoadingElement /> :
          isImageLoading ? <LoadingElement className="loading-img" /> :
            clientImageData !== null ?
              (<img src={clientImageData}
                alt="Obrázek/logo klienta"
                className="client-image"
                width="160" height="160" />)
              :
              (useModal || selectedClient) ?
                (<div className="no-client-image">Klient nemá žádný obrázek</div>)
                : ''
      }
      {clientInfo}
    </div>);
}
