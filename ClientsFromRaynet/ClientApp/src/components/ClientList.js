import React, { useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
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
}


#search-box {
  margin-bottom: 16px;
  border-radius: 10px;
  font-size: 18px;
}

.text-link {
  :hover {
    text-decoration: underline;
  }
}

.pagination {
  padding: .5rem;

  button {
    border: none;
    color: #0366d6;
    font-size: 1.3rem;
    margin: 0 1px 0 1px;
    padding: 0 6px 4px 6px;
    line-height: 0;
    background: transparent;

    :focus {
      outline: 0 none;
      box-shadow: none;
    }

    :hover {
      text-decoration: underline;
    }

    &[disabled] {
      color: rgb(150, 150, 150);
    }
  }

  .set-page-size {
    padding-top: 2px;
    padding-left: 12px;
  }

  .page-numbers {
    margin: 0 8px;

    input {
      width: 54px;
      margin-top: 2px;
    }
  }
}
`;

/**
 * Style object for modal window
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

  const [pageIdx, setPageIdx] = useStore('pageIndex', 0);
  const availablePageSizes = [5, 10, 20, 30, 40, 50, 75, 100];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageSize }
  } = useTable(
    {
      columns,
      data,
      autoResetSortBy: false,
      disableSortRemove: true,
      initialState: {
        sortBy: sortByInitial,
        pageIndex: pageIdx
      }
    },
    useSortBy,
    usePagination
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
          {page.map((row, i) => {
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

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => { setPageIdx(0); return gotoPage(0); }} disabled={!canPreviousPage}>
          {'|<'}
        </button>
        <button onClick={() => { setPageIdx(pageIdx - 1); return previousPage() }} disabled={!canPreviousPage}>
          {'<'}
        </button>

        <span className="page-numbers">
          <input
            type="number"
            min="1"
            max={pageCount}
            value={pageIdx + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;

              setPageIdx(page);
              gotoPage(page)
            }} />
          <span> z {pageOptions.length}</span>
        </span>

        <button onClick={() => { setPageIdx(pageIdx + 1); nextPage() }} disabled={!canNextPage}>
          {'>'}
        </button>
        <button
          onClick={() => {
            const lastPage = pageCount - 1;
            setPageIdx(lastPage);
            gotoPage(lastPage)
          }}
          disabled={!canNextPage}>
          {'>|'}
        </button>

        <div className="set-page-size">
          Zobrazit{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}>
            {availablePageSizes.map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          {' '}záznamů
        </div>
      </div>
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
  const [selectedClient, setSelectedClient] = useStore('selectedClient', null);
  const [categories, setCategories] = useStore('categories', companyCategories);

  if (isFirstLoad) {
    // Load company categories during 1st load
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


  // Table column definition
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
                setSelectedClient(client);
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

  // Fetch data with 'fulltext' parameter when search value is changed
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
