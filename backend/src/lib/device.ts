import { UAParser } from "ua-parser-js";

export interface DeviceResult {
  browser: string | null;
  os: string | null;
  device_type: string | null;
}

export function parseDevice(userAgent: string): DeviceResult {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    browser: browser.name || null,
    os: os.name || null,
    device_type: device.type || "desktop",
  };
}
