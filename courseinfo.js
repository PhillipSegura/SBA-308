// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      { id: 1, name: "Declare a Variable", due_at: "2023-01-25", points_possible: 50 },
      { id: 2, name: "Write a Function", due_at: "2023-02-27", points_possible: 150 },
      { id: 3, name: "Code the World", due_at: "2023-03-15", points_possible: 500 }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    { learner_id: 125, assignment_id: 1, submission: { submitted_at: "2023-01-25", score: 47 } },
    { learner_id: 125, assignment_id: 2, submission: { submitted_at: "2023-02-12", score: 150 } },
    { learner_id: 125, assignment_id: 3, submission: { submitted_at: "2023-03-14", score: 400 } },
    { learner_id: 132, assignment_id: 1, submission: { submitted_at: "2023-01-24", score: 39 } },
    { learner_id: 132, assignment_id: 2, submission: { submitted_at: "2023-03-07", score: 140 } }
  ];
  
  // Function to get learner data
  function getLearnerData(course, ag, submissions) {
    // Validate that the AssignmentGroup belongs to the Course
    if (course.id !== ag.course_id) throw new Error("AssignmentGroup does not belong to the Course.");
    
    const currentDate = new Date();
    const results = {}; // Store results for each learner
  
    submissions.forEach(({ learner_id, assignment_id, submission }) => {
      const assignment = ag.assignments.find(a => a.id === assignment_id);
      if (!assignment || new Date(assignment.due_at) > currentDate) return; // Skip invalid or not due assignments
  
      // Calculate score and apply late penalty if needed
      let score = submission.score;
      if (assignment.points_possible === 0) {
        console.warn(`Points possible is zero for assignment ID: ${assignment_id}`);
        return; // Avoid division by zero
      }
      if (new Date(submission.submitted_at) > new Date(assignment.due_at)) {
        score -= assignment.points_possible * 0.1; // Late penalty
      }
      
      const scorePercent = Math.max(score, 0) / assignment.points_possible; // Ensure non-negative score
  
      // Initialize learner data
      if (!results[learner_id]) results[learner_id] = { id: learner_id, avg: 0, totalPoints: 0 };
      
      // Update results
      results[learner_id][assignment_id] = scorePercent;
      results[learner_id].avg += scorePercent * assignment.points_possible;
      results[learner_id].totalPoints += assignment.points_possible;
    });
  
    // Finalize averages
    return Object.values(results).map(learner => {
      learner.avg /= learner.totalPoints; // Calculate weighted average
      delete learner.totalPoints; // Clean up temporary data
      return learner;
    });
  }
  
  // Testing the function
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(result);
  