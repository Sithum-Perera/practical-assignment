import React, { useState } from 'react';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import EmployeeDetail from './components/EmployeeDetails';
import { apiService } from './api/apiService';
import './App.css';

function App() {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit', 'detail'
  const [selectedEmpNo, setSelectedEmpNo] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleAddClick = () => {
    setView('add');
    setCurrentEmployee(null);
  };
  
  const handleEditClick = async (empNo) => {
    try {
      const employee = await apiService.getEmployee(empNo);
      setCurrentEmployee(employee);
      setView('edit');
    } catch (error) {
      console.error('Error fetching employee for edit:', error);
    }
  };
  
  const handleDetailClick = (empNo) => {
    setSelectedEmpNo(empNo);
    setView('detail');
  };
  
  const handleSaveEmployee = async (employeeData) => {
    try {
      if (view === 'add') {
        await apiService.addEmployee(employeeData);
      } else if (view === 'edit') {
        await apiService.updateEmployee(employeeData);
      }
      
      // Refresh the list and return to list view
      setRefreshTrigger(prev => prev + 1);
      setView('list');
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('There was an error saving the employee. Please try again.');
    }
  };
  
  const handleDeleteEmployee = async (empNo) => {
    try {
      await apiService.deleteEmployee(empNo);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('There was an error deleting the employee. Please try again.');
    }
  };
  
  const handleCancel = () => {
    setView('list');
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Employee Management System</h1>
      </header>
      
      <main className="app-main">
        {view === 'list' && (
          <>
            <div className="list-actions">
              <button className="btn-add" onClick={handleAddClick}>
                Add New Employee
              </button>
            </div>
            <EmployeeList 
              onEdit={handleEditClick}
              onView={handleDetailClick}
              onDelete={handleDeleteEmployee}
              refreshTrigger={refreshTrigger}
            />
          </>
        )}
        
        {(view === 'add' || view === 'edit') && (
          <EmployeeForm 
            employee={view === 'edit' ? currentEmployee : null}
            onSave={handleSaveEmployee}
            onCancel={handleCancel}
          />
        )}
        
        {view === 'detail' && (
          <EmployeeDetail 
            empNo={selectedEmpNo}
            onClose={handleCancel}
          />
        )}
      </main>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Employee Management System</p>
      </footer>
    </div>
  );
}

export default App;
