import React, { useState } from 'react';
import { TextInput, View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NewsCategory } from '../types/news';

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: NewsCategory | undefined) => void;
  selectedCategory?: NewsCategory;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const categories: { key: NewsCategory | undefined; label: string }[] = [
  { key: undefined, label: 'Все' },
  { key: 'general', label: 'Общие' },
  { key: 'business', label: 'Бизнес' },
  { key: 'technology', label: 'Технологии' },
  { key: 'sports', label: 'Спорт' },
  { key: 'health', label: 'Здоровье' },
  { key: 'science', label: 'Наука' },
  { key: 'entertainment', label: 'Развлечения' },
];

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  onSearch,
  onCategorySelect,
  selectedCategory,
  searchQuery,
  onSearchQueryChange,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = () => {
    onSearch(localSearchQuery.trim());
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    onSearchQueryChange('');
    onSearch('');
  };

  const handleCategoryPress = (category: NewsCategory | undefined) => {
    onCategorySelect(category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск новостей..."
          value={localSearchQuery}
          onChangeText={(text) => {
            setLocalSearchQuery(text);
            onSearchQueryChange(text);
          }}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {localSearchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
            <Text style={styles.clearButtonText}>Очистить</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Категории:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.key;
            return (
              <TouchableOpacity
                key={category.key || 'all'}
                style={[
                  styles.categoryButton,
                  isSelected && styles.categoryButtonSelected
                ]}
                onPress={() => handleCategoryPress(category.key)}
              >
                <Text style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  categoryButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollViewContent: {
    paddingVertical: 4,
  },
});

export default SearchAndFilters;