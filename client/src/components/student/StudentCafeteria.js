import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';
import { Restaurant, ShoppingCart, Payment, History } from '@mui/icons-material';

const StudentCafeteria = () => {
  const [balance, setBalance] = useState(250);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([
    { id: 1, items: 'Sandwich, Coffee', amount: 45, date: '2024-02-10', status: 'delivered' },
    { id: 2, items: 'Pizza, Juice', amount: 85, date: '2024-02-09', status: 'delivered' }
  ]);

  const menuItems = [
    { id: 1, name: 'Sandwich', price: 25, category: 'Snacks' },
    { id: 2, name: 'Pizza', price: 65, category: 'Main Course' },
    { id: 3, name: 'Coffee', price: 20, category: 'Beverages' },
    { id: 4, name: 'Juice', price: 30, category: 'Beverages' }
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Cafeteria</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Payment color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Wallet Balance</Typography>
                  <Typography variant="h4">₹{balance}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ShoppingCart color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Cart Items</Typography>
                  <Typography variant="h4">{cart.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Menu</Typography>
              <List>
                {menuItems.map((item) => (
                  <ListItem key={item.id} secondaryAction={
                    <Button variant="contained" size="small" onClick={() => addToCart(item)}>
                      Add ₹{item.price}
                    </Button>
                  }>
                    <ListItemText 
                      primary={item.name} 
                      secondary={item.category}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order History</Typography>
              <List>
                {orders.map((order) => (
                  <ListItem key={order.id}>
                    <ListItemText 
                      primary={order.items}
                      secondary={`${order.date} - ₹${order.amount}`}
                    />
                    <Chip label={order.status} color="success" size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentCafeteria;