// src/pages/dashboard/orders/list.js

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
import Layout from '../../../layouts';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableHeadCustom, TableEmptyRows, TableNoData } from '../../../components/table';
import { OrderTableToolbar, OrderTableRow } from '../../../sections/@dashboard/orders/list';
import axios from '../../../utils/axios';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

const TABLE_HEAD = [
  { id: 'deliveryDate', label: 'Fecha de Entrega', align: 'left' },
  { id: 'client', label: 'Cliente', align: 'left' },
  { id: 'items', label: 'Productos', align: 'left' },
  { id: 'negotiatedPrice', label: 'Precio Total', align: 'right' },
  { id: 'currency', label: 'Moneda', align: 'left' },
  { id: 'status', label: 'Estado', align: 'left' },
  { id: 'fulfillmentStatus', label: 'Nivel de Cumplimiento', align: 'left' },
  { id: '' },
];

OrdersList.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function OrdersList() {
  const {
    dense,
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
  const [filterStatus, setFilterStatus] = useState('all');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/orders');
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

  const handleFilterStatus = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = (id) => {
    setSelectedOrderId(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/orders/${selectedOrderId}`);
      const updatedData = tableData.filter((row) => row._id !== selectedOrderId);
      setTableData(updatedData);
      setOpenConfirmDialog(false);
      setSelectedOrderId(null);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al eliminar el pedido', { variant: 'error' });
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setSelectedOrderId(null);
  };

  const handleEditRow = (id, status) => {
    if (status !== 'Completado') {
      push(`${PATH_DASHBOARD.orders.root}/${id}/edit`);
    }
  };

  const handleViewRow = (id) => {
    push(`${PATH_DASHBOARD.orders.root}/${id}`);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!dataFiltered.length && filterStatus !== 'all');

  return (
    <Page title="Pedidos: Lista">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lista de Pedidos"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Pedidos', href: PATH_DASHBOARD.orders.list },
          ]}
          action={
            <Button variant="contained" onClick={() => push(PATH_DASHBOARD.orders.new)}>
              Nuevo Pedido
            </Button>
          }
        />

        <Card>
          <OrderTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            filterStatus={filterStatus}
            onFilterStatus={handleFilterStatus}
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
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <OrderTableRow
                        key={row._id}
                        row={row}
                        onEditRow={() => handleEditRow(row._id, row.status)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
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

          {/* Confirmation Dialog */}
          <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
              ¿Estás seguro de que deseas eliminar este pedido?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete}>Cancelar</Button>
              <Button onClick={handleConfirmDelete} color="error">
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Container>
    </Page>
  );
}

function applySortFilter({ tableData, comparator, filterName, filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order2 = comparator(a[0], b[0]);
    if (order2 !== 0) return order2;
    return a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    filteredData = filteredData.filter((item) => {
      const clientName = item.client.name.toLowerCase();
      const productNames = item.items
        .map((item) => item.product?.name?.toLowerCase() || '')
        .join(' ');

      return (
        clientName.includes(filterName.toLowerCase()) ||
        productNames.includes(filterName.toLowerCase())
      );
    });
  }

  if (filterStatus !== 'all') {
    filteredData = filteredData.filter((item) => item.status === filterStatus);
  }

  return filteredData;
}
