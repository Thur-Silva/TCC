// RideCard.tsx
import { icons } from '@/constants';
import { formatDate, formatTime } from '@/lib/utils';
import { Ride } from '@/types/types';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

export default function RideCard({ ride }: { ride: Ride }) {
  const {
    origin_address,
    destination_address,
    created_at,
    ride_time,
    driver,
    payment_status,
  } = ride;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => setIsOpen(!isOpen)}>

    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.addrCol}>
          <View style={styles.row}>
            <Image source={icons.to} style={styles.iconSmall} />
            <Text style={styles.addrText} numberOfLines={1}>
              {origin_address}
            </Text>
          </View>
          <View style={styles.row}>
            <Image source={icons.point} style={styles.iconSmall} />
            <Text style={styles.addrText} numberOfLines={1}>
              {destination_address}
            </Text>
          </View>
        </View>
      </View>

    { isOpen && (

      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Data e Hora</Text>
          <Text style={styles.value}>
            {formatDate(created_at)}, {formatTime(ride_time)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Motorista</Text>
          <Text style={styles.value}>
            {driver.first_name} {driver.last_name}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Comissão</Text>
          <Text
            style={[
              styles.value,
              payment_status === 'gratis'
                ? styles.free
                : styles.paid,
            ]}
          >
            {payment_status}
          </Text>
        </View>
      </View>
    )}

    </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  topRow: {
    flexDirection: 'row',
    padding: 12,
  },
  staticMap: {
    width: 110,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  addrCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconSmall: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  addrText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  details: {
    backgroundColor: '#44628749',
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    color: '#black',
  },
  value: {
    fontSize: 14,
    color: '#374151',
  },
  free: { color: 'green' },
  paid: { color: 'orange' },
});
