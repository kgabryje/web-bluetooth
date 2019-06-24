export const calcAccFromSensorOutput = val =>
  val > 127 ? (val - 256) / 64 : val / 64;