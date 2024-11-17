// src/pages/dashboard/sales/list.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Divider,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../components/table';
import { SaleTableToolbar, SaleTableRow } from '../../../sections/@dashboard/sales/list';
import axios from '../../../utils/axios';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

const STATUS_OPTIONS = ['all', 'Pagado', 'Parcial', 'No Pagado'];

const TABLE_HEAD = [
    { id: 'saleNumber', label: 'Número de Venta', align: 'left' },
    { id: 'customerName', label: 'Cliente', align: 'left' },
    { id: 'saleDate', label: 'Fecha de Venta', align: 'left' },
    { id: 'totalAmount', label: 'Total', align: 'left' },
    { id: 'national', label: 'Nacional', align: 'center' },
    { id: 'amountOwed', label: 'Adeudo', align: 'left' },
    { id: 'status', label: 'Estado', align: 'left' },
    { id: 'actions', label: 'Acciones', align: 'center' }, // New Column
  ];

SalesList.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

function applySortFilter({ tableData, comparator, filterName, filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order2 = comparator(a[0], b[0]);
    if (order2 !== 0) return order2;
    return a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    const filterNameLower = filterName.toLowerCase();
    filteredData = filteredData.filter((item) => {
      const clientName = item.client?.name?.toLowerCase() || '';
      const saleNumber = item.saleNumber.toLowerCase();
      return clientName.includes(filterNameLower) || saleNumber.includes(filterNameLower);
    });
  }

  if (filterStatus !== 'all') {
    filteredData = filteredData.filter((item) => item.status === filterStatus);
  }

  return filteredData;
}

export default function SalesList() {
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
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/sales');
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

  const handleFilterStatus = (event, newValue) => {
    onChangeFilterStatus(event, newValue);
    setPage(0);
  };

  const handleViewRow = (id) => {
    push(`${PATH_DASHBOARD.sales.root}/${id}`);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const isNotFound = !dataFiltered.length && !!(filterName || filterStatus !== 'all');

  return (
    <Page title="Ventas: Lista">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lista de Ventas"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Ventas', href: PATH_DASHBOARD.sales.list },
          ]}
          action={
            <Button
              variant="contained"
              onClick={() => push(PATH_DASHBOARD.sales.new)}
            >
              Nueva Venta
            </Button>
          }
        />

        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((option) => (
              <Tab key={option} label={option} value={option} />
            ))}
          </Tabs>

          <Divider />

          <SaleTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            optionsStatus={STATUS_OPTIONS}
          />

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
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <SaleTableRow
                      key={row._id}
                      row={row}
                      onViewRow={() => handleViewRow(row._id)}
                    />
                  ))}

                  <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

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