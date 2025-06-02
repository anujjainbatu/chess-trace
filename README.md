# 🧠♟️ ChessTrace: Low-Cost Smart Chessboard with Cloud-Based Algebraic Notation Recording

![Project Banner](/assets/chess-trace-banner.png)

## 📌 Overview

**ChessTrace** is a low-cost smart chessboard designed to bring intelligent digital features—such as automatic move detection and cloud-based recording—to traditional physical chess. Built using ESP32 and reed switch technology, this solution enables players to record and analyze games with ease and affordability.

## 🎯 Key Features

- 🧲 **Magnetic Piece Detection**: 98%+ accuracy
- 🌐 **Real-time Cloud Sync**: Via Firebase
- 📜 **Automatic Notation**: Algebraic & PGN generation
- 💻 **Web Dashboard**: For live game viewing & analysis
- 🔋 **Rechargeable Battery**: 8+ hours of portable use
- 📱 **Cross-Platform Access**: PC, Mobile, Tablet

## 🖼️ Preview

### ✅ Final Product
![Final Smart Chessboard](/assets/product.png)
![Final Smart Chessboard](/assets/product-2.png)

### ✅ Detection Technology
![Final Smart Chessboard](/assets/detection_technologies.png)
![Final Smart Chessboard](/assets/detection_technologies_back.png)

### 💡 System Architecture
![System Architecture Diagram](/assets/solution_architecture_dia.jpeg)
![System Architecture Diagram](/assets/solution_architecture.jpeg)

### 🔎 Web Interface
![Web UI Screenshot](/assets/UX_UI.jpg)

## 🛠️ Tech Stack

| Layer      | Technologies                         |
|------------|--------------------------------------|
| Hardware   | ESP32, Reed Switches, Magnets, MUX   |
| Firmware   | C++ (Arduino)                        |
| Cloud      | Firebase Realtime Database           |
| Frontend   | HTML, CSS, JavaScript, Stockfish.js  |

## 🧱 Architecture

```
[Chessboard (64 reed switches)]
        ↓
[ESP32 Microcontroller]
        ↓
[Firebase Realtime Database]
        ↓
[Web UI with Stockfish.js for Analysis]
```

## 🚀 Getting Started

### 🔧 Hardware Assembly

1. Solder 64 reed switches to a multiplexer matrix.
2. Insert magnets into the base of chess pieces.
3. Connect multiplexers to ESP32.
4. Enclose board and connect 18650 battery.

### 💻 Firmware Setup

- Install Arduino IDE.
- Add ESP32 board manager.
- Upload firmware with Wi-Fi and Firebase credentials.

### ☁️ Firebase Configuration

- Enable Realtime Database and Authentication.
- Set up data structure (`/users`, `/games`, `/moves`).
- Configure rules and paste API key in firmware.

### 🌐 Web App Setup

- Open `index.html` in your browser.
- Authenticate and link your board.
- View and replay games in real time.

## ⚙️ Hardware BOM (Total Cost ≈ ₹1,850)

| Component         | Qty | Price (₹) |
|-------------------|-----|-----------|
| ESP32 WROOM       | 1   | 450       |
| Reed Switches     | 64  | 640       |
| CD74HC4067 MUX    | 4   | 200       |
| Neodymium Magnets | 32  | 320       |
| Battery + Charger | 1   | 200       |
| Enclosure (MDF)   | 1   | 200       |
| **Total**         |     | **1,850** |

## 📊 Performance

| Metric                  | Result      |
|-------------------------|-------------|
| Move Detection Accuracy | 98.2%       |
| Cloud Sync Latency      | < 500ms     |
| Battery Backup          | 8+ hours    |
| Setup Time              | < 5 minutes |

## 🎓 Use Cases

- 🏫 **Schools**: For chess-integrated CBSE classrooms.
- 🏆 **Clubs/Academies**: Easy move tracking for coaches.
- ♟️ **Casual Players**: Review games with friends or analyze with Stockfish.

## 🔮 Future Roadmap

- 📌 Piece Identification via RFID
- 📱 Companion Mobile App
- 🤖 AI-powered Coaching Suggestions
- 🏟️ Tournament Mode with Arbiter View

## 👨‍💻 Authors

- **Anuj Jain** - `0108IO221009`
- **Akshat Jain** - `0108IO221003`
- **Sanidhya Sahu** - `0108IO221053`

Under guidance of **Prof. Abhishek Mathur**  
Samrat Ashok Technological Institute, Vidisha (M.P.)

## 📝 License

This repository is open-source for **educational and research purposes only**. For commercial use, please contact the authors.

> “Bringing smart play to every player—affordable, accurate, and accessible.” 🧠♟️
