import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Assignment, Add, CheckCircle, Schedule } from "@mui/icons-material";

const StaffAssignments = () => {
  const [assignments] = useState([
    {
      id: 1,
      title: "Algebra Practice Problems",
      class: "6th-B",
      subject: "Mathematics",
      dueDate: "2024-01-20",
      status: "Active",
      submissions: 25,
      totalStudents: 30,
    },
    {
      id: 2,
      title: "Geometry Worksheet",
      class: "7th-B",
      subject: "Mathematics",
      dueDate: "2024-01-22",
      status: "Active",
      submissions: 18,
      totalStudents: 28,
    },
    {
      id: 3,
      title: "Trigonometry Quiz",
      class: "8th-B",
      subject: "Mathematics",
      dueDate: "2024-01-18",
      status: "Completed",
      submissions: 32,
      totalStudents: 32,
    },
  ]);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Assignments</Typography>
        <Button variant="contained" startIcon={<Add />} color="primary">
          Create Assignment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {assignments.map((assignment) => (
          <Grid item xs={12} md={6} lg={4} key={assignment.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Assignment color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    {assignment.title}
                  </Typography>
                </Box>

                <List dense>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Class"
                      secondary={assignment.class}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Subject"
                      secondary={assignment.subject}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText
                      primary="Due Date"
                      secondary={assignment.dueDate}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Chip
                    label={assignment.status}
                    color={
                      assignment.status === "Active" ? "primary" : "success"
                    }
                    size="small"
                    icon={
                      assignment.status === "Active" ? (
                        <Schedule />
                      ) : (
                        <CheckCircle />
                      )
                    }
                  />
                  <Typography variant="body2" color="textSecondary">
                    {assignment.submissions}/{assignment.totalStudents}{" "}
                    submitted
                  </Typography>
                </Box>

                <Box display="flex" gap={1}>
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                  <Button size="small" variant="outlined">
                    Grade
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StaffAssignments;
