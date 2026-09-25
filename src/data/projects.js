const projects = [
  {
    id: 1,
    title: 'AI Enabled Smart Air Quality Monitoring System',
    categories: ['AI / ML','IoT'],
    status: 'Completed',
    description: 'An IoT-based air quality monitoring system designed to monitor environmental conditions and air pollution parameters using sensors, embedded hardware and cloud connectivity.',
    image: '/Projects/air-quality.png',
    technologies: ['ESP8266','MQ-135','MQ-6','DHT11','OLED','IoT','Blynk']
  },
  {
    id: 2,
    title: 'Heart Attack Prediction',
    categories: ['AI / ML'],
    status: 'Completed',
    description: 'A machine learning-based predictive system designed to analyze relevant health-related input parameters and estimate heart attack risk using a trained classification model.',
    image: '/Projects/heart-attack.png',
    technologies: ['Python','Machine Learning','Classification','Data Processing']
  },
  {
    id: 3,
    title: 'Daily Shop Android E-Commerce Application',
    categories: ['Software','Android'],
    status: 'Completed',
    description: 'An Android-based e-commerce application designed to provide a modern shopping experience with product categories, product management and digital commerce functionality.',
    image: '/Projects/daily-shop.png',
    technologies: ['Android','Kotlin/Java','Firebase','E-Commerce','UI/UX']
  },
  {
    id: 4,
    title: 'Automatic Banana Ripening Identifier',
    categories: ['AI / ML'],
    status: 'Completed',
    description: 'An intelligent system designed to identify banana ripening stages using image-based analysis and machine learning techniques.',
    image: '/Projects/banana-ripening.png',
    technologies: ['Python','Machine Learning','Image Processing','Computer Vision']
  },
  {
    id: 5,
    title: 'Line Follower Robot',
    categories: ['Embedded'],
    status: 'Completed',
    description: 'An autonomous robotic system designed to detect and follow a predefined path using sensors, a microcontroller and motor control.',
    image: '/Projects/line-follower.png',
    technologies: ['Arduino','IR Sensors','Motors','Robotics','Embedded Systems']
  },
  {
    id: 6,
    title: 'Phishing Detection Using Machine Learning',
    categories: ['AI / ML'],
    status: 'Completed',
    description: 'A machine learning-based cybersecurity project designed to identify potentially malicious or phishing-related inputs using classification techniques.',
    image: '/Projects/phishing-detection.png',
    technologies: ['Python','Machine Learning','Cybersecurity','Classification']
  },
  {
    id: 7,
    title: 'IR Wireless Underwater Communication System',
    categories: ['IoT','Embedded'],
    status: 'Completed',
    description: 'A communication system exploring infrared-based wireless data transmission in an underwater environment.',
    image: '/Projects/underwater-communication.png',
    technologies: ['IR Communication','Embedded Systems','Wireless Communication','Underwater Communication']
  },
  {
    id: 8,
    title: 'IoT and AI-Based Water Quality Monitoring and Intelligent Purification Recommendation System',
    categories: ['AI / ML','IoT'],
    status: 'Completed',
    description: 'An IoT and AI-based system that monitors water quality in real time using pH, TDS, turbidity, and flow sensors. The STM32F103C8T6 collects and processes the sensor readings, while the ESP8266 provides Wi-Fi connectivity for sending data to the cloud. An AI model analyzes the water-quality parameters and provides suitable purification recommendations such as RO, UV, or sediment filtration. A mobile Android app displays the water-quality readings in real time.',
    image: '/Projects/IoT and AI-Based Water Quality Monitoring and Intelligent Purification Recommendation System.png',
    technologies: ['STM32F103C8T6','ESP8266 Wi-Fi','pH sensor','TDS sensor','Turbidity sensor','Flow sensor','AI-based purification recommendation','Android mobile application','Cloud/IoT communication']
  },
  {
    id: 9,
    title: 'Deep Learning-Based Pest Detection System Using Sound Analytics',
    categories: ['AI / ML','Deep Learning'],
    status: 'In Progress',
    description: 'A deep learning-based research project exploring sound analytics for identifying agricultural pest activity and supporting intelligent pest detection.',
    image: '/Projects/pest-detection.png',
    technologies: ['Deep Learning','Audio Analytics','Machine Learning','Agriculture AI']
  }
]

export default projects
