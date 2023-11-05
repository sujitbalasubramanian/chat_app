import React, { useState } from "react";
import axios from "axios";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { HfInference } from '@huggingface/inference'

export default function ChatInput({ handleSendMsg, loader, setLoader }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  async function zephyrbot(data) {
    console.log(data)
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha", data,
      {
        headers: { Authorization: "Bearer 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" },
      }
    );
    console.log(response)
    return response;
  }

  async function mistralbot(data) {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      data,
      {
        headers: { Authorization: "Bearer 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" },
      }
    );
    console.log(response)
    return response;
  }

  async function bloom(data) {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/bigscience/bloom",
      data,
      {
        headers: { Authorization: "Bearer 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" },
      }
    );
    console.log(response)
    return response;
  }

  function blobToDataUrl(blob) {
    return new Promise(r => { let a = new FileReader(); a.onload = r; a.readAsDataURL(blob) }).then(e => e.target.result);
  }

  async function stablediff(data) {
    const TOKEN = "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";
    const hf = new HfInference(TOKEN);
    const blob = await hf.textToImage({
      inputs: data,
      model: "stabilityai/stable-diffusion-xl-base-1.0",
    });
    let dataUrl = await blobToDataUrl(blob);
    console.log(dataUrl)
    return dataUrl;
  }


  const sendChat = (event) => {
    setLoader(true);
    event.preventDefault();
    if (msg.length > 0) {
      if (msg.includes('/')) {
        if (msg.includes('/zephyrbot')) {
          zephyrbot({ "inputs": msg.split(' ').slice(1).join(' ') }).then((response) => {
            console.log(response);
            handleSendMsg("@zephyrbot " + response?.data[0]?.generated_text)
            setLoader(false);
          })
            .catch(err => {
              console.log(err)
            })
        } else if (msg.includes('/mistralbot')) {
          mistralbot({ "inputs": msg.split(' ').slice(1).join(' ') }).then((response) => {
            console.log(response);
            handleSendMsg("@mistralbot " + response?.data[0]?.generated_text)
            setLoader(false);

          })
            .catch(err => {
              console.log(err)
            })
        } else if (msg.includes('/bloombot')) {
          bloom({ "inputs": msg.split(' ').slice(1).join(' ') }).then((response) => {
            console.log(response);
            handleSendMsg("@bloombot " + response?.data[0]?.generated_text)
            setLoader(false);

          })
            .catch(err => {
              console.log(err)
            })
        } else if (msg.includes('/imagebot')) {
          stablediff(msg.split(' ').slice(1).join(' '))
            .then((response) => {
              console.log(response)
              handleSendMsg("@stable-diffusion");
              handleSendMsg(response);
              setLoader(false);
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          handleSendMsg('no bot found')
        }
      } else {
        handleSendMsg(msg);
      }
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #000000;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    svg {
      font-size: 2rem;
      color: white;
    }
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #f1fa8c;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        box-shadow: none;
        background-color: #000000;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #000000;
          width: 5px;
          &-thumb {
            background-color: #bd93f9;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
        color: white;
          border-color: #bd93f9;
        }
        .emoji-group:before {
          background-color: #000000;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #44475a;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #bd93f9;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #bd93f9;

      border: none;
      &:hover {
        background-color: #50fa7b;
      }
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
