import React from 'react';
import { d, formatValueObj, formatDate, formatYesNo, getColorForCategory } from '../Helpers';
import { colorHexForState, enumDisplayString, Role, State } from '../Enums';


export function BasicInfoRow({ client, categories }) {
  const categoryColor = client && client.category && client.category.value ?
    getColorForCategory(client.category.value, categories)
    : null;

  return (<div className="row">
    <div className="col-sm-6">

      <span className="label-client">Stav:&nbsp;</span>
      <span style={{ color: colorHexForState(client.state) }}>
        {enumDisplayString(client.state, State)}
      </span><br />
      <span className="label-client">Vztah:&nbsp;</span>
      <span>{enumDisplayString(client.role, Role)}</span><br />

      <span className="label-client">Kategorie:&nbsp;</span>
      <span style={{ backgroundColor: '#' + categoryColor }}
        className="category-cell">
        {formatValueObj(client.category)}
      </span><br />

      <span className="label-client">Obor:&nbsp;</span>
      <span>{formatValueObj(client.economyActivity)}</span><br />

      <span className="label-client">Zdroj kontaktu:&nbsp;</span>
      <span>{formatValueObj(client.contactSource)}</span><br />

      <span className="label-client">IČ:&nbsp;</span>
      <span>{d(client.regNumber)}</span><br />

      <span className="label-client">DIČ:&nbsp;</span>
      <span>{d(client.taxNumber)}</span><br />
    </div>
    <div className="col-sm-6">
      <span className="label-client">Oslovení:&nbsp;</span>
      <span>{d(client.salutation)}</span><br />

      <span className="label-client">Obrat:&nbsp;</span>
      <span>{formatValueObj(client.turnover)}</span><br />

      <span className="label-client">Zaměstnanců:&nbsp;</span>
      <span>{formatValueObj(client.employeesNumber)}</span><br />

      <span className="label-client">Bankovní spojení:&nbsp;</span>
      <span>{d(client.bankAccount)}</span><br />

      <span className="label-client">Platební podmínky:&nbsp;</span>
      <span>{formatValueObj(client.paymentTerm)}</span><br />

      <span className="label-client">Plátce DPH:&nbsp;</span>
      <span>{formatYesNo(client.taxPayer)}</span><br />

      <span className="label-client">Narozeniny/výročí:&nbsp;</span>
      <span>{formatDate(client.birthday)}</span>
    </div>
  </div>);
}
