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
  Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Plus, Trash2 } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { generatePDF } from '@/utils/pdfGenerator';

export default function CreateCVScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { darkMode } = useSettingsStore();
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cv, setCV] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    summary: '',
    workExperience: [
      {
        id: '1',
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      }
    ],
    education: [
      {
        id: '1',
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
      }
    ],
    skills: [''],
    certifications: [
      {
        id: '1',
        name: '',
        issuer: '',
        date: '',
      }
    ],
    references: [
      {
        id: '1',
        name: '',
        company: '',
        position: '',
        email: '',
        phone: '',
      }
    ],
  });
  
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    photo: '',
    summary: '',
  });
  
  const handleChange = (section: string, field: string, value: string, index?: number) => {
    if (index !== undefined && Array.isArray(formData[section as keyof typeof formData])) {
      const newArray = [...(formData[section as keyof typeof formData] as any[])];
      newArray[index] = { ...newArray[index], [field]: value };
      setFormData(prev => ({ ...prev, [section]: newArray }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleAddItem = (section: string) => {
    const newItem: any = {};
    
    switch (section) {
      case 'workExperience':
        newItem.id = Date.now().toString();
        newItem.company = '';
        newItem.position = '';
        newItem.startDate = '';
        newItem.endDate = '';
        newItem.current = false;
        newItem.description = '';
        break;
      case 'education':
        newItem.id = Date.now().toString();
        newItem.institution = '';
        newItem.degree = '';
        newItem.field = '';
        newItem.startDate = '';
        newItem.endDate = '';
        newItem.current = false;
        break;
      case 'skills':
        newItem.id = Date.now().toString();
        newItem.name = '';
        break;
      case 'certifications':
        newItem.id = Date.now().toString();
        newItem.name = '';
        newItem.issuer = '';
        newItem.date = '';
        break;
      case 'references':
        newItem.id = Date.now().toString();
        newItem.name = '';
        newItem.company = '';
        newItem.position = '';
        newItem.email = '';
        newItem.phone = '';
        break;
      default:
        return;
    }
    
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section as keyof typeof prev] as any[]), section === 'skills' ? '' : newItem],
    }));
  };
  
  const handleRemoveItem = (section: string, index: number) => {
    const newArray = [...(formData[section as keyof typeof formData] as any[])];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [section]: newArray }));
  };
  
  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({
      ...prev,
      skills: newSkills,
    }));
  };
  
  const handleAddSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, ''],
    }));
  };
  
  const handleRemoveSkill = (index: number) => {
    const newSkills = [...formData.skills];
    newSkills.splice(index, 1);
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };
  
  const handleTakePhoto = () => {
    // In a real app, this would open the camera
    Alert.alert(
      'Take Photo',
      'This would open the camera to take a square photo for your CV.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK',
          onPress: () => {
            // Simulate taking a photo
            setPhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop');
            setErrors(prev => ({ ...prev, photo: '' }));
          }
        }
      ]
    );
  };
  
  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;
    
    // Required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    }
    
    if (!photo) {
      newErrors.photo = 'Photo is required';
      isValid = false;
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'Professional summary is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      // If validation fails, switch to personal section to show errors
      setActiveSection('personal');
      return;
    }
    
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a CV');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For demo, we'll use the direct URL
      const photoURL = photo || '';
      
      // Create CV object
      const cvData = {
        userId: user.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        summary: formData.summary,
        photoURL,
        workExperience: formData.workExperience,
        education: formData.education,
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        certifications: formData.certifications,
        references: formData.references,
      };
      
      // Store CV for download
      setCV({ id: Date.now().toString(), ...cvData });
      
      // Update user to indicate they have a CV
      updateUser({ hasCV: true });
      
      Alert.alert(
        'Success',
        'Your CV has been created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/(tabs)/profile') 
          }
        ]
      );
    } catch (error) {
      console.error('Error creating CV:', error);
      Alert.alert(
        'Error',
        'Failed to create CV. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDownloadCV = async () => {
    if (!cv) {
      Alert.alert('Error', 'Please create your CV first');
      return;
    }
    
    try {
      await generatePDF(cv);
    } catch (error) {
      console.error('Error downloading CV:', error);
      Alert.alert('Error', 'Failed to download CV. Please try again later.');
    }
  };
  
  const renderPersonalInfo = () => {
    return (
      <View style={styles.sectionContent}>
        <View style={styles.photoContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <TouchableOpacity style={styles.photoPlaceholder} onPress={handleTakePhoto}>
              <Camera size={32} color={Colors.primary} />
              <Text style={styles.photoText}>Take Photo</Text>
            </TouchableOpacity>
          )}
          {photo ? (
            <TouchableOpacity style={styles.changePhotoButton} onPress={handleTakePhoto}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          ) : null}
          {errors.photo ? <Text style={styles.errorText}>{errors.photo}</Text> : null}
        </View>
        
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={formData.fullName}
          onChangeText={(text) => handleChange('personal', 'fullName', text)}
          error={errors.fullName}
          containerStyle={styles.inputContainer}
          labelStyle={darkMode ? styles.darkLabel : undefined}
          inputStyle={darkMode ? styles.darkInput : undefined}
        />
        
        <Input
          label="Email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChangeText={(text) => handleChange('personal', 'email', text)}
          error={errors.email}
          keyboardType="email-address"
          containerStyle={styles.inputContainer}
          labelStyle={darkMode ? styles.darkLabel : undefined}
          inputStyle={darkMode ? styles.darkInput : undefined}
        />
        
        <Input
          label="Phone"
          placeholder="+237 6XX XXX XXX"
          value={formData.phone}
          onChangeText={(text) => handleChange('personal', 'phone', text)}
          error={errors.phone}
          keyboardType="phone-pad"
          containerStyle={styles.inputContainer}
          labelStyle={darkMode ? styles.darkLabel : undefined}
          inputStyle={darkMode ? styles.darkInput : undefined}
        />
        
        <Input
          label="Address"
          placeholder="Douala, Cameroon"
          value={formData.address}
          onChangeText={(text) => handleChange('personal', 'address', text)}
          containerStyle={styles.inputContainer}
          labelStyle={darkMode ? styles.darkLabel : undefined}
          inputStyle={darkMode ? styles.darkInput : undefined}
        />
        
        <Input
          label="Professional Summary"
          placeholder="Brief overview of your professional background and key strengths"
          value={formData.summary}
          onChangeText={(text) => handleChange('personal', 'summary', text)}
          error={errors.summary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          containerStyle={styles.inputContainer}
          inputStyle={[styles.textArea, darkMode && styles.darkInput]}
          labelStyle={darkMode ? styles.darkLabel : undefined}
        />
      </View>
    );
  };
  
  const renderWorkExperience = () => {
    return (
      <View style={styles.sectionContent}>
        {formData.workExperience.map((experience, index) => (
          <View key={experience.id} style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemTitle, darkMode && { color: Colors.dark.text }]}>
                Experience {index + 1}
              </Text>
              {formData.workExperience.length > 1 && (
                <TouchableOpacity 
                  onPress={() => handleRemoveItem('workExperience', index)}
                  style={styles.removeButton}
                >
                  <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
            
            <Input
              label="Company"
              placeholder="Company Name"
              value={experience.company}
              onChangeText={(text) => handleChange('workExperience', 'company', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <Input
              label="Position"
              placeholder="Job Title"
              value={experience.position}
              onChangeText={(text) => handleChange('workExperience', 'position', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <View style={styles.dateContainer}>
              <Input
                label="Start Date"
                placeholder="MM/YYYY"
                value={experience.startDate}
                onChangeText={(text) => handleChange('workExperience', 'startDate', text, index)}
                containerStyle={[styles.inputContainer, styles.dateInput]}
                labelStyle={darkMode ? styles.darkLabel : undefined}
                inputStyle={darkMode ? styles.darkInput : undefined}
              />
              
              <Input
                label="End Date"
                placeholder="MM/YYYY or Present"
                value={experience.endDate}
                onChangeText={(text) => handleChange('workExperience', 'endDate', text, index)}
                containerStyle={[styles.inputContainer, styles.dateInput]}
                labelStyle={darkMode ? styles.darkLabel : undefined}
                inputStyle={darkMode ? styles.darkInput : undefined}
              />
            </View>
            
            <Input
              label="Description"
              placeholder="Describe your responsibilities and achievements"
              value={experience.description}
              onChangeText={(text) => handleChange('workExperience', 'description', text, index)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              containerStyle={styles.inputContainer}
              inputStyle={[styles.textArea, darkMode && styles.darkInput]}
              labelStyle={darkMode ? styles.darkLabel : undefined}
            />
          </View>
        ))}
        
        <TouchableOpacity 
          style={[styles.addButton, darkMode && styles.darkAddButton]} 
          onPress={() => handleAddItem('workExperience')}
        >
          <Plus size={18} color={Colors.primary} />
          <Text style={styles.addButtonText}>Add Work Experience</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderEducation = () => {
    return (
      <View style={styles.sectionContent}>
        {formData.education.map((edu, index) => (
          <View key={edu.id} style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemTitle, darkMode && { color: Colors.dark.text }]}>
                Education {index + 1}
              </Text>
              {formData.education.length > 1 && (
                <TouchableOpacity 
                  onPress={() => handleRemoveItem('education', index)}
                  style={styles.removeButton}
                >
                  <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
            
            <Input
              label="Institution"
              placeholder="University/School Name"
              value={edu.institution}
              onChangeText={(text) => handleChange('education', 'institution', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <Input
              label="Degree"
              placeholder="e.g., Bachelor of Science"
              value={edu.degree}
              onChangeText={(text) => handleChange('education', 'degree', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <Input
              label="Field of Study"
              placeholder="e.g., Computer Science"
              value={edu.field}
              onChangeText={(text) => handleChange('education', 'field', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <View style={styles.dateContainer}>
              <Input
                label="Start Date"
                placeholder="MM/YYYY"
                value={edu.startDate}
                onChangeText={(text) => handleChange('education', 'startDate', text, index)}
                containerStyle={[styles.inputContainer, styles.dateInput]}
                labelStyle={darkMode ? styles.darkLabel : undefined}
                inputStyle={darkMode ? styles.darkInput : undefined}
              />
              
              <Input
                label="End Date"
                placeholder="MM/YYYY or Present"
                value={edu.endDate}
                onChangeText={(text) => handleChange('education', 'endDate', text, index)}
                containerStyle={[styles.inputContainer, styles.dateInput]}
                labelStyle={darkMode ? styles.darkLabel : undefined}
                inputStyle={darkMode ? styles.darkInput : undefined}
              />
            </View>
          </View>
        ))}
        
        <TouchableOpacity 
          style={[styles.addButton, darkMode && styles.darkAddButton]} 
          onPress={() => handleAddItem('education')}
        >
          <Plus size={18} color={Colors.primary} />
          <Text style={styles.addButtonText}>Add Education</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderSkills = () => {
    return (
      <View style={styles.sectionContent}>
        <Text style={[styles.skillsLabel, darkMode && styles.darkLabel]}>Skills</Text>
        <Text style={[styles.skillsSubLabel, darkMode && { color: Colors.dark.text }]}>
          Add skills relevant to your target job
        </Text>
        
        {formData.skills.map((skill, index) => (
          <View key={index} style={styles.skillContainer}>
            <Input
              placeholder="e.g., React Native, Project Management"
              value={skill}
              onChangeText={(text) => handleSkillChange(index, text)}
              containerStyle={[styles.inputContainer, styles.skillInput]}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            {formData.skills.length > 1 && (
              <TouchableOpacity 
                onPress={() => handleRemoveSkill(index)}
                style={styles.removeSkillButton}
              >
                <Trash2 size={18} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        <TouchableOpacity 
          style={[styles.addButton, darkMode && styles.darkAddButton]} 
          onPress={handleAddSkill}
        >
          <Plus size={18} color={Colors.primary} />
          <Text style={styles.addButtonText}>Add Skill</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderCertifications = () => {
    return (
      <View style={styles.sectionContent}>
        {formData.certifications.map((cert, index) => (
          <View key={cert.id} style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemTitle, darkMode && { color: Colors.dark.text }]}>
                Certification {index + 1}
              </Text>
              {formData.certifications.length > 1 && (
                <TouchableOpacity 
                  onPress={() => handleRemoveItem('certifications', index)}
                  style={styles.removeButton}
                >
                  <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
            
            <Input
              label="Certification Name"
              placeholder="e.g., AWS Certified Developer"
              value={cert.name}
              onChangeText={(text) => handleChange('certifications', 'name', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <Input
              label="Issuing Organization"
              placeholder="e.g., Amazon Web Services"
              value={cert.issuer}
              onChangeText={(text) => handleChange('certifications', 'issuer', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <Input
              label="Date Obtained"
              placeholder="MM/YYYY"
              value={cert.date}
              onChangeText={(text) => handleChange('certifications', 'date', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
          </View>
        ))}
        
        <TouchableOpacity 
          style={[styles.addButton, darkMode && styles.darkAddButton]} 
          onPress={() => handleAddItem('certifications')}
        >
          <Plus size={18} color={Colors.primary} />
          <Text style={styles.addButtonText}>Add Certification</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderReferences = () => {
    return (
      <View style={styles.sectionContent}>
        {formData.references.map((ref, index) => (
          <View key={ref.id} style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemTitle, darkMode && { color: Colors.dark.text }]}>
                Reference {index + 1}
              </Text>
              {formData.references.length > 1 && (
                <TouchableOpacity 
                  onPress={() => handleRemoveItem('references', index)}
                  style={styles.removeButton}
                >
                  <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
            
            <Input
              label="Name"
              placeholder="Reference's Full Name"
              value={ref.name}
              onChangeText={(text) => handleChange('references', 'name', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <Input
              label="Company"
              placeholder="Company Name"
              value={ref.company}
              onChangeText={(text) => handleChange('references', 'company', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <Input
              label="Position"
              placeholder="Job Title"
              value={ref.position}
              onChangeText={(text) => handleChange('references', 'position', text, index)}
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <Input
              label="Email"
              placeholder="reference@example.com"
              value={ref.email}
              onChangeText={(text) => handleChange('references', 'email', text, index)}
              keyboardType="email-address"
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
            
            <Input
              label="Phone (Optional)"
              placeholder="+237 6XX XXX XXX"
              value={ref.phone}
              onChangeText={(text) => handleChange('references', 'phone', text, index)}
              keyboardType="phone-pad"
              containerStyle={styles.inputContainer}
              labelStyle={darkMode ? styles.darkLabel : undefined}
              inputStyle={darkMode ? styles.darkInput : undefined}
            />
          </View>
        ))}
        
        <TouchableOpacity 
          style={[styles.addButton, darkMode && styles.darkAddButton]} 
          onPress={() => handleAddItem('references')}
        >
          <Plus size={18} color={Colors.primary} />
          <Text style={styles.addButtonText}>Add Reference</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'experience':
        return renderWorkExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'certifications':
        return renderCertifications();
      case 'references':
        return renderReferences();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Create CV',
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
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeSection === 'personal' && styles.activeTab,
                  darkMode && styles.darkTab,
                  activeSection === 'personal' && darkMode && styles.darkActiveTab,
                ]}
                onPress={() => setActiveSection('personal')}
              >
                <Text 
                  style={[
                    styles.tabText,
                    activeSection === 'personal' && styles.activeTabText,
                    darkMode && styles.darkTabText,
                  ]}
                >
                  Personal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeSection === 'experience' && styles.activeTab,
                  darkMode && styles.darkTab,
                  activeSection === 'experience' && darkMode && styles.darkActiveTab,
                ]}
                onPress={() => setActiveSection('experience')}
              >
                <Text 
                  style={[
                    styles.tabText,
                    activeSection === 'experience' && styles.activeTabText,
                    darkMode && styles.darkTabText,
                  ]}
                >
                  Experience
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeSection === 'education' && styles.activeTab,
                  darkMode && styles.darkTab,
                  activeSection === 'education' && darkMode && styles.darkActiveTab,
                ]}
                onPress={() => setActiveSection('education')}
              >
                <Text 
                  style={[
                    styles.tabText,
                    activeSection === 'education' && styles.activeTabText,
                    darkMode && styles.darkTabText,
                  ]}
                >
                  Education
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeSection === 'skills' && styles.activeTab,
                  darkMode && styles.darkTab,
                  activeSection === 'skills' && darkMode && styles.darkActiveTab,
                ]}
                onPress={() => setActiveSection('skills')}
              >
                <Text 
                  style={[
                    styles.tabText,
                    activeSection === 'skills' && styles.activeTabText,
                    darkMode && styles.darkTabText,
                  ]}
                >
                  Skills
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeSection === 'certifications' && styles.activeTab,
                  darkMode && styles.darkTab,
                  activeSection === 'certifications' && darkMode && styles.darkActiveTab,
                ]}
                onPress={() => setActiveSection('certifications')}
              >
                <Text 
                  style={[
                    styles.tabText,
                    activeSection === 'certifications' && styles.activeTabText,
                    darkMode && styles.darkTabText,
                  ]}
                >
                  Certifications
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeSection === 'references' && styles.activeTab,
                  darkMode && styles.darkTab,
                  activeSection === 'references' && darkMode && styles.darkActiveTab,
                ]}
                onPress={() => setActiveSection('references')}
              >
                <Text 
                  style={[
                    styles.tabText,
                    activeSection === 'references' && styles.activeTabText,
                    darkMode && styles.darkTabText,
                  ]}
                >
                  References
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <View style={[styles.formContainer, darkMode && styles.darkFormContainer]}>
              {renderActiveSection()}
            </View>
          </ScrollView>
          
          <View style={[styles.footer, darkMode && styles.darkFooter]}>
            {cv ? (
              <View style={styles.footerButtons}>
                <Button
                  title="Download CV"
                  onPress={handleDownloadCV}
                  variant="outline"
                  style={styles.downloadButton}
                />
                <Button
                  title="Create CV"
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  style={styles.submitButton}
                />
              </View>
            ) : (
              <Button
                title="Create CV"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                style={styles.submitButton}
              />
            )}
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
  tabsContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
  },
  darkTab: {
    backgroundColor: Colors.dark.card,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  darkActiveTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  darkTabText: {
    color: Colors.dark.text,
  },
  activeTabText: {
    color: 'white',
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
  sectionContent: {
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photoText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.primary,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.primary,
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
  },
  itemContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4F8',
    paddingVertical: 12,
    borderRadius: 8,
  },
  darkAddButton: {
    backgroundColor: Colors.dark.background,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  skillsLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.text,
  },
  skillsSubLabel: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 16,
  },
  skillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillInput: {
    flex: 1,
  },
  removeSkillButton: {
    padding: 8,
    marginLeft: 8,
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
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
  },
  downloadButton: {
    marginRight: 10,
    flex: 1,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});