﻿import React, { Component, useState, useEffect, setState, useCallback } from 'react';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';
import { roleDisplayString, stateDisplayString, enumDisplayString, Role, State } from './../Enums';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useStore } from 'react-context-hook';


const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    thead {
      background: #00b6d4;
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      max-width: 21rem;
      overflow-x: hidden;
      text-overflow: ellipsis;

      :last-child {
        border-right: 0;
      }
    }
  }

  .loading-div {
  position: absolute;
left: 0;
text-align: center;
width: 100%;
  }
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
  margin-top: 40px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
background: linear-gradient(white, #00b6d4, white);
  border-radius: 50%;
  border: 6px solid #00b6d4;
  border-color: #00b6d4 transparent #00b6d4 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


#search-box {
  margin-bottom: 16px;

}
`;

let isFirstLoad = true;
// #region Subcomponents

/**
 * Table from react-table
 */
function Table({ columns, data }) {

  const sortedData = data.sort((a, b) => {
    return a.name.localeCompare(b.name);
  })
  console.log('datata', data, 'sortedData', sortedData)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  //const firstPageRows = rows.slice(0, 20)
  //console.log('columns', columns);
  if (isFirstLoad) {
    const nameColumn = (function () {
      for (const h of headerGroups) {
        for (const column of h.headers) {
          if (column.id === 'name') {
            return column;
          }
        }
      }
      return null;
    })();
    setTimeout(() => {
      console.log('BOOM')
      nameColumn.toggleSortBy();

    }, 700)
    isFirstLoad = false;
  }

  return (
    <>
      <table {...getTableProps()} id="clients-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */ }
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </table>
    </>
  )
}

function LoadingElement() {
  const loadingElement = <div className="loading-div"><div className="lds-dual-ring"></div></div>;

  return loadingElement;
}

function SearchBox() {
  //const [searchValue, setSearchValue] = useState(searchValue2);
  const [searchValue, setSearchValue, deleteSearchValue] = useStore('searchValue', null);

  let timeoutHandle = null;
  const debounceSearchValue = function (inputEl) {
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(() => {
      setSearchValue(inputEl.value);
      console.log('setting...', inputEl.value, 'storeValue=', searchValue)
    }, 700);
  }

  const searchBoxInputEl = (<input type="text"
    placeholder="Hledat 🔍"
    id="search-box"
    onInput={(e) => { debounceSearchValue(e.target); }} />);

  return searchBoxInputEl;
}

// #endregion Subcomponents
/**
 * Main component
 * */
export function ClientList() {
  const [searchValue, setSearchValue, deleteSearchValue] = useStore('searchValue', null);
  const [companies, setCompanies, deleteCompanies] = useStore('companies', []);
  const [isLoading, setIsLoading, deleteIsLoading] = useStore('isLoading', false);
  const [username, setUsername, deleteUsername] = useStore('username', 'risul.kubny@centrum.cz');
  const [apiKey, setApiKey, deleteApiKey] = useStore('apiKey', 'crm-9c4fde5a37a847c79aae988a7b7528c7');

  async function fetchData() {
    //const username = 'risul.kubny@centrum.cz';
    //const pw = 'crm-9c4fde5a37a847c79aae988a7b7528c7';
    //const searchValue = document.getElementById('search-box').value;

    setIsLoading(true);
    //toggleLoadingForTable(true, setIsLoading);
    console.log('seaasfsearchValue', searchValue)

    const queryPart = searchValue !== null && searchValue !== '' ?
      ('?fulltext=' + searchValue)
      : '';

    const response = await fetch(url + queryPart, {
      method: 'GET',
      headers: {
        "X-Instance-Name": "taktozkusime",
        'Authorization': 'Basic ' + btoa(username + ':' + apiKey),
      },
      timeout: 5000
    });

    const json = await response.json();

    setCompanies(json.data);
    setIsLoading(false);
    //toggleLoadingForTable(false, setIsLoading);
  }

  // Get table columns
  const columns = React.useMemo(
    () => [
      {
        Header: 'Název/jméno',
        accessor: 'name',
        Cell: (info) => {
          const client = info.row.original;
          const val = info.cell.value;
          const url = "/company/" + client.id;

          return (
            <NavLink tag={Link} className="text-link"
              to={{ pathname: url, state: client }}>
              {val}
            </NavLink>
          );
        }
      },
      {
        Header: 'Stav',
        accessor: 'state',
        Cell: (info) => {
          return enumDisplayString(info.cell.value, State);
        }
      },
      {
        Header: 'Vztah',
        accessor: 'role',
        Cell: (info) => {
          return enumDisplayString(info.cell.value, Role);
        }
      },
      {
        Header: 'Rating',
        accessor: 'rating',
      },
      {
        Header: 'Vlastník',
        accessor: 'owner.fullName',
      },
      {
        Header: 'IČ',
        accessor: 'regNumber',
      },
      {
        Header: 'Město',
        accessor: 'primaryAddress.address.city',
      },
      {
        Header: 'Kategorie',
        accessor: 'category.value',
      },
    ],
  );

  const url = 'https://app.raynet.cz/api/v2/company/';
  //let [requests, setRequests] = useStore('requests', -1);

  useEffect(() => {
    fetchData();
  }, [searchValue]);

  return (
    <Styles>
      <SearchBox />
      {isLoading && <LoadingElement />}
      <Table columns={columns} data={companies} />
    </Styles>
  );
}
