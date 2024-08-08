import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../components/Header';

afterEach(() => {
  cleanup();
});

describe('Header component', () => {
  test('should open and close the hamburger menu', async () => {
    // Render the Header component
    render(<Header searchTerm="" userConnected={false} />, { wrapper: MemoryRouter });

    // Verify the hamburger menu icon is initially present
    const openHamburgerIcon = screen.getByTestId('hamburger-open-icon');
    expect(openHamburgerIcon).toBeInTheDocument();

    // Click the hamburger menu icon to open the menu
    fireEvent.click(openHamburgerIcon);

    // Verify the menu is now visible
    const menuBackground = screen.getByTestId('menu-background');
    expect(menuBackground).toBeInTheDocument();

    // Verify the close icon is now visible
    const closeHamburgerIcon = screen.getByTestId('hamburger-close-icon');
    expect(closeHamburgerIcon).toBeInTheDocument();

    // Click the close icon to close the menu
    fireEvent.click(closeHamburgerIcon);

    // Verify the menu is now hidden
    expect(menuBackground).not.toBeVisible();
  });

  test('should display hamburger menu correctly on different screen sizes', async () => {
    const { rerender } = render(<Header searchTerm="" userConnected={false} />, { wrapper: MemoryRouter });

    // Simulate a small screen size
    await act(async () => {
      window.innerWidth = 320;
      window.dispatchEvent(new Event('resize'));
      rerender(<Header searchTerm="" userConnected={false} />);
    });

    let openHamburgerIcon = screen.getByTestId('hamburger-open-icon');
    expect(openHamburgerIcon).toBeInTheDocument();

    // Simulate a large screen size
    await act(async () => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event('resize'));
      rerender(<Header searchTerm="" userConnected={false} />);
    });

    openHamburgerIcon = screen.getByTestId('hamburger-open-icon');
    expect(openHamburgerIcon).toBeInTheDocument();
  });
});
