[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/1M59WghA)  
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21836925&assignment_repo_type=AssignmentRepo)

# EmoGo – Minimal Expo Router App with Recording Features

This project is based on the provided **Expo Router minimal working example**, and extended to include features required by the assignment:

## ✔ Implemented Features
- Select current **emotion** (happy / sad / angry)
- Retrieve **GPS location** (latitude + longitude)
- Record **1-second video**  
  - Web: using `MediaRecorder`  
  - Mobile (iOS/Android): using Expo Camera (if installed)
- Automatically store the collected data (emotion + location + timestamp)

This makes it possible to capture **three required items** within 12 hours:
1. A 1-second video  
2. Current emotion  
3. Current GPS coordinates  

---

# 📦 How to Run (Development Mode)

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
