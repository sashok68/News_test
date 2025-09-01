import React from 'react';
import { ScrollView, Linking, Alert, View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type NewsDetailScreenRouteProp = RouteProp<RootStackParamList, 'NewsDetail'>;

interface Props {
  route: NewsDetailScreenRouteProp;
}

const NewsDetailScreen: React.FC<Props> = ({ route }) => {
  const { article } = route.params;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReadMore = async () => {
    try {
      const supported = await Linking.canOpenURL(article.url);
      if (supported) {
        await Linking.openURL(article.url);
      } else {
        Alert.alert('Ошибка', 'Невозможно открыть ссылку');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при открытии ссылки');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
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

        <Text style={styles.title}>{article.title}</Text>

        <View style={styles.metaInfo}>
          <Text style={styles.source}>{article.source.name}</Text>
          <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
        </View>

        {article.author && (
          <Text style={styles.author}>Автор: {article.author}</Text>
        )}

        {article.description && (
          <Text style={styles.description}>{article.description}</Text>
        )}

        {article.content && (
          <Text style={styles.content}>
            {article.content.replace(/\[\+\d+\s+chars\]$/, '...')}
          </Text>
        )}

        <TouchableOpacity style={styles.readMoreButton} onPress={handleReadMore}>
          <Text style={styles.readMoreButtonText}>Читать полностью</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  newsImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#6b7280',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 32,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  source: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
  },
  author: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 24,
  },
  content: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  readMoreButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  readMoreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewsDetailScreen;