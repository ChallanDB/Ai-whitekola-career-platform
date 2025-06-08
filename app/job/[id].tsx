import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Share2, Calendar, MapPin, Briefcase, DollarSign, Clock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useJobsStore } from '@/store/jobsStore';
import { useSettingsStore } from '@/store/settingsStore';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { jobs } = useJobsStore();
  const { darkMode } = useSettingsStore();
  
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return (
      <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]}>
        <Text style={[styles.notFoundText, darkMode && styles.darkText]}>Job not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.backButton} />
      </SafeAreaView>
    );
  }

  const handleApply = () => {
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job: ${job.title} at ${job.company}. ${job.description}`,
        title: `${job.title} - ${job.company}`,
      });
    } catch (error) {
      console.error('Error sharing job:', error);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: job.title,
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Share2 size={20} color={darkMode ? Colors.dark.text : Colors.text} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: darkMode ? Colors.dark.card : 'white',
          },
          headerTintColor: darkMode ? Colors.dark.text : Colors.text,
        }}
      />
      
      <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]} edges={['bottom']}>
        <ScrollView style={styles.scrollView}>
          <View style={[styles.header, darkMode && styles.darkHeader]}>
            <View style={styles.companyContainer}>
              <View style={styles.initialsContainer}>
                <Text style={styles.initials}>
                  {job.title.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)}
                </Text>
              </View>
              <View>
                <Text style={[styles.company, darkMode && styles.darkText]}>{job.company}</Text>
                <Text style={styles.jobType}>{job.jobType}</Text>
              </View>
            </View>
            
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <MapPin size={16} color={Colors.primary} />
                <Text style={[styles.metaText, darkMode && styles.darkText]}>{job.location}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Briefcase size={16} color={Colors.primary} />
                <Text style={[styles.metaText, darkMode && styles.darkText]}>{job.sector}</Text>
              </View>
              
              {job.salary && (
                <View style={styles.metaItem}>
                  <DollarSign size={16} color={Colors.primary} />
                  <Text style={[styles.metaText, darkMode && styles.darkText]}>{job.salary}</Text>
                </View>
              )}
              
              <View style={styles.metaItem}>
                <Calendar size={16} color={Colors.primary} />
                <Text style={[styles.metaText, darkMode && styles.darkText]}>
                  Deadline: {formatDate(job.deadline)}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <Clock size={16} color={Colors.primary} />
                <Text style={[styles.metaText, darkMode && styles.darkText]}>
                  Posted: {new Date(job.postedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.section, darkMode && styles.darkSection]}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Job Description</Text>
            <Text style={[styles.description, darkMode && styles.darkText]}>
              {job.description}
            </Text>
          </View>
          
          <View style={[styles.section, darkMode && styles.darkSection]}>
            <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Application Method</Text>
            <Text style={[styles.applicationMethod, darkMode && styles.darkText]}>
              {job.applicationType === 'internal' 
                ? 'Apply directly through WhiteKola with your CV' 
                : 'Apply through external website'}
            </Text>
            
            {job.isExternal && (
              <View style={styles.externalTag}>
                <Text style={styles.externalTagText}>
                  {job.source || 'External Job'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        <View style={[styles.footer, darkMode && styles.darkFooter]}>
          <Button
            title={job.applicationType === 'internal' ? 'Apply with CV' : 'Apply External'}
            onPress={handleApply}
            style={styles.applyButton}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  darkContainer: {
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  darkHeader: {
    backgroundColor: Colors.dark.card,
    borderBottomColor: Colors.dark.border,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  initialsContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initials: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  darkText: {
    color: Colors.dark.text,
  },
  jobType: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  metaInfo: {
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  darkSection: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
  },
  applicationMethod: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  externalTag: {
    backgroundColor: Colors.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  externalTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  darkFooter: {
    backgroundColor: Colors.dark.card,
    borderTopColor: Colors.dark.border,
  },
  applyButton: {
    width: '100%',
  },
  shareButton: {
    padding: 8,
  },
  notFoundText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    color: Colors.text,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
});