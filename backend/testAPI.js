const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing API login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'student_demo@erp.com',
      password: 'student123',
      role: 'student'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Login failed!');
    console.error('Error:', error.response?.data || error.message);
  }
};

testLogin();