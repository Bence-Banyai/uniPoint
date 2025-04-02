import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { servicesApi, Service } from '../services/services';

export default function ApiTest() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await servicesApi.getAll();
      setServices(data);
      setError(null);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Test</Text>
      
      <Button 
        title={loading ? "Loading..." : "Test Connection"} 
        onPress={fetchServices} 
        disabled={loading}
      />
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <View style={styles.results}>
        <Text style={styles.subtitle}>
          {services.length > 0 ? `${services.length} services found` : 'No services found'}
        </Text>
        
        {services.map((service: any) => (
          <View key={service.serviceId} style={styles.serviceItem}>
            <Text style={styles.serviceName}>{service.serviceName}</Text>
            <Text>Price: ${service.price}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  results: {
    marginTop: 20,
  },
  serviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});