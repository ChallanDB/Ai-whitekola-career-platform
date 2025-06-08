import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from './Button';
import { jobSectors, jobTypes, cameroonLocations } from '@/utils/mockData';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    location: string;
    jobType: string;
    sector: string;
  }) => void;
  initialFilters: {
    location: string;
    jobType: string;
    sector: string;
  };
  locations?: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
  locations = cameroonLocations,
}) => {
  const [location, setLocation] = useState(initialFilters.location);
  const [jobType, setJobType] = useState(initialFilters.jobType);
  const [sector, setSector] = useState(initialFilters.sector);

  const handleApply = () => {
    onApplyFilters({
      location,
      jobType,
      sector,
    });
    onClose();
  };

  const handleReset = () => {
    setLocation('');
    setJobType('');
    setSector('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>Filter Jobs</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Location</Text>
                  <View style={styles.optionsContainer}>
                    {locations.map((loc) => (
                      <TouchableOpacity
                        key={loc}
                        style={[
                          styles.optionButton,
                          location === loc && styles.selectedOption,
                        ]}
                        onPress={() => setLocation(location === loc ? '' : loc)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            location === loc && styles.selectedOptionText,
                          ]}
                        >
                          {loc}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Job Type</Text>
                  <View style={styles.optionsContainer}>
                    {jobTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.optionButton,
                          jobType === type && styles.selectedOption,
                        ]}
                        onPress={() => setJobType(jobType === type ? '' : type)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            jobType === type && styles.selectedOptionText,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Sector</Text>
                  <View style={styles.optionsContainer}>
                    {jobSectors.map((sec) => (
                      <TouchableOpacity
                        key={sec}
                        style={[
                          styles.optionButton,
                          sector === sec && styles.selectedOption,
                        ]}
                        onPress={() => setSector(sector === sec ? '' : sec)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            sector === sec && styles.selectedOptionText,
                          ]}
                        >
                          {sec}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <Button
                  title="Reset"
                  onPress={handleReset}
                  variant="outline"
                  style={styles.resetButton}
                />
                <Button
                  title="Apply Filters"
                  onPress={handleApply}
                  style={styles.applyButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.text,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedOptionText: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  resetButton: {
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    flex: 2,
  },
});

export default FilterModal;