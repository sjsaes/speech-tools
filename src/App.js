import React, { useState, useRef } from 'react';
import { Button, Card, Typography, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

const topics = [
  'Describe your favorite book.',
  'Discuss a memorable travel experience.',
  'Talk about a challenging problem you have faced and how you overcame it.',
  // Add more topics as needed
];

const ImpromptuSpeakingApp = () => {
  const [currentTopic, setCurrentTopic] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(true); // State to control Snackbar visibility
  const [openDialog, setOpenDialog] = useState(true); // State to control Dialog visibility
  const mediaRecorder = useRef(null);

  const getRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
  };

  const handleStartSpeaking = () => {
    const topic = getRandomTopic();
    setCurrentTopic(topic);

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            const audioBlob = new Blob([e.data], { type: 'audio/wav' });
            setAudioURL(URL.createObjectURL(audioBlob));
          }
        };

        recorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.current = recorder;
        setRecording(true);
        recorder.start();
      })
      .catch((error) => console.error('Error accessing microphone:', error));
  };

  const handleStopSpeaking = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Card elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">Impromptu Speaking Practice</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">Current Topic: {currentTopic}</Typography>
        </Grid>
        <Grid item xs={12}>
          <div style={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={handleStartSpeaking} disabled={recording} style={{ margin: '8px' }}>
              Start Speaking
            </Button>
            <Button variant="contained" onClick={handleStopSpeaking} disabled={!recording} style={{ margin: '8px' }}>
              Stop Speaking
            </Button>
          </div>
        </Grid>
        {audioURL && (
          <Grid item xs={12}>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <audio controls src={audioURL} style={{ width: '100%' }} />
            </div>
          </Grid>
        )}
      </Grid>
      {/* Snackbar to inform the user */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="The microphone will be opened for recording. The recording is not saved anywhere."
      />
      {/* Dialog with information */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Recording Tips</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>
                <VolumeUpIcon /> Speak clearly and at a good pace. Limited prep speeches are hard to write on the go, but go at an appropriate pace anyway.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <RecordVoiceOverIcon /> Don't worry about making mistakes. If you misspeak, just keep going since your time is limited.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <InfoIcon /> Once your preparation time is up, you will be prompted to start speaking, and we'll start recording automatically.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ImpromptuSpeakingApp;
