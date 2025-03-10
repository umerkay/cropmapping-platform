import { useState, useEffect, useRef } from "react";

export const useVoiceRecognition = (setUserInput) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isListeningUrdu, setIsListeningUrdu] = useState(false);
  const recognitionUrduRef = useRef(null);
  const [isUrduMode, setIsUrduMode] = useState(false);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setUserInput(finalTranscript || interimTranscript);
      };

      recognitionRef.current = recognition;

      const recognitionUrdu = new window.webkitSpeechRecognition();
      recognitionUrdu.continuous = true;
      recognitionUrdu.interimResults = true;
      recognitionUrdu.lang = "ur-PK";

      recognitionUrdu.onstart = () => setIsListeningUrdu(true);
      recognitionUrdu.onend = () => setIsListeningUrdu(false);
      recognitionUrdu.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setUserInput(finalTranscript || interimTranscript);
      };

      recognitionUrduRef.current = recognitionUrdu;
    }
  }, [setUserInput]);

  const handleVoiceInput = () => {
    if (isUrduMode) {
      if (isListeningUrdu) {
        recognitionUrduRef.current.stop();
      } else {
        recognitionUrduRef.current.start();
      }
    } else {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  };

  return {
    isListening,
    isListeningUrdu,
    handleVoiceInput,
    isUrduMode,
    setIsUrduMode,
  };
};
