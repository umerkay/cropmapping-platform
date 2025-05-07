import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../../../Services/ChatService";
import Grid from "@mui/material/Grid";
import { useColorScheme } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { CircleArrowLeft, PlusIcon, Send } from "lucide-react";
import DashboardMap from "../components/DashboardMap";
import { welcomeMessages, urduWelcomeMessages } from "./welcomemsgs";
import { Assistant, Refresh, Restore } from "@mui/icons-material";
import { usePolygons } from "../../../Context/PolygonsContext";
import { useLocation } from "react-router-dom";
import { Slide } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ChatWelcome from "../components/ChatWelcome";
import { useVoiceRecognition } from "../../../Services/VoiceService";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchGraphData } from '../../../Services/GraphDataService'; // Import the fetchGraphData function

function getRandomMessages() {
  const shuffled = welcomeMessages.sort(() => 0.5 - Math.random());
  const urduShuffled = urduWelcomeMessages.sort(() => 0.5 - Math.random());
  return {
    english: shuffled.slice(0, 3),
    urdu: urduShuffled.slice(0, 3),
  };
}

export default function AIExplain() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [conversationId, setConvId] = useState(uuidv4());
  const { mode, systemMode, setMode } = useColorScheme();
  const [toolUse, setToolUse] = useState({ name: "", content: "" });
  const [randomMessages, setRandomMessages] = useState(getRandomMessages());
  const [selectedPolygons, setSelectedPolygons] = useState([]);
  const { provinceGeojsonData, districtGeojsonData } = usePolygons();
  const location = useLocation();
  const {
    isListening,
    isListeningUrdu,
    handleVoiceInput,
    isUrduMode,
    setIsUrduMode,
  } = useVoiceRecognition(setUserInput);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (location.state?.message) {
      handleSendMessage(location.state.message);
    }
  }, [location.state]);

  const showMap = (name, type) => {
    type = type.toLowerCase();
    const geojsonData =
      type === "province" ? provinceGeojsonData : districtGeojsonData;
    if (!geojsonData) return;
    const selected = geojsonData.features.find((feature) =>
      feature.properties[type === "province" ? "NAME_1" : "NAME_3"]
        .toLowerCase()
        .includes(name.toLowerCase())
    );
    if (!selected) return;
    setSelectedPolygons((prev) => {
      const newSelection = [...prev];
      if (
        !newSelection.some(
          (polygon) =>
            polygon.properties[type === "province" ? "GID_1" : "GID_3"] ===
            selected.properties[type === "province" ? "GID_1" : "GID_3"]
        )
      ) {
        newSelection.push(selected);
      }
      return newSelection.length > 3 ? newSelection.slice(1) : newSelection;
    });
  };

  const handleSendMessage = async (message) => {
    const input = message || userInput;
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    await sendMessage(input, conversationId, setMessages, toolUse, setToolUse);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const newChat = () => {
    setMessages([]);
    setConvId(uuidv4());
    setUserInput("");
    setSelectedPolygons([]);
    setGraphData(null);
  };

  useEffect(() => {
    if (toolUse.name == "show_map") {
      console.log(toolUse.content);
      showMap(toolUse.content.location, toolUse.content.type);
    } else if (toolUse.name == "rag_retriever") {
      fetchGraphData(toolUse.content).then((data) => {
        setGraphData(data);
      });
    }
  }, [toolUse]);

  console.log(graphData)

  return (
    <Box sx={{ p: 2, height: "90vh" }}>
      <Grid container spacing={2} sx={{ width: "80vw", height: "100%" }}>
        <Grid item xs={(selectedPolygons.length > 0 || graphData) ? 8 : 12}>
          <Paper
            sx={{
              p: 2,
              minWidth: "50vw",
              height: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* <Typography variant="h6" gutterBottom>{toolUse.name !== "show_map" && toolUse.content}</Typography> */}
            <Paper
              sx={{
                p: 2,
                mb: 2,
                flexGrow: 1,
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {messages.length === 0 ? (
                <ChatWelcome
                  handleSendMessage={handleSendMessage}
                  randomMessages={randomMessages}
                />
              ) : (
                <List>
                  {messages.map((msg, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        textAlign: msg.role === "user" ? "right" : "left",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent:
                          msg.role === "user" ? "flex-end" : "flex-start",
                        mb: 1,
                        width: "100%",
                      }}
                    >
                      <ListItemText
                        sx={{
                          textAlign: msg.role === "user" ? "right" : "left",
                          maxWidth: "0%",
                          minWidth: "fit-content",
                          padding: "10px 20px",
                          backgroundColor:
                            mode === "light"
                              ? "rgba(0, 0, 0, 0.02)"
                              : "rgba(255, 255, 255, 0.02)",
                          borderRadius: 1,
                          mb: 1,
                        }}
                        slotProps={{
                          primary: { style: { fontSize: "1.1rem" } },
                          secondary: { style: { fontSize: "0.9rem" } },
                        }}
                        secondary={
                          msg.role === "user" ? "You" : "Zarai Rehnuma"
                        }

            className="urdu-msg"
                        primary={
                          msg.content ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Thinking...
                            </Typography>
                          )
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                id="userInput"
                label="Type your message"
                variant="outlined"
                fullWidth
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ mr: 2 }}
                autoComplete="off"
              />
              <Button variant="contained" onClick={() => handleSendMessage()}>
                <Send size={24} />
              </Button>
              <Button variant="contained" onClick={handleVoiceInput}>
                {isListening || isListeningUrdu ? (
                  <MicOffIcon size={24} />
                ) : (
                  <MicIcon size={24} />
                )}
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsUrduMode(!isUrduMode)}
              >
                {isUrduMode ? "Urdu" : "English"}
              </Button>
              <Button
                disabled={messages.length === 0}
                variant="contained"
                onClick={() => newChat()}
              >
                <Refresh size={24} />
              </Button>
            </Box>
          </Paper>
        </Grid>
        {(selectedPolygons.length > 0 || !!graphData) && (
          <Grid item xs={4}>
            <Slide
              direction="left"
              in={selectedPolygons.length > 0 || !!graphData}
              mountOnEnter
              unmountOnExit
            >
              <Paper sx={{ p: 2, height: "100%", maxHeight: "90vh", overflowY: "auto" }}>
                {/* <Typography variant="h6" gutterBottom>Card Component</Typography> */}
                {selectedPolygons.map((polygon, index) => (
                  <Box
                    key={polygon.properties.NAME_3}
                    sx={{ mb: 2, height: 400, width: "100%" }}
                  >
                    <DashboardMap selectedPolygon={polygon} />
                  </Box>
                ))}
                {graphData && (
                  <>
                    <Box sx={{ mb: 2, height: "fit-content", display: "flex", flexDirection: "column",justifyContent: "center" }}>
                      <Typography variant="h6" gutterBottom>
                        Land Use Information
                      </Typography>
                      <BarChart
                        xAxis={[
                          {
                            scaleType: "band",
                            data: Object.keys(graphData.landUseData),
                          },
                        ]}
                        series={[
                          {
                            data: Object.values(graphData.landUseData),
                            label: "Acres",
                          },
                        ]}
                        width={400}
                        height={300}
                      />
                    </Box>
                    <Box sx={{ mb: 2, height: "fit-content", display: "flex",flexDirection: "column", justifyContent: "center" }}>
                      <Typography variant="h6" gutterBottom>
                        Crop Type Classification
                      </Typography>
                      <BarChart
                        xAxis={[
                          {
                            scaleType: "band",
                            data: Object.keys(graphData.cropTypeData),
                          },
                        ]}
                        series={[
                          {
                            data: Object.values(graphData.cropTypeData),
                            label: "Acres",
                          },
                        ]}
                        width={400}
                        height={300}
                      />
                    </Box>
                    {graphData.expectedYieldData && (
                      <Box sx={{ height: "fit-content", display: "flex", flexDirection: "column",justifyContent: "center" }}>
                        <Typography variant="h6" gutterBottom>
                          Expected Yield Data
                        </Typography>
                        <BarChart
                          xAxis={[
                            {
                              scaleType: "band",
                              data: Object.keys(graphData.expectedYieldData),
                            },
                          ]}
                          series={[
                            {
                              data: Object.values(graphData.expectedYieldData).map(
                                (item) => typeof item === 'object' ? item.expectedYield : item
                              ),
                              label: "Expected Yield",
                            },
                          ]}
                          width={400}
                          height={300}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Paper>
            </Slide>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
