import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function PatientDashboard({ navigation }) {
  const { user, logout } = useAuth();

  const StatCard = ({ title, value, color }) => (
    <View style={[styles.statCard, { backgroundColor: color + '20' }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const ActionCard = ({ icon, title, onPress, color }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Text style={styles.actionIconText}>{icon}</Text>
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'John Doe'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Book Your Next Appointment</Text>
          <Text style={styles.bannerSubtext}>Schedule a visit with our expert dentists</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard title="Total" value="5" color="#6366f1" />
          <StatCard title="Completed" value="3" color="#10b981" />
          <StatCard title="Pending" value="2" color="#f59e0b" />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionCard 
            icon="📅" 
            title="Book Appointment" 
            onPress={() => navigation.navigate('Booking')}
            color="#6366f1"
          />
          <ActionCard 
            icon="📋" 
            title="My Appointments" 
            onPress={() => navigation.navigate('Appointments')}
            color="#10b981"
          />
          <ActionCard 
            icon="👤" 
            title="My Profile" 
            onPress={() => navigation.navigate('Profile')}
            color="#f59e0b"
          />
          <ActionCard 
            icon="💬" 
            title="Support" 
            onPress={() => {}}
            color="#ef4444"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.appointmentTitle}>General Checkup</Text>
              <Text style={styles.appointmentStatus}>Confirmed</Text>
            </View>
            <Text style={styles.appointmentDetail}>Dr. Sarah Williams</Text>
            <Text style={styles.appointmentDetail}>Tomorrow, 10:00 AM</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  banner: {
    backgroundColor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  bannerSubtext: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  actionCard: {
    width: '50%',
    padding: 8,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 12,
    color: '#1e293b',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  appointmentStatus: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  appointmentDetail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
});
