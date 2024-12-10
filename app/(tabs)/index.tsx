import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useRef, useState } from 'react';

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [selectedLot, setSelectedLot] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [parkingSpots, setParkingSpots] = useState(
    Array(18).fill(true)  // true means available, false means taken
  );
  
  const parkingLots = [
    { name: 'Lot 30', coordinate: { latitude: 33.970129, longitude: -117.332284 }, spots: 50 },
    { name: 'Lot 50', coordinate: { latitude: 33.974506, longitude: -117.336548 }, spots: 50 },
    { name: 'Lot 1', coordinate: { latitude: 33.973768, longitude: -117.332625 }, spots: 50 },
    { name: 'Lot 6', coordinate: { latitude: 33.969728, longitude: -117.327672 }, spots: 50 },
    { name: 'Lot 15', coordinate: { latitude: 33.976552, longitude: -117.324348 }, spots: 50 },
    { name: 'Lot 24', coordinate: { latitude: 33.977998, longitude: -117.330558 }, spots: 50 },
    { name: 'Lot 26', coordinate: { latitude: 33.981988, longitude: -117.335003 }, spots: 50 },
    { name: 'Lot 27', coordinate: { latitude: 33.982326, longitude: -117.327122 }, spots: 50 },
    { name: 'Lot 22', coordinate: { latitude: 33.980129, longitude: -117.325181 }, spots: 50 },
    { name: 'Lot 21', coordinate: { latitude: 33.978928, longitude: -117.322147 }, spots: 50 },
    { name: 'Lot 13', coordinate: { latitude: 33.974733, longitude: -117.320609 }, spots: 50 },
    { name: 'Big Springs 1', coordinate: { latitude: 33.976330, longitude: -117.319166 }, spots: 50 },
    { name: 'Big Springs 2', coordinate: { latitude: 33.975022, longitude: -117.318866 }, spots: 50 },
  ];

  const lot15Spots = [
    { coordinate: { latitude: 33.976793, longitude: -117.324320 } },
    { coordinate: { latitude: 33.976717, longitude: -117.324320 } },
    { coordinate: { latitude: 33.976628, longitude: -117.324320 } },
    { coordinate: { latitude: 33.976540, longitude: -117.324326 } },
    { coordinate: { latitude: 33.976465, longitude: -117.324326 } },
    { coordinate: { latitude: 33.976828, longitude: -117.324246 } },
    { coordinate: { latitude: 33.976739, longitude: -117.324245 } },
    { coordinate: { latitude: 33.976677, longitude: -117.324245 } },
    { coordinate: { latitude: 33.976601, longitude: -117.324246 } },
    { coordinate: { latitude: 33.976539, longitude: -117.324251 } },
    { coordinate: { latitude: 33.976842, longitude: -117.324154 } },
    { coordinate: { latitude: 33.976775, longitude: -117.324149 } },
    { coordinate: { latitude: 33.976675, longitude: -117.324147 } },
    { coordinate: { latitude: 33.976590, longitude: -117.324147 } },
    { coordinate: { latitude: 33.976864, longitude: -117.324072 } },
    { coordinate: { latitude: 33.976780, longitude: -117.324072 } },
    { coordinate: { latitude: 33.976699, longitude: -117.324072 } },
  ];

  const initialRegion = {
    latitude: (33.983011 + 33.964683) / 2,
    longitude: (-117.339916 + -117.316678) / 2,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const handleMarkerPress = (coordinate: { latitude: number; longitude: number }, lotName: string) => {
    mapRef.current?.animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.0008,
      longitudeDelta: 0.0008,
    }, 1000);
    setIsZoomedIn(true);
    setSelectedLot(lotName);
    
    // Reset parking spots state when Lot 15 is clicked
    if (lotName === 'Lot 15') {
      // Add slight delay to ensure markers appear after zoom
      setTimeout(() => {
        setParkingSpots(spots => [...spots]);
      }, 100);
    }
  };

  const handleReset = () => {
    mapRef.current?.animateToRegion(initialRegion, 1000);
    setIsZoomedIn(false);
    setSelectedLot(null);
    setResetKey(prev => prev + 1);
  };

  const toggleSpotStatus = (index: number) => {
    setParkingSpots(spots => {
      const newSpots = [...spots];
      newSpots[index] = !newSpots[index];
      return newSpots;
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        key={resetKey}
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        minZoomLevel={14}
        mapType="standard"
        onRegionChangeComplete={(region) => {
          const newRegion = {
            ...region,
            latitude: Math.min(Math.max(region.latitude, 33.964683), 33.983011),
            longitude: Math.min(Math.max(region.longitude, -117.339916), -117.316678),
          };
          if (newRegion !== region) {
            mapRef.current?.animateToRegion(newRegion, 100);
          }
        }}
      >
        {parkingLots.map((lot) => (
          <Marker
            key={`${lot.name}-${resetKey}`}
            coordinate={lot.coordinate}
            tracksViewChanges={false}
            onPress={() => handleMarkerPress(lot.coordinate, lot.name)}
          >
            {(selectedLot === null || lot.name !== selectedLot) && (
              <View style={styles.markerContainer}>
                <Text style={styles.markerText}>{lot.name}</Text>
                <Text style={styles.spotsText}>{lot.spots} spots</Text>
              </View>
            )}
          </Marker>
        ))}
        
        {/* Individual parking spot markers */}
        {isZoomedIn && selectedLot === 'Lot 15' && lot15Spots.map((spot, index) => (
          <Marker
            key={`spot-${index}-${resetKey}`}
            coordinate={spot.coordinate}
            tracksViewChanges={false}
            onPress={() => toggleSpotStatus(index)}
            zIndex={999}
          >
            <View style={[
              styles.spotIndicator,
              { backgroundColor: parkingSpots[index] ? '#4CAF50' : '#FF0000' }
            ]} />
          </Marker>
        ))}
      </MapView>
      {isZoomedIn && (
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerContainer: {
    backgroundColor: '#0064A4', // UCR Blue
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  spotsText: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
  },
  resetButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  spotIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
