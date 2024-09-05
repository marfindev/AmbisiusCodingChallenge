import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { validationSchema } from '../utils/validationSchema';
import { Employee } from '../types/employee';

const EditableTable: React.FC = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Employee>({
    resolver: yupResolver(validationSchema),
  });

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/employees');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, []);

  // Submit form data (Add or Update)
  const onSubmit = async (formData: Employee) => {
    try {
      if (editingRowIndex !== null) {
        // Update employee
        await axios.put(`/api/employees`, formData);
        setData((prev) =>
          prev.map((row, index) => (index === editingRowIndex ? formData : row))
        );
      } else {
        // Add new employee
        const response = await axios.post('/api/employees', formData);
        setData((prev) => [...prev, response.data]);
      }
      reset();
      setEditingRowIndex(null);
    } catch (error) {
      console.error('Failed to update data', error);
    }
  };

  // Handle delete operation
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/employees`, { params: { id } });
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Failed to delete data', error);
    }
  };


  // Prepare to edit a row
  const handleEdit = (row: Employee, index: number) => {
    setEditingRowIndex(index);
    setValue('id', row.id);
    setValue('firstName', row.firstName);
    setValue('lastName', row.lastName);
    setValue('position', row.position);
    setValue('phone', row.phone);
    setValue('email', row.email);
  };

  // Table columns definition
  const columns = useMemo(
    () => [
      { Header: 'First Name', accessor: 'firstName' },
      { Header: 'Last Name', accessor: 'lastName' },
      { Header: 'Position', accessor: 'position' },
      { Header: 'Phone', accessor: 'phone' },
      { Header: 'Email', accessor: 'email' },
      {
        Header: 'Actions',
        Cell: ({ row }: any) => (
          <div>
            <button
              onClick={() => handleEdit(row.original, row.index)}
              className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-2 px-2 rounded ml-2"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Initialize table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Start with first page
    },
    useSortBy,
    usePagination
  );

  return (
    <div>
      {/* Form for adding or editing an employee */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <input 
            {...field} 
            placeholder="First Name" 
            className="border border-gray-300 p-2 rounded w-full mb-2"
            />
          )}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <input 
            {...field} 
            placeholder="Last Name"
            className="border border-gray-300 p-2 rounded w-full mb-2"
            />
          )}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
        )}

        <Controller
          name="position"
          control={control}
          render={({ field }) => (
            <input 
            {...field} 
            placeholder="Position"
            className="border border-gray-300 p-2 rounded w-full mb-2"
            />
          )}
        />
        {errors.position && (
          <p className="text-red-500 text-sm">{errors.position.message}</p>
        )}

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <input 
            {...field} 
            placeholder="Phone"
            className="border border-gray-300 p-2 rounded w-full mb-2"
            />
          )}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input 
            {...field} 
            placeholder="Email"
            className="border border-gray-300 p-2 rounded w-full mb-2"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <button 
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-2 px-4 rounded"
        >
          {editingRowIndex !== null ? 'Update' : 'Add'}
        </button>
      </form>

      {/* Table for displaying employees */}
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} 
                key={column.id}
                className="px-6 py-3 text-center text-xs font-bold text-white-500 uppercase tracking-wider"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} 
                  key={cell.column.id}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="mt-5 flex items-center justify-between">
        <button onClick={() => previousPage()} 
        disabled={!canPreviousPage}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <button 
        onClick={() => nextPage()} 
        disabled={!canNextPage}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EditableTable;
