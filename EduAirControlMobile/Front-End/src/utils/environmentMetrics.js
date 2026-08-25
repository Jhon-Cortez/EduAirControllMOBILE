export function calcEnvironmentScore(env) {
  const temp = env.temp ?? env.temperature ?? 22;
  const tempScore = Math.max(0, 100 - Math.abs(temp - 21) * 8);
  const humidityScore = Math.max(0, 100 - Math.abs(env.humidity - 50) * 3);
  const co2Score = Math.max(0, 100 - Math.max(0, env.co2 - 600) * 0.08);
  const noiseScore = Math.max(0, 100 - Math.max(0, env.noise - 30) * 2);
  return Math.round((tempScore + humidityScore + co2Score + noiseScore) / 4);
}

export function isNormalEnvironment(env) {
  return (
    env.statusKey === "normal" || env.statusKey === "dashboard.statusNormal"
  );
}

export function isWarningEnvironment(env) {
  return (
    env.statusKey === "warning" || env.statusKey === "dashboard.statusWarning"
  );
}

export function isAlertEnvironment(env) {
  return env.statusKey === "alert" || env.statusKey === "dashboard.statusAlert";
}

export function getEnvironmentStatusKey(env) {
  if (isNormalEnvironment(env)) return "normal";
  if (isWarningEnvironment(env)) return "warning";
  return "alert";
}
