const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testConnection() {
  console.log('🧪 Testing ERP API Connection...\n');
  
  try {
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    
    console.log('\n2. Testing Login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'student_demo@erp.com',
      password: 'student123',
      role: 'student'
    });
    console.log('✅ Login successful, token received');
    
    console.log('\n3. Testing Protected Route...');
    const meResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${loginResponse.data.token}` }
    });
    console.log('✅ Protected route working');
    
    console.log('\n🎉 All tests passed! ERP system is ready.');
    console.log('\n📋 Demo Credentials:');
    console.log('Student: student_demo@erp.com / student123');
    console.log('Staff: staff_demo@erp.com / staff123');
    console.log('Admin: admin_demo@erp.com / admin123');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Start backend: cd backend && npm start');
    }
  }
}

testConnection();