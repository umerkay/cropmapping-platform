import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Assistant } from "@mui/icons-material";

const ChatWelcome = ({ handleSendMessage, randomMessages }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography>
        <Assistant sx={{ fontSize: 100 }} />
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ fontSize: "2rem" }}>
        Welcome to Zarai Rehnuma
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ fontSize: "1.2rem" }}>
        I am an AI expert in agricultural data with tools to access data and
        generate insights, especially focused on Pakistan.
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ fontSize: "1.2rem" }}>
        Here are some example questions you can ask:
      </Typography>
      <Box>
        {randomMessages.english.map((msg, index) => (
          <Button
            key={index}
            variant="outlined"
            sx={{ m: 1 }}
            onClick={() => handleSendMessage(msg)}
          >
            {msg}
          </Button>
        ))}
      </Box>
      <Typography
        variant="h6"
        gutterBottom
            className="urdu-msg"
        sx={{ fontSize: "2rem", marginTop: "1rem", fontFamily: "Noto Nastaliq Urdu !important" }}
      >
        زرعی رہنما میں خوش آمدید
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
            className="urdu-msg"
        sx={{ fontSize: "1.2rem", fontFamily: "Noto Nastaliq Urdu !important" }}
      >
        میں زرعی ڈیٹا کا ماہر ہوں جس کے پاس ڈیٹا تک رسائی اور بصیرت پیدا کرنے کے اوزار ہیں، خاص طور پر پاکستان پر توجہ مرکوز ہے۔
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
            className="urdu-msg"
        sx={{ fontSize: "1.2rem", fontFamily: "Noto Nastaliq Urdu !important" }}
      >
        یہاں کچھ سوالات ہیں جو آپ پوچھ سکتے ہیں
      </Typography>
      <Box>
        {randomMessages.urdu.map((msg, index) => (
          <Button
            key={index}
            variant="outlined"
            className="urdu-msg"
            sx={{ m: 1, fontFamily: "Noto Nastaliq Urdu !important" }}
            onClick={() => handleSendMessage(msg)}
          >
            {msg}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default ChatWelcome;
