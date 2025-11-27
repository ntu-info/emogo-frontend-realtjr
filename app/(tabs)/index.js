import { useState, useRef, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, Platform } from "react-native";
import * as Location from "expo-location";

// Web 用：MediaRecorder
let mediaStream = null;
let mediaRecorder = null;

export default function HomeScreen() {
  const [emotion, setEmotion] = useState(null);
  const [location, setLocation] = useState(null);
  const [isWebCameraReady, setIsWebCameraReady] = useState(false);

  const videoRef = useRef(null); // Web 用 video 預覽

  // -------------------------------
  // 取得 GPS
  // -------------------------------
  async function captureLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("定位權限被拒絕");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const data = {
      lat: loc.coords.latitude,
      lon: loc.coords.longitude,
    };
    setLocation(data);

    Alert.alert("定位成功", `lat: ${data.lat}\nlon: ${data.lon}`);
  }

  // -------------------------------
  // 初始化 Web 鏡頭
  // -------------------------------
  async function initWebCamera() {
    if (Platform.OS !== "web") return;

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setIsWebCameraReady(true);
    } catch (e) {
      console.error(e);
      Alert.alert("無法開啟 Web 鏡頭");
    }
  }

  useEffect(() => {
    if (Platform.OS === "web") initWebCamera();
  }, []);

  // -------------------------------
  // Web 錄影 + 自動下載影片 + JSON
  // -------------------------------
  async function recordWebVideo() {
    if (!isWebCameraReady) {
      Alert.alert("鏡頭尚未啟動");
      return;
    }
    if (!emotion) {
      Alert.alert("請先選擇心情");
      return;
    }
    if (!location) {
      Alert.alert("請先取得位置");
      return;
    }

    let chunks = [];
    const timestamp = Date.now();
    const videoFileName = `record_${timestamp}.webm`;

    mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: "video/webm",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      // ------------------
      // ① 下載影片
      // ------------------
      const blob = new Blob(chunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = videoFileName;
      a.click();
      URL.revokeObjectURL(videoUrl);

      // ------------------
      // ② 產生 JSON metadata（心情 + 位置 + 時間 + 影片檔名）
      // ------------------
      const metadata = {
        emotion: emotion,
        location: location,
        timestamp: timestamp,
        video: videoFileName,
      };

      const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], {
        type: "application/json",
      });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const j = document.createElement("a");
      j.href = jsonUrl;
      j.download = `record_${timestamp}.json`;
      j.click();
      URL.revokeObjectURL(jsonUrl);

      Alert.alert("錄影完成", "影片與 JSON 已下載");
    };

    mediaRecorder.start();
    console.log("Recording started...");

    setTimeout(() => {
      mediaRecorder.stop();
      console.log("Recording stopped.");
    }, 1000);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EmoGo Recorder</Text>

      {/* 心情 */}
      <Text style={styles.section}>1️⃣ 心情</Text>
      <Button title="🙂 HAPPY" onPress={() => setEmotion("happy")} />
      <Button title="😢 SAD" onPress={() => setEmotion("sad")} />
      <Button title="😡 ANGRY" onPress={() => setEmotion("angry")} />

      {/* 位置 */}
      <Text style={styles.section}>2️⃣ 位置</Text>
      <Button title="📍 取得位置" onPress={captureLocation} />

      {/* 錄影區 */}
      <Text style={styles.section}>3️⃣ 錄影（Web MediaRecorder）</Text>

      {Platform.OS === "web" ? (
        <>
          <video
            ref={videoRef}
            style={{ width: "100%", height: 250, backgroundColor: "#ddd" }}
            muted
            playsInline
          />
          <Button title="🎥 開始錄影（1 秒）" onPress={recordWebVideo} />
        </>
      ) : (
        <Text style={styles.section}>📵 手機模式：請用模擬器或真機測試</Text>
      )}

      {/* 顯示狀態 */}
      <Text style={styles.section}>目前心情：{emotion || "無"}</Text>
      <Text style={styles.section}>
        目前位置：
        {location ? `${location.lat}, ${location.lon}` : "尚未取得"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  section: { fontSize: 20, fontWeight: "600", marginTop: 25 },
});
