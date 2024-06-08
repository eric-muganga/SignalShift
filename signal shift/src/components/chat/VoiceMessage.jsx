import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import WaveSurfer from "wavesurfer.js";
import { selectCurrentChatUser } from "../../store/chatSlice";
import { selectUserProfile } from "../../store/userSlice";
import { Avatar, IconButton } from "@material-tailwind/react";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "../../utils/CalculateTime";
import MesssgeStatus from "../common/MesssgeStatus";

function VoiceMessage({ message }) {
  const currentChatUser = useSelector(selectCurrentChatUser);
  const currentUser = useSelector(selectUserProfile);
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [error, setError] = useState(null);

  const waveformRef = useRef(null);
  const waveform = useRef(null);

  useEffect(() => {
    // Initializing WaveSurfer if not already initialized
    if (waveform.current === null) {
      waveform.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true,
      });

      // Setting play state to false when audio finishes playing
      waveform.current.on("finish", () => {
        setIsPlaying(false);
      });
    }

    // Cleaning up the WaveSurfer instance on component unmount
    return () => {
      if (waveform.current) {
        try {
          waveform.current.destroy();
        } catch (err) {
          console.error("Error destroying WaveSurfer instance:", err);
        }
        waveform.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Loading the audio message into WaveSurfer
    if (message.message) {
      const audio = new Audio(message.message);
      setAudioMessage(audio);
      waveform.current.load(message.message);

      // Setting total duration when WaveSurfer is ready
      waveform.current.on("ready", () => {
        setTotalDuration(waveform.current.getDuration());
      });

      // Updating playback time during audio playback
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audio.currentTime);
      };

      audio.addEventListener("timeupdate", updatePlaybackTime);

      // Cleaning up the timeupdate event listener
      return () => {
        audio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [message.message]);

  useEffect(() => {
    // Updating playback time state if audioMessage is available
    if (audioMessage) {
      const updatePlayBackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlayBackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlayBackTime);
      };
    }
  }, [audioMessage]);

  // Handling play action for the audio message
  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.current.stop();
      waveform.current.play();
      audioMessage.play();
      setIsPlaying(true);
    } else {
      setError("No audio message to play.");
    }
  };

  // Handling pause action for the audio message
  const handlePauseAudio = () => {
    waveform.current.stop();
    audioMessage.pause();
    setIsPlaying(false);
  };

  // Formatting time from seconds to mm:ss format
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div
      className={` flex items-center gap-5 px-4 pr-2 py-4 text-sm rounded-md ${
        message.senderId === currentChatUser.id
          ? "bg-blue-gray-100 text-blue-gray-900"
          : "bg-[#2563EB] text-white"
      }`}
    >
      <div>
        <Avatar size="md" src={currentChatUser?.avatar} />
      </div>
      <div className="cursor-pointer text-xl">
        <IconButton
          variant="text"
          title={isPlaying ? "Pause" : "Play"}
          onClick={isPlaying ? handlePauseAudio : handlePlayAudio}
        >
          {isPlaying ? (
            <FaStop className="text-xl" />
          ) : (
            <FaPlay className="text-xl" />
          )}
        </IconButton>
      </div>
      <div className="relative">
        <div className="w-60" ref={waveformRef} />
        <div className="flex justify-between items-center text-[11px] text-gray-600 pt-1 absolute bottom-[-22px] w-full">
          <span>
            {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
          </span>
          <div>
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === currentUser.id && (
              <MesssgeStatus messsgeStatus={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}

VoiceMessage.propTypes = {
  message: PropTypes.object.isRequired,
};

export default VoiceMessage;
