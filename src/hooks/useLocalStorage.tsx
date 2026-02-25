/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  const backupData = () => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const element = document.createElement('a');
        const file = new Blob([item], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = `${key}_backup.json`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
      } else {
        console.error('No data found to backup');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsedValue = JSON.parse(result);
        setStoredValue(parsedValue);
        window.localStorage.setItem(key, JSON.stringify(parsedValue));
        window.location.reload()
        window.alert('Backup restaurado!')
      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return [storedValue, setValue, backupData, loadBackup];
};

export default useLocalStorage;