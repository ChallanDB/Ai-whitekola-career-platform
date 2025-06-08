import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, DollarSign, CreditCard } from 'lucide-react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { mockCounselingSlots } from '@/utils/mockData';
import { sendCounselingBookingEmail } from '@/utils/emailService';

export default function BookCounselingScreen() {
  const router = useRouter();
  const { darkMode } = useSettingsStore();
  const { user } = useAuthStore();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1); // in hours
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const hourlyRate = 10; // $10 per hour
  const totalCost = duration * hourlyRate;
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleDurationChange = (newDuration: number) => {
    if (newDuration >= 1 && newDuration <= 3) {
      setDuration(newDuration);
    }
  };
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time for your session');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send email notification to counselor
      await sendCounselingBookingEmail(
        'akum.binda17@gmail.com', // Counselor email
        {
          userName: user?.username || 'Anonymous User',
          userEmail: user?.email || 'No email provided',
          date: selectedDate,
          time: selectedTime,
          duration,
          notes,
        }
      );
      
      // In a real app, save booking to Firestore
      // await createDocument('counselingSessions', {
      //   userId: user?.id,
      //   date: selectedDate,
      //   startTime: selectedTime,
      //   duration,
      //   status: 'pending',
      //   notes,
      //   paymentStatus: 'pending',
      //   paymentAmount: totalCost,
      //   createdAt: Date.now(),
      // });
      
      Alert.alert(
        'Booking Confirmed',
        `Your counseling session has been booked for ${selectedDate} at ${selectedTime}. You will receive a confirmation email shortly.`,
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/(tabs)/learn') 
          }
        ]
      );
    } catch (error) {
      console.error('Error booking session:', error);
      Alert.alert(
        'Booking Failed',
        'There was an error booking your session. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderDateSelector = () => {
    return (
      <View style={styles.selectorContainer}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color={Colors.primary} />
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Select Date</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
          {mockCounselingSlots.map((dateSlot) => (
            <TouchableOpacity
              key={dateSlot.date}
              style={[
                styles.dateButton,
                selectedDate === dateSlot.date && styles.selectedDateButton,
                darkMode && styles.darkDateButton,
                selectedDate === dateSlot.date && darkMode && styles.darkSelectedDateButton,
              ]}
              onPress={() => handleDateSelect(dateSlot.date)}
            >
              <Text 
                style={[
                  styles.dateText,
                  selectedDate === dateSlot.date && styles.selectedDateText,
                  darkMode && styles.darkText,
                ]}
              >
                {new Date(dateSlot.date).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  const renderTimeSelector = () => {
    if (!selectedDate) return null;
    
    const selectedDateSlots = mockCounselingSlots.find(slot => slot.date === selectedDate);
    
    if (!selectedDateSlots) return null;
    
    return (
      <View style={styles.selectorContainer}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color={Colors.primary} />
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Select Time</Text>
        </View>
        
        <View style={styles.timeGrid}>
          {selectedDateSlots.slots.map((slot) => (
            <TouchableOpacity
              key={slot.time}
              style={[
                styles.timeButton,
                !slot.available && styles.unavailableTimeButton,
                selectedTime === slot.time && styles.selectedTimeButton,
                darkMode && styles.darkTimeButton,
                !slot.available && darkMode && styles.darkUnavailableTimeButton,
                selectedTime === slot.time && darkMode && styles.darkSelectedTimeButton,
              ]}
              onPress={() => slot.available && handleTimeSelect(slot.time)}
              disabled={!slot.available}
            >
              <Text 
                style={[
                  styles.timeText,
                  !slot.available && styles.unavailableTimeText,
                  selectedTime === slot.time && styles.selectedTimeText,
                  darkMode && styles.darkText,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  const renderDurationSelector = () => {
    if (!selectedDate || !selectedTime) return null;
    
    return (
      <View style={styles.selectorContainer}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color={Colors.primary} />
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Session Duration</Text>
        </View>
        
        <View style={styles.durationContainer}>
          <TouchableOpacity 
            style={[
              styles.durationButton,
              duration === 1 && styles.selectedDurationButton,
              darkMode && styles.darkDurationButton,
              duration === 1 && darkMode && styles.darkSelectedDurationButton,
            ]}
            onPress={() => handleDurationChange(1)}
          >
            <Text 
              style={[
                styles.durationText,
                duration === 1 && styles.selectedDurationText,
                darkMode && styles.darkText,
              ]}
            >
              1 Hour
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.durationButton,
              duration === 2 && styles.selectedDurationButton,
              darkMode && styles.darkDurationButton,
              duration === 2 && darkMode && styles.darkSelectedDurationButton,
            ]}
            onPress={() => handleDurationChange(2)}
          >
            <Text 
              style={[
                styles.durationText,
                duration === 2 && styles.selectedDurationText,
                darkMode && styles.darkText,
              ]}
            >
              2 Hours
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.durationButton,
              duration === 3 && styles.selectedDurationButton,
              darkMode && styles.darkDurationButton,
              duration === 3 && darkMode && styles.darkSelectedDurationButton,
            ]}
            onPress={() => handleDurationChange(3)}
          >
            <Text 
              style={[
                styles.durationText,
                duration === 3 && styles.selectedDurationText,
                darkMode && styles.darkText,
              ]}
            >
              3 Hours
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderNotesInput = () => {
    if (!selectedDate || !selectedTime) return null;
    
    return (
      <View style={[styles.selectorContainer, darkMode && styles.darkSelectorContainer]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Session Notes (Optional)</Text>
        </View>
        
        <TextInput
          style={[
            styles.notesInput,
            darkMode && styles.darkNotesInput
          ]}
          placeholder="Add any specific topics or questions you'd like to discuss..."
          placeholderTextColor={darkMode ? Colors.dark.subtext : Colors.subtext}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    );
  };
  
  const renderPaymentSummary = () => {
    if (!selectedDate || !selectedTime) return null;
    
    return (
      <View style={[styles.summaryContainer, darkMode && styles.darkSummaryContainer]}>
        <View style={styles.sectionHeader}>
          <DollarSign size={20} color={Colors.primary} />
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Payment Summary</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, darkMode && styles.darkText]}>Date:</Text>
          <Text style={[styles.summaryValue, darkMode && styles.darkText]}>
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, darkMode && styles.darkText]}>Time:</Text>
          <Text style={[styles.summaryValue, darkMode && styles.darkText]}>{selectedTime}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, darkMode && styles.darkText]}>Duration:</Text>
          <Text style={[styles.summaryValue, darkMode && styles.darkText]}>{duration} hour{duration > 1 ? 's' : ''}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, darkMode && styles.darkText]}>Rate:</Text>
          <Text style={[styles.summaryValue, darkMode && styles.darkText]}>${hourlyRate}/hour</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, darkMode && styles.darkText]}>Total:</Text>
          <Text style={[styles.totalValue, darkMode && styles.darkText]}>${totalCost}</Text>
        </View>
        
        <View style={styles.paymentMethodContainer}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={Colors.primary} />
            <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Payment Method</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.paymentMethodButton, darkMode && styles.darkPaymentMethodButton]}
            onPress={() => Alert.alert('Payment', 'This would open a payment form in a real app.')}
          >
            <Text style={[styles.paymentMethodText, darkMode && styles.darkText]}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Book Counseling',
          headerStyle: {
            backgroundColor: darkMode ? Colors.dark.card : 'white',
          },
          headerTintColor: darkMode ? Colors.dark.text : Colors.text,
        }}
      />
      
      <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]} edges={['bottom']}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <View style={[styles.infoContainer, darkMode && styles.darkInfoContainer]}>
              <Text style={[styles.infoTitle, darkMode && styles.darkText]}>Expert Career Counseling</Text>
              <Text style={[styles.infoText, darkMode && styles.darkText]}>
                Book a one-on-one session with a career expert who can provide personalized guidance 
                on your career path, job search strategy, interview preparation, and more.
              </Text>
              <Text style={[styles.infoHighlight, darkMode && styles.darkInfoHighlight]}>
                Rate: ${hourlyRate}/hour
              </Text>
            </View>
            
            {renderDateSelector()}
            {renderTimeSelector()}
            {renderDurationSelector()}
            {renderNotesInput()}
            {renderPaymentSummary()}
          </View>
        </ScrollView>
        
        {selectedDate && selectedTime && (
          <View style={[styles.footer, darkMode && styles.darkFooter]}>
            <Button
              title={`Book Session - $${totalCost}`}
              onPress={handleBooking}
              isLoading={isSubmitting}
              style={styles.bookButton}
            />
          </View>
        )}
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
  content: {
    padding: 16,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkInfoContainer: {
    backgroundColor: Colors.dark.card,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  darkText: {
    color: Colors.dark.text,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: Colors.text,
  },
  infoHighlight: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  darkInfoHighlight: {
    color: Colors.secondary,
  },
  selectorContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkSelectorContainer: {
    backgroundColor: Colors.dark.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: Colors.text,
  },
  datesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dateButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F0F4F8',
    minWidth: 100,
    alignItems: 'center',
  },
  darkDateButton: {
    backgroundColor: Colors.dark.background,
  },
  selectedDateButton: {
    backgroundColor: Colors.primary,
  },
  darkSelectedDateButton: {
    backgroundColor: Colors.primary,
  },
  dateText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedDateText: {
    color: 'white',
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
  },
  darkTimeButton: {
    backgroundColor: Colors.dark.background,
  },
  selectedTimeButton: {
    backgroundColor: Colors.primary,
  },
  darkSelectedTimeButton: {
    backgroundColor: Colors.primary,
  },
  unavailableTimeButton: {
    backgroundColor: '#E9ECEF',
    opacity: 0.5,
  },
  darkUnavailableTimeButton: {
    backgroundColor: '#2A2A2A',
    opacity: 0.5,
  },
  timeText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedTimeText: {
    color: 'white',
    fontWeight: '600',
  },
  unavailableTimeText: {
    color: Colors.subtext,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
  },
  darkDurationButton: {
    backgroundColor: Colors.dark.background,
  },
  selectedDurationButton: {
    backgroundColor: Colors.primary,
  },
  darkSelectedDurationButton: {
    backgroundColor: Colors.primary,
  },
  durationText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedDurationText: {
    color: 'white',
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
  },
  darkNotesInput: {
    backgroundColor: Colors.dark.background,
    color: Colors.dark.text,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkSummaryContainer: {
    backgroundColor: Colors.dark.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  paymentMethodContainer: {
    marginTop: 16,
  },
  paymentMethodButton: {
    backgroundColor: '#F0F4F8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  darkPaymentMethodButton: {
    backgroundColor: Colors.dark.background,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
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
  bookButton: {
    width: '100%',
  },
});