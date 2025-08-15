import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('Earthquake App', () => {
  test('renders main title', () => {
    render(<App />);
    expect(screen.getByText(/Earthquakes in Spain/i)).toBeInTheDocument();
  });

  test('shows loading initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('refresh button triggers data fetch', async () => {
    render(<App />);
    const refreshBtn = screen.getByText(/Refresh Results/i);
    fireEvent.click(refreshBtn);
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(screen.getByText(/Última actualización/i)).toBeInTheDocument();
  });

  test('filter button toggles Spain filter', async () => {
    render(<App />);
    const filterBtn = screen.getByRole('button', { name: /Show Only Spain Locations/i });
    fireEvent.click(filterBtn);
    expect(filterBtn.textContent).toMatch(/Show All Locations/i);
  });
});
