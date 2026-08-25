import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EnvironmentsContext = createContext();
const STORAGE_KEY = "eduair.environments";

function buildHistory(env) {
  const temp = env.temp ?? env.temperature ?? 22;
  const humidity = env.humidity ?? 50;
  const co2 = env.co2 ?? 700;
  const noise = env.noise ?? 40;
  const labels = ["08:00", "10:00", "12:00", "14:00", "16:00"];

  return labels.map((time, index) => {
    const offset = index - 2;
    return {
      time,
      temp: Number((temp + offset * 0.4).toFixed(1)),
      humidity: Math.max(0, Math.round(humidity + offset * 2)),
      co2: Math.max(350, Math.round(co2 + offset * 45)),
      noise: Math.max(0, Math.round(noise + offset * 3)),
    };
  });
}

function withHistory(env) {
  return {
    ...env,
    history:
      Array.isArray(env.history) && env.history.length
        ? env.history
        : buildHistory(env),
  };
}

const INITIAL_ENVIRONMENTS = [
  {
    id: 1,
    name: "Aula 101",
    statusKey: "warning",
    temp: 26.4,
    humidity: 32,
    co2: 1010,
    noise: 62,
    qualityKey: "regular",
    capacity: 30,
    location: "Bloque A",
    isFavorite: false,
  },
  {
    id: 2,
    name: "Laboratorio de Sistemas",
    statusKey: "alert",
    temp: 29.1,
    humidity: 28,
    co2: 1350,
    noise: 71,
    qualityKey: "bad",
    capacity: 25,
    location: "Bloque B",
    isFavorite: true,
  },
  {
    id: 3,
    name: "Sala de Conferencias",
    statusKey: "normal",
    temp: 22.0,
    humidity: 50,
    co2: 750,
    noise: 40,
    qualityKey: "good",
    capacity: 40,
    location: "Bloque C",
    isFavorite: false,
  },
  {
    id: 4,
    name: "Biblioteca",
    statusKey: "normal",
    temp: 21.5,
    humidity: 55,
    co2: 680,
    noise: 35,
    qualityKey: "good",
    capacity: 60,
    location: "Bloque D",
    isFavorite: false,
  },
  {
    id: 5,
    name: "Aula 205",
    statusKey: "warning",
    temp: 25.8,
    humidity: 38,
    co2: 920,
    noise: 58,
    qualityKey: "regular",
    capacity: 35,
    location: "Bloque A",
    isFavorite: false,
  },
];

export function EnvironmentsProvider({ children }) {
  const [environments, setEnvironments] = useState(() =>
    INITIAL_ENVIRONMENTS.map(withHistory),
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setEnvironments(parsed.map(withHistory));
          }
        }
      } catch (e) {
        console.warn("Error loading environments:", e);
      } finally {
        setLoaded(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(environments)).catch(
      (e) => {
        console.warn("Error saving environments:", e);
      },
    );
  }, [environments, loaded]);

  const toggleFavorite = useCallback((id, isFav) => {
    setEnvironments((prev) =>
      prev.map((env) =>
        env.id === id
          ? {
              ...env,
              isFavorite: typeof isFav === "boolean" ? isFav : !env.isFavorite,
            }
          : env,
      ),
    );
  }, []);

  const addEnvironment = useCallback((env) => {
    setEnvironments((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: env.name,
        capacity: env.capacity,
        location: env.location,
        isFavorite: false,
        statusKey: "normal",
        temp: 22,
        humidity: 49,
        co2: 700,
        noise: 39,
        qualityKey: "good",
        history: buildHistory({ temp: 22, humidity: 49, co2: 700, noise: 39 }),
      },
    ]);
  }, []);

  const editEnvironment = useCallback((id, data) => {
    setEnvironments((prev) =>
      prev.map((env) => (env.id === id ? { ...env, ...data } : env)),
    );
  }, []);

  const deleteEnvironment = useCallback((id) => {
    setEnvironments((prev) => prev.filter((env) => env.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      environments,
      toggleFavorite,
      addEnvironment,
      editEnvironment,
      deleteEnvironment,
      environmentsLoaded: loaded,
    }),
    [
      addEnvironment,
      deleteEnvironment,
      editEnvironment,
      environments,
      loaded,
      toggleFavorite,
    ],
  );

  return (
    <EnvironmentsContext.Provider value={value}>
      {children}
    </EnvironmentsContext.Provider>
  );
}

export function useEnvironments() {
  return useContext(EnvironmentsContext);
}
