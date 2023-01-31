import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import OptionsMenu from '../../menus/OptionsMenu';
import { getComparator, stableSort } from '../../../../utils/functions';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import AppButton from '../../buttons/AppButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StatusChip from './StatusChip';
import AddTaskModal from '../../modals/AddTaskModal';
import EditTaskModal from '../../modals/EditTaskModal';
import { MainContext } from '../../../../context/MainContextProvider';

const headCells = [
  {
    id: 'created_at',
    numeric: false,
    disablePadding: true,
    label: 'Дата создания',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Название',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Описание',
  },
  {
    id: 'author',
    numeric: false,
    disablePadding: false,
    label: 'Автор',
  },
  {
    id: 'results',
    numeric: false,
    disablePadding: false,
    label: 'Результаты',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Статус',
  },
  {
    id: 'options',
    numeric: false,
    disablePadding: true,
    label: '',
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <>
      {numSelected > 0 ? (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...{
              bgcolor: theme =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            },
          }}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            color='inherit'
            variant='subtitle1'
            component='div'>
            {numSelected} выбрано
          </Typography>

          <Tooltip title='Delete'>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      ) : null}
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function TasksTable({ rows }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('subject');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openOptionsMenu = Boolean(anchorEl);
  const [status, setStatus] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const { setSelectedTask } = useContext(MainContext);

  const [openAddTaskModal, setOpenAddTaskModal] = React.useState(false);
  const handleOpenAddTaskModal = () => setOpenAddTaskModal(true);
  const handleCloseAddTaskModal = () => setOpenAddTaskModal(false);

  const [openEditTaskModal, setOpenEditTaskModal] = React.useState(false);
  const handleOpenEditTaskModal = e => {
    setOpenEditTaskModal(true);
  };
  const handleCloseEditTaskModal = () => setOpenEditTaskModal(false);

  const handleChangeStatus = event => {
    setStatus(event.target.value);
  };

  const handleChangeAuthor = event => {
    setAuthor(event.target.value);
  };

  const handleCloseOptionsMenu = () => {
    setAnchorEl(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.created_at);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, created_at) => {
    const selectedIndex = selected.indexOf(created_at);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, created_at);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = created_at => selected.indexOf(created_at) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper
          sx={{
            width: '100%',
            mb: 2,
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(83, 83, 83, 0.1)',
          }}>
          <Stack
            direction='row'
            sx={{
              p: '16px',
              gap: '16px',
              alignItems: 'center',
              display: 'grid',
              gridTemplateColumns: '180px 180px 1fr auto',
            }}>
            <FormControl>
              <InputLabel>Статус</InputLabel>
              <Select
                id='demo-simple-select'
                value={status}
                label='Статус'
                onChange={handleChangeStatus}>
                <MenuItem value={10}>Открыт</MenuItem>
                <MenuItem value={20}>Закрыт</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Автор</InputLabel>
              <Select
                id='demo-simple-select'
                value={author}
                label='Автор'
                onChange={handleChangeAuthor}>
                <MenuItem value={10}>user228</MenuItem>
                <MenuItem value={20}>navi</MenuItem>
                <MenuItem value={30}>simple</MenuItem>
                <MenuItem value={30}>virtus</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Поиск'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant='outlined'
            />
            <AppButton
              onClick={handleOpenAddTaskModal}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ height: 'fit-content', p: 1.5 }}>
              Добавить
            </AppButton>
          </Stack>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.sort(getComparator(order, orderBy)).slice() */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.created_at);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, row.created_at)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.created_at}
                        selected={isItemSelected}>
                        <TableCell padding='checkbox'>
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component='th'
                          id={labelId}
                          scope='row'
                          padding='none'>
                          {row.created_at}
                        </TableCell>
                        <TableCell sx={{ maxWidth: '400px' }}>
                          {row.title}
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: '135px',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}>
                          {row.description}
                        </TableCell>
                        <TableCell>{row.author.email}</TableCell>
                        <TableCell>
                          <Button
                            onClick={e => e.stopPropagation()}
                            href={`http://localhost:8080/api/task/solve/result/${row.guid}`}
                            sx={{
                              textTransform: 'none',
                            }}>
                            Скачать
                          </Button>
                        </TableCell>
                        <TableCell>
                          <StatusChip isOpen={row.is_active} />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedTask(row);
                              setAnchorEl(e.currentTarget);
                            }}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <OptionsMenu
        anchorEl={anchorEl}
        open={openOptionsMenu}
        handleClose={handleCloseOptionsMenu}
        onEdit={handleOpenEditTaskModal}
      />
      <AddTaskModal open={openAddTaskModal} onClose={handleCloseAddTaskModal} />
      <EditTaskModal
        open={openEditTaskModal}
        onClose={handleCloseEditTaskModal}
      />
    </>
  );
}
