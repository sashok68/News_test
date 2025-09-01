import axios, { AxiosResponse } from 'axios';
import { NewsApiResponse, NewsFilters } from '../types/news';

const NEWS_API_KEY = '02f9f40258ad4058ba941a1c349ac54e'; // Ваш реальный API ключ
const BASE_URL = 'https://newsapi.org/v2';

const newsApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': NEWS_API_KEY,
  },
});

export class NewsApiService {
  static async getTopHeadlines(filters: NewsFilters = {}): Promise<NewsApiResponse> {
    const params = {
      country: filters.country || 'us',
      category: filters.category,
      q: filters.q,
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
    };

    // Удаляем undefined значения
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] === undefined) {
        delete params[key as keyof typeof params];
      }
    });

    try {
      const response: AxiosResponse<NewsApiResponse> = await newsApi.get('/top-headlines', {
        params,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('Ошибка сети при загрузке новостей');
    }
  }

  static async searchNews(query: string, page: number = 1): Promise<NewsApiResponse> {
    try {
      const response: AxiosResponse<NewsApiResponse> = await newsApi.get('/everything', {
        params: {
          q: query,
          page,
          pageSize: 10,
          sortBy: 'publishedAt',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('Ошибка сети при поиске новостей');
    }
  }
}
