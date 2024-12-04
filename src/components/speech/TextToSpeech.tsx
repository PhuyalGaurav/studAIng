export const textToSpeech = async (
  text: string,
  audioMap: { [key: string]: string },
  setAudioMap: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>,
  currentAudioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
  try {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }

    if (audioMap[text]) {
      const existingAudio = new Audio(audioMap[text]);

      currentAudioRef.current = existingAudio;
      existingAudio.play().then(() => {
        setIsSpeaking(true);
        existingAudio.onended = () => setIsSpeaking(false);
      }).catch(err => {
        console.error("Error playing audio:", err);
        setIsSpeaking(false);
      });

      return;
    }

    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Error from API:", data.error);
      setIsSpeaking(false);
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    setAudioMap(prev => ({ ...prev, [text]: url }));

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    const newAudio = new Audio(url);
    currentAudioRef.current = newAudio;
    newAudio.play().then(() => {
      setIsSpeaking(true);
      newAudio.onended = () => setIsSpeaking(false);
    }).catch(err => {
      console.error("Error playing audio:", err);
      setIsSpeaking(false);
    });

  } catch (error) {
    console.error("Error with TTS:", error);
    setIsSpeaking(false);
  }
};
