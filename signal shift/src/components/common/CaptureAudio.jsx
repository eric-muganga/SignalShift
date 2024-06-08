import { IconButton } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  getChatId,
  selectCurrentChatUser,
  updateUserChats,
} from "../../store/chatSlice";
import { selectUserProfile } from "../../store/userSlice";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import { addDoc, collection } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import mediaUpload from "../../utils/upload";

function CaptureAudio({ hideCaptureAudio }) {
  const currentChatUser = useSelector(selectCurrentChatUser);
  const currentUser = useSelector(selectUserProfile);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);

  //const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveformRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });

    setWaveform(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) handleStartRecording();
  }, [waveform]);

  useEffect(() => {
    if (recordedAudio) {
      const updatePlayBackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlayBackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlayBackTime);
      };
    }
  }, [recordedAudio]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        //audioRef.current.src = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          waveform.load(audioURL);

          const audioFile = new File([blob], "recording.mp3");
          setRenderedAudio(audioFile);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphne: ", error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();
    }
  };

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveform.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const handleSendRecording = async () => {
    if (renderedAudio) {
      //setUploadInProgress(true);
      const chatId = await getChatId(currentUser.id, currentChatUser.id);
      try {
        const fileRef = `audio/${currentUser.id}/${Date.now()}.mp3`;
        const downloadURL = await mediaUpload(renderedAudio, fileRef);
        await addDoc(collection(database, "messages"), {
          senderId: currentUser.id,
          receiverId: currentChatUser.id,
          message: downloadURL,
          messageStatus: "sent",
          createdAt: Date.now(),
          chatId,
          type: "audio",
        });

        await updateUserChats(
          chatId,
          currentUser.id,
          currentChatUser.id,
          downloadURL,
          "audio"
        );
      } catch (error) {
        console.error("Error sending audio message: ", error);
      } finally {
        //setUploadInProgress(false);
        hideCaptureAudio();
      }
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <IconButton
          variant="text"
          title="Record voice message"
          onClick={() => hideCaptureAudio()}
        >
          <FaTrash className="text-[#2563EB] text-xl" />
        </IconButton>
      </div>
      <div className="mx-4 py-2 px-4 text-gray-800 bg-blue-gray-100 text-lg flex gap-3 justify-center items-center rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-400 animate-pulse text-center">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <IconButton
                    variant="text"
                    title="Play Recording"
                    onClick={handlePlayRecording}
                  >
                    <FaPlay className="text-[#2563EB] text-xl" />
                  </IconButton>
                ) : (
                  <IconButton
                    variant="text"
                    title="Stop Recording"
                    onClick={handlePauseRecording}
                  >
                    <FaStop className="text-[#2563EB] text-xl" />
                  </IconButton>
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveformRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        {/* <audio ref={audioRef} hidden /> */}
      </div>
      <div className="mr-4">
        {!isRecording ? (
          <IconButton
            variant="text"
            title="Start Recording"
            onClick={handleStartRecording}
          >
            <FaMicrophone className="text-red-500 text-xl" />
          </IconButton>
        ) : (
          <IconButton
            variant="text"
            title="Stop Recording"
            onClick={handleStopRecording}
          >
            <FaPauseCircle className=" text-red-500 text-xl" />
          </IconButton>
        )}
      </div>
      <div>
        <IconButton
          variant="text"
          title="send"
          onClick={handleSendRecording}
          className="mr-4"
        >
          <MdSend className="text-[#2563EB] text-xl" />
        </IconButton>
      </div>
    </div>
  );
}

CaptureAudio.propTypes = {
  hideCaptureAudio: PropTypes.func.isRequired,
};

export default CaptureAudio;
