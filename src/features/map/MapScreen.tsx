import { useRef, useCallback, useEffect, useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Post } from "@/types/post";
import { colors, spacing } from "@/theme/tokens";

interface Cluster {
  center: { lat: number; lng: number };
  count: number;
  postIds: string[];
}

interface MapScreenProps {
  posts?: Post[];
  onMarkerPress?: (postId: string) => void;
  onMapPress?: (lat: number, lng: number) => void;
  selectedPostId?: string | null;
}

const CLUSTER_RADIUS_METERS = 300;

function calculateClusters(posts: Post[]): Cluster[] {
  const clusters: Cluster[] = [];
  const processed = new Set<string>();

  posts.forEach((post) => {
    if (processed.has(post.id)) return;

    const nearbyPosts = posts.filter((p) => {
      if (processed.has(p.id)) return false;
      const distance = getDistance(post.latitude, post.longitude, p.latitude, p.longitude);
      return distance <= CLUSTER_RADIUS_METERS;
    });

    if (nearbyPosts.length >= 3) {
      const centerLat = nearbyPosts.reduce((sum, p) => sum + p.latitude, 0) / nearbyPosts.length;
      const centerLng = nearbyPosts.reduce((sum, p) => sum + p.longitude, 0) / nearbyPosts.length;
      clusters.push({
        center: { lat: centerLat, lng: centerLng },
        count: nearbyPosts.length,
        postIds: nearbyPosts.map((p) => p.id),
      });
      nearbyPosts.forEach((p) => processed.add(p.id));
    }
  });

  return clusters;
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const getMapHTML = (posts: Post[], selectedPostId: string | null, clusters: Cluster[]) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; background: #0f172a; }
    #map { width: 100%; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([41.9981, 21.4254], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var posts = ${JSON.stringify(posts)};
    var selectedId = ${JSON.stringify(selectedPostId)};
    var clusters = ${JSON.stringify(clusters)};
    var tempMarker = null;

    function getColor(severity) {
      var c = {
        'low': '#22C55E',
        'medium': '#F59E0B',
        'high': '#EF4444',
        'critical': '#DC2626'
      };
      return c[severity] || '#22C55E';
    }

    function createMarker(size, color, isSelected) {
      return L.divIcon({
        className: '',
        html: '<div style="background:' + color + ';width:' + size + 'px;height:' + size + 'px;border-radius:50%;border:' + (isSelected ? '3px solid #fff' : '2px solid white') + ';box-shadow:0 0 6px rgba(0,0,0,0.5);"></div>',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });
    }

    function renderClusters() {
      clusters.forEach(function(cluster) {
        var circle = L.circle([cluster.center.lat, cluster.center.lng], {
          radius: ${CLUSTER_RADIUS_METERS},
          color: '#EF4444',
          fillColor: '#EF4444',
          fillOpacity: 0.25,
          weight: 2,
          opacity: 0.5
        }).addTo(map);
        
        circle.bindPopup('<div style="text-align:center;color:white;background:rgba(0,0,0,0.7);padding:8px;border-radius:8px;"><strong>' + cluster.count + ' reports</strong><br><span style="font-size:12px;">in this area</span></div>');
      });
    }

    function renderPosts() {
      posts.forEach(function(post) {
        var isSelected = selectedId === post.id;
        var color = getColor(post.severity);
        var size = isSelected ? 16 : 12;
        var icon = createMarker(size, isSelected ? '#fff' : color, isSelected);
        var marker = L.marker([post.latitude, post.longitude], { icon: icon }).addTo(map);
        marker.on('click', function(e) {
          L.DomEvent.stopPropagation(e);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', postId: post.id }));
        });
      });
    }

    map.on('click', function(e) {
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      
      if (tempMarker) {
        map.removeLayer(tempMarker);
      }
      
      tempMarker = L.circleMarker([lat, lng], {
        radius: 12,
        color: '#14B8A6',
        fillColor: '#14B8A6',
        fillOpacity: 1,
        weight: 3
      }).addTo(map);
      
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapClick', lat: lat, lng: lng }));
    });

    renderClusters();
    renderPosts();
  </script>
</body>
</html>
`;

export function MapScreen({ posts = [], onMarkerPress, onMapPress, selectedPostId = null }: MapScreenProps) {
  const [WebViewComponent, setWebViewComponent] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);
  const webViewRef = useRef<any>(null);
  const [mapKey, setMapKey] = useState(0);

  const clusters = useMemo(() => calculateClusters(posts), [posts]);

  useEffect(() => {
    import('react-native-webview').then(module => {
      setWebViewComponent(() => module.WebView);
    }).catch(() => {
      setLoadError(true);
    });
  }, []);

  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [posts, selectedPostId]);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerPress' && onMarkerPress) {
        onMarkerPress(data.postId);
      } else if (data.type === 'mapClick' && onMapPress) {
        onMapPress(data.lat, data.lng);
      }
    } catch (e) {
      console.warn('Message parse error:', e);
    }
  }, [onMarkerPress, onMapPress]);

  if (loadError || !WebViewComponent) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackTitle}>Map Loading...</Text>
        <Text style={styles.fallbackText}>Tap anywhere to add a pin</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebViewComponent
        key={mapKey}
        ref={webViewRef}
        source={{ html: getMapHTML(posts, selectedPostId, clusters) }}
        style={styles.map}
        onMessage={handleMessage}
        originWhitelist={['*']}
        javaScriptEnabled
        onError={() => setLoadError(true)}
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
  fallbackContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  fallbackTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  fallbackText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
