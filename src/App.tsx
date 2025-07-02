import React, { useState, useRef, useEffect, useCallback } from 'react';

// Define the type for a row of data
interface RowData {
  id: number;
  [key: string]: string | number; // Allow any string key for column data
}

// Define the type for a column definition
interface Column {
  id: string;
  header: string;
  accessor: string; // Key to access data in RowData
  width?: string; // Optional width for columns
}

const App: React.FC = () => {
  // Initial data for the spreadsheet
  const [data, setData] = useState<RowData[]>([
    { id: 1, 'job-request': 'Launch social media campaign for pro...', submitted: '15-11-2024', status: 'in-process', submitter: 'Aisha Patel', url: 'www.aishapatel...', assigned: 'Sophie Choudury', priority: 'Medium', 'due-date': '20-11-2024', 'est-value': '6,200,000 ₹' },
    { id: 2, 'job-request': 'Update press kit for company redesign', submitted: '28-10-2024', status: 'need to start', submitter: 'Irfan Khan', url: 'www.irfankhanp...', assigned: 'Tejas Pandey', priority: 'High', 'due-date': '30-10-2024', 'est-value': '3,500,000 ₹' },
    { id: 3, 'job-request': 'Finalize user testing feedback for app...', submitted: '05-12-2024', status: 'in-process', submitter: 'Mark Johnson', url: 'www.markjohns...', assigned: 'Rachel Lee', priority: 'Medium', 'due-date': '10-12-2024', 'est-value': '4,750,000 ₹' },
    { id: 4, 'job-request': 'Design new features for the website', submitted: '10-01-2025', status: 'Complete', submitter: 'Emily Green', url: 'www.emilygreen...', assigned: 'Tom Wright', priority: 'Low', 'due-date': '15-01-2025', 'est-value': '5,900,000 ₹' },
    { id: 5, 'job-request': 'Prepare financial report for Q4', submitted: '25-01-2025', status: 'Blocked', submitter: 'Jessica Brown', url: 'www.jessicabro...', assigned: 'Kevin Smith', priority: 'Low', 'due-date': '30-01-2025', 'est-value': '2,800,000 ₹' },
    // Add more empty rows for spreadsheet feel
    ...Array(20).fill(null).map((_, i) => ({ id: i + 6, 'job-request': '', submitted: '', status: '', submitter: '', url: '', assigned: '', priority: '', 'due-date': '', 'est-value': '' })),
  ]);

  // Column definitions
  const columns: Column[] = [
    { id: 'job-request', header: 'Job Request', accessor: 'job-request', width: '250px' },
    { id: 'submitted', header: 'Submitted', accessor: 'submitted', width: '120px' },
    { id: 'status', header: 'Status', accessor: 'status', width: '120px' },
    { id: 'submitter', header: 'Submitter', accessor: 'submitter', width: '150px' },
    { id: 'url', header: 'URL', accessor: 'url', width: '150px' },
    { id: 'assigned', header: 'Assigned', accessor: 'assigned', width: '150px' },
    { id: 'priority', header: 'Priority', accessor: 'priority', width: '100px' },
    { id: 'due-date', header: 'Due Date', accessor: 'due-date', width: '120px' },
    { id: 'est-value', header: 'Est. Value', accessor: 'est-value', width: '150px' },
  ];

  // State for active cell editing
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [cellValue, setCellValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('All Orders');

  // Effect to focus the input when a cell becomes editable
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  // Handle double click to enable editing
  // FIX: Convert row[column.accessor] to string before passing to handleDoubleClick
  const handleDoubleClick = useCallback((rowIndex: number, columnId: string, value: string) => {
    setEditingCell({ rowIndex, columnId });
    setCellValue(value);
  }, []);

  // Handle change in cell input
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCellValue(e.target.value);
  }, []);

  // Handle blur or Enter key press to save changes
  const handleSave = useCallback(() => {
    if (editingCell) {
      const newData = [...data];
      newData[editingCell.rowIndex] = {
        ...newData[editingCell.rowIndex],
        [editingCell.columnId]: cellValue,
      };
      setData(newData);
      setEditingCell(null);
      setCellValue('');
    }
  }, [editingCell, cellValue, data]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setCellValue('');
    }
  }, [handleSave]);

  // Handle tab click
  const handleTabClick = useCallback((tabName: string) => {
    setActiveTab(tabName);
    console.log(`Tab clicked: ${tabName}`);
  }, []);

  // Handle button clicks
  const handleButtonClick = useCallback((buttonName: string) => {
    console.log(`Button clicked: ${buttonName}`);
  }, []);

  // Helper to get status badge classes
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in-process':
        return 'bg-blue-100 text-blue-800';
      case 'need to start':
        return 'bg-yellow-100 text-yellow-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get priority badge classes
  const getPriorityClasses = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col antialiased text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Workspace</span>
          <span className="text-gray-400">/</span>
          <span>Folder 2</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-gray-800">Spreadsheet 3</span>
          <button className="ml-2 p-1 rounded-full hover:bg-gray-100" onClick={() => handleButtonClick('More Options')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search within sheet"
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                JD
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
            </div>
            <span className="text-sm font-medium">John Doe</span>
            <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => handleButtonClick('User Options')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200" onClick={() => handleButtonClick('New Action')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Action
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Tool bar')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.26-.16.533-.29.817-.392V4.317z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Tool bar</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Hide fields')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.879 16.121A4.995 4.995 0 0112 15c1.42 0 2.722-.478 3.75-1.288M12 18v-1.25" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657A8.997 8.997 0 0112 21c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.879 16.121A4.995 4.995 0 0112 15c1.42 0 2.722-.478 3.75-1.288M12 18v-1.25" />
            </svg>
            <span>Hide fields</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Filter')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Sort')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            <span>Sort</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Cell view')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Cell view</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('ABC dropdown')}>
              <span>ABC ...</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Answer a question dropdown')}>
              <span>Answer a question ...</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Extract dropdown')}>
              <span>Extract ...</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="h-6 w-px bg-gray-300 mx-2"></div> {/* Divider */}
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Import')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Export')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100" onClick={() => handleButtonClick('Share')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 0L14 6m-5.316 5.342A7.002 7.002 0 0112 21a7.002 7.002 0 01-5.316-8.658m0 0C6.114 12.938 6 12.482 6 12c0-.482.114-.938.316-1.342M14 6V4m0 2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m0 0L14 6m-5.316 5.342A7.002 7.002 0 0112 21a7.002 7.002 0 01-5.316-8.658" />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar (Empty for now, but visually present as a thin border) */}
        <div className="w-12 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="h-full w-full border-r border-gray-100"></div> {/* Visual separator */}
        </div>

        {/* Spreadsheet Container */}
        <div className="flex-grow overflow-auto bg-white">
          <div className="inline-block min-w-full">
            <div className="flex">
              {/* Row Numbers Column Header */}
              <div className="flex-shrink-0 w-12 bg-gray-50 border-r border-b border-gray-200 sticky top-0 left-0 z-20">
                <div className="h-10 flex items-center justify-center text-xs font-medium text-gray-500 border-b border-gray-200">
                  {/* Top-left empty corner */}
                </div>
              </div>
              {/* Spreadsheet Headers */}
              <div className="flex overflow-x-hidden flex-grow">
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className="flex-shrink-0 h-10 px-3 py-2 bg-gray-50 border-b border-r border-gray-200 flex items-center justify-between text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                    style={{ width: column.width }}
                    onClick={() => handleButtonClick(`Column Header: ${column.header}`)}
                  >
                    <span className="truncate">{column.header}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Spreadsheet Rows */}
            {data.map((row, rowIndex) => (
              <div key={row.id} className="flex group">
                {/* Row Number */}
                <div className="flex-shrink-0 w-12 h-10 flex items-center justify-center text-xs text-gray-500 border-r border-b border-gray-200 bg-gray-50 group-hover:bg-gray-100 sticky left-0 z-10">
                  {rowIndex + 1}
                </div>
                {/* Cells */}
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className="flex-shrink-0 h-10 px-3 py-2 border-b border-r border-gray-200 flex items-center overflow-hidden whitespace-nowrap text-sm relative"
                    style={{ width: column.width }}
                    // FIX: Convert value to string for handleDoubleClick
                    onDoubleClick={() => handleDoubleClick(rowIndex, column.accessor, String(row[column.accessor]))}
                  >
                    {editingCell?.rowIndex === rowIndex && editingCell?.columnId === column.accessor ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={cellValue}
                        onChange={handleChange}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full p-0 border-none outline-none bg-blue-50 focus:ring-1 focus:ring-blue-500 -mx-3 -my-2"
                      />
                    ) : (
                      <>
                        {column.id === 'status' ? (
                          // FIX: Convert value to string for getStatusClasses
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(String(row[column.accessor]))}`}>
                            {row[column.accessor]}
                          </span>
                        ) : column.id === 'priority' ? (
                          // FIX: Convert value to string for getPriorityClasses
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityClasses(String(row[column.accessor]))}`}>
                            {row[column.accessor]}
                          </span>
                        ) : (
                          row[column.accessor]
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Tabs */}
      <div className="flex items-center p-3 bg-white border-t border-gray-200 shadow-sm">
        <div className="flex space-x-1">
          {['All Orders', 'Pending', 'Reviewed', 'Arrived'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="ml-4 p-2 rounded-full hover:bg-gray-100 text-gray-600" onClick={() => handleButtonClick('Add Tab')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default App;
