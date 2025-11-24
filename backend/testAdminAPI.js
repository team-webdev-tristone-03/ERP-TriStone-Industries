const axios = require('axios');

const testAdminLogin = async () => {
  try {
    console.log('Testing Admin API login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin_demo@erp.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Admin login failed!');
    console.error('Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
};

testAdminLogin();