import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress
} from '@mui/material';
import { studentService } from '../../services/authService';

const StudentMarks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await studentService.getMarks();
        // Handle both array and object responses
        const marksData = Array.isArray(response.data) ? response.data : response.data?.marks || [];
        setMarks(marksData);
      } catch (err) {
        setError('Failed to load marks data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const calculateOverallStats = () => {
    if (!Array.isArray(marks) || marks.length === 0) return { average: 0, totalMarks: 0, obtainedMarks: 0 };
    
    const totalMarks = marks.reduce((sum, mark) => sum + (mark.maxMarks || 0), 0);
    const obtainedMarks = marks.reduce((sum, mark) => sum + (mark.marks || 0), 0);
    const average = totalMarks > 0 ? (obtainedMarks / totalMarks * 100).toFixed(1) : 0;
    
    return { average, totalMarks, obtainedMarks };
  };

  const stats = calculateOverallStats();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Marks & Results
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overall Average
              </Typography>
              <Typography variant="h4" color={getGradeColor(stats.average)}>
                {stats.average}%
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Grade: {getGrade(stats.average)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Marks
              </Typography>
              <Typography variant="h4">
                {stats.obtainedMarks}/{stats.totalMarks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Subjects
              </Typography>
              <Typography variant="h4">
                {new Set(marks.map(mark => mark.subject)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Marks
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell>Exam Type</TableCell>
                  <TableCell>Marks Obtained</TableCell>
                  <TableCell>Max Marks</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {marks.length > 0 ? (
                  marks.map((mark, index) => {
                    const percentage = (mark.marks / mark.maxMarks * 100).toFixed(1);
                    return (
                      <TableRow key={index}>
                        <TableCell>{mark.subject}</TableCell>
                        <TableCell>{mark.examType}</TableCell>
                        <TableCell>{mark.marks}</TableCell>
                        <TableCell>{mark.maxMarks}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={percentage}
                                color={getGradeColor(percentage)}
                              />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="text.secondary">
                                {percentage}%
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getGrade(percentage)}
                            color={getGradeColor(percentage)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(mark.date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No marks records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentMarks;