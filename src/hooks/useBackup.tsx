const useBackup = () => {
  const backupLocalStorage = () => {
    const data: Record<string, string | null> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }

    fetch("http://localhost:8888/backup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const loadBackupFromFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data: Record<string, string | null> = JSON.parse(content);

        localStorage.clear();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== null) {
            localStorage.setItem(key, value);
          }
        });

        window.location.reload();
      } catch (err) {
        console.error("Arquivo inválido", err);
      }
    };

    reader.readAsText(file);
  };

  return {
    backupLocalStorage,
    loadBackupFromFile,
  };
};

export default useBackup;
