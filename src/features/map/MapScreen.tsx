import { useRef, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Post } from "@/types/post";
import { colors } from "@/theme/tokens";

interface MapScreenProps {
  posts?: Post[];
  onMarkerPress?: (postId: string) => void;
  selectedPostId?: string | null;
}

const getMapHTML = (posts: Post[], selectedPostId: string | null) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; background: #0f172a; }
    #map { width: 100%; height: 100vh; }
    .custom-marker {
      background: ${colors.primary};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 6px rgba(0,0,0,0.5);
    }
    .selected-marker {
      background: #fff;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid ${colors.primary};
      box-shadow: 0 0 10px ${colors.primary};
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([41.9981, 21.4254], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var markers = {};
    var posts = ${JSON.stringify(posts)};
    var selectedId = ${JSON.stringify(selectedPostId)};

    function getSeverityColor(severity) {
      var colors = {
        'low': '#22C55E',
        'medium': '#F59E0B',
        'high': '#EF4444',
        'critical': '#DC2626'
      };
      return colors[severity] || '#22C55E';
    }

    function createMarkerIcon(post, isSelected) {
      var color = getSeverityColor(post.severity);
      var size = isSelected ? 16 : 12;
      var border = isSelected ? '3px solid ' + color : '2px solid white';
      return L.divIcon({
        className: '',
        html: '<div style="background: ' + (isSelected ? '#fff' : color) + '; width: ' + size + 'px; height: ' + size + 'px; border-radius: 50%; border: ' + border + '; box-shadow: 0 0 ' + (isSelected ? '10px' : '6px') + ' rgba(0,0,0,0.5);"></div>',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });
    }

    posts.forEach(function(post) {
      var isSelected = selectedId === post.id;
      var marker = L.marker([post.latitude, post.longitude], {
        icon: createMarkerIcon(post, isSelected)
      }).addTo(map);

      marker.on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'markerPress',
          postId: post.id
        }));
      });

      markers[post.id] = marker;
    });

    window.updateSelected = function(newSelectedId) {
      Object.keys(markers).forEach(function(id) {
        var post = posts.find(function(p) { return p.id === id; });
        if (post) {
          markers[id].setIcon(createMarkerIcon(post, id === newSelectedId));
        }
      });
    };
  </script>
</body>
</html>
`;

export function MapScreen({ posts = [], onMarkerPress, selectedPostId = null }: MapScreenProps) {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (webViewRef.current && selectedPostId !== undefined) {
      webViewRef.current.injectJavaScript(`window.updateSelected('${selectedPostId}'); true;`);
    }
  }, [selectedPostId]);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerPress' && onMarkerPress) {
        onMarkerPress(data.postId);
      }
    } catch (e) {
      console.log('Message parse error:', e);
    }
  }, [onMarkerPress]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: getMapHTML(posts, selectedPostId) }}
        style={styles.map}
        onMessage={handleMessage}
        originWhitelist={['*']}
        javaScriptEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
