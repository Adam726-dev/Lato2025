
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStats, getAllUsers, FirebaseUser } from '@/services/firebaseService';
import { Users, UserCheck, Calendar, TrendingUp } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalLogins: number;
  totalProfiles: number;
  lastUpdated: any;
}

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          getStats(),
          getAllUsers()
        ]);
        
        setStats(statsData as Stats);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Ładowanie danych...</div>
      </div>
    );
  }

  const completedProfiles = users.filter(user => 
    user.profile && Object.keys(user.profile).length > 0
  ).length;

  const recentUsers = users.filter(user => {
    if (!user.createdAt || !user.createdAt.toDate) return false;
    const userDate = user.createdAt.toDate();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return userDate > weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Administratora</h1>
          <p className="text-gray-600">Statystyki i zarządzanie aplikacją</p>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wszyscy użytkownicy</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                +{recentUsers} w tym tygodniu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ukończone profile</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedProfiles}</div>
              <p className="text-xs text-muted-foreground">
                {users.length > 0 ? Math.round((completedProfiles / users.length) * 100) : 0}% użytkowników
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nowi użytkownicy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentUsers}</div>
              <p className="text-xs text-muted-foreground">
                Ostatnie 7 dni
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktywność</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.lastUpdated ? 'Aktywne' : 'Brak'}
              </div>
              <p className="text-xs text-muted-foreground">
                Status aplikacji
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista użytkowników */}
        <Card>
          <CardHeader>
            <CardTitle>Lista użytkowników</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Nazwa</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Data rejestracji</th>
                    <th className="text-left p-2">Ostatnie logowanie</th>
                    <th className="text-left p-2">Profil</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uid} className="border-b hover:bg-gray-50">
                      <td className="p-2">{user.displayName}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">
                        {user.createdAt?.toDate ? 
                          user.createdAt.toDate().toLocaleDateString('pl-PL') : 
                          'Brak danych'
                        }
                      </td>
                      <td className="p-2">
                        {user.lastLoginAt?.toDate ? 
                          user.lastLoginAt.toDate().toLocaleDateString('pl-PL') : 
                          'Brak danych'
                        }
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.profile && Object.keys(user.profile).length > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.profile && Object.keys(user.profile).length > 0 ? 'Ukończony' : 'Niekompletny'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
