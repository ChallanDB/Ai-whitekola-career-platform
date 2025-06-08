import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Share } from 'lucide-react-native';
import { Job } from '@/types';
import Colors from '@/constants/colors';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onShare: () => void;
  onApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress, onShare, onApply }) => {
  // Get initials from job title
  const getInitials = (title: string) => {
    return title
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date to relative time (e.g., "2 days ago")
  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, job.isPriority && styles.priorityCard]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      {job.isPriority && (
        <View style={styles.priorityBadge}>
          <Text style={styles.priorityText}>Featured</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <View style={[styles.initialsContainer, job.isPriority && styles.priorityInitialsContainer]}>
          <Text style={styles.initials}>{getInitials(job.title)}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Share size={18} color={Colors.subtext} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.description} numberOfLines={2}>{job.description}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{job.jobType}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{job.location}</Text>
            </View>
            {job.isExternal && (
              <View style={[styles.tag, styles.externalTag]}>
                <Text style={styles.tagText}>{job.source || 'External'}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.timeAgo}>{getRelativeTime(job.postedAt)}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.applyButton, job.isPriority && styles.priorityApplyButton]} 
          onPress={onApply}
        >
          <Text style={styles.applyButtonText}>
            {job.applicationType === 'internal' ? 'Apply with CV' : 'Apply External'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  priorityCard: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: '#FFFDF7',
  },
  priorityBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  initialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  priorityInitialsContainer: {
    backgroundColor: Colors.secondary,
  },
  initials: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: Colors.subtext,
  },
  shareButton: {
    padding: 8,
  },
  details: {
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  externalTag: {
    backgroundColor: Colors.secondary,
  },
  tagText: {
    fontSize: 12,
    color: Colors.text,
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.subtext,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
    paddingTop: 12,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  priorityApplyButton: {
    backgroundColor: Colors.secondary,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default JobCard;