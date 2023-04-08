import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Nav from './Nav';


//== search by text ==//
describe('App component', () => {
  test('it renders', () => {
    render(<Nav />);
    expect(screen.getByText('Cartse')).toBeInTheDocument();
    expect(screen.getByTestId('Cartse')).toBeInTheDocument();
  });
})

//== for async functions ==//
describe('Archive component', () => {
  test('it renders', async () => {
    render(<Archive />);
    const cars = await waitFor(() => screen.getByTestId('Passat'));
    expect(cars).toBeInTheDocument()
  });
})

//== if field empty ==//
test("Form submission should not call add method if input field is empty", () => {
  const add = jest.fn();
  const { getByTestId } = render(<Archive add={add} />);
  const btn = getByTestId("submit-btn");
  fireEvent.click(btn);

  expect(add).not.toHaveBeenCalledTimes(1);
});

//== render compoents with redus end router ==//
describe('With React Testing Library', () => {
  const initialState = {};
  const mockStore = configureStore();
  const store = mockStore(initialState);

  test('Check render Item component"', () => {
      const { getByText } = render(<Provider store={store}><Item product={product} /></Provider>, { wrapper: MemoryRouter });
      expect(getByText('Test user')).not.toBeNull();
  });
});