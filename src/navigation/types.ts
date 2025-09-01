import { NewsArticle } from '../types/news';

export type RootStackParamList = {
  NewsList: undefined;
  NewsDetail: {
    article: NewsArticle;
  };
};
