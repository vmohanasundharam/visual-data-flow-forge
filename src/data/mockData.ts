// Mock data for testing the entire flow functionality
export const mockDataSources = {
  "data_sources": [
    {
      "id": "ds001",
      "name": "Temperature Monitoring System",
      "description": "Industrial temperature sensors across factory floor",
      "tags": [
        { "id": "tag001", "name": "current_temperature", "type": "number" as const, "value": 24.5 },
        { "id": "tag002", "name": "target_temperature", "type": "number" as const, "value": 22.0 },
        { "id": "tag003", "name": "sensor_status", "type": "string" as const, "value": "active" },
        { "id": "tag004", "name": "zone_name", "type": "string" as const, "value": "Production Floor A" },
        { "id": "tag005", "name": "alert_level", "type": "number" as const, "value": 0 },
        { "id": "tag006", "name": "last_calibrated", "type": "string" as const, "value": "2024-01-15" }
      ],
      "fields": [
        { "id": "field001", "name": "sensor_id", "type": "string" as const, "value": "TEMP_001" },
        { "id": "field002", "name": "location", "type": "string" as const, "value": "Building A - Floor 1 - Zone A" },
        { "id": "field003", "name": "max_threshold", "type": "number" as const, "value": 35.0 },
        { "id": "field004", "name": "min_threshold", "type": "number" as const, "value": 15.0 },
        { "id": "field005", "name": "maintenance_due", "type": "string" as const, "value": "2024-03-15" },
        { "id": "field006", "name": "criticality_level", "type": "number" as const, "value": 3 }
      ]
    },
    {
      "id": "ds002", 
      "name": "Pressure Monitoring Network",
      "description": "Hydraulic pressure sensors for industrial equipment",
      "tags": [
        { "id": "tag007", "name": "current_pressure", "type": "number" as const, "value": 1013.25 },
        { "id": "tag008", "name": "pressure_unit", "type": "string" as const, "value": "hPa" },
        { "id": "tag009", "name": "system_status", "type": "string" as const, "value": "operational" },
        { "id": "tag010", "name": "equipment_name", "type": "string" as const, "value": "Hydraulic Press 1" },
        { "id": "tag011", "name": "pressure_variance", "type": "number" as const, "value": 2.5 },
        { "id": "tag012", "name": "operator_id", "type": "string" as const, "value": "OP_001" }
      ],
      "fields": [
        { "id": "field007", "name": "equipment_id", "type": "string" as const, "value": "PRESS_001" },
        { "id": "field008", "name": "installation_date", "type": "string" as const, "value": "2023-06-01" },
        { "id": "field009", "name": "max_pressure", "type": "number" as const, "value": 1200.0 },
        { "id": "field010", "name": "safety_limit", "type": "number" as const, "value": 1100.0 },
        { "id": "field011", "name": "department", "type": "string" as const, "value": "Manufacturing" },
        { "id": "field012", "name": "shift_schedule", "type": "string" as const, "value": "24/7" }
      ]
    },
    {
      "id": "ds003",
      "name": "Flow Rate Sensors",
      "description": "Water and chemical flow measurement systems",
      "tags": [
        { "id": "tag013", "name": "flow_rate", "type": "number" as const, "value": 125.7 },
        { "id": "tag014", "name": "flow_unit", "type": "string" as const, "value": "L/min" },
        { "id": "tag015", "name": "valve_position", "type": "number" as const, "value": 75 },
        { "id": "tag016", "name": "fluid_type", "type": "string" as const, "value": "water" },
        { "id": "tag017", "name": "pipe_status", "type": "string" as const, "value": "clear" },
        { "id": "tag018", "name": "total_volume", "type": "number" as const, "value": 15420.5 }
      ],
      "fields": [
        { "id": "field013", "name": "pipe_id", "type": "string" as const, "value": "PIPE_A01" },
        { "id": "field014", "name": "diameter", "type": "number" as const, "value": 150 },
        { "id": "field015", "name": "material", "type": "string" as const, "value": "stainless_steel" },
        { "id": "field016", "name": "max_flow_rate", "type": "number" as const, "value": 200.0 },
        { "id": "field017", "name": "installation_zone", "type": "string" as const, "value": "Treatment Plant B" },
        { "id": "field018", "name": "inspection_interval", "type": "number" as const, "value": 90 }
      ]
    },
    {
      "id": "ds004",
      "name": "Environmental Sensors",
      "description": "Air quality and environmental monitoring system",
      "tags": [
        { "id": "tag019", "name": "humidity", "type": "number" as const, "value": 65.2 },
        { "id": "tag020", "name": "air_quality_index", "type": "number" as const, "value": 45 },
        { "id": "tag021", "name": "co2_level", "type": "number" as const, "value": 410 },
        { "id": "tag022", "name": "weather_condition", "type": "string" as const, "value": "partly_cloudy" },
        { "id": "tag023", "name": "wind_speed", "type": "number" as const, "value": 12.5 },
        { "id": "tag024", "name": "uv_index", "type": "number" as const, "value": 6 }
      ],
      "fields": [
        { "id": "field019", "name": "station_id", "type": "string" as const, "value": "ENV_STAT_001" },
        { "id": "field020", "name": "coordinates", "type": "string" as const, "value": "40.7128,-74.0060" },
        { "id": "field021", "name": "elevation", "type": "number" as const, "value": 10 },
        { "id": "field022", "name": "reporting_frequency", "type": "number" as const, "value": 15 },
        { "id": "field023", "name": "data_retention", "type": "number" as const, "value": 365 },
        { "id": "field024", "name": "network_type", "type": "string" as const, "value": "LoRaWAN" }
      ]
    },
    {
      "id": "ds005",
      "name": "Power Consumption Monitors",
      "description": "Electrical power usage and energy monitoring",
      "tags": [
        { "id": "tag025", "name": "current_power", "type": "number" as const, "value": 2450.5 },
        { "id": "tag026", "name": "voltage", "type": "number" as const, "value": 230.2 },
        { "id": "tag027", "name": "power_factor", "type": "number" as const, "value": 0.92 },
        { "id": "tag028", "name": "load_status", "type": "string" as const, "value": "normal" },
        { "id": "tag029", "name": "peak_demand", "type": "number" as const, "value": 3200.0 },
        { "id": "tag030", "name": "efficiency_rating", "type": "string" as const, "value": "A+" }
      ],
      "fields": [
        { "id": "field025", "name": "meter_id", "type": "string" as const, "value": "PWR_MTR_001" },
        { "id": "field026", "name": "circuit_breaker", "type": "string" as const, "value": "CB_A1_001" },
        { "id": "field027", "name": "rated_capacity", "type": "number" as const, "value": 5000.0 },
        { "id": "field028", "name": "connection_type", "type": "string" as const, "value": "3_phase" },
        { "id": "field029", "name": "tariff_type", "type": "string" as const, "value": "industrial" },
        { "id": "field030", "name": "billing_cycle", "type": "number" as const, "value": 30 }
      ]
    }
  ]
};

