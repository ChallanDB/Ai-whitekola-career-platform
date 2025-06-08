import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/store/settingsStore';
import { useJobsStore } from '@/store/jobsStore';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { jobSectors, jobTypes, cameroonLocations } from '@/utils/mockData';
import { Job } from '@/types';

export default function PostJobScreen() {
  const router = useRouter();
  const { darkMode } = useSettingsStore();
  const { postJob } = useJobsStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: '' as 'Remote' | 'Hybrid' | 'Onsite',
    sector: '',
    salary: '',
    deadline: '',
    applicationType: 'internal' as 'internal' | 'external',
    applicationLink: '',
  });
  
  const [errors, setErrors] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: '',
    sector: '',
    deadline: '',
    applicationLink: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;
    
    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
      isValid = false;
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
      isValid = false;
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }
    
    if (!formData.jobType) {
      newErrors.jobType = 'Job type is required';
      isValid = false;
    }
    
    if (!formData.sector) {
      newErrors.sector = 'Sector is required';
      isValid = false;
    }
    
    if (!formData.deadline.trim()) {
      newErrors.deadline = 'Application deadline is required';
      isValid = false;
    } else {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.deadline)) {
        newErrors.deadline = 'Use format YYYY-MM-DD';
        isValid = false;
      }
    }
    
    // External link validation
    if (formData.applicationType === 'external' && !formData.applicationLink.trim()) {
      newErrors.applicationLink = 'Application link is required for external jobs';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare job data
      const jobData: Omit<Job, 'id' | 'postedAt' | 'isPriority'> = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        location: formData.location,
        jobType: formData.jobType,
        sector: formData.sector,
        salary: formData.salary,
        deadline: formData.deadline,
        postedBy: user?.id || 'anonymous',
        applicationType: formData.applicationType,
        applicationLink: formData.applicationLink,
        isExternal: formData.applicationType === 'external',
        source: 'WhiteKola'
      };
      
      // Post job to Firestore
      await postJob(jobData);
      
      Alert.alert(
        'Success',
        'Your job has been posted successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to post job. Please try again later.'
      );
      console.error('Error posting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderJobTypeOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        {jobTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              formData.jobType === type && styles.selectedOption,
              darkMode && styles.darkOptionButton,
              formData.jobType === type && darkMode && styles.darkSelectedOption,
            ]}
            onPress={() => handleChange('jobType', type)}
          >
            <Text 
              style={[
                styles.optionText,
                formData.jobType === type && styles.selectedOptionText,
                darkMode && styles.darkText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const renderSectorOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        {jobSectors.map(sector => (
          <TouchableOpacity
            key={sector}
            style={[
              styles.optionButton,
              formData.sector === sector && styles.selectedOption,
              darkMode && styles.darkOptionButton,
              formData.sector === sector && darkMode && styles.darkSelectedOption,
            ]}
            onPress={() => handleChange('sector', sector)}
          >
            <Text 
              style={[
                styles.optionText,
                formData.sector === sector && styles.selectedOptionText,
                darkMode && styles.darkText,
              ]}
            >
              {sector}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const renderLocationOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        {cameroonLocations.map(location => (
          <TouchableOpacity
            key={location}
            style={[
              styles.optionButton,
              formData.location === location && styles.selectedOption,
              darkMode && styles.darkOptionButton,
              formData.location === location && darkMode && styles.darkSelectedOption,
            ]}
            onPress={() => handleChange('location', location)}
          >
            <Text 
              style={[
                styles.optionText,
                formData.location === location && styles.selectedOptionText,
                darkMode && styles.darkText,
              ]}
            >
              {location}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const renderApplicationTypeOptions = () => {
    return (
      <View style={styles.applicationTypeContainer}>
        <TouchableOpacity
          style={[
            styles.applicationTypeButton,
            formData.applicationType === 'internal' && styles.selectedApplicationType,
            darkMode && styles.darkApplicationTypeButton,
            formData.applicationType === 'internal' && darkMode && styles.darkSelectedApplicationType,
          ]}
          onPress={() => handleChange('applicationType', 'internal')}
        >
          <Text 
            style={[
              styles.applicationTypeText,
              formData.applicationType === 'internal' && styles.selectedApplicationTypeText,
              darkMode && styles.darkText,
            ]}
          >
            WhiteKola CV
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.applicationTypeButton,
            formData.applicationType === 'external' && styles.selectedApplicationType,
            darkMode && styles.darkApplicationTypeButton,
            formData.applicationType === 'external' && darkMode && styles.darkSelectedApplicationType,
          ]}
          onPress={() => handleChange('applicationType', 'external')}
        >
          <Text 
            style={[
              styles.applicationTypeText,
              formData.applicationType === 'external' && styles.selectedApplicationTypeText,
              darkMode && styles.darkText,
            ]}
          >
            External Link
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Post a Job',
          headerStyle: {
            backgroundColor: darkMode ? Colors.dark.card : 'white',
          },
          headerTintColor: darkMode ? Colors.dark.text : Colors.text,
        }}
      />
      
      <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView style={styles.scrollView}>
            <View style={[styles.formContainer, darkMode && styles.darkFormContainer]}>
              <Text style={[styles.formTitle, darkMode && styles.darkText]}>Job Details</Text>
              
              <Input
                label="Job Title"
                placeholder="e.g., Senior React Native Developer"
                value={formData.title}
                onChangeText={(text) => handleChange('title', text)}
                error={errors.title}
                containerStyle={styles.inputContainer}
                labelStyle={darkMode ? styles.darkLabel : undefined}
                inputStyle={darkMode ? styles.darkInput : undefined}
              />
              
              <Input
                label="Company Name"
                placeholder="e.g., TechCorp Cameroon"
                value={formData.company}
                onChangeText={(text) => handleChange('company', text)}
                error={errors.company}
                containerStyle={styles.inputContainer}
                labelStyle={darkMode ? styles.darkLabel : undefined}
                inputStyle={darkMode ? styles.darkInput : undefined}
              />
              
              <Input
                label="Job Description"
                placeholder="Describe the role, responsibilities, and requirements"
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                error={errors.description}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                containerStyle={styles.inputContainer}
                inputStyle={[styles.textArea, darkMode && styles.darkInput]}
                labelStyle={darkMode ? styles.darkLabel : undefined}
              />
              
              <View style={styles.inputContainer}>
                <Text style={[styles.label, darkMode && styles.darkLabel]}>Location</Text>
                {renderLocationOptions()}
                {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.label, darkMode && styles.darkLabel]}>Job Type</Text>
                {renderJobTypeOptions()}
                {errors.jobType ? <Text style={styles.errorText}>{errors.jobType}</Text> : null}
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.label, darkMode && styles.darkLabel]}>Sector</Text>
                {renderSectorOptions()}
                {errors.sector ? <Text style={styles.errorText}>{errors.sector}</Text> : null}
              </View>
              
              <Input
                label="Salary (Optional)"
                placeholder="e.g., XAF 1,000,000 - 1,500,000"
                value={formData.salary}
                onChangeText={(text) => handleChange('salary', text)}
                containerStyle={styles.inputContainer}
                labelStyle={darkMode ? styles.darkLabel : undefined}
                inputStyle={darkMode ? styles.darkInput : undefined}
              />
              
              <Input
                label="Application Deadline"
                placeholder="YYYY-MM-DD"
                value={formData.deadline}
                onChangeText={(text) => handleChange('deadline', text)}
                error={errors.deadline}
                containerStyle={styles.inputContainer}
                labelStyle={darkMode ? styles.darkLabel : undefined}
                inputStyle={darkMode ? styles.darkInput : undefined}
              />
              
              <View style={styles.inputContainer}>
                <Text style={[styles.label, darkMode && styles.darkLabel]}>Application Method</Text>
                {renderApplicationTypeOptions()}
              </View>
              
              {formData.applicationType === 'external' && (
                <Input
                  label="Application Link"
                  placeholder="https://example.com/apply"
                  value={formData.applicationLink}
                  onChangeText={(text) => handleChange('applicationLink', text)}
                  error={errors.applicationLink}
                  containerStyle={styles.inputContainer}
                  labelStyle={darkMode ? styles.darkLabel : undefined}
                  inputStyle={darkMode ? styles.darkInput : undefined}
                />
              )}
            </View>
          </ScrollView>
          
          <View style={[styles.footer, darkMode && styles.darkFooter]}>
            <Button
              title="Post Job"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkFormContainer: {
    backgroundColor: Colors.dark.card,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  darkText: {
    color: Colors.dark.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: Colors.text,
  },
  darkLabel: {
    color: Colors.dark.text,
  },
  darkInput: {
    color: Colors.dark.text,
    backgroundColor: Colors.dark.background,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  optionButton: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  darkOptionButton: {
    backgroundColor: Colors.dark.background,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
  },
  darkSelectedOption: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedOptionText: {
    color: 'white',
  },
  applicationTypeContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  applicationTypeButton: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
  },
  darkApplicationTypeButton: {
    backgroundColor: Colors.dark.background,
  },
  selectedApplicationType: {
    backgroundColor: Colors.primary,
  },
  darkSelectedApplicationType: {
    backgroundColor: Colors.primary,
  },
  applicationTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedApplicationTypeText: {
    color: 'white',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
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
  submitButton: {
    width: '100%',
  },
});