import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchAndFilters from '../../src/components/SearchAndFilters';

const mockOnSearch = jest.fn();
const mockOnCategorySelect = jest.fn();
const mockOnSearchQueryChange = jest.fn();

const defaultProps = {
  onSearch: mockOnSearch,
  onCategorySelect: mockOnCategorySelect,
  selectedCategory: undefined,
  searchQuery: '',
  onSearchQueryChange: mockOnSearchQueryChange,
};

describe('SearchAndFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input and categories', () => {
    const { getByPlaceholderText, getByText } = render(
      <SearchAndFilters {...defaultProps} />
    );

    expect(getByPlaceholderText('Поиск новостей...')).toBeTruthy();
    expect(getByText('Категории:')).toBeTruthy();
    expect(getByText('Все')).toBeTruthy();
    expect(getByText('Бизнес')).toBeTruthy();
    expect(getByText('Технологии')).toBeTruthy();
  });

  test('displays search query in input', () => {
    const { getByDisplayValue } = render(
      <SearchAndFilters {...defaultProps} searchQuery="test query" />
    );

    expect(getByDisplayValue('test query')).toBeTruthy();
  });

  test('calls onSearchQueryChange when typing in search input', () => {
    const { getByPlaceholderText } = render(
      <SearchAndFilters {...defaultProps} />
    );

    const searchInput = getByPlaceholderText('Поиск новостей...');
    fireEvent.changeText(searchInput, 'new search');

    expect(mockOnSearchQueryChange).toHaveBeenCalledWith('new search');
  });

  test('calls onSearch when submitting search', () => {
    const { getByPlaceholderText } = render(
      <SearchAndFilters {...defaultProps} searchQuery="test search" />
    );

    const searchInput = getByPlaceholderText('Поиск новостей...');
    fireEvent(searchInput, 'submitEditing');

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  test('shows clear button when search query is not empty', () => {
    const { getByText } = render(
      <SearchAndFilters {...defaultProps} searchQuery="test" />
    );

    expect(getByText('Очистить')).toBeTruthy();

    // Re-render with empty search query
    const { queryByText } = render(
      <SearchAndFilters {...defaultProps} searchQuery="" />
    );

    expect(queryByText('Очистить')).toBeNull();
  });

  test('clears search when clear button is pressed', () => {
    const { getByText } = render(
      <SearchAndFilters {...defaultProps} searchQuery="test query" />
    );

    const clearButton = getByText('Очистить');
    fireEvent.press(clearButton);

    expect(mockOnSearchQueryChange).toHaveBeenCalledWith('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('highlights selected category', () => {
    const { getByText } = render(
      <SearchAndFilters {...defaultProps} selectedCategory="technology" />
    );

    const techCategory = getByText('Технологии');
    expect(techCategory).toBeTruthy();
  });

  test('calls onCategorySelect when category is pressed', () => {
    const { getByText } = render(
      <SearchAndFilters {...defaultProps} />
    );

    const businessCategory = getByText('Бизнес');
    fireEvent.press(businessCategory);

    expect(mockOnCategorySelect).toHaveBeenCalledWith('business');
  });

  test('calls onCategorySelect with undefined when "Все" is pressed', () => {
    const { getByText } = render(
      <SearchAndFilters {...defaultProps} />
    );

    const allCategory = getByText('Все');
    fireEvent.press(allCategory);

    expect(mockOnCategorySelect).toHaveBeenCalledWith(undefined);
  });

  test('renders all category options', () => {
    const { getByText } = render(
      <SearchAndFilters {...defaultProps} />
    );

    const expectedCategories = [
      'Все',
      'Общие',
      'Бизнес',
      'Технологии',
      'Спорт',
      'Здоровье',
      'Наука',
      'Развлечения',
    ];

    expectedCategories.forEach(category => {
      expect(getByText(category)).toBeTruthy();
    });
  });
});
