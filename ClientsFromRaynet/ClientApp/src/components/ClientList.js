import React, { useEffect } from 'react';
import { useTable, useSortBy} from 'react-table';
import styled from 'styled-components';
import { enumDisplayString, Role, State, colorHexForState } from './../Enums';
import { NavLink } from 'reactstrap';
import { Link, useParams} from 'react-router-dom';
import { useStore } from 'react-context-hook';
import Modal from 'react-modal';
import { ClientDetail } from './ClientDetail';
import { getColorForCategory } from '../Helpers';
import { LoadingElement, SearchBox } from './Subcomponents';

const Styles = styled.div`
padding: 1rem;

table {
  border-spacing: 0;
  border: none;
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
    color: white;
    font-weight: bold;
    th:first-child { border-radius: 10px 0 0 0; }
    th:last-child { border-radius: 0 10px 0 0; }
  }

  th,
  td {
    margin: 0;
    padding: 0.5rem;
    border-bottom: 1px solid grey;
    border-right: none;
    border-left: none;
    max-width: 21rem;
    overflow-x: hidden;
    text-overflow: ellipsis;

    :last-child {
      border-right: 0;
    }
  }
}


#search-box {
  margin-bottom: 16px;
  border: 1px solid rgb(100, 100, 100);
  padding-left: 8px;
  border-radius: 10px;
  font-size: 18px;

  :focus {
    border-radius: 10px;
    box-shadow: none;
    outline: 0 none;
  }
}

td > .nav-link {
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 600;
}

tbody {
  tr[role="row"] {
    :nth-child(odd) {
      background: rgb(255, 255, 255);
    }
    :nth-child(even) {
      background: rgb(230, 230, 230);
    }
    :hover {
      background: #e0fcd4;
    }
  }
}

.text-link {
  :hover {
    text-decoration: underline;
  }
}
`;

/**
 * Style object for Modal
 * */
const customModalStyles = {
  content: {
    top: '46%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }
};

/**
 * Table component using react-table
 */
function Table({ columns, data }) {
  const sortByInitial = React.useMemo(
    () => [{ id: 'name' } ],
    []
  );

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
      autoResetSortBy: false,
      disableSortRemove: true,
      initialState: {
        sortBy: sortByInitial
      }
    },
    useSortBy
  );

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

let isFirstLoad = true;
let companyCategories = [];

/**
 * Main clients component
 * */
export function ClientList() {
  const { clientId } = useParams();
  const [searchValue] = useStore('searchValue', null);
  const [companies, setCompanies] = useStore('companies', []);
  const [isLoading, setIsLoading] = useStore('isLoading', false);
  const [isModalOpened, setIsModalOpened] = useStore('isModalOpened', !isNaN(clientId));
  const [username] = useStore('username', 'risul.kubny@centrum.cz');
  const [apiKey] = useStore('apiKey', 'crm-9c4fde5a37a847c79aae988a7b7528c7');
  const [appUrl] = useStore('appUrl', 'https://app.raynet.cz/api/v2/company/');
  const [selectedCompany, setSelectedCompany] = useStore('selectedCompany', null);
  const [categories, setCategories] = useStore('categories', companyCategories);

  if (isFirstLoad) {
    // Load company categories
    isFirstLoad = false;

    async function fetchCategories() {
      const categoriesUrl = 'https://app.raynet.cz/api/v2/companyCategory/';

      setCategories([]);

      const response = await fetch(categoriesUrl, {
        method: 'GET',
        headers: {
          "X-Instance-Name": "taktozkusime",
          'Authorization': 'Basic ' + btoa(username + ':' + apiKey),
        },
        timeout: 5000
      });

      const json = await response.json();

      companyCategories = json.data;
      setCategories(companyCategories);
    }

    fetchCategories();
  }

  // Sorting functions for enums
  const sortState = React.useMemo(
    () => {
      return function (rowA, rowB) {
        const stateA = rowA.values.state;
        const stateB = rowB.values.state;

        const displayStrA = enumDisplayString(stateA, State);
        const displayStrB = enumDisplayString(stateB, State);

        return displayStrA.localeCompare(displayStrB);
      };
    }, [searchValue]
  );
  const sortRole = React.useMemo(
    () => {
      return function (rowA, rowB) {
        const roleA = rowA.values.role;
        const roleB = rowB.values.role;

        const displayStrA = enumDisplayString(roleA, Role);
        const displayStrB = enumDisplayString(roleB, Role);

        return displayStrA.localeCompare(displayStrB);
      };
    }, [searchValue]
  );


  // Get table columns
  const columns = React.useMemo(
    () => [
      {
        Header: 'Název/jméno',
        accessor: 'name',
        Cell: (info) => {
          const client = info.row.original;
          const val = info.cell.value;
          const url = "/client/" + client.id;

          return (
            <NavLink tag={Link} className="text-link"
              to={{ pathname: url, state: client }}
              onClick={() => {
                setSelectedCompany(client);
                setIsModalOpened(true);
              }}>
              {val}
            </NavLink>
          );
        },
        width: 400
      },
      {
        Header: 'Stav',
        accessor: 'state',
        Cell: (info) => {
          return (<span style={{ "color": colorHexForState(info.cell.value) }}>
            {enumDisplayString(info.cell.value, State)}
          </span>);
        },
        sortType: sortState
      },
      {
        Header: 'Vztah',
        accessor: 'role',
        Cell: (info) => {
          return enumDisplayString(info.cell.value, Role);
        },
        sortType: sortRole
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
        Cell: (info) => {
          const categoryName = (info.cell.value || '').trim();
          const color = getColorForCategory(categoryName, companyCategories);

          return <span style={{ backgroundColor: '#' + color }} className="category-cell">{categoryName}</span>
        }
      },
    ],
    []
  );

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const queryPart = searchValue !== null && searchValue !== '' ?
        ('?fulltext=' + searchValue)
        : '';

      const response = await fetch(appUrl + queryPart, {
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

    fetchData();
  }, [searchValue]);

  return (
    <Styles>
      <SearchBox />

      {isLoading && <LoadingElement />}
      <Table columns={columns} data={companies} />

      <Modal
        isOpen={isModalOpened}
        style={customModalStyles}
        onRequestClose={(e) => { setIsModalOpened(false); }}
        contentLabel="Client info modal">
        <div className="container">
          <div className="row modal-header-row">
            <button id="close-modal-btn" onClick={() => { setIsModalOpened(false); }}>&#10005;</button>
          </div>
        </div>
        <ClientDetail clientId={clientId} />
      </Modal>
    </Styles>
  );
}
