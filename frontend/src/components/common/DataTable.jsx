import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, Download, Search } from 'lucide-react';

export const DataTable = ({
  data = [],
  columns = [],
  pageSize = 10,
  searchable = true,
  searchPlaceholder = "Search records...",
  onRowClick
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Filtering
  const filteredData = data.filter(row => {
    if (!filterText) return true;
    return columns.some(col => {
      const val = row[col.accessor];
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(filterText.toLowerCase());
    });
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (accessor) => {
    if (sortColumn === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
  };

  const exportCSV = () => {
    if (!data.length) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = filteredData.map(row =>
      columns.map(c => `"${String(row[c.accessor] || '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `intelligence_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl overflow-hidden shadow-xl">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#000000]">
        {searchable && (
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-[#0A0A0A] border border-[#27272A] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        )}

        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#27272A] text-xs font-semibold text-white hover:border-blue-500 transition-all"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <span className="text-xs text-zinc-400 font-mono">
            Total: <strong className="text-white font-bold">{filteredData.length}</strong> records
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-200">
          <thead className="bg-[#000000] border-b border-[#27272A] text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                  className={`px-4 py-3 font-semibold ${
                    col.sortable !== false ? 'cursor-pointer select-none hover:text-white' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    {col.sortable !== false && <ArrowUpDown size={12} className="text-zinc-500" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-zinc-900/60 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.accessor} className="px-4 py-3 font-medium whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-zinc-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-3 border-t border-[#27272A] flex items-center justify-between text-xs text-zinc-400 bg-[#000000]">
        <div>
          Showing page <span className="font-bold text-white">{currentPage}</span> of{' '}
          <span className="font-bold text-white">{totalPages}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#27272A] hover:bg-zinc-900 text-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#27272A] hover:bg-zinc-900 text-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
