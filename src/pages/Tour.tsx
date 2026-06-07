import { Navigate } from 'react-router-dom';

// The slide-based tour was replaced by an in-place spotlight tour rendered
// on the dashboard itself. Any visit to /tour now goes straight to /dashboard.
const Tour = () => <Navigate to="/dashboard" replace />;

export default Tour;
