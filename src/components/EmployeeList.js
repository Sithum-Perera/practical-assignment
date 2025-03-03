import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import '../styles/EmployeeList.css';

const EmployeeList = ({ onEdit, onDelete, onView, refreshTrigger }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch departments and create a lookup
        const depts = await apiService.getDepartments();
        const deptLookup = {};
        depts.forEach(dept => {
          deptLookup[dept.deptNo] = dept.deptName;
        });
        setDepartments(deptLookup);
        
        // Fetch employees
        const emps = await apiService.getEmployees();
        setEmployees(emps);
        setSearchResults(emps);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [refreshTrigger]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(employees);
    } else {
      const term = searchTerm.toLowerCase();
      const results = employees.filter(emp => 
        emp.empNo.toString().includes(term) ||
        emp.empName.toLowerCase().includes(term) ||
        (departments[emp.deptNo] && departments[emp.deptNo].toLowerCase().includes(term))
      );
      setSearchResults(results);
    }
  }, [searchTerm, employees, departments]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDelete = async (empNo) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await onDelete(empNo);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }
  
  return (
    <div className="employee-list-container">
      <div className="list-header">
        <h2>Employee List</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>
      
      {searchResults.length === 0 ? (
        <div className="no-results">No employees found</div>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Emp No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map(employee => (
              <tr key={employee.empNo}>
                <td>{employee.empNo}</td>
                <td>{employee.empName}</td>
                <td>{departments[employee.deptNo] || 'Unknown'}</td>
                <td>{employee.empEmail}</td>
                <td>{employee.empPhone}</td>
                <td>{formatDate(employee.joinDate)}</td>
                <td>${employee.salary.toFixed(2)}</td>
                <td className="actions">
                  <button 
                    className="btn-edit" 
                    onClick={() => onEdit(employee.empNo)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDelete(employee.empNo)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;

