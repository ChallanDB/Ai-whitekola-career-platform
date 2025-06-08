import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Share as RNShare,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useJobsStore } from '@/store/jobsStore';
import JobCard from '@/components/JobCard';
import FilterModal from '@/components/FilterModal';
import Colors from '@/constants/colors';
import { cameroonLocations } from '@/utils/mockData';
import { useSettingsStore } from '@/store/settingsStore';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { darkMode } = useSettingsStore();
  const { 
    jobs, 
    filteredJobs, 
    filters, 
    isLoading,
    setJobs, 
    updateFilters, 
    applyFilters, 
    clearFilters,
    fetchJobs
  } = useJobsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load jobs on component mount
    fetchJobs();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    updateFilters({ search: text });
    applyFilters();
  };

  const clearSearch = () => {
    setSearchQuery('');
    updateFilters({ search: '' });
    applyFilters();
  };

  const handleApplyFilters = (newFilters: any) => {
    updateFilters(newFilters);
    applyFilters();
  };

  const handleJobPress = (jobId: string) => {
    router.push(`/job/${jobId}`);
  };

  const handleShareJob = async (job: any) => {
    try {
      await RNShare.share({
        message: `Check out this job: ${job.title} at ${job.company}. ${job.description}`,
        title: `${job.title} - ${job.company}`,
      });
    } catch (error) {
      console.error('Error sharing job:', error);
    }
  };

  const handleApplyToJob = (job: any) => {
    if (!user?.hasCV && job.applicationType === 'internal') {
      Alert.alert(
        'CV Required',
        'You need to create a CV before applying to this job.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Create CV', 
            onPress: () => router.push('/cv/create') 
          }
        ]
      );
      return;
    }

    if (job.applicationType === 'external') {
      // Open external link
      Alert.alert(
        'External Application',
        'You will be redirected to an external website to complete your application.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue', 
            onPress: () => {
              // In a real app, this would open the URL
              console.log('Opening URL:', job.applicationLink);
            } 
          }
        ]
      );
    } else {
      // Internal application
      Alert.alert(
        'Apply with WhiteKola',
        'Your CV will be sent to the employer. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Apply', 
            onPress: () => {
              // In a real app, this would submit the application
              Alert.alert('Success', 'Your application has been submitted!');
            } 
          }
        ]
      );
    }
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, darkMode && styles.darkText]}>
        No jobs found. Try adjusting your filters.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]} edges={['bottom']}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, darkMode && styles.darkSearchBar]}>
          <Search size={20} color={darkMode ? Colors.dark.subtext : Colors.subtext} />
          <TextInput
            style={[styles.searchInput, darkMode && styles.darkText]}
            placeholder="Search jobs..."
            placeholderTextColor={darkMode ? Colors.dark.subtext : Colors.subtext}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={darkMode ? Colors.dark.subtext : Colors.subtext} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, darkMode && styles.darkFilterButton]} 
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color={darkMode ? Colors.dark.text : 'white'} />
        </TouchableOpacity>
      </View>

      {(filters.location || filters.jobType || filters.sector) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={[styles.activeFiltersText, darkMode && styles.darkText]}>
            Active filters:
          </Text>
          <View style={styles.filterTags}>
            {filters.location && (
              <View style={styles.filterTag}>
                <Text style={styles.filterTagText}>{filters.location}</Text>
                <TouchableOpacity 
                  onPress={() => {
                    updateFilters({ location: '' });
                    applyFilters();
                  }}
                >
                  <X size={14} color={Colors.text} />
                </TouchableOpacity>
              </View>
            )}
            {filters.jobType && (
              <View style={styles.filterTag}>
                <Text style={styles.filterTagText}>{filters.jobType}</Text>
                <TouchableOpacity 
                  onPress={() => {
                    updateFilters({ jobType: '' });
                    applyFilters();
                  }}
                >
                  <X size={14} color={Colors.text} />
                </TouchableOpacity>
              </View>
            )}
            {filters.sector && (
              <View style={styles.filterTag}>
                <Text style={styles.filterTagText}>{filters.sector}</Text>
                <TouchableOpacity 
                  onPress={() => {
                    updateFilters({ sector: '' });
                    applyFilters();
                  }}
                >
                  <X size={14} color={Colors.text} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear all</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={filteredJobs}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => handleJobPress(item.id)}
            onShare={() => handleShareJob(item)}
            onApply={() => handleApplyToJob(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={darkMode ? Colors.dark.text : Colors.primary}
          />
        }
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={{
          location: filters.location,
          jobType: filters.jobType,
          sector: filters.sector,
        }}
        locations={cameroonLocations}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  darkContainer: {
    backgroundColor: Colors.dark.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  darkSearchBar: {
    backgroundColor: Colors.dark.card,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  darkText: {
    color: Colors.dark.text,
  },
  filterButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkFilterButton: {
    backgroundColor: Colors.dark.card,
  },
  activeFiltersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  activeFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.text,
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterTagText: {
    fontSize: 12,
    marginRight: 6,
    color: Colors.text,
  },
  clearFiltersText: {
    color: Colors.primary,
    fontSize: 12,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
  },
});