export const mockJSFunctions = [
  {
    "id": "func001",
    "name": "calculateAverage",
    "description": "Calculate average of multiple numeric values",
    "arguments": [
      { "name": "value1", "type": "number" as const },
      { "name": "value2", "type": "number" as const },
      { "name": "value3", "type": "number" as const }
    ],
    "returnType": "number" as const,
    "code": `function calculateAverage(value1, value2, value3) {
  return (value1 + value2 + value3) / 3;
}`
  },
  {
    "id": "func002", 
    "name": "temperatureConverter",
    "description": "Convert temperature between Celsius and Fahrenheit",
    "arguments": [
      { "name": "temperature", "type": "number" as const },
      { "name": "fromUnit", "type": "string" as const },
      { "name": "toUnit", "type": "string" as const }
    ],
    "returnType": "number" as const,
    "code": `function temperatureConverter(temperature, fromUnit, toUnit) {
  if (fromUnit === 'C' && toUnit === 'F') {
    return (temperature * 9/5) + 32;
  } else if (fromUnit === 'F' && toUnit === 'C') {
    return (temperature - 32) * 5/9;
  }
  return temperature;
}`
  },
  {
    "id": "func003",
    "name": "thresholdCheck",
    "description": "Check if a value exceeds specified thresholds",
    "arguments": [
      { "name": "currentValue", "type": "number" as const },
      { "name": "minThreshold", "type": "number" as const },
      { "name": "maxThreshold", "type": "number" as const }
    ],
    "returnType": "string" as const,
    "code": `function thresholdCheck(currentValue, minThreshold, maxThreshold) {
  if (currentValue < minThreshold) return 'below_min';
  if (currentValue > maxThreshold) return 'above_max';
  return 'normal';
}`
  },
  {
    "id": "func004",
    "name": "dataAggregator",
    "description": "Aggregate sensor data into summary statistics",
    "arguments": [
      { "name": "dataList", "type": "list" as const },
      { "name": "operation", "type": "string" as const }
    ],
    "returnType": "map" as const,
    "code": `function dataAggregator(dataList, operation) {
  const numbers = dataList.filter(x => typeof x === 'number');
  const result = { count: numbers.length };
  
  if (operation === 'stats') {
    result.sum = numbers.reduce((a, b) => a + b, 0);
    result.average = result.sum / result.count;
    result.min = Math.min(...numbers);
    result.max = Math.max(...numbers);
  }
  
  return result;
}`
  },
  {
    "id": "func005",
    "name": "statusClassifier", 
    "description": "Classify system status based on multiple parameters",
    "arguments": [
      { "name": "primaryValue", "type": "number" as const },
      { "name": "secondaryValue", "type": "number" as const },
      { "name": "systemType", "type": "string" as const }
    ],
    "returnType": "string" as const,
    "code": `function statusClassifier(primaryValue, secondaryValue, systemType) {
  const ratio = primaryValue / secondaryValue;
  
  if (systemType === 'temperature') {
    if (ratio > 1.2) return 'overheating';
    if (ratio < 0.8) return 'undercooling';
    return 'optimal';
  } else if (systemType === 'pressure') {
    if (ratio > 1.1) return 'overpressure';
    if (ratio < 0.9) return 'underpressure';
    return 'normal';
  }
  
  return 'unknown';
}`
  },
  {
    "id": "func006",
    "name": "alertGenerator",
    "description": "Generate alerts based on sensor conditions",
    "arguments": [
      { "name": "sensorValue", "type": "number" as const },
      { "name": "alertThreshold", "type": "number" as const },
      { "name": "sensorName", "type": "string" as const }
    ],
    "returnType": "map" as const,
    "code": `function alertGenerator(sensorValue, alertThreshold, sensorName) {
  const isAlert = sensorValue > alertThreshold;
  return {
    alert: isAlert,
    severity: isAlert ? (sensorValue > alertThreshold * 1.5 ? 'high' : 'medium') : 'low',
    message: isAlert ? sensorName + ' exceeded threshold' : 'Normal operation',
    timestamp: new Date().toISOString()
  };
}`
  },
  {
    "id": "func007",
    "name": "efficiencyCalculator",
    "description": "Calculate system efficiency percentage",
    "arguments": [
      { "name": "actualOutput", "type": "number" as const },
      { "name": "theoreticalMax", "type": "number" as const }
    ],
    "returnType": "number" as const,
    "code": `function efficiencyCalculator(actualOutput, theoreticalMax) {
  if (theoreticalMax <= 0) return 0;
  return Math.min(100, (actualOutput / theoreticalMax) * 100);
}`
  },
  {
    "id": "func008",
    "name": "sumOfTwoNumbers",
    "description": "Calculates the sum of two numbers",
    "arguments": [
      { "name": "a", "type": "number" as const },
      { "name": "b", "type": "number" as const }
    ],
    "returnType": "number" as const,
    "code": `function sumOfTwoNumbers(a, b) {
  // Validate inputs
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  
  // Calculate and return the sum
  return a + b;
}`
  },
  {
    "id": "func009",
    "name": "factorial",
    "description": "Calculates the factorial of a non-negative integer",
    "arguments": [
      { "name": "n", "type": "number" as const }
    ],
    "returnType": "number" as const,
    "code": `function factorial(n) {
  // Validate input
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new Error('Input must be a non-negative integer');
  }
  
  // Base cases
  if (n === 0 || n === 1) {
    return 1;
  }
  
  // Calculate factorial iteratively for better performance
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  
  return result;
}`
  }
];