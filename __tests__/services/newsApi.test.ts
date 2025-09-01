import axios from 'axios';
import { NewsApiService } from '../../src/services/newsApi';
import { NewsApiResponse } from '../../src/types/news';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
  })),
  isAxiosError: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockAxiosInstance = mockedAxios.create() as jest.Mocked<ReturnType<typeof axios.create>>;

const mockNewsApiResponse: NewsApiResponse = {
  status: 'ok',
  totalResults: 2,
  articles: [
    {
      source: { id: 'test-source', name: 'Test Source' },
      author: 'John Doe',
      title: 'Test Article 1',
      description: 'Test description 1',
      url: 'https://example.com/article1',
      urlToImage: 'https://example.com/image1.jpg',
      publishedAt: '2024-01-01T12:00:00Z',
      content: 'Test content 1',
    },
    {
      source: { id: 'test-source-2', name: 'Test Source 2' },
      author: 'Jane Smith',
      title: 'Test Article 2',
      description: 'Test description 2',
      url: 'https://example.com/article2',
      urlToImage: 'https://example.com/image2.jpg',
      publishedAt: '2024-01-02T12:00:00Z',
      content: 'Test content 2',
    },
  ],
};

describe('NewsApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    (mockedAxios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
  });

  describe('getTopHeadlines', () => {
    test('fetches top headlines with default parameters', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockNewsApiResponse });

      const result = await NewsApiService.getTopHeadlines();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/top-headlines', {
        params: {
          country: 'us',
          page: 1,
          pageSize: 10,
        },
      });
      expect(result).toEqual(mockNewsApiResponse);
    });

    test('fetches top headlines with custom filters', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockNewsApiResponse });

      const filters = {
        category: 'technology' as const,
        country: 'ru',
        page: 2,
        pageSize: 20,
      };

      const result = await NewsApiService.getTopHeadlines(filters);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/top-headlines', {
        params: {
          country: 'ru',
          category: 'technology',
          page: 2,
          pageSize: 20,
        },
      });
      expect(result).toEqual(mockNewsApiResponse);
    });

    test('removes undefined values from params', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockNewsApiResponse });

      const filters = {
        category: undefined,
        q: undefined,
        page: 1,
      };

      await NewsApiService.getTopHeadlines(filters);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/top-headlines', {
        params: {
          country: 'us',
          page: 1,
          pageSize: 10,
        },
      });
    });

    test('handles API error response', async () => {
      const apiError = {
        response: {
          data: {
            status: 'error',
            code: 'apiKeyInvalid',
            message: 'Your API key is invalid',
          },
        },
      };
      (mockedAxios.isAxiosError as jest.Mock).mockReturnValue(true);
      mockAxiosInstance.get.mockRejectedValue(apiError);

      await expect(NewsApiService.getTopHeadlines()).rejects.toEqual(
        apiError.response.data
      );
    });

    test('handles network error', async () => {
      const networkError = new Error('Network Error');
      (mockedAxios.isAxiosError as jest.Mock).mockReturnValue(false);
      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(NewsApiService.getTopHeadlines()).rejects.toThrow(
        'Ошибка сети при загрузке новостей'
      );
    });
  });

  describe('searchNews', () => {
    test('searches news with query and default page', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockNewsApiResponse });

      const result = await NewsApiService.searchNews('test query');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/everything', {
        params: {
          q: 'test query',
          page: 1,
          pageSize: 10,
          sortBy: 'publishedAt',
        },
      });
      expect(result).toEqual(mockNewsApiResponse);
    });

    test('searches news with query and custom page', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockNewsApiResponse });

      const result = await NewsApiService.searchNews('test query', 3);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/everything', {
        params: {
          q: 'test query',
          page: 3,
          pageSize: 10,
          sortBy: 'publishedAt',
        },
      });
      expect(result).toEqual(mockNewsApiResponse);
    });

    test('handles API error response in search', async () => {
      const apiError = {
        response: {
          data: {
            status: 'error',
            code: 'rateLimited',
            message: 'You have made too many requests',
          },
        },
      };
      (mockedAxios.isAxiosError as jest.Mock).mockReturnValue(true);
      mockAxiosInstance.get.mockRejectedValue(apiError);

      await expect(NewsApiService.searchNews('test')).rejects.toEqual(
        apiError.response.data
      );
    });

    test('handles network error in search', async () => {
      const networkError = new Error('Network Error');
      (mockedAxios.isAxiosError as jest.Mock).mockReturnValue(false);
      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(NewsApiService.searchNews('test')).rejects.toThrow(
        'Ошибка сети при поиске новостей'
      );
    });
  });
});
