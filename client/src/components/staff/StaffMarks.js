import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Grade, Add, Save } from '@mui/icons-material';

const StaffMarks = () => {
  const [selectedClass, setSelectedClass] = useState('10A');
  const [selectedExam, setSelectedExam] = useState('midterm');
  
  const [students] = useState([
    { id: 1, name: 'John Doe', rollNo: '001', math: 85, physics: 78, chemistry: 92 },
    { id: 2, name: 'Jane Smith', rollNo: '002', math: 92, physics: 88, chemistry: 85 },
    { id: 3, name: 'Mike Johnson', rollNo: '003', math: 78, physics: 85, chemistry: 90 }
  ]);

  const [newMarks, setNewMarks] = useState({
    studentId: '',
    subject: 'Mathematics',
    examType: 'midterm',
    marks: '',
    maxMarks: 100
  });

  const handleAddMarks = () => {
    console.log('Adding marks:', newMarks);
    setNewMarks({ studentId: '', subject: 'Mathematics', examType: 'midterm', marks: '', maxMarks: 100 });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Marks Management</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Add New Marks</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Student</InputLabel>
                    <Select
                      value={newMarks.studentId}
                      onChange={(e) => setNewMarks({...newMarks, studentId: e.target.value})}
                    >
                      {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.name} ({student.rollNo})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={newMarks.subject}
                      onChange={(e) => setNewMarks({...newMarks, subject: e.target.value})}
                    >
                      <MenuItem value="Mathematics">Mathematics</MenuItem>
                      <MenuItem value="Physics">Physics</MenuItem>
                      <MenuItem value="Chemistry">Chemistry</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Exam Type</InputLabel>
                    <Select
                      value={newMarks.examType}
                      onChange={(e) => setNewMarks({...newMarks, examType: e.target.value})}
                    >
                      <MenuItem value="midterm">Mid-term</MenuItem>
                      <MenuItem value="final">Final</MenuItem>
                      <MenuItem value="quiz">Quiz</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Marks Obtained"
                    type="number"
                    value={newMarks.marks}
                    onChange={(e) => setNewMarks({...newMarks, marks: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Marks"
                    type="number"
                    value={newMarks.maxMarks}
                    onChange={(e) => setNewMarks({...newMarks, maxMarks: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={handleAddMarks}
                    disabled={!newMarks.studentId || !newMarks.marks}
                  >
                    Add Marks
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Grade color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Class Average</Typography>
                  <Typography variant="h4">82.5%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Student Marks - Class {selectedClass}</Typography>
                <Box display="flex" gap={2}>
                  <FormControl size="small">
                    <InputLabel>Class</InputLabel>
                    <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                      <MenuItem value="10A">10th A</MenuItem>
                      <MenuItem value="10B">10th B</MenuItem>
                      <MenuItem value="9A">9th A</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <InputLabel>Exam</InputLabel>
                    <Select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
                      <MenuItem value="midterm">Mid-term</MenuItem>
                      <MenuItem value="final">Final</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Roll No</TableCell>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Mathematics</TableCell>
                      <TableCell>Physics</TableCell>
                      <TableCell>Chemistry</TableCell>
                      <TableCell>Average</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.math}</TableCell>
                        <TableCell>{student.physics}</TableCell>
                        <TableCell>{student.chemistry}</TableCell>
                        <TableCell>{Math.round((student.math + student.physics + student.chemistry) / 3)}</TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small" startIcon={<Save />}>
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffMarks;