import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewsCard from '../../src/components/NewsCard';
import { NewsArticle } from '../../src/types/news';

const mockArticle: NewsArticle = {
  source: {
    id: 'test-source',
    name: 'Test News Source',
  },
  author: 'John Doe',
  title: 'Test News Title',
  description: 'This is a test description for the news article.',
  url: 'https://example.com/test-article',
  urlToImage: 'https://example.com/test-image.jpg',
  publishedAt: '2024-01-01T12:00:00Z',
  content: 'This is test content for the news article.',
};

const mockArticleWithoutImage: NewsArticle = {
  ...mockArticle,
  urlToImage: null,
};

const mockOnPress = jest.fn();

describe('NewsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders article with all information', () => {
    const { getByText } = render(
      <NewsCard article={mockArticle} onPress={mockOnPress} />
    );

    expect(getByText('Test News Title')).toBeTruthy();
    expect(getByText('This is a test description for the news article.')).toBeTruthy();
    expect(getByText('Test News Source')).toBeTruthy();
  });

  test('renders article without description', () => {
    const articleWithoutDescription = { ...mockArticle, description: null };
    const { getByText, queryByText } = render(
      <NewsCard article={articleWithoutDescription} onPress={mockOnPress} />
    );

    expect(getByText('Test News Title')).toBeTruthy();
    expect(queryByText('This is a test description for the news article.')).toBeNull();
    expect(getByText('Test News Source')).toBeTruthy();
  });

  test('renders placeholder when no image is provided', () => {
    const { getByText } = render(
      <NewsCard article={mockArticleWithoutImage} onPress={mockOnPress} />
    );

    expect(getByText('Нет изображения')).toBeTruthy();
  });

  test('calls onPress when card is pressed', () => {
    const { getByText } = render(
      <NewsCard article={mockArticle} onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Test News Title'));
    expect(mockOnPress).toHaveBeenCalledWith(mockArticle);
  });

  test('formats date correctly', () => {
    const { getByText } = render(
      <NewsCard article={mockArticle} onPress={mockOnPress} />
    );

    // Check that date is displayed in some format
    const dateElement = getByText(/01\.01\.2024/);
    expect(dateElement).toBeTruthy();
  });

  test('truncates title to 3 lines', () => {
    const longTitleArticle = {
      ...mockArticle,
      title: 'This is a very long title that should be truncated after three lines because it contains too much text and would not fit properly in the card layout',
    };

    const { getByText } = render(
      <NewsCard article={longTitleArticle} onPress={mockOnPress} />
    );

    const titleElement = getByText(longTitleArticle.title);
    expect(titleElement.props.numberOfLines).toBe(3);
  });

  test('truncates description to 2 lines', () => {
    const longDescriptionArticle = {
      ...mockArticle,
      description: 'This is a very long description that should be truncated after two lines because it contains too much text and would not fit properly in the card layout without making it too tall',
    };

    const { getByText } = render(
      <NewsCard article={longDescriptionArticle} onPress={mockOnPress} />
    );

    const descriptionElement = getByText(longDescriptionArticle.description);
    expect(descriptionElement.props.numberOfLines).toBe(2);
  });
});
