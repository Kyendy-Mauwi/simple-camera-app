
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import * as FileSystem from 'expo-file-system';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CapturedPhoto {
  uri: string;
  timestamp: number;
}

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  console.log('CameraScreen rendered, permission status:', permission?.status);

  useEffect(() => {
    loadSavedPhotos();
  }, []);

  const loadSavedPhotos = async () => {
    try {
      const photosDir = `${FileSystem.documentDirectory}photos/`;
      const dirInfo = await FileSystem.getInfoAsync(photosDir);
      
      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(photosDir);
        const photoFiles = files
          .filter(file => file.endsWith('.jpg'))
          .map(file => ({
            uri: `${photosDir}${file}`,
            timestamp: parseInt(file.replace('.jpg', '')) || Date.now(),
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setCapturedPhotos(photoFiles);
        console.log('Loaded saved photos:', photoFiles.length);
      }
    } catch (error) {
      console.log('Error loading saved photos:', error);
    }
  };

  if (!permission) {
    console.log('Camera permissions are still loading');
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    console.log('Camera permissions not granted');
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <IconSymbol name="camera.fill" size={64} color={colors.textSecondary} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need your permission to use the camera to take photos
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    console.log('Toggling camera facing from', facing);
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        console.log('Taking picture...');
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo) {
          console.log('Photo taken:', photo.uri);
          await savePhoto(photo.uri);
        }
      } catch (error) {
        console.log('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const savePhoto = async (photoUri: string) => {
    try {
      const photosDir = `${FileSystem.documentDirectory}photos/`;
      const dirInfo = await FileSystem.getInfoAsync(photosDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
      }
      
      const timestamp = Date.now();
      const filename = `${timestamp}.jpg`;
      const newUri = `${photosDir}${filename}`;
      
      await FileSystem.copyAsync({
        from: photoUri,
        to: newUri,
      });
      
      const newPhoto: CapturedPhoto = {
        uri: newUri,
        timestamp,
      };
      
      setCapturedPhotos(prev => [newPhoto, ...prev]);
      console.log('Photo saved:', newUri);
      
      Alert.alert('Success', 'Photo saved successfully!');
    } catch (error) {
      console.log('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo.');
    }
  };

  const deletePhoto = async (photoToDelete: CapturedPhoto) => {
    try {
      await FileSystem.deleteAsync(photoToDelete.uri);
      setCapturedPhotos(prev => prev.filter(photo => photo.uri !== photoToDelete.uri));
      console.log('Photo deleted:', photoToDelete.uri);
    } catch (error) {
      console.log('Error deleting photo:', error);
      Alert.alert('Error', 'Failed to delete photo.');
    }
  };

  const confirmDeletePhoto = (photo: CapturedPhoto) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePhoto(photo) },
      ]
    );
  };

  if (showGallery) {
    return (
      <View style={styles.container}>
        <View style={styles.galleryHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowGallery(false)}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
            <Text style={styles.backButtonText}>Camera</Text>
          </TouchableOpacity>
          <Text style={styles.galleryTitle}>Gallery ({capturedPhotos.length})</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.galleryContainer} contentContainerStyle={styles.galleryContent}>
          {capturedPhotos.length === 0 ? (
            <View style={styles.emptyGallery}>
              <IconSymbol name="photo" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyGalleryText}>No photos yet</Text>
              <Text style={styles.emptyGallerySubtext}>Take some photos to see them here</Text>
            </View>
          ) : (
            <View style={styles.photoGrid}>
              {capturedPhotos.map((photo, index) => (
                <TouchableOpacity
                  key={photo.uri}
                  style={styles.photoItem}
                  onLongPress={() => confirmDeletePhoto(photo)}
                >
                  <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
                  <Text style={styles.photoDate}>
                    {new Date(photo.timestamp).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => console.log('Camera ready')}
        onMountError={(error) => {
          console.log('Camera mount error:', error);
          Alert.alert('Camera Error', 'Failed to start camera. Please try again.');
        }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <IconSymbol name="camera.rotate" size={24} color={colors.card} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowGallery(true)}
          >
            <IconSymbol name="photo.on.rectangle" size={24} color={colors.card} />
            {capturedPhotos.length > 0 && (
              <View style={styles.photoBadge}>
                <Text style={styles.photoBadgeText}>{capturedPhotos.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
  },
  photoBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoBadgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: colors.text,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 5,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 60,
  },
  galleryContainer: {
    flex: 1,
  },
  galleryContent: {
    padding: 20,
  },
  emptyGallery: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyGalleryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
  },
  emptyGallerySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoItem: {
    width: (screenWidth - 60) / 2,
    marginBottom: 20,
  },
  photoThumbnail: {
    width: '100%',
    height: (screenWidth - 60) / 2,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  photoDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
});
