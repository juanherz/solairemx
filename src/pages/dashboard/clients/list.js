// src/pages/dashboard/clients/list.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableHeadCustom, TableEmptyRows, TableNoData } from '../../../components/table';
import { ClientTableToolbar, ClientTableRow } from '../../../sections/@dashboard/clients/list';
import axios from '../../../utils/axios';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', align: 'left' },
  { id: 'company', label: 'Compañía', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Teléfono', align: 'left' },
  { id: '' },
];

ClientsList.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function ClientsList() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();
  const { push } = useRouter();

  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/clients');
        setTableData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleFilterName = (value) => {
    setFilterName(value);
    setPage(0);
  };

  const handleDeleteRow = async (id) => {
    try {
      await axios.delete(`/api/clients/${id}`);
      const updatedData = tableData.filter((row) => row._id !== id);
      setTableData(updatedData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditRow = (id) => {
    push(`${PATH_DASHBOARD.clients.root}/${id}/edit`);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = !dataFiltered.length && !!filterName;

  return (
    <Page title="Clientes: Lista">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lista de Clientes"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Clientes', href: PATH_DASHBOARD.clients.list },
          ]}
          action={
            <Button variant="contained" onClick={() => push(PATH_DASHBOARD.clients.new)}>
              Nuevo Cliente
            </Button>
          }
        />

        <Card>
          <ClientTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ClientTableRow
                        key={row._id}
                        row={row}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order2 = comparator(a[0], b[0]);
    if (order2 !== 0) return order2;
    return a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    filteredData = filteredData.filter(
      (item) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.company?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.email?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return filteredData;
}
