
import React, { useState, useEffect } from 'react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from './FormElements';
import { Eye, EyeOff, Key } from 'lucide-react';

const ApiKeyManager: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
  // Sprawdź, czy klucz jest już w localStorage
  let savedKey = localStorage.getItem('gemini-api-key');
  if (!savedKey) {
    // Jeśli nie, pobierz z env i zapisz do localStorage
    savedKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (savedKey) {
      localStorage.setItem('gemini-api-key', savedKey.trim());
    }
  }
  if (savedKey) {
    setApiKey(savedKey);
    setIsKeySet(true);
  }
}, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini-api-key', apiKey.trim());
      setIsKeySet(true);
      alert('Klucz API został zapisany pomyślnie!');
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey('');
    setIsKeySet(false);
    alert('Klucz API został usunięty!');
  };

  return (
    <Card className="mb-6">
      {/* <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Konfiguracja API Gemini
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="apiKey">Klucz API Google Gemini</Label>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Wklej tutaj swój klucz API..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button onClick={handleSaveKey} disabled={!apiKey.trim()}>
              Zapisz
            </Button>
            {isKeySet && (
              <Button onClick={handleRemoveKey} variant="outline">
                Usuń
              </Button>
            )}
          </div>
        </div>
        
        {isKeySet ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              ✓ Klucz API jest skonfigurowany. Możesz teraz generować plany!
            </p>
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              ⚠️ Potrzebujesz klucza API Google Gemini, aby generować spersonalizowane plany.
            </p>
            <p className="text-yellow-600 text-xs mt-1">
              Uzyskaj klucz na: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
            </p>
          </div>
        )}
      </CardContent> */}
    </Card>
  );
};

export default ApiKeyManager;
