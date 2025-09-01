import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Container, LoadingContainer, ErrorContainer, ErrorText, RetryButton, RetryButtonText } from '../components/styled/Container';
import NewsCard from '../components/NewsCard';
import SearchAndFilters from '../components/SearchAndFilters';
import { RootStackParamList } from '../navigation/types';
import { NewsArticle, NewsCategory } from '../types/news';
import { NewsApiService } from '../services/newsApi';

type NewsListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewsList'>;

interface Props {
  navigation: NewsListScreenNavigationProp;
}

const NewsListScreen: React.FC<Props> = ({ navigation }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | undefined>();
  const [isSearchMode, setIsSearchMode] = useState(false);

  const loadNews = useCallback(async (
    pageNum: number = 1, 
    isRefresh: boolean = false,
    query?: string,
    category?: NewsCategory
  ) => {
    try {
      if (pageNum === 1) {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);
      } else {
        setLoadingMore(true);
      }

      let response;
      if (query && query.trim()) {
        response = await NewsApiService.searchNews(query, pageNum);
        setIsSearchMode(true);
      } else {
        response = await NewsApiService.getTopHeadlines({
          page: pageNum,
          pageSize: 10,
          category: category,
        });
        setIsSearchMode(false);
      }

      if (pageNum === 1) {
        setArticles(response.articles);
      } else {
        setArticles(prev => [...prev, ...response.articles]);
      }

      setPage(pageNum);
      setHasMorePages(response.articles.length === 10);
    } catch (err: any) {
      console.error('Error loading news:', err);
      const errorMessage = err.message || 'Ошибка при загрузке новостей';
      setError(errorMessage);
      if (pageNum === 1) {
        setArticles([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadNews(1, false, searchQuery, selectedCategory);
  }, [selectedCategory, loadNews, searchQuery]);

  const handleRefresh = () => {
    setPage(1);
    setHasMorePages(true);
    loadNews(1, true, searchQuery, selectedCategory);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMorePages && !loading) {
      const nextPage = page + 1;
      loadNews(nextPage, false, searchQuery, selectedCategory);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setHasMorePages(true);
    loadNews(1, false, query, selectedCategory);
  };

  const handleCategorySelect = (category: NewsCategory | undefined) => {
    setSelectedCategory(category);
    if (!searchQuery) {
      setPage(1);
      setHasMorePages(true);
    }
  };

  const handleArticlePress = (article: NewsArticle) => {
    navigation.navigate('NewsDetail', { article });
  };

  const handleRetry = () => {
    setPage(1);
    setHasMorePages(true);
    loadNews(1, false, searchQuery, selectedCategory);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <Container style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#2563eb" />
      </Container>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <ErrorContainer>
        <ErrorText>
          {isSearchMode 
            ? 'По вашему запросу ничего не найдено' 
            : 'Новости не найдены'
          }
        </ErrorText>
      </ErrorContainer>
    );
  };

  if (loading && articles.length === 0) {
    return (
      <Container>
        <SearchAndFilters
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
        <LoadingContainer>
          <ActivityIndicator size="large" color="#2563eb" />
        </LoadingContainer>
      </Container>
    );
  }

  if (error && articles.length === 0) {
    return (
      <Container>
        <SearchAndFilters
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <RetryButton onPress={handleRetry}>
            <RetryButtonText>Попробовать снова</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <SearchAndFilters
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
      <FlatList
        data={articles}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        renderItem={({ item }) => (
          <NewsCard article={item} onPress={handleArticlePress} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2563eb']}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.flatListContent}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 20,
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default NewsListScreen;
