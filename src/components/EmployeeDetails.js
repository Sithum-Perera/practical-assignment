import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import '../styles/EmployeeDetails.css';

const EmployeeDetail = ({ empNo, onClose }) => {
  const [employee, setEmployee] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch employee details
        const emp = await apiService.getEmployee(empNo);
        setEmployee(emp);
        
        // Fetch departments to get department name
        const depts = await apiService.getDepartments();
        const dept = depts.find(d => d.deptNo === emp.deptNo);
        setDepartment(dept);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (empNo) {
      fetchData();
    }
  }, [empNo]);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (loading) {
    return <div className="loading">Loading employee details...</div>;
  }
  
  if (!employee) {
    return <div className="error">Employee not found</div>;
  }
  
  return (
    <div className="employee-detail">
      <h2>Employee Details</h2>
      
      <div className="detail-row">
        <div className="detail-label">Employee Number:</div>
        <div className="detail-value">{employee.empNo}</div>
      </div>
      
      <div className="detail-row">
        <div className="detail-label">Name:</div>
        <div className="detail-value">{employee.empName}</div>
      </div>
      
      <div className="detail-row">
        <div className="detail-label">Department:</div>
        <div className="detail-value">{department ? department.deptName : 'Unknown'}</div>
      </div>
      
      <div className="detail-row">
        <div className="detail-label">Address:</div>
        <div className="detail-value">{employee.empAddress || 'N/A'}</div>
      </div>
      
      <div className="detail-row">
        <div className="detail-label">Email:</div>
        <div className="detail-value">{employee.empEmail}</div>
      </div>
      
      <div className="detail-row">
        <div className="detail-label">Phone:</div>
        <div className="detail-value">{employee.empPhone}</div>
      </div>
      
      <div className="detail-row">
        <div className="detail-label">Join Date:</div>
        <div className="detail-value">{formatDate(employee.joinDate)}</div>
      </div>
      
      <div className="detail-row">
        <div className="detail-label">Salary:</div>
        <div className="detail-value">${employee.salary.toFixed(2)}</div>
      </div>
      
      <div className="detail-actions">
        <button className="btn-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EmployeeDetail;