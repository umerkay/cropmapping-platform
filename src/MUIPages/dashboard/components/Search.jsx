import * as React from 'react';
import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { Assistant } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

export default function Search({ view }) {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  console.log(view)

  const handleSend = () => {
    if (inputValue.trim()) {
      navigate(`/dashboard?view=AgroAI`, { state: { message: `${inputValue} (from ${view})` } });
      setInputValue('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', md: 'auto' } }}>
      <FormControl sx={{ flexGrow: 1 }} variant="outlined">
        <OutlinedInput
          size="small"
          id="ask-ai"
          placeholder="Ask AI…"
          sx={{ flexGrow: 1 }}
          value={inputValue}
          autoComplete='off'
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          startAdornment={
            <InputAdornment position="start" sx={{ color: 'text.primary' }}>
              <Assistant fontSize="small" />
            </InputAdornment>
          }
          inputProps={{
            'aria-label': 'ask-ai',
          }}
        />
      </FormControl>
      <IconButton onClick={handleSend} edge="end" sx={{ outline: 'none', ml: 1, mr: 1 }}>
        <SendIcon size={10} />
      </IconButton>
    </Box>
  );
}
