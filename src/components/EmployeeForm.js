import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import '../styles/EmployeeForm.css';

const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    empNo: '',
    empName: '',
    empAddress: '',
    empEmail: '',
    empPhone: '',
    deptNo: '',
    joinDate: '',
    salary: ''
  });
  
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Load departments and set form data if editing
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await apiService.getDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error('Error loading departments:', error);
      }
    };
    
    fetchDepartments();
    
    if (employee) {
      setFormData({
        empNo: employee.empNo || '',
        empName: employee.empName || '',
        empAddress: employee.empAddress || '',
        empEmail: employee.empEmail || '',
        empPhone: employee.empPhone || '',
        deptNo: employee.deptNo || '',
        joinDate: employee.joinDate ? employee.joinDate.substring(0, 10) : '',
        salary: employee.salary || ''
      });
    }
  }, [employee]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.empName.trim()) {
      newErrors.empName = 'Employee name is required';
    }
    
    if (!formData.empEmail.trim()) {
      newErrors.empEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.empEmail)) {
      newErrors.empEmail = 'Email is invalid';
    }
    
    if (!formData.empPhone.trim()) {
      newErrors.empPhone = 'Phone number is required';
    }
    
    if (!formData.deptNo) {
      newErrors.deptNo = 'Department is required';
    }
    
    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
    }
    
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert form data to match API requirements
    const employeeData = {
      ...formData,
      deptNo: parseInt(formData.deptNo),
      salary: parseFloat(formData.salary)
    };
    
    try {
      await onSave(employeeData);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
      
      {employee && (
        <div className="form-group">
          <label>Employee Number</label>
          <input
            type="text"
            name="empNo"
            value={formData.empNo}
            disabled
          />
        </div>
      )}
      
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="empName"
          value={formData.empName}
          onChange={handleChange}
          className={errors.empName ? 'error' : ''}
        />
        {errors.empName && <div className="error-message">{errors.empName}</div>}
      </div>
      
      <div className="form-group">
        <label>Address</label>
        <textarea
          name="empAddress"
          value={formData.empAddress}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="empEmail"
          value={formData.empEmail}
          onChange={handleChange}
          className={errors.empEmail ? 'error' : ''}
        />
        {errors.empEmail && <div className="error-message">{errors.empEmail}</div>}
      </div>
      
      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          name="empPhone"
          value={formData.empPhone}
          onChange={handleChange}
          className={errors.empPhone ? 'error' : ''}
        />
        {errors.empPhone && <div className="error-message">{errors.empPhone}</div>}
      </div>
      
      <div className="form-group">
        <label>Department</label>
        <select
          name="deptNo"
          value={formData.deptNo}
          onChange={handleChange}
          className={errors.deptNo ? 'error' : ''}
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.deptNo} value={dept.deptNo}>
              {dept.deptName}
            </option>
          ))}
        </select>
        {errors.deptNo && <div className="error-message">{errors.deptNo}</div>}
      </div>
      
      <div className="form-group">
        <label>Join Date</label>
        <input
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          className={errors.joinDate ? 'error' : ''}
        />
        {errors.joinDate && <div className="error-message">{errors.joinDate}</div>}
      </div>
      
      <div className="form-group">
        <label>Salary</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          step="0.01"
          className={errors.salary ? 'error' : ''}
        />
        {errors.salary && <div className="error-message">{errors.salary}</div>}
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-save">Save</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default EmployeeForm;
