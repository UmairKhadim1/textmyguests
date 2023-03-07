import React, { useState, useRef, useEffect } from 'react';
import { Title } from '../Dashboard/DashboardCard';
import { Icon, SendOutlined } from 'antd';
import Popup from './popover';
import { connect } from 'react-redux';
import store from '../../redux/store';
import './individual.css';
import axios from 'axios';
import api from '../../services/api';
import Group from './Assets/Group.svg';
import sentitem from './Assets/senditem.svg';
//  import ScrollToBottom from 'react-scroll-to-bottom';
// import { css } from 'glamor';
import { Select } from 'antd';
import useMediaQuery, { MediaQueryKey } from 'use-media-antd-query';

function handleChange(value) {
  console.log(`selected ${value}`);
}
const { Option } = Select;

function Individual({
  guests,
  loadGuests,
  messages,
  event,
  loadChat,
  loadPostDirectChat,
  loadAllRecipient,
  loadMessages,
  chatMessage,
  contactsWithChat,
  allGuestMessage,
  loadGuestMessage,
  guestWithMessage,
  setTextValue,
  props,
}) {
  const [messageInput, setMessageInput] = useState('');
  const [currentUser, setCurrentUser] = useState(contactsWithChat[0]);
  const [isActive, setActive] = useState(null);
  // const[screenSize,setScreenSize] = useState("");
  const [optionsState, setOptionState] = '';
  // const [item, setItem] = useState(true);
  const [show, setShow] = useState(true);
  const [sticky, setSticky] = useState(true);

  const scrollable_ref = useRef(null);

  const messageHandler = host => {
    let inputPayload = {
      guest_id: host.id,
      eventID: event.id,
    };
    console.log('host', host);
    setCurrentUser(host);
    loadGuestMessage(inputPayload);
  };

  const submit = () => {
    let messagePayload = {
      receiver_id: currentUser.id,
      contents: messageInput,
      image: '',
      thumbnail: '',
      eventID: event.id,
    };
    loadPostDirectChat(messagePayload);
    setMessageInput('');
  };

  const messageInputHandler = e => {
    setMessageInput(e.target.value);
  };

  const selectedUser = user => {
    setCurrentUser(user);
    loadChat({
      eventID: event.id,
      receiver_id: user.id,
    });
  };

  useEffect(
    () => {
      if (event) {
        loadGuests(event.id);
      }
    },
    [(event || {}).id]
  );

  useEffect(async () => {
    currentUser &&
      currentUser.id &&
      (await loadChat({
        eventID: event.id,
        receiver_id: currentUser && currentUser.id,
      }));
  }, []);

  useEffect(() => {
    loadAllRecipient({
      eventID: event.id,
      receiver_id: currentUser && currentUser.id,
    });
  }, []);

  useEffect(
    () => {
      if (event) {
        loadMessages(event.id);
      }
    },
    [(event || {}).id]
  );

  console.log('chatMessage', chatMessage);

  const screenSize = useMediaQuery();
  console.log(screenSize); // "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

  useEffect(
    () => {
      scrollable_ref.current.scrollIntoView(false);
    },
    [selectedUser]
  );

  return (
    <div className="chat-container">
      {/* left side */}
      <div className="chats-contacts">
        <div className="contact-add">
          <div>
            <div className="plus">
              <h2 className="chating">Chats</h2>
              <div
                className="pop-plus"
                style={{
                  width: '29px',
                  color: 'black',
                  height: '29px',
                  background: '#D9D9D9',
                  marginRight: '45px',
                }}>
                <Popup guests={guests} selectedUser={selectedUser} />
              </div>
            </div>
          </div>
          <div className="icon-data">
            <Icon className="search-icon" type="search" />
            <input className="search-input" type="text" placeholder="Search" />
          </div>
        </div>
        <div className="contacts-container scrollable">
          <div className="contacts ">
            {contactsWithChat &&
              contactsWithChat.length > 0 &&
              contactsWithChat.map(host => (
                <div
                  className="contact-list"
                  onClick={() => messageHandler(host)}
                  key={host.sender + host.id}>
                  <div className="title">
                    <h2
                      style={{
                        fontStyle: 'normal',
                        fontWeight: '500',
                        fontSize: '26.8673px',
                        lineHeight: '33px',
                        color: '#000000',
                        marginBottom: '9.99px',
                      }}>
                      {host.sender}({host.phone_number})
                    </h2>
                  </div>
                  <div>
                    <p className="para">{host.contents}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Right side  */}
      <div className="chat-box">
        <div className="top-title">
          {(screenSize === 'lg') |
          (screenSize === 'xl') |
          (screenSize === 'xxl') ? (
            <div>
              <h2 className="chat-box-title">
                {currentUser
                  ? `${currentUser.first_name ||
                      currentUser.sender} (${currentUser.phone ||
                      currentUser.phone_number})`
                  : 'Select User first'}
              </h2>
            </div>
          ) : (
            <div>
              <div className="direct-Guest">
                <Select
                  defaultValue="select user"
                  style={{
                    boxSizing: 'border-box',
                    display: 'inline-block',
                    position: 'relative',
                    color: '#595959',
                    fontSize: '13px',
                    width: '400px',
                    margin: '10px',
                  }}
                  onChange={handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="chat-msg-body scrollable">
          <div ref={scrollable_ref}>
            {chatMessage &&
              chatMessage.length > 0 &&
              chatMessage.map((msg, i) => (
                <div className="chat-text-container ">
                  {msg.message_type !== 'receive' ? (
                    <div className="receive-bubble">
                      <span className="text">{msg.contents}</span>
                    </div>
                  ) : (
                    <div className="sent-bubble">
                      {/* <div className="right-border" /> */}
                      <span className="text">{msg.contents}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/*  */}
        <div className="wrap-input">
          <div className="icon-info">
            <input
              className="search-input"
              type="text"
              placeholder="Type your text"
              value={messageInput}
              onChange={messageInputHandler}
            />

            <span
              className="submission "
              onClick={() => {
                submit();
              }}>
              <img
                className="search-icon-info"
                src={Group}
                alt="image is  here"
              />
              <img
                className="search-icon-inform"
                src={sentitem}
                alt=""
                srcset=""
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(
  state => ({
    event: store.select.Event.currentEvent(state),
    messages: store.select.Message.allMessages(state),
    guests: store.select.Guest.allGuests(state),
    chatMessage: store.select.Chat.allChat(state),
    contactsWithChat: store.select.Chat.allChatContacts(state),
    guestWithMessage: store.select.Chat.allGuestMessage(state),
  }),
  ({
    Guest: { loadGuests },
    Chat: { loadChat, loadPostDirectChat, loadAllRecipient, loadGuestMessage },
    Message: { loadMessages },
  }) => ({
    loadGuests,
    loadChat,
    loadPostDirectChat,
    loadAllRecipient,
    loadMessages,
    loadGuestMessage,
  })
)(Individual);
