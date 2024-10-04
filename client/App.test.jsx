import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignIn from './src/pages/signin/SignIn';
// import '@testing-library/jest-dom/extend-expect'; // Import custom matchers
import '@testing-library/jest-dom';


test('renders the text "LOGIN"', () => {
  render(
    <Router>
      <SignIn />
    </Router>
  );

  expect(screen.getByText(/LOGIN/i)).toBeInTheDocument();
});
