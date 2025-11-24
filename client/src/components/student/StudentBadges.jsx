import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, Avatar } from '@mui/material';
import { EmojiEvents, Star, School, Sports } from '@mui/icons-material';

const StudentBadges = () => {
  const [badges] = useState([
    { id: 1, name: 'Perfect Attendance', description: '100% attendance for 3 months', icon: <School />, color: 'success', earned: true, date: '2024-01-15' },
    { id: 2, name: 'Top Performer', description: 'Scored above 90% in all subjects', icon: <EmojiEvents />, color: 'warning', earned: true, date: '2024-02-01' },
    { id: 3, name: 'Sports Champion', description: 'Won inter-school sports competition', icon: <Sports />, color: 'primary', earned: true, date: '2024-01-20' },
    { id: 4, name: 'Leadership', description: 'Class monitor for 6 months', icon: <Star />, color: 'secondary', earned: false, date: null }
  ]);

  const [achievements] = useState([
    { title: 'Mathematics Olympiad - Gold Medal', date: '2024-01-10', category: 'Academic' },
    { title: 'Science Fair - First Prize', date: '2024-01-25', category: 'Academic' },
    { title: 'Basketball Tournament - Winner', date: '2024-02-05', category: 'Sports' }
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Badges & Achievements</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Earned Badges</Typography>
              <Grid container spacing={2}>
                {badges.filter(badge => badge.earned).map((badge) => (
                  <Grid item xs={12} sm={6} md={4} key={badge.id}>
                    <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar sx={{ bgcolor: `${badge.color}.main`, mx: 'auto', mb: 1 }}>
                        {badge.icon}
                      </Avatar>
                      <Typography variant="h6">{badge.name}</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {badge.description}
                      </Typography>
                      <Chip label={`Earned: ${badge.date}`} size="small" color={badge.color} />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Available Badges</Typography>
              <Grid container spacing={2}>
                {badges.filter(badge => !badge.earned).map((badge) => (
                  <Grid item xs={12} sm={6} md={4} key={badge.id}>
                    <Card variant="outlined" sx={{ textAlign: 'center', p: 2, opacity: 0.6 }}>
                      <Avatar sx={{ bgcolor: 'grey.300', mx: 'auto', mb: 1 }}>
                        {badge.icon}
                      </Avatar>
                      <Typography variant="h6">{badge.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {badge.description}
                      </Typography>
                      <Chip label="Not Earned" size="small" variant="outlined" />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Achievements</Typography>
              {achievements.map((achievement, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{achievement.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{achievement.date}</Typography>
                  <Chip label={achievement.category} size="small" color="primary" />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentBadges;