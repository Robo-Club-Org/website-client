export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  brand: string
  inStock: boolean
  tags?: string[]
  discount?: number
  sku?: string
}

export const mockProducts: Product[] = [
  // Microcontrollers (1-12)
  {
    id: 1,
    name: "Arduino Uno R3",
    price: 22.99,
    image: "/products/arduino-uno.jpg",
    category: "Microcontrollers",
    description: "The most popular Arduino board with 14 digital I/O pins and 6 analog inputs.",
    rating: 4.8,
    reviews: 1247,
    brand: "Arduino",
    inStock: true,
    tags: ["beginner-friendly", "usb-programmable"],
    sku: "ARD-UNO-R3"
  },
  {
    id: 2,
    name: "Arduino Mega 2560",
    price: 38.99,
    image: "/products/arduino-mega.jpg",
    category: "Microcontrollers",
    description: "Powerful Arduino board with 54 digital I/O pins and 16 analog inputs.",
    rating: 4.7,
    reviews: 892,
    brand: "Arduino",
    inStock: true,
    tags: ["advanced", "large-projects"],
    sku: "ARD-MEGA-2560"
  },
  {
    id: 3,
    name: "Raspberry Pi 4 Model B (4GB)",
    price: 55.00,
    image: "/products/rpi-4.jpg",
    category: "Microcontrollers",
    description: "Quad-core single-board computer with 4GB RAM for versatile projects.",
    rating: 4.9,
    reviews: 1563,
    brand: "Raspberry Pi",
    inStock: true,
    tags: ["linux", "multimedia"],
    sku: "RPI-4B-4GB"
  },
  {
    id: 4,
    name: "ESP32 DevKitC",
    price: 9.99,
    image: "/products/esp32.jpg",
    category: "Microcontrollers",
    description: "Dual-core WiFi and Bluetooth-enabled development board.",
    rating: 4.6,
    reviews: 1104,
    brand: "Espressif",
    inStock: true,
    tags: ["wifi", "bluetooth"],
    sku: "ESP-32-DEV"
  },
  {
    id: 5,
    name: "STM32F103 Blue Pill",
    price: 4.49,
    image: "/products/stm32-bluepill.jpg",
    category: "Microcontrollers",
    description: "ARM Cortex-M3 microcontroller for advanced embedded projects.",
    rating: 4.4,
    reviews: 672,
    brand: "STMicroelectronics",
    inStock: true,
    tags: ["arm", "low-cost"],
    sku: "STM-F103"
  },
  {
    id: 6,
    name: "Arduino Leonardo",
    price: 19.99,
    image: "/products/arduino-leonardo.jpg",
    category: "Microcontrollers",
    description: "Arduino board with built-in USB for keyboard/mouse emulation.",
    rating: 4.5,
    reviews: 543,
    brand: "Arduino",
    inStock: true,
    tags: ["hid", "usb"],
    sku: "ARD-LEONARDO"
  },
  {
    id: 7,
    name: "Raspberry Pi Zero 2 W",
    price: 15.00,
    image: "/products/rpi-zero2w.jpg",
    category: "Microcontrollers",
    description: "Compact WiFi-enabled Pi with quad-core processor.",
    rating: 4.6,
    reviews: 789,
    brand: "Raspberry Pi",
    inStock: true,
    tags: ["compact", "wifi"],
    sku: "RPI-ZERO2W"
  },
  {
    id: 8,
    name: "ESP32-CAM",
    price: 12.49,
    image: "/products/esp32-cam.jpg",
    category: "Microcontrollers",
    description: "ESP32-based board with OV2640 camera for IoT projects.",
    rating: 4.3,
    reviews: 456,
    brand: "Espressif",
    inStock: true,
    tags: ["camera", "iot"],
    sku: "ESP-32-CAM"
  },
  {
    id: 9,
    name: "Arduino Nano",
    price: 12.99,
    image: "/products/arduino-nano.jpg",
    category: "Microcontrollers",
    description: "Compact Arduino board with USB connectivity in a small form factor.",
    rating: 4.6,
    reviews: 856,
    brand: "Arduino",
    inStock: true,
    tags: ["compact", "breadboard-friendly"],
    sku: "ARD-NANO"
  },
  {
    id: 10,
    name: "Raspberry Pi Pico",
    price: 4.99,
    image: "/products/rpi-pico.jpg",
    category: "Microcontrollers",
    description: "RP2040-based microcontroller board with flexible I/O options.",
    rating: 4.7,
    reviews: 723,
    brand: "Raspberry Pi",
    inStock: true,
    tags: ["rp2040", "micro-python"],
    sku: "RPI-PICO"
  },
  {
    id: 11,
    name: "ESP8266 NodeMCU",
    price: 6.99,
    image: "/products/nodemcu.jpg",
    category: "Microcontrollers",
    description: "WiFi-enabled development board based on ESP8266 chip.",
    rating: 4.5,
    reviews: 945,
    brand: "NodeMCU",
    inStock: true,
    tags: ["wifi", "lua"],
    sku: "ESP-NODEMCU"
  },
  {
    id: 12,
    name: "Teensy 4.0",
    price: 19.99,
    image: "/products/teensy.jpg",
    category: "Microcontrollers",
    description: "High-performance 600MHz ARM Cortex-M7 microcontroller board.",
    rating: 4.8,
    reviews: 423,
    brand: "PJRC",
    inStock: true,
    tags: ["high-speed", "audio"],
    sku: "TNSY-40"
  },

  // Sensors (13-24)
  {
    id: 13,
    name: "BMP280 Pressure Sensor",
    price: 5.99,
    image: "/products/bmp280.jpg",
    category: "Sensors",
    description: "Precise barometric pressure and temperature sensor with I2C/SPI interface.",
    rating: 4.6,
    reviews: 387,
    brand: "Bosch",
    inStock: true,
    tags: ["weather", "altitude"],
    sku: "SEN-BMP280"
  },
  {
    id: 14,
    name: "MPU6050 Accelerometer/Gyro",
    price: 6.50,
    image: "/products/mpu6050.jpg",
    category: "Sensors",
    description: "6-axis motion tracking device with accelerometer and gyroscope.",
    rating: 4.5,
    reviews: 512,
    brand: "InvenSense",
    inStock: true,
    tags: ["motion", "imu"],
    sku: "SEN-MPU6050"
  },
  {
    id: 15,
    name: "DHT22 Temperature/Humidity Sensor",
    price: 7.99,
    image: "/products/dht22.jpg",
    category: "Sensors",
    description: "Accurate sensor for measuring temperature and humidity.",
    rating: 4.5,
    reviews: 634,
    brand: "Generic",
    inStock: true,
    tags: ["climate", "digital"],
    sku: "SEN-DHT22"
  },
  {
    id: 16,
    name: "HC-SR04 Ultrasonic Sensor",
    price: 3.49,
    image: "/products/hc-sr04.jpg",
    category: "Sensors",
    description: "Ultrasonic distance sensor for measuring distances up to 4m.",
    rating: 4.4,
    reviews: 876,
    brand: "Generic",
    inStock: true,
    tags: ["distance", "robotics"],
    sku: "SEN-HCSR04"
  },
  {
    id: 17,
    name: "PIR Motion Sensor",
    price: 4.99,
    image: "/products/pir.jpg",
    category: "Sensors",
    description: "Passive infrared sensor for detecting motion.",
    rating: 4.3,
    reviews: 432,
    brand: "Generic",
    inStock: true,
    tags: ["motion", "security"],
    sku: "SEN-PIR"
  },
  {
    id: 18,
    name: "VL53L0X ToF Distance Sensor",
    price: 9.99,
    image: "/products/vl53l0x.jpg",
    category: "Sensors",
    description: "High-precision time-of-flight distance sensor up to 2m.",
    rating: 4.7,
    reviews: 298,
    brand: "STMicroelectronics",
    inStock: true,
    tags: ["tof", "precision"],
    sku: "SEN-VL53L0X"
  },
  {
    id: 19,
    name: "MQ-2 Gas Sensor",
    price: 5.49,
    image: "/products/mq2.jpg",
    category: "Sensors",
    description: "Gas sensor for detecting smoke, LPG, and CO.",
    rating: 4.2,
    reviews: 367,
    brand: "Generic",
    inStock: true,
    tags: ["gas", "safety"],
    sku: "SEN-MQ2"
  },
  {
    id: 20,
    name: "BH1750 Light Sensor",
    price: 4.29,
    image: "/products/bh1750.jpg",
    category: "Sensors",
    description: "Digital light intensity sensor with I2C interface.",
    rating: 4.5,
    reviews: 245,
    brand: "Generic",
    inStock: true,
    tags: ["light", "i2c"],
    sku: "SEN-BH1750"
  },
  {
    id: 21,
    name: "TCS34725 Color Sensor",
    price: 8.99,
    image: "/products/tcs34725.jpg",
    category: "Sensors",
    description: "RGB color sensor with IR filter and I2C interface.",
    rating: 4.6,
    reviews: 189,
    brand: "Adafruit",
    inStock: true,
    tags: ["color", "i2c"],
    sku: "SEN-TCS34725"
  },
  {
    id: 22,
    name: "DS18B20 Temperature Sensor",
    price: 3.99,
    image: "/products/ds18b20.jpg",
    category: "Sensors",
    description: "Waterproof digital temperature sensor with 1-Wire interface.",
    rating: 4.7,
    reviews: 521,
    brand: "Maxim",
    inStock: true,
    tags: ["temperature", "waterproof"],
    sku: "SEN-DS18B20"
  },
  {
    id: 23,
    name: "APDS-9960 Proximity Sensor",
    price: 7.49,
    image: "/products/apds9960.jpg",
    category: "Sensors",
    description: "Proximity, light, and gesture sensor with I2C interface.",
    rating: 4.4,
    reviews: 276,
    brand: "Broadcom",
    inStock: true,
    tags: ["proximity", "gesture"],
    sku: "SEN-APDS9960"
  },
  {
    id: 24,
    name: "MAX30102 Pulse Oximeter",
    price: 12.99,
    image: "/products/max30102.jpg",
    category: "Sensors",
    description: "Pulse oximeter and heart-rate sensor for wearable projects.",
    rating: 4.5,
    reviews: 312,
    brand: "Maxim",
    inStock: true,
    tags: ["health", "i2c"],
    sku: "SEN-MAX30102"
  },

  // Motor Drivers (25-28)
  {
    id: 25,
    name: "DRV8825 Stepper Driver",
    price: 8.99,
    image: "/products/drv8825.jpg",
    category: "Motor Drivers",
    description: "Stepper motor driver with up to 1/32 microstepping.",
    rating: 4.4,
    reviews: 278,
    brand: "Texas Instruments",
    inStock: true,
    tags: ["stepper", "cnc"],
    sku: "DRV-8825"
  },
  {
    id: 26,
    name: "L298N Motor Driver",
    price: 6.99,
    image: "/products/l298n.jpg",
    category: "Motor Drivers",
    description: "Dual H-bridge motor driver for DC and stepper motors.",
    rating: 4.3,
    reviews: 456,
    brand: "Generic",
    inStock: true,
    tags: ["dc-motor", "h-bridge"],
    sku: "DRV-L298N"
  },
  {
    id: 27,
    name: "TB6612FNG Motor Driver",
    price: 5.49,
    image: "/products/tb6612fng.jpg",
    category: "Motor Drivers",
    description: "Dual motor driver with 1.2A per channel for DC motors.",
    rating: 4.5,
    reviews: 321,
    brand: "Toshiba",
    inStock: true,
    tags: ["dc-motor", "robotics"],
    sku: "DRV-TB6612"
  },
  {
    id: 28,
    name: "A4988 Stepper Driver",
    price: 4.99,
    image: "/products/a4988.jpg",
    category: "Motor Drivers",
    description: "Microstepping driver for bipolar stepper motors up to 2A.",
    rating: 4.4,
    reviews: 398,
    brand: "Allegro",
    inStock: true,
    tags: ["stepper", "3d-printing"],
    sku: "DRV-A4988"
  },

  // Displays (29-34)
  {
    id: 29,
    name: "1.3\" OLED Display (128x64)",
    price: 9.99,
    image: "/products/oled-1.3.jpg",
    category: "Displays",
    description: "Larger monochrome OLED with SPI/I2C interface.",
    rating: 4.6,
    reviews: 321,
    brand: "Generic",
    inStock: true,
    tags: ["spi", "high-contrast"],
    sku: "DSP-OLED-13"
  },
  {
    id: 30,
    name: "0.96\" OLED Display (128x64)",
    price: 7.99,
    image: "/products/oled-0.96.jpg",
    category: "Displays",
    description: "Compact monochrome OLED with I2C interface.",
    rating: 4.5,
    reviews: 432,
    brand: "Generic",
    inStock: true,
    tags: ["i2c", "compact"],
    sku: "DSP-OLED-096"
  },
  {
    id: 31,
    name: "2.8\" TFT LCD Touchscreen",
    price: 19.99,
    image: "/products/tft-2.8.jpg",
    category: "Displays",
    description: "Color touchscreen display with SPI interface for Raspberry Pi.",
    rating: 4.6,
    reviews: 287,
    brand: "Generic",
    inStock: true,
    tags: ["touch", "color"],
    sku: "DSP-TFT-28"
  },
  {
    id: 32,
    name: "16x2 LCD Display",
    price: 6.99,
    image: "/products/lcd-16x2.jpg",
    category: "Displays",
    description: "Alphanumeric LCD with 16 characters by 2 lines and I2C backpack.",
    rating: 4.4,
    reviews: 543,
    brand: "Generic",
    inStock: true,
    tags: ["i2c", "alphanumeric"],
    sku: "DSP-LCD-16X2"
  },
  {
    id: 33,
    name: "7\" HDMI Display",
    price: 59.99,
    image: "/products/hdmi-7.jpg",
    category: "Displays",
    description: "High-resolution HDMI display for Raspberry Pi projects.",
    rating: 4.7,
    reviews: 321,
    brand: "Generic",
    inStock: true,
    tags: ["hdmi", "large-screen"],
    sku: "DSP-HDMI-7"
  },
  {
    id: 34,
    name: "E-Ink Display 2.13\"",
    price: 24.99,
    image: "/products/eink-2.13.jpg",
    category: "Displays",
    description: "Low-power e-ink display with SPI interface for long-term displays.",
    rating: 4.5,
    reviews: 198,
    brand: "Waveshare",
    inStock: true,
    tags: ["e-ink", "low-power"],
    sku: "DSP-EINK-213"
  },

  // Kits (35-40)
  {
    id: 35,
    name: "Raspberry Pi Starter Kit",
    price: 89.99,
    image: "/products/rpi-kit.jpg",
    category: "Kits",
    description: "Complete kit with Raspberry Pi 4, case, power supply and accessories.",
    rating: 4.7,
    reviews: 412,
    brand: "Raspberry Pi",
    inStock: true,
    tags: ["starter", "complete"],
    discount: 15,
    sku: "KIT-RPI-STARTER"
  },
  {
    id: 36,
    name: "Arduino Starter Kit",
    price: 79.99,
    image: "/products/arduino-kit.jpg",
    category: "Kits",
    description: "Beginner-friendly kit with Arduino Uno, sensors, and project guide.",
    rating: 4.8,
    reviews: 567,
    brand: "Arduino",
    inStock: true,
    tags: ["beginner", "educational"],
    discount: 10,
    sku: "KIT-ARD-STARTER"
  },
  {
    id: 37,
    name: "Robotics Kit with ESP32",
    price: 99.99,
    image: "/products/robotics-kit.jpg",
    category: "Kits",
    description: "Complete robotics kit with ESP32, motors, and sensors.",
    rating: 4.6,
    reviews: 345,
    brand: "Espressif",
    inStock: true,
    tags: ["robotics", "iot"],
    sku: "KIT-ROB-ESP32"
  },
  {
    id: 38,
    name: "Sensor Experimentation Kit",
    price: 49.99,
    image: "/products/sensor-kit.jpg",
    category: "Kits",
    description: "Kit with 10+ sensors for Arduino and Raspberry Pi projects.",
    rating: 4.5,
    reviews: 432,
    brand: "Generic",
    inStock: true,
    tags: ["sensors", "learning"],
    sku: "KIT-SENSOR"
  },
  {
    id: 39,
    name: "IoT Development Kit",
    price: 69.99,
    image: "/products/iot-kit.jpg",
    category: "Kits",
    description: "IoT kit with ESP8266, sensors, and cloud integration guide.",
    rating: 4.4,
    reviews: 298,
    brand: "NodeMCU",
    inStock: true,
    tags: ["iot", "wifi"],
    sku: "KIT-IOT-NODE"
  },
  {
    id: 40,
    name: "Raspberry Pi Media Center Kit",
    price: 109.99,
    image: "/products/rpi-media-kit.jpg",
    category: "Kits",
    description: "Kit for building a media center with Raspberry Pi 4 and accessories.",
    rating: 4.7,
    reviews: 376,
    brand: "Raspberry Pi",
    inStock: true,
    tags: ["media", "hdmi"],
    discount: 20,
    sku: "KIT-RPI-MEDIA"
  },

  // Power (41-45)
  {
    id: 41,
    name: "5V 3A Power Supply",
    price: 12.99,
    image: "/products/5v-psu.jpg",
    category: "Power",
    description: "Stable 5V DC power supply with micro USB connector.",
    rating: 4.5,
    reviews: 287,
    brand: "Generic",
    inStock: true,
    tags: ["regulated", "usb"],
    sku: "PWR-5V-3A"
  },
  {
    id: 42,
    name: "9V 2A Power Adapter",
    price: 9.99,
    image: "/products/9v-adapter.jpg",
    category: "Power",
    description: "9V DC power adapter with barrel connector for Arduino.",
    rating: 4.4,
    reviews: 321,
    brand: "Generic",
    inStock: true,
    tags: ["adapter", "arduino"],
    sku: "PWR-9V-2A"
  },
  {
    id: 43,
    name: "3.3V/5V Breadboard Power Module",
    price: 3.99,
    image: "/products/breadboard-power.jpg",
    category: "Power",
    description: "Dual-output power module for breadboard projects.",
    rating: 4.3,
    reviews: 456,
    brand: "Generic",
    inStock: true,
    tags: ["breadboard", "dual-voltage"],
    sku: "PWR-BB-33V5V"
  },
  {
    id: 44,
    name: "LiPo Battery 3.7V 2000mAh",
    price: 14.99,
    image: "/products/lipo-2000.jpg",
    category: "Power",
    description: "Rechargeable lithium-polymer battery for portable projects.",
    rating: 4.5,
    reviews: 234,
    brand: "Generic",
    inStock: true,
    tags: ["battery", "portable"],
    sku: "PWR-LIPO-2000"
  },
  {
    id: 45,
    name: "12V 5A Power Supply",
    price: 19.99,
    image: "/products/12v-psu.jpg",
    category: "Power",
    description: "High-current 12V DC power supply for motor projects.",
    rating: 4.6,
    reviews: 198,
    brand: "Generic",
    inStock: true,
    tags: ["high-power", "motors"],
    sku: "PWR-12V-5A"
  },

  // Wireless (46-50)
  {
    id: 46,
    name: "NRF24L01+ Wireless Module",
    price: 3.99,
    image: "/products/nrf24.jpg",
    category: "Wireless",
    description: "2.4GHz RF transceiver module with SPI interface.",
    rating: 4.3,
    reviews: 198,
    brand: "Nordic",
    inStock: true,
    tags: ["rf", "long-range"],
    sku: "WLS-NRF24"
  },
  {
    id: 47,
    name: "HC-05 Bluetooth Module",
    price: 6.99,
    image: "/products/hc05.jpg",
    category: "Wireless",
    description: "Bluetooth 2.0 module for wireless serial communication.",
    rating: 4.4,
    reviews: 432,
    brand: "Generic",
    inStock: true,
    tags: ["bluetooth", "serial"],
    sku: "WLS-HC05"
  },
  {
    id: 48,
    name: "ESP01 WiFi Module",
    price: 5.49,
    image: "/products/esp01.jpg",
    category: "Wireless",
    description: "Compact ESP8266-based WiFi module for IoT applications.",
    rating: 4.3,
    reviews: 387,
    brand: "Espressif",
    inStock: true,
    tags: ["wifi", "iot"],
    sku: "WLS-ESP01"
  },
  {
    id: 49,
    name: "HC-12 Wireless Serial Module",
    price: 8.99,
    image: "/products/hc12.jpg",
    category: "Wireless",
    description: "Long-range 433MHz wireless serial communication module.",
    rating: 4.5,
    reviews: 276,
    brand: "Generic",
    inStock: true,
    tags: ["serial", "long-range"],
    sku: "WLS-HC12"
  },
  {
    id: 50,
    name: "LoRa SX1278 Module",
    price: 14.99,
    image: "/products/sx1278.jpg",
    category: "Wireless",
    description: "Long-range LoRa module for low-power IoT applications.",
    rating: 4.6,
    reviews: 234,
    brand: "Semtech",
    inStock: true,
    tags: ["lora", "iot"],
    sku: "WLS-SX1278"
  },

  // Robotics (51-53)
  {
    id: 51,
    name: "MG996R Servo Motor",
    price: 14.99,
    image: "/products/mg996r.jpg",
    category: "Robotics",
    description: "High-torque digital servo motor with metal gears.",
    rating: 4.6,
    reviews: 356,
    brand: "TowerPro",
    inStock: true,
    tags: ["robotic-arm", "strong"],
    sku: "RB-MG996R"
  },
  {
    id: 52,
    name: "DC Motor with Gearbox",
    price: 9.99,
    image: "/products/dc-gear-motor.jpg",
    category: "Robotics",
    description: "12V DC motor with high-torque gearbox for robotics.",
    rating: 4.4,
    reviews: 287,
    brand: "Generic",
    inStock: true,
    tags: ["dc-motor", "robotics"],
    sku: "RB-DC-GEAR"
  },
  {
    id: 53,
    name: "4WD Robot Chassis Kit",
    price: 29.99,
    image: "/products/4wd-chassis.jpg",
    category: "Robotics",
    description: "Complete 4WD robot chassis with motors and wheels.",
    rating: 4.5,
    reviews: 321,
    brand: "Generic",
    inStock: true,
    tags: ["robotics", "chassis"],
    sku: "RB-4WD-KIT"
  }
]

