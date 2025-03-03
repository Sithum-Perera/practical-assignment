const API_BASE_URL = 'http://examination.24x7retail.com';
const API_KEY = '?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf';

export const apiService = {
  // Get all departments
  getDepartments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1.0/Departments`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },
  
  // Get all employees
  getEmployees: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1.0/Employees`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },
  
  // Get employee by ID
  getEmployee: async (empNo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1.0/Employee/${empNo}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employee');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching employee ${empNo}:`, error);
      throw error;
    }
  },
  
  // Add new employee
  addEmployee: async (employee) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1.0/Employee`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add employee');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  },
  
  // Update existing employee
  updateEmployee: async (employee) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1.0/Employee`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },
  
  // Delete employee
  deleteEmployee: async (empNo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1.0/Employee/${empNo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting employee ${empNo}:`, error);
      throw error;
    }
  }
};