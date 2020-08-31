import React from 'react';
import { d, formatValueObj, formatDate, formatYesNo, getColorForCategory } from '../Helpers';
import { colorHexForState, enumDisplayString, Role, State } from '../Enums';


export function BasicInfoRow({ client, categories }) {
  const categoryColor = client && client.category && client.category.value ?
    getColorForCategory(client.category.value, categories)
    : null;

  return (<div className="row">
    <div className="col-sm-6">
      <table className="client-info-table">
        <tbody>
          <tr>
            <td>
              <span className="label-client">Stav:</span>
            </td>
            <td>
              <span style={{ color: colorHexForState(client.state) }}>
                {enumDisplayString(client.state, State)}
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Vztah:</span>
            </td>
            <td>
              <span>{enumDisplayString(client.role, Role)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Kategorie:</span>
            </td>
            <td>
              <span style={{ backgroundColor: '#' + categoryColor }}
                className={categoryColor ? "category-cell" : ""}>
                {formatValueObj(client.category)}
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Obor:</span>
            </td>
            <td>
              <span>{formatValueObj(client.economyActivity)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Zdroj&nbsp;kontaktu:</span>
            </td>
            <td>
              <span>{formatValueObj(client.contactSource)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">IČ:</span>
            </td>
            <td>
              <span>{d(client.regNumber)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">DIČ:</span>
            </td>
            <td>
              <span>{d(client.taxNumber)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="col-sm-6">
      <table className="client-info-table">
        <tbody>
          <tr>
            <td>
              <span className="label-client">Oslovení:</span>
            </td>
            <td>
              <span>{d(client.salutation)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Obrat:</span>
            </td>
            <td>
              <span>{formatValueObj(client.turnover)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Zaměstnanců:</span>
            </td>
            <td>
              <span>{formatValueObj(client.employeesNumber)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Bankovní&nbsp;spojení:</span>
            </td>
            <td>
              <span>{d(client.bankAccount)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Platební&nbsp;podmínky:</span>
            </td>
            <td>
              <span>{formatValueObj(client.paymentTerm)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Plátce&nbsp;DPH:</span>
            </td>
            <td>
              <span>{formatYesNo(client.taxPayer)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="label-client">Narozeniny/výročí:</span>
            </td>
            <td>
              <span>{formatDate(client.birthday)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>);
}