export const brands = [
  // Existing brands
  {
    name: "Arduino",
    logo: "https://images.seeklogo.com/logo-png/18/1/arduino-logo-png_seeklogo-184988.png",
    description: "Open-source electronics platform for makers and education"
  },
  // ... (other existing brands)

  // New brands
  {
    name: "Espressif",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_von_Espressif.png",
    description: "Manufacturer of Wi-Fi and Bluetooth SoCs"
  },
  {
    name: "Texas Instruments",
    logo: "https://1000logos.net/wp-content/uploads/2020/04/Logo-Texas-Instruments.jpg",
    description: "Semiconductor company producing motor drivers and ICs"
  },
  {
    name: "STMicroelectronics",
    logo: "https://efp-data.s3.amazonaws.com/expos/aweusa2022/data/exhibitors/151134/media/stmicroelectronics.png",
    description: "Global semiconductor leader delivering intelligent and energy-efficient products"
  }
]

export const categories = [
  // Existing categories
  {
    name: "Microcontrollers",
    icon: "/categories/mcu-icon.svg",
    description: "Programmable boards for electronics projects"
  },
  // ... (other existing categories)

  // New categories
  {
    name: "Power",
    icon: "/categories/power-icon.svg",
    description: "Power supplies, regulators and management"
  },
  {
    name: "Wireless",
    icon: "/categories/wireless-icon.svg",
    description: "RF, Bluetooth, WiFi and other wireless modules"
  },
  {
    name: "Robotics",
    icon: "/categories/robotics-icon.svg",
    description: "Components for building robots and mechanical systems"
  }
]