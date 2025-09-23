import React, { useState } from "react";
import { useStatsigClient } from "@statsig/react-bindings";
import "./App.css";
import Field from "./Field";
import SideBar from "./SideBar";
import ClickAction from "./ClickAction";
import { StatsigProvider } from "@statsig/react-bindings";
import { StatsigSessionReplayPlugin } from "@statsig/session-replay";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";

function parseGraphState(json) {
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data.vertices) && Array.isArray(data.edges)) {
      const vertices = data.vertices.map((v) => ({
        position: [v.x, v.y],
        color: v.color,
      }));
      const edges = data.edges.map((e) => ({
        endpoints: [vertices[e.from], vertices[e.to]],
        color: e.color,
        directedBool: e.directed,
      }));
      return { vertices, edges };
    }
  } catch (e) {
    console.warn("Failed to parse graph state:", e);
  }
  return { vertices: [], edges: [] };
}

// Component that uses Statsig (inside provider)
function AppContentWithStatsig(props) {
  const {
    clickAction,
    setClickAction,
    color,
    setColor,
    vertices,
    setVertices,
    edges,
    setEdges,
  } = props;

  // This hook is safe to call because we're inside StatsigProvider
  const statsigHook = useStatsigClient();
  const client = statsigHook?.client;

  React.useEffect(() => {
    async function logAccess() {
      if (!client) {
        console.log("Statsig client not ready yet");
        return;
      }

      let ip = "";
      try {
        // Get IP address
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ip = data.ip;

        // Get browser and system info
        const userAgent = navigator.userAgent;
        const browserInfo = {
          browser_name: getBrowserName(userAgent),
          browser_version: getBrowserVersion(userAgent),
          os: getOS(userAgent),
          os_version: getOSVersion(userAgent),
          device_model: navigator.platform,
          country: Intl.DateTimeFormat().resolvedOptions().locale,
          language: navigator.language,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        await client.logEvent("Sketchpad Access", null, {
          ...browserInfo,
          ip_address: ip,
          timestamp: new Date().toISOString(),
        });

        console.log("Successfully logged user access event");
      } catch (error) {
        console.log("Failed to log analytics event:", error.message);
      }
    }

    // Helper functions to parse UserAgent string
    function getBrowserName(ua) {
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Chrome")) return "Chrome";
      if (ua.includes("Safari")) return "Safari";
      if (ua.includes("Edge")) return "Edge";
      return "Unknown";
    }

    function getBrowserVersion(ua) {
      const match = ua.match(/(Firefox|Chrome|Safari|Edge)\/(\d+\.\d+)/);
      return match ? match[2] : "Unknown";
    }

    function getOS(ua) {
      if (ua.includes("Windows")) return "Windows";
      if (ua.includes("Mac OS")) return "macOS";
      if (ua.includes("Linux")) return "Linux";
      if (ua.includes("iPhone")) return "iOS";
      if (ua.includes("Android")) return "Android";
      return "Unknown";
    }

    function getOSVersion(ua) {
      const match = ua.match(/(?:Windows NT|Mac OS X|Android) ([0-9._]+)/);
      return match ? match[1] : "Unknown";
    }

    // Add a small delay to ensure client is fully initialized
    const timer = setTimeout(logAccess, 1000);
    return () => clearTimeout(timer);
  }, [client]);

  return (
    <div className="App">
      <SideBar
        clickAction={clickAction}
        setClickAction={setClickAction}
        color={color}
        setColor={setColor}
        vertices={vertices}
        edges={edges}
        setVertices={setVertices}
        setEdges={setEdges}
      />
      <Field
        color={color}
        clickAction={clickAction}
        vertices={vertices}
        setVertices={setVertices}
        edges={edges}
        setEdges={setEdges}
      />
    </div>
  );
}

// Component that doesn't use Statsig (outside provider)
function AppContentWithoutStatsig(props) {
  const {
    clickAction,
    setClickAction,
    color,
    setColor,
    vertices,
    setVertices,
    edges,
    setEdges,
  } = props;

  React.useEffect(() => {
    console.log("Analytics disabled - running without Statsig");
  }, []);

  return (
    <div className="App">
      <SideBar
        clickAction={clickAction}
        setClickAction={setClickAction}
        color={color}
        setColor={setColor}
        vertices={vertices}
        edges={edges}
        setVertices={setVertices}
        setEdges={setEdges}
      />
      <Field
        color={color}
        clickAction={clickAction}
        vertices={vertices}
        setVertices={setVertices}
        edges={edges}
        setEdges={setEdges}
      />
    </div>
  );
}

function App() {
  const [clickAction, setClickAction] = useState(ClickAction.SELECT);
  const [color, setColor] = useState("#000000");

  // Add error handling for localStorage
  let initial = { vertices: [], edges: [] };
  try {
    const stored = localStorage.getItem("graphData");
    if (stored) {
      initial = parseGraphState(stored);
    }
  } catch (error) {
    console.warn("Could not load from localStorage:", error);
  }

  const [vertices, setVertices] = useState(initial.vertices);
  const [edges, setEdges] = useState(initial.edges);

  // Determine if we should use Statsig based on environment
  const shouldUseStatsig = true;

  console.log("Analytics enabled:", shouldUseStatsig);

  const appProps = {
    clickAction,
    setClickAction,
    color,
    setColor,
    vertices,
    setVertices,
    edges,
    setEdges,
  };

  // If analytics are disabled, render without Statsig provider
  if (!shouldUseStatsig) {
    return <AppContentWithoutStatsig {...appProps} />;
  }

  return (
    <StatsigProvider
      sdkKey={process.env.REACT_APP_STATSIG_SDK_KEY}
      user={{ userID: "SketchpadUser" }}
      options={{
        initTimeoutMs: 3000,
        disableNetworkKeepalive: true,
        environment: { tier: process.env.NODE_ENV },
        networkRetryAttempts: 1,
        plugins: [
          new StatsigSessionReplayPlugin(),
          new StatsigAutoCapturePlugin(),
        ],
      }}
      loadingComponent={<div>Loading analytics...</div>}
      errorComponent={<AppContentWithoutStatsig {...appProps} />}
    >
      <AppContentWithStatsig {...appProps} />
    </StatsigProvider>
  );
}

export default App;
