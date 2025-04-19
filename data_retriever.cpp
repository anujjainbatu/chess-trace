#include <FirebaseESP32.h>
#include <WiFi.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Firebase credentials
#define FIREBASE_HOST "chesstrace-42e8d-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "O0nQyi0FrejhdMu8XcEhQxED5pBUgU9eygFDG4mL"

FirebaseData firebaseData;

// Multiplexer control pins
#define S0 16
#define S1 17
#define S2 18
#define S3 19

// Multiplexer signal pins for each MUX
const int sigPins[4] = {32, 33, 34, 35};

void setup() {
  Serial.begin(115200);

  // Setup MUX control pins
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);

  // Setup signal pins as input
  for (int i = 0; i < 4; i++) {
    pinMode(sigPins[i], INPUT);
  }

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");

  // Connect to Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void selectMuxChannel(int channel) {
  digitalWrite(S0, bitRead(channel, 0));
  digitalWrite(S1, bitRead(channel, 1));
  digitalWrite(S2, bitRead(channel, 2));
  digitalWrite(S3, bitRead(channel, 3));
}

void loop() {
  for (int square = 0; square < 64; square++) {
    int muxIndex = square / 16;
    int channel = square % 16;

    selectMuxChannel(channel);
    delayMicroseconds(5); // Allow signal to settle

    bool isPiecePresent = digitalRead(sigPins[muxIndex]) == LOW;

    String path = "/chessboard/" + String(square);
    String pieceState = isPiecePresent ? "P" : " ";

    if (Firebase.setString(firebaseData, path + "/piece", pieceState)) {
      Serial.printf("Updated square %d: %s\n", square, pieceState.c_str());
    } else {
      Serial.printf("Failed to update square %d: %s\n", square, firebaseData.errorReason().c_str());
    }

    delay(20); // small delay to avoid spamming
  }

  delay(1000); // Update every second
}
