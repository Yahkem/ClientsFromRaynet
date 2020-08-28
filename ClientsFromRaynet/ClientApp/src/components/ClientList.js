import React, { Component, useState, useEffect, setState, useCallback } from 'react';
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

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
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
width:calc(100% - 100px); height: calc(100% - 120px); background: rgba(127, 127, 127, 0.3);
  }

#search-box {
  margin-bottom: 16px;

}
`;

/**
 * Table from react-table
 */
function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20)

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
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
          {firstPageRows.map(
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
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  )
}

/**
 * Main component
 * */
export function ClientList() {
  function getTableColumns() {
    return React.useMemo(
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
  }

  const [companies, setCompanies, deleteCompanies] = useStore('companies', []);
  const [isLoading, setIsLoading, deleteIsLoading] = useStore('isLoading', false);
  const [username, setUsername, deleteUsername] = useStore('username', 'risul.kubny@centrum.cz');
  const [apiKey, setApiKey, deleteApiKey] = useStore('apiKey', 'crm-9c4fde5a37a847c79aae988a7b7528c7');

  const columns = getTableColumns();
  const url = 'https://app.raynet.cz/api/v2/company/';
  //let [requests, setRequests] = useStore('requests', -1);

  useEffect(() => {
    async function fetchData(searchValue) {
      //const username = 'risul.kubny@centrum.cz';
      //const pw = 'crm-9c4fde5a37a847c79aae988a7b7528c7';
      //const searchValue = document.getElementById('search-box').value;

      setIsLoading(true);
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
    }

    fetchData(searchValue);
  }, [searchValue]);

  return (
    <Styles>
      <SearchBox />
      {isLoading && <LoadingElement />}
      <Table columns={columns} data={companies} />
    </Styles>
  );
}


function LoadingElement() {
  const loadingElement = <div className="loading-div">Loading...</div>;

  return loadingElement;
}

function SearchBox() {
  //const [searchValue, setSearchValue] = useState(searchValue2);
  const [searchValue, setSearchValue, deleteSearchValue] = useStore('searchValue', null)

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