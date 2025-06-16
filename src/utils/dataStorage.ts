
import { UserProfile } from '@/types/userProfile';

const STORAGE_KEY = 'user-profile';
const JSON_FILE_KEY = 'user-profile-json';

export const saveUserData = (data: Partial<UserProfile>) => {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const currentData = existing ? JSON.parse(existing) : {};
    const updatedData = { ...currentData, ...data };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    
    const jsonData = JSON.stringify(updatedData, null, 2);
    localStorage.setItem(JSON_FILE_KEY, jsonData);
    
    console.log('Data saved successfully:', updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error saving user data:', error);
    return null;
  }
};

export const loadUserData = (): UserProfile => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading user data:', error);
    return {};
  }
};

export const exportUserDataAsJSON = () => {
  try {
    const data = localStorage.getItem(JSON_FILE_KEY);
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user-profile.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};
