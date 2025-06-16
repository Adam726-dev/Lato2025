import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types/userProfile';
import { useAuth } from '@/context/AuthContext';

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  isProfileComplete: (section: 'fitness' | 'nutrition' | 'activity' | 'travel' | 'social' | 'weather' | 'progress' | 'budget' | 'habits') => boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>({});
  const { user, updateUserProfile } = useAuth();

  useEffect(() => {
    if (user?.profile) {
      setProfile(user.profile);
    } else {
      // Fallback do localStorage dla kompatybilności wstecznej
      const savedProfile = localStorage.getItem('user-profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...data };
    setProfile(newProfile);
    
    // Zapisz w localStorage dla kompatybilności wstecznej
    localStorage.setItem('user-profile', JSON.stringify(newProfile));
    
    // Synchronizuj z Firebase jeśli użytkownik jest zalogowany
    if (user) {
      try {
        await updateUserProfile(newProfile);
      } catch (error) {
        console.error('Error syncing profile with Firebase:', error);
      }
    }
  };

  const isProfileComplete = (section: 'fitness' | 'nutrition' | 'activity' | 'travel' | 'social' | 'weather' | 'progress' | 'budget' | 'habits') => {
    if (section === 'fitness') {
      return !!(profile.currentWeight && profile.height && profile.age && 
               profile.gender && profile.fitnessLevel && profile.fitnessGoals?.length);
    }
    if (section === 'nutrition') {
      return !!(profile.dailyCalories && profile.mealsPerDay);
    }
    if (section === 'activity') {
      return !!(profile.personalityType && profile.activityPreferences?.length && 
               profile.energyLevel && profile.socialPreference);
    }
    if (section === 'travel') {
      return !!(profile.travelBudget && profile.travelStyle && 
               profile.accommodationPreference && profile.transportPreference && 
               profile.destinationPreferences?.length && profile.travelCompanions);
    }
    if (section === 'social') {
      return !!(profile.lookingForCompanions !== undefined && profile.companionPreferences?.length && 
               profile.teamChallengeInterest && profile.socialGoals?.length);
    }
    if (section === 'weather') {
      return !!(profile.weatherSensitivity && profile.indoorAlternatives?.length && 
               profile.outdoorPreferences?.length && profile.temperaturePreference);
    }
    if (section === 'progress') {
      return !!(profile.trackingGoals?.length && profile.commitmentLevel && 
               profile.motivationType && profile.timelineGoals);
    }
    if (section === 'budget') {
      return !!(profile.monthlyBudget && profile.budgetPriorities?.length && 
               profile.spendingStyle && profile.dealPreferences?.length);
    }
    if (section === 'habits') {
      return !!(profile.targetHabits?.length && profile.habitDifficulty && 
               profile.reminderFrequency && profile.motivationStyle && 
               profile.habitTrackingMethod && profile.consistencyGoal);
    }
    return false;
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, isProfileComplete }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export default UserProfileProvider;
