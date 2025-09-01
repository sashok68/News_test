import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { NewsArticle } from '../types/news';

interface NewsCardProps {
  article: NewsArticle;
  onPress: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity onPress={() => onPress(article)} activeOpacity={0.7}>
      <View style={styles.cardContainer}>
        {article.urlToImage ? (
          <Image 
            source={{ uri: article.urlToImage }}
            style={styles.newsImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Нет изображения</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={3}>{article.title}</Text>
          {article.description && (
            <Text style={styles.description} numberOfLines={2}>{article.description}</Text>
          )}
          <View style={styles.metaInfo}>
            <Text style={styles.source}>{article.source.name}</Text>
            <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderText: {
    color: '#6b7280',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default NewsCard;